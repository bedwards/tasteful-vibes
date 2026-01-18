import { useState, useEffect, useRef } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatButtonProps {
  pageContext: string;
}

const DAILY_LIMIT = 5;
const STORAGE_KEY = 'tasteful-vibes-chat';

function getStoredData(): { messages: Message[]; count: number; date: string } {
  if (typeof window === 'undefined') return { messages: [], count: 0, date: '' };

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return { messages: [], count: 0, date: '' };

  try {
    return JSON.parse(stored);
  } catch {
    return { messages: [], count: 0, date: '' };
  }
}

function storeData(messages: Message[], count: number) {
  if (typeof window === 'undefined') return;

  const today = new Date().toISOString().split('T')[0];
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ messages, count, date: today }));
}

export default function ChatButton({ pageContext }: ChatButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dailyCount, setDailyCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = getStoredData();
    const today = new Date().toISOString().split('T')[0];

    if (stored.date === today) {
      setMessages(stored.messages);
      setDailyCount(stored.count);
    } else {
      // Reset for new day
      setMessages([]);
      setDailyCount(0);
      storeData([], 0);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    if (dailyCount >= DAILY_LIMIT) {
      setError(`Daily limit reached (${DAILY_LIMIT} messages). Come back tomorrow!`);
      return;
    }

    const userMessage: Message = { role: 'user', content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          context: pageContext,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      const assistantMessage: Message = { role: 'assistant', content: data.content };
      const updatedMessages = [...newMessages, assistantMessage];
      const newCount = dailyCount + 1;

      setMessages(updatedMessages);
      setDailyCount(newCount);
      storeData(updatedMessages, newCount);
    } catch (err) {
      setError('Failed to send message. Please try again.');
      setMessages(newMessages.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-terminal-accent text-terminal-bg rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center"
        aria-label="Open chat"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] bg-terminal-surface border border-terminal-border rounded-lg shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-terminal-bg border-b border-terminal-border px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-terminal-green rounded-full animate-pulse"></span>
              <span className="font-semibold text-sm">Ask AI about Brian</span>
            </div>
            <span className="text-xs text-terminal-muted">
              {DAILY_LIMIT - dailyCount} messages left today
            </span>
          </div>

          {/* Messages */}
          <div className="h-80 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-terminal-muted text-sm text-center py-8">
                <p>Ask me anything about Brian's work, skills, or projects!</p>
                <p className="mt-2 text-xs">Examples:</p>
                <ul className="mt-1 space-y-1 text-xs">
                  <li>"What projects has Brian built?"</li>
                  <li>"What is vibe coding?"</li>
                  <li>"Can Brian help with healthcare software?"</li>
                </ul>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                    msg.role === 'user'
                      ? 'bg-terminal-accent text-terminal-bg'
                      : 'bg-terminal-bg text-terminal-text'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-terminal-bg rounded-lg px-3 py-2 text-sm text-terminal-muted">
                  <span className="animate-pulse">Thinking...</span>
                </div>
              </div>
            )}

            {error && (
              <div className="text-terminal-red text-xs text-center">
                {error}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-terminal-border p-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={dailyCount >= DAILY_LIMIT ? "Daily limit reached" : "Type a message..."}
                disabled={dailyCount >= DAILY_LIMIT || isLoading}
                className="flex-1 bg-terminal-bg border border-terminal-border rounded px-3 py-2 text-sm text-terminal-text placeholder-terminal-muted focus:outline-none focus:border-terminal-accent disabled:opacity-50"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading || dailyCount >= DAILY_LIMIT}
                className="bg-terminal-accent text-terminal-bg px-4 py-2 rounded text-sm font-semibold hover:bg-terminal-accent/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
