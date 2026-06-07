/**
 * chat.service.js
 *
 * AI parking assistant using Groq (OpenAI-compatible) with function/tool calling.
 * The model autonomously decides which tools to call based on user intent.
 *
 * Tools exposed to the model:
 *  - searchParkings     → geocodes location name → calls listSmartParkings
 *  - checkAvailability  → calls calculateAvailableSlots
 *
 * No existing service logic is modified.
 */

import OpenAI from "openai";

import { env } from "../config/env.js";
import { listSmartParkings } from "./parking.service.js";
import { calculateAvailableSlots } from "./occupancy.service.js";
import { createHttpError } from "../utils/createHttpError.js";

// ---------------------------------------------------------------------------
// Groq client — lazy-initialised so missing key gives a clear error
// ---------------------------------------------------------------------------
let _client = null;

function getClient() {
  if (!env.GROQ_API_KEY) {
    throw createHttpError(
      503,
      "AI assistant is not configured. Set GROQ_API_KEY in .env"
    );
  }

  if (!_client) {
    _client = new OpenAI({
      apiKey: env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });
  }

  return _client;
}

// ---------------------------------------------------------------------------
// Geocoding helper — converts a place name to {lat, lng} using Nominatim
// Free, no API key required. Respects OSM usage policy.
// ---------------------------------------------------------------------------

/**
 * Geocode a human-readable location string to coordinates.
 * Falls back to null if the location cannot be resolved.
 *
 * @param {string} locationName  e.g. "Andheri West, Mumbai" or "Connaught Place Delhi"
 * @returns {Promise<{lat: number, lng: number} | null>}
 */
async function geocodeLocation(locationName) {
  try {
    const encoded = encodeURIComponent(locationName);
    const url = `https://nominatim.openstreetmap.org/search?q=${encoded}&countrycodes=in&format=json&limit=1`;

    const res = await fetch(url, {
      headers: {
        // Nominatim requires a descriptive User-Agent
        "User-Agent": "SmartParkAssistant/1.0 (parking-saas)",
      },
    });

    if (!res.ok) return null;

    const data = await res.json();
    if (!data || data.length === 0) return null;

    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
    };
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Tool definitions — what we tell the model it can do
// NOTE: searchParkings now accepts a human-readable `location` string.
//       Coordinates are resolved server-side — the model never needs them.
// ---------------------------------------------------------------------------
const TOOLS = [
  {
    type: "function",
    function: {
      name: "searchParkings",
      description:
        "Search for parking lots near a location. Pass the location as a human-readable string (e.g. 'Andheri West Mumbai', 'MG Road Bangalore'). Never ask the user for coordinates.",
      parameters: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description:
              "Human-readable area or city, e.g. 'Bandra West Mumbai' or 'Koramangala Bangalore'.",
          },
          radiusKm: {
            type: "number",
            description: "Search radius in kilometres. Default 3, max 20.",
          },
          limit: {
            type: "number",
            description: "Maximum results to return. Default 5, max 10.",
          },
        },
        required: ["location"],
      },
    },
  },

  {
    type: "function",
    function: {
      name: "checkAvailability",
      description:
        "Check how many slots are available for a specific parking lot and time window.",
      parameters: {
        type: "object",
        properties: {
          parkingId: { type: "string" },
          totalSlots: { type: "number" },
          bookingDate: {
            type: "string",
            description: "Date in YYYY-MM-DD format.",
          },
          startTime: {
            type: "string",
            description: "Start time in HH:MM (24-hour) format.",
          },
          endTime: {
            type: "string",
            description: "End time in HH:MM (24-hour) format.",
          },
        },
        required: ["parkingId", "totalSlots", "bookingDate", "startTime", "endTime"],
      },
    },
  },
];

// ---------------------------------------------------------------------------
// System prompt
// ---------------------------------------------------------------------------
const SYSTEM_PROMPT = `You are SmartPark Assistant, a helpful AI for finding and booking parking across India.

BEHAVIOUR:
- Help users find parking, check availability, compare options, and understand pricing.
- When a user mentions ANY location (neighbourhood, landmark, city, area), immediately call searchParkings with that location string. Never ask for coordinates — the system resolves them automatically.
- If the user's message contains no location at all (e.g. "find parking" with no place mentioned), ask them which area or city they are looking in. Keep it short: "Which area or city are you looking in?"
- Use checkAvailability when the user asks about a specific parking lot and time slot.
- Keep responses concise and friendly. Prices in ₹, distances in km/metres.
- Today's date (IST) is available via the system clock — use it when the user says "today" or "tomorrow".

OUTPUT FORMAT (strict — no plain text outside JSON):
- Parking search results:
  { "type": "parking_results", "message": "<friendly intro>", "results": [<array>] }
- Availability answer:
  { "type": "availability", "message": "<answer>", "available": <number> }
- Geocoding failure (location not found):
  { "type": "text", "message": "I couldn't find that location on the map. Could you be more specific, e.g. 'Andheri West, Mumbai'?" }
- All other replies (greetings, questions, errors):
  { "type": "text", "message": "<your response>" }
NEVER respond with plain text or markdown outside the JSON wrapper.`;

// ---------------------------------------------------------------------------
// Tool executor — maps tool names → actual service calls
// ---------------------------------------------------------------------------
async function executeTool(name, args) {
  if (name === "searchParkings") {
    const locationName = String(args.location ?? "").trim();

    if (!locationName) {
      return { parkings: [], message: "No location provided." };
    }

    // Resolve place name → coordinates
    const coords = await geocodeLocation(locationName);

    if (!coords) {
      // Return a structured error the model can relay gracefully
      return {
        parkings: [],
        geocodingFailed: true,
        message: `Could not resolve "${locationName}" to a map location.`,
      };
    }

    const radiusKm = Math.min(Number(args.radiusKm ?? 3), 20);
    const limit = Math.min(Number(args.limit ?? 5), 10);

    const results = await listSmartParkings(coords.lat, coords.lng, radiusKm, limit);

    return results.map((p) => ({
      id: p.id ?? p._id,
      title: p.title,
      address: p.address,
      area: p.area,
      city: p.city,
      hourlyPrice: p.hourlyPrice,
      availableSlots: p.availableSlots,
      totalSlots: p.totalSlots,
      amenities: p.amenities ?? [],
      parkingType: p.parkingType,
      vehicleTypes: p.vehicleTypes ?? [],
      distanceMetres: p.distance ?? null,
      badge: p.badge ?? null,
      rating: p.averageRating ?? null,
    }));
  }

  if (name === "checkAvailability") {
    const available = await calculateAvailableSlots(
      args.parkingId,
      Number(args.totalSlots),
      {
        bookingDate: args.bookingDate,
        startTime: args.startTime,
        endTime: args.endTime,
      }
    );
    return { available, parkingId: args.parkingId };
  }

  throw createHttpError(400, `Unknown tool requested by AI: ${name}`);
}

// ---------------------------------------------------------------------------
// Main chat function — agentic loop that handles multi-step tool use
// ---------------------------------------------------------------------------

/**
 * Process a conversation and return the assistant's reply.
 *
 * @param {Array<{role: 'user'|'assistant', content: string}>} messages
 * @returns {Promise<{type: string, message: string, results?: Array, available?: number}>}
 */
export async function processChat(messages) {
  const client = getClient();

  if (!Array.isArray(messages) || messages.length === 0) {
    throw createHttpError(400, "messages must be a non-empty array");
  }

  const trimmedMessages = messages.slice(-20);

  let currentMessages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...trimmedMessages.map((m) => ({
      role: m.role,
      content: String(m.content ?? ""),
    })),
  ];

  const MAX_ITERATIONS = 5;
  let iterations = 0;

  while (iterations < MAX_ITERATIONS) {
    iterations++;

    const response = await client.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: currentMessages,
      tools: TOOLS,
      tool_choice: "auto",
      temperature: 0.2,
      max_tokens: 1500,
    });

    const assistant = response.choices?.[0]?.message;
    if (!assistant) throw new Error("No model response");

    // ── Tool calls ──────────────────────────────────────────────────────────
    if (assistant.tool_calls?.length > 0) {
      currentMessages.push({
        role: "assistant",
        content: assistant.content || "",
        tool_calls: assistant.tool_calls,
      });

      const toolResults = await Promise.all(
        assistant.tool_calls.map(async (toolCall) => {
          try {
            const args = JSON.parse(toolCall.function.arguments || "{}");
            const result = await executeTool(toolCall.function.name, args);
            return {
              role: "tool",
              tool_call_id: toolCall.id,
              content: JSON.stringify(result),
            };
          } catch (err) {
            return {
              role: "tool",
              tool_call_id: toolCall.id,
              content: JSON.stringify({ error: err.message || "Tool execution failed" }),
            };
          }
        })
      );

      currentMessages.push(...toolResults);
      continue;
    }

    // ── Final response ───────────────────────────────────────────────────────
    const raw = assistant.content?.trim() || "";

    try {
      const cleaned = raw
        .replace(/^```json/i, "")
        .replace(/^```/, "")
        .replace(/```$/, "")
        .trim();

      return JSON.parse(cleaned);
    } catch {
      return { type: "text", message: raw };
    }
  }

  return {
    type: "text",
    message: "I ran into an issue processing your request. Please try again.",
  };
}