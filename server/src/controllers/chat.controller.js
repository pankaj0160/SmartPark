/**
 * chat.controller.js
 *
 * HTTP controller for the AI chat endpoint.
 * Delegates all logic to chat.service.js.
 */

import { processChat } from '../services/chat.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createHttpError } from '../utils/createHttpError.js';

/**
 * POST /api/chat
 *
 * Body: { messages: Array<{role: 'user'|'assistant', content: string}> }
 * Response: { success: true, data: { type, message, results?, available? } }
 */
export const handleChat = asyncHandler(async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    throw createHttpError(400, 'Request body must include a "messages" array');
  }

  if (messages.length === 0) {
    throw createHttpError(400, '"messages" array must not be empty');
  }

  // Basic shape validation — each message must have role + content
  for (const msg of messages) {
    if (!msg.role || !['user', 'assistant'].includes(msg.role)) {
      throw createHttpError(400, 'Each message must have a "role" of "user" or "assistant"');
    }
    if (typeof msg.content !== 'string' || msg.content.trim() === '') {
      throw createHttpError(400, 'Each message must have a non-empty string "content"');
    }
  }

  const result = await processChat(messages);

  res.status(200).json({
    success: true,
    data: result
  });
});
