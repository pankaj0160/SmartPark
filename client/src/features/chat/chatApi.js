/**
 * chatApi.js
 *
 * Thin wrapper around apiClient for the /chat endpoint.
 * Uses the same axios instance as the rest of the app
 * so auth headers are automatically included.
 */

import { apiClient } from '../../lib/apiClient.js';

/**
 * Send messages to the AI chat endpoint.
 *
 * @param {Array<{role: 'user'|'assistant', content: string}>} messages
 * @returns {Promise<{type: string, message: string, results?: Array, available?: number}>}
 */
export async function sendChatMessage(messages) {
  const response = await apiClient.post('/chat', { messages });
  return response.data.data;
}
