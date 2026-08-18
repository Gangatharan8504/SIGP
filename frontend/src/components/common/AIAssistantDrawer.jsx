import React, { useState } from 'react';
import { aiApi, ragApi } from '../../api/apis';
import {
  Sparkles,
  Bot,
  BookOpen,
  Send,
  X,
  CheckCircle2,
  AlertCircle,
  FileText,
  HelpCircle,
  Code2,
} from 'lucide-react';
import { Button, Badge, Spinner } from './UIElements';

export const AIAssistantDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('agent'); // 'agent' | 'rag'
  const [agentType, setAgentType] = useState('Learning Agent');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am your SGIP AI Growth & Intelligence Assistant. How can I assist your placement preparation today?',
      agent: 'Learning Agent',
      citations: [],
    },
  ]);

  const agentsList = [
    { id: 'Learning Agent', label: 'Learning Agent', icon: BookOpen },
    { id: 'Skill Analysis Agent', label: 'Skill Gap Agent', icon: Sparkles },
    { id: 'Coding Agent', label: 'Coding & Algorithmic Agent', icon: Code2 },
    { id: 'Resume Agent', label: 'Resume ATS Optimizer', icon: FileText },
    { id: 'Placement Agent', label: 'Placement Eligibility Agent', icon: CheckCircle2 },
    { id: 'Interview Agent', label: 'Mock Interview Coach', icon: HelpCircle },
    { id: 'Exam Integrity Agent', label: 'Integrity Advisor', icon: AlertCircle },
  ];

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!query.trim() || loading) return;

    const userText = query;
    setQuery('');
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setLoading(true);

    try {
      if (activeTab === 'agent') {
        const res = await aiApi.chatAgent({
          agentType,
          query: userText,
          context: { role: 'STUDENT', path: window.location.pathname },
        });

        if (res.data.success) {
          setMessages((prev) => [
            ...prev,
            {
              sender: 'ai',
              text: res.data.response,
              agent: res.data.agentType || agentType,
              citations: [],
            },
          ]);
        }
      } else {
        const res = await ragApi.queryCourseRAG({
          query: userText,
          department: 'Computer Science and Engineering',
        });

        if (res.data.success) {
          setMessages((prev) => [
            ...prev,
            {
              sender: 'ai',
              text: res.data.answer,
              agent: 'Curriculum RAG Engine',
              citations: res.data.citations || [],
            },
          ]);
        }
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `Error connecting to AI service: ${err.message || 'Please check Groq API configuration.'}`,
          agent: 'System Alert',
          citations: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button with Reddish-Pink Radiance */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 hover:from-rose-500 hover:to-pink-500 text-white shadow-2xl shadow-rose-600/40 flex items-center gap-2 font-bold text-xs transition-all hover:scale-105 border border-rose-400/30 cursor-pointer"
        title="Open SGIP AI Assistant"
      >
        <Sparkles className="w-5 h-5 animate-pulse text-rose-200" />
        <span className="hidden sm:inline">Ask SGIP AI</span>
      </button>

      {/* Slide-out Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="w-full max-w-lg h-full bg-slate-950 light:bg-white border-l border-rose-500/20 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 border-b border-rose-500/15 flex items-center justify-between bg-rose-950/20 light:bg-rose-50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 via-pink-600 to-rose-500 flex items-center justify-center text-white shadow-md shadow-rose-600/30">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white light:text-rose-950 flex items-center gap-1.5">
                    SGIP AI Intelligence Assistant
                    <Badge variant="rose" size="sm">Groq Llama-3.3</Badge>
                  </h3>
                  <p className="text-[11px] text-rose-300/70 light:text-rose-700">Contextual multi-agent guidance & course RAG</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-rose-300 light:text-rose-700 hover:text-white hover:bg-rose-500/20 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mode Tabs */}
            <div className="p-3 border-b border-rose-500/15 bg-rose-950/10 light:bg-rose-50/50 flex items-center gap-2">
              <button
                onClick={() => setActiveTab('agent')}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition ${
                  activeTab === 'agent'
                    ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md shadow-rose-600/30'
                    : 'text-rose-300/70 light:text-rose-800 hover:text-white bg-slate-900 light:bg-white'
                }`}
              >
                Specialized Agents
              </button>
              <button
                onClick={() => setActiveTab('rag')}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition ${
                  activeTab === 'rag'
                    ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md shadow-rose-600/30'
                    : 'text-rose-300/70 light:text-rose-800 hover:text-white bg-slate-900 light:bg-white'
                }`}
              >
                Course Material RAG
              </button>
            </div>

            {/* Agent Selector (when in agent mode) */}
            {activeTab === 'agent' && (
              <div className="px-4 py-2 border-b border-rose-500/15 bg-slate-950 light:bg-rose-50/30 flex items-center gap-1.5 overflow-x-auto text-xs scrollbar-none">
                {agentsList.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => setAgentType(a.id)}
                    className={`px-2.5 py-1 rounded-lg shrink-0 transition text-[11px] font-semibold flex items-center gap-1 ${
                      agentType === a.id
                        ? 'bg-rose-500/20 text-rose-300 light:bg-rose-600 light:text-white border border-rose-500/40'
                        : 'bg-slate-900 light:bg-white text-rose-300/60 light:text-rose-800 hover:text-white border border-rose-500/20'
                    }`}
                  >
                    <a.icon className="w-3 h-3" />
                    {a.label}
                  </button>
                ))}
              </div>
            )}

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${
                    m.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  {m.sender === 'ai' && (
                    <span className="text-[10px] text-rose-400 light:text-rose-600 font-bold mb-1 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> {m.agent}
                    </span>
                  )}
                  <div
                    className={`max-w-[88%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                      m.sender === 'user'
                        ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-br-none shadow-md shadow-rose-600/20'
                        : 'bg-slate-900 light:bg-rose-50/80 text-rose-100 light:text-slate-900 border border-rose-500/20 rounded-bl-none'
                    }`}
                  >
                    {m.text}

                    {/* Citations */}
                    {m.citations && m.citations.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-rose-500/20 space-y-1">
                        <span className="text-[10px] font-bold text-rose-300 light:text-rose-700 uppercase tracking-wider">
                          Grounded Sources:
                        </span>
                        {m.citations.map((c, cIdx) => (
                          <p key={cIdx} className="text-[11px] text-emerald-400 light:text-emerald-700 font-mono">
                            • {c}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-2 text-rose-400">
                  <Spinner size="sm" />
                  <span className="text-xs">Reasoning with Groq Llama 3.3...</span>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSend} className="p-3 border-t border-rose-500/15 bg-rose-950/20 light:bg-rose-50 flex items-center gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={
                  activeTab === 'agent'
                    ? `Ask the ${agentType}...`
                    : 'Search approved course notes & curriculum...'
                }
                className="flex-1 bg-slate-950 light:bg-white border border-rose-500/25 text-xs rounded-xl px-3.5 py-2.5 text-white light:text-slate-900 outline-none focus:border-rose-500 transition"
              />
              <Button type="submit" variant="primary" size="sm" disabled={!query.trim() || loading} icon={Send}>
                Send
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
