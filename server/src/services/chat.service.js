/**
 * chat.service.js
 *
 * AI parking assistant using Anthropic Claude with function/tool calling.
 * The model autonomously decides which tools to call based on user intent.
 *
 * Tools exposed to the model:
 *  - searchParkings  → calls listSmartParkings (existing service)
 *  - checkAvailability → calls calculateAvailableSlots (existing service)
 *
 * No existing service logic is modified.
 */

import OpenAI from "openai";

import { env } from "../config/env.js";
import { listSmartParkings } from "./parking.service.js";
import { calculateAvailableSlots } from "./occupancy.service.js";
import { createHttpError } from "../utils/createHttpError.js";

// ---------------------------------------------------------------------------
// Anthropic client — lazy-initialised so missing key gives a clear error
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
      baseURL: "https://api.groq.com/openai/v1"
    });
  }

  return _client;
}
// ---------------------------------------------------------------------------
// Tool definitions — what we tell the model it can do
// ---------------------------------------------------------------------------
const TOOLS = [
  {
    type: "function",
    function: {
      name: "searchParkings",
      description:
        "Search for parking lots near a city or area.",
      parameters: {
        type: "object",
        properties: {
          lat: {
            type: "number"
          },
          lng: {
            type: "number"
          },
          radiusKm: {
            type: "number"
          },
          limit: {
            type: "number"
          }
        },
        required: ["lat", "lng"]
      }
    }
  },

  {
    type: "function",
    function: {
      name: "checkAvailability",
      description:
        "Check parking availability for a specific time slot.",
      parameters: {
        type: "object",
        properties: {
          parkingId: {
            type: "string"
          },
          totalSlots: {
            type: "number"
          },
          bookingDate: {
            type: "string"
          },
          startTime: {
            type: "string"
          },
          endTime: {
            type: "string"
          }
        },
        required: [
          "parkingId",
          "totalSlots",
          "bookingDate",
          "startTime",
          "endTime"
        ]
      }
    }
  }
];
// ---------------------------------------------------------------------------
// System prompt — instructs the model on persona and output format
// ---------------------------------------------------------------------------
const SYSTEM_PROMPT = `You are SmartPark Assistant, a helpful AI for finding and booking parking in India.

BEHAVIOUR:
- Help users find parking, check availability, compare options, and understand pricing.
- Always use the searchParkings tool when asked to find parking. Never make up parking lots.
- Use checkAvailability when the user asks about a specific time slot.
- If you need coordinates but don't have them, politely ask the user for their city/area and explain you need it to search nearby.
- Keep responses concise and friendly. Use simple language.
- Prices are in Indian Rupees (₹). Distances in km/metres.

OUTPUT FORMAT:
- For parking search results, respond with a JSON object ONLY (no markdown fences, no extra text):
  { "type": "parking_results", "message": "<friendly intro text>", "results": [<array from tool>] }
- For availability answers, respond with JSON:
  { "type": "availability", "message": "<answer>", "available": <number> }
- For all other responses (greetings, clarifying questions, errors), respond with JSON:
  { "type": "text", "message": "<your response>" }
- NEVER respond with plain text outside JSON. Always wrap in the JSON format above.`;

// ---------------------------------------------------------------------------
// Tool executor — maps tool names → actual service calls
// ---------------------------------------------------------------------------
async function executeTool(name, args) {
  if (name === 'searchParkings') {
    const lat = Number(args.lat ?? 0);
    const lng = Number(args.lng ?? 0);

    // If coordinates are zero the model doesn't know location — return empty
    if (lat === 0 && lng === 0) {
      return { parkings: [], message: 'Location coordinates not provided.' };
    }

    const radiusKm = Math.min(Number(args.radiusKm ?? 3), 20);
    const limit = Math.min(Number(args.limit ?? 5), 10);

    const results = await listSmartParkings(lat, lng, radiusKm, limit);
    // Shape the results for the model — keep it lean to stay within token budget
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
      rating: p.averageRating ?? null
    }));
  }

  if (name === 'checkAvailability') {
    const available = await calculateAvailableSlots(
      args.parkingId,
      Number(args.totalSlots),
      {
        bookingDate: args.bookingDate,
        startTime: args.startTime,
        endTime: args.endTime
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
 *   Full conversation history from the client.
 * @returns {Promise<{type: string, message: string, results?: Array, available?: number}>}
 */
export async function processChat(messages) {
  const client = getClient();

  if (!Array.isArray(messages) || messages.length === 0) {
    throw createHttpError(
      400,
      "messages must be a non-empty array"
    );
  }

  const trimmedMessages = messages.slice(-20);

  let currentMessages = [
    {
      role: "system",
      content: SYSTEM_PROMPT
    },

    ...trimmedMessages.map((m) => ({
      role: m.role,
      content: String(m.content ?? "")
    }))
  ];

  const MAX_ITERATIONS = 5;
  let iterations = 0;

  while (iterations < MAX_ITERATIONS) {
    iterations++;

    const response =
      await client.chat.completions.create({
        model: "openai/gpt-oss-120b",

        messages: currentMessages,

        tools: TOOLS,

        tool_choice: "auto",

        temperature: 0.2,

        max_tokens: 1500
      });

    const assistant =
      response.choices?.[0]?.message;

    if (!assistant) {
      throw new Error("No model response");
    }

    // Tool calls
    if (
      assistant.tool_calls &&
      assistant.tool_calls.length > 0
    ) {
      currentMessages.push({
        role: "assistant",
        content: assistant.content || "",
        tool_calls: assistant.tool_calls
      });

      const toolResults = await Promise.all(
        assistant.tool_calls.map(
          async (toolCall) => {
            try {
              const args = JSON.parse(
                toolCall.function.arguments || "{}"
              );

              const result =
                await executeTool(
                  toolCall.function.name,
                  args
                );

              return {
                role: "tool",
                tool_call_id: toolCall.id,
                content: JSON.stringify(result)
              };
            } catch (err) {
              return {
                role: "tool",
                tool_call_id: toolCall.id,
                content: JSON.stringify({
                  error:
                    err.message ||
                    "Tool execution failed"
                })
              };
            }
          }
        )
      );

      currentMessages.push(...toolResults);

      continue;
    }

    // Final response
    const raw =
      assistant.content?.trim() || "";

    try {
      const cleaned = raw
        .replace(/^```json/i, "")
        .replace(/^```/, "")
        .replace(/```$/, "")
        .trim();

      return JSON.parse(cleaned);
    } catch {
      return {
        type: "text",
        message: raw
      };
    }
  }

  return {
    type: "text",
    message:
      "I ran into an issue processing your request. Please try again."
  };
}