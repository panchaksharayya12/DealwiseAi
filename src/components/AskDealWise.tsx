import React, { useState } from 'react';
import { PropertyInput, FinancialMetrics, DealScoreBreakdown, ChatMessage } from '../types';
import { Sparkles, Send, Bot, User, Loader2 } from 'lucide-react';

interface AskDealWiseProps {
  property: PropertyInput;
  financialMetrics: FinancialMetrics;
  dealScore: DealScoreBreakdown;
}

export const AskDealWise: React.FC<AskDealWiseProps> = ({
  property,
  financialMetrics,
  dealScore,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I have analyzed **${property.propertyName}** (${dealScore.overallScore}/100 — ${dealScore.classification}). Ask me anything about this deal's valuation, rental yield potential, risks, or negotiation leverage points.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sampleQuestions = [
    'Is this property worth the asking price?',
    'What is making this deal risky?',
    'How much rent would I need for better returns?',
    'Should I consider a higher down payment?',
    'What should I negotiate with the seller?',
  ];

  const handleSend = async (questionText?: string) => {
    const query = (questionText || input).trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          property,
          financialMetrics,
          dealScore,
          userQuestion: query,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      const assistantMsg: ChatMessage = {
        id: `a_${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'Analysis completed.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.warn('[AskDealWise] Request failed, generating local fallback:', err);
      // Client-side fallback if network or server unreachable
      const fallbackMsg: ChatMessage = {
        id: `a_${Date.now()}`,
        role: 'assistant',
        content: `Deterministic Response: With a Deal Score of ${dealScore.overallScore}/100 and gross rental yield of ${financialMetrics.grossRentalYield}%, ${property.propertyName} presents a ${dealScore.classification.toLowerCase()}. Ensure you verify actual registered transactions in ${property.location} and physical structure health before making an offer.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="liquid-glass rounded-2xl p-6 md:p-8 border border-white/10 mt-8">
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-medium text-white flex items-center gap-2">
              Ask DealWise
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white/10 text-zinc-300 border border-white/15">
                Property Context Active
              </span>
            </h3>
            <p className="text-xs text-zinc-400 font-light">
              Interactive inquiries calibrated specifically to this property&apos;s financial outputs.
            </p>
          </div>
        </div>
      </div>

      {/* Suggested Quick Questions */}
      <div className="flex flex-wrap gap-2 mb-6">
        {sampleQuestions.map((q) => (
          <button
            key={q}
            onClick={() => handleSend(q)}
            disabled={loading}
            className="text-xs bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white px-3 py-1.5 rounded-lg border border-white/10 transition-colors text-left disabled:opacity-50"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Messages List */}
      <div className="space-y-4 max-h-96 overflow-y-auto pr-2 mb-6">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-3 ${
              m.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {m.role === 'assistant' && (
              <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-zinc-300 shrink-0 mt-0.5">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}

            <div
              className={`rounded-2xl px-4 py-3 max-w-[85%] md:max-w-[75%] text-sm ${
                m.role === 'user'
                  ? 'bg-white text-black font-normal'
                  : 'bg-zinc-900/90 text-zinc-200 border border-white/10 font-light'
              }`}
            >
              <div className="whitespace-pre-line leading-relaxed">
                {m.content}
              </div>
              <span
                className={`text-[10px] block mt-1.5 font-mono ${
                  m.role === 'user' ? 'text-zinc-500 text-right' : 'text-zinc-500'
                }`}
              >
                {m.timestamp}
              </span>
            </div>

            {m.role === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-zinc-300 shrink-0 mt-0.5">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-zinc-400 bg-white/5 rounded-xl p-3 border border-white/5 w-fit">
            <Loader2 className="w-4 h-4 animate-spin text-white" />
            <span>DealWise AI is analyzing your question...</span>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 bg-black/60 border border-white/15 rounded-xl p-1.5 focus-within:border-white/40 transition-colors"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about this property deal..."
          disabled={loading}
          className="flex-1 bg-transparent px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="bg-white text-black px-4 py-2 rounded-lg font-medium text-xs hover:bg-zinc-200 transition-colors disabled:opacity-40 flex items-center gap-1.5"
        >
          <span>Ask</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
