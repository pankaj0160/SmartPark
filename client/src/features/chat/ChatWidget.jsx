/**
 * ChatWidget.jsx
 *
 * Floating AI chat assistant for SmartPark.
 * - Renders as a small FAB (floating action button) bottom-right.
 * - Opens into a chat panel with message history.
 * - Calls POST /api/chat via chatApi.js.
 * - Renders parking result cards inline when the AI returns search results.
 * - Respects app light/dark theme via CSS variables.
 * - No third-party UI library dependencies — only lucide-react (already installed).
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send, Loader2, Bot } from 'lucide-react';
import { sendChatMessage } from './chatApi.js';
import { ParkingResultCard } from './ParkingResultCard.jsx';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const WELCOME_MESSAGE = {
  role: 'assistant',
  type: 'text',
  content: "Hi! I'm SmartPark Assistant 🚗\n\nTell me where you need parking — city, area, or any preference like \"covered parking near Bandra under ₹40/hr\" — and I'll find the best options for you."
};

// ---------------------------------------------------------------------------
// ChatWidget
// ---------------------------------------------------------------------------
export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // messages stored as: { role, content, type?, results?, available? }
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    setInput('');
    setError(null);

    // Optimistically add user message
    const userMsg = { role: 'user', content: text, type: 'text' };
    setMessages((prev) => [...prev, userMsg]);

    setIsLoading(true);

    try {
      // Build history for the API — only role + content, no UI-only fields
      const history = [...messages, userMsg]
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .map((m) => ({ role: m.role, content: m.content }));

      const response = await sendChatMessage(history);

      // Build the assistant message with the full response data
      const assistantMsg = {
        role: 'assistant',
        type: response.type ?? 'text',
        content: response.message ?? '',
        results: response.results ?? null,
        available: response.available ?? null
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      const errorText =
        err?.response?.data?.message ?? err?.message ?? 'Something went wrong. Please try again.';
      setError(errorText);
      // Also add error as assistant message so conversation context is preserved
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', type: 'text', content: `Sorry, I ran into an issue: ${errorText}` }
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const handleClear = useCallback(() => {
    setMessages([WELCOME_MESSAGE]);
    setError(null);
  }, []);

  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* FAB button                                                           */}
      {/* ------------------------------------------------------------------ */}
      <button
        aria-label={isOpen ? 'Close AI assistant' : 'Open AI assistant'}
        onClick={() => setIsOpen((v) => !v)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          background: 'var(--brand-600, #2563eb)',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
          transition: 'transform 0.15s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        type="button"
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {/* ------------------------------------------------------------------ */}
      {/* Chat panel                                                           */}
      {/* ------------------------------------------------------------------ */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="SmartPark AI Assistant"
          style={{
            position: 'fixed',
            bottom: '86px',
            right: '24px',
            zIndex: 9998,
            width: 'min(380px, calc(100vw - 32px))',
            height: 'min(540px, calc(100vh - 110px))',
            background: 'var(--app-bg, #fff)',
            border: '1px solid var(--app-border, #e2e8f0)',
            borderRadius: '16px',
            boxShadow: '0 8px 40px rgba(0,0,0,0.14)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            fontFamily: 'inherit'
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 14px',
              borderBottom: '1px solid var(--app-border, #e2e8f0)',
              background: 'var(--app-surface, #f8fafc)',
              flexShrink: 0
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Bot size={18} style={{ color: 'var(--brand-600, #2563eb)' }} />
              <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--app-text)' }}>
                SmartPark Assistant
              </span>
              <span
                style={{
                  fontSize: '10px',
                  padding: '1px 6px',
                  borderRadius: '10px',
                  background: '#dcfce7',
                  color: '#15803d',
                  fontWeight: 500
                }}
              >
                AI
              </span>
            </div>
            <button
              aria-label="Clear chat history"
              onClick={handleClear}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '11px',
                color: 'var(--app-text-muted)',
                padding: '2px 6px',
                borderRadius: '4px'
              }}
              type="button"
            >
              Clear
            </button>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '12px 12px 4px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            {messages.map((msg, idx) => (
              <MessageBubble key={idx} msg={msg} />
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--app-text-muted)', fontSize: '13px' }}>
                <Loader2 size={14} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                Thinking…
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Error banner */}
          {error && (
            <div
              style={{
                padding: '6px 12px',
                background: '#fef2f2',
                borderTop: '1px solid #fecaca',
                fontSize: '12px',
                color: '#dc2626',
                flexShrink: 0
              }}
            >
              {error}
            </div>
          )}

          {/* Input */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: 8,
              padding: '10px 12px',
              borderTop: '1px solid var(--app-border, #e2e8f0)',
              background: 'var(--app-surface, #f8fafc)',
              flexShrink: 0
            }}
          >
            <textarea
              ref={inputRef}
              aria-label="Message to AI assistant"
              disabled={isLoading}
              maxLength={500}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about parking…"
              rows={1}
              style={{
                flex: 1,
                resize: 'none',
                border: '1px solid var(--app-border, #e2e8f0)',
                borderRadius: '8px',
                padding: '8px 10px',
                fontSize: '13px',
                fontFamily: 'inherit',
                background: 'var(--app-bg, #fff)',
                color: 'var(--app-text)',
                outline: 'none',
                lineHeight: 1.4,
                maxHeight: '80px',
                overflowY: 'auto'
              }}
              value={input}
            />
            <button
              aria-label="Send message"
              disabled={isLoading || !input.trim()}
              onClick={handleSend}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: input.trim() && !isLoading ? 'var(--brand-600, #2563eb)' : 'var(--app-border, #e2e8f0)',
                color: input.trim() && !isLoading ? '#fff' : 'var(--app-text-muted)',
                border: 'none',
                cursor: input.trim() && !isLoading ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'background 0.15s'
              }}
              type="button"
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      )}

      {/* Inline CSS for spinner since we can't import a stylesheet */}
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}

// ---------------------------------------------------------------------------
// MessageBubble — renders a single message (user or assistant)
// ---------------------------------------------------------------------------
function MessageBubble({ msg }) {
  const isUser = msg.role === 'user';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isUser ? 'flex-end' : 'flex-start',
        maxWidth: '100%'
      }}
    >
      {/* Main bubble */}
      <div
        style={{
          maxWidth: '88%',
          padding: '8px 11px',
          borderRadius: isUser ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
          background: isUser ? 'var(--brand-600, #2563eb)' : 'var(--app-surface-muted, #f1f5f9)',
          color: isUser ? '#fff' : 'var(--app-text)',
          fontSize: '13px',
          lineHeight: 1.55,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word'
        }}
      >
        {msg.content}
      </div>

      {/* Parking result cards (only for assistant messages with results) */}
      {!isUser && msg.type === 'parking_results' && msg.results?.length > 0 && (
        <div style={{ width: '100%', marginTop: 8 }}>
          {msg.results.map((p, i) => (
            <ParkingResultCard key={p.id ?? i} parking={p} />
          ))}
        </div>
      )}

      {/* Availability inline answer */}
      {!isUser && msg.type === 'availability' && msg.available != null && (
        <div
          style={{
            marginTop: 6,
            fontSize: '12px',
            color: msg.available > 0 ? '#15803d' : '#dc2626',
            fontWeight: 500
          }}
        >
          {msg.available > 0 ? `✓ ${msg.available} slot(s) available` : '✗ No slots available'}
        </div>
      )}
    </div>
  );
}
