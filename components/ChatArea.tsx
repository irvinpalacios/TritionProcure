
import React, { useState, useRef, useEffect } from 'react';
import { Send, Terminal, ShieldCheck, Zap, ArrowRight, CheckCircle2, Loader2, Circle, Database, Cloud, Mail, Bot, User, Keyboard } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Message, ProcessingStep, Phase } from '../types';

interface ChatAreaProps {
  messages: Message[];
  isTyping: boolean;
  processingSteps: ProcessingStep[];
  phase: Phase;
  userName: string;
  onSendMessage: (text: string) => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({ messages, isTyping, processingSteps, phase, userName, onSendMessage }) => {
  const [inputValue, setInputValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll to bottom when messages or typing status changes
  useEffect(() => {
    // Small timeout to ensure DOM updates and animations are processed
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100);
    return () => clearTimeout(timer);
  }, [messages, isTyping, processingSteps]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (inputValue.trim() && !isTyping) {
      onSendMessage(inputValue);
      setInputValue('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    // Reset height to auto to shrink if text is deleted, then set to scrollHeight
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const isOraclePhase = (
    phase === Phase.COMPARISON || 
    phase === Phase.EVENT_SPEAKER_FINALIZE || 
    phase === Phase.FUNDING_CHECK || 
    phase === Phase.EVENT_FUNDING_CHECK || 
    phase === Phase.COMPLIANCE || 
    phase === Phase.TAX_EXEMPTION_Q2 ||
    phase === Phase.EVENT_POLICY_GUIDANCE
  ) && processingSteps.some(s => s.label.includes('Oracle') && s.status === 'active');

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-white relative overflow-hidden">
      {/* Messages Container */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10"
      >
        {messages.map((msg) => (
          <div key={msg.id} className={`flex w-full gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {/* Agent Avatar */}
            {msg.role === 'agent' && (
              <div className="w-8 h-8 rounded-full bg-ucsd-navy flex items-center justify-center shrink-0 mt-2 shadow-md">
                <Bot size={16} className="text-ucsd-gold" />
              </div>
            )}
            
            <div className="max-w-[85%] w-full flex flex-col">
              
              {/* Message Bubble */}
              <div className={`p-6 rounded-2xl shadow-sm border transition-all ${
                msg.role === 'user' 
                ? 'bg-ucsd-blue text-white border-ucsd-blue self-end' 
                : 'bg-[#F8FAFC] text-slate-800 border-slate-200 self-start'
              }`}>
                <div className={`prose prose-sm max-w-none ${msg.role === 'user' ? 'prose-invert' : 'prose-slate'} leading-relaxed font-medium`}>
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>

                {/* Specific UI Components based on Metadata */}
                {msg.metadata?.type === 'comparison' && (
                  <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="p-3 font-bold text-slate-600 uppercase tracking-tighter whitespace-nowrap">Metric</th>
                          {msg.metadata.options.map((opt: any, i: number) => (
                            <th key={i} className={`p-3 font-bold ${i === 1 ? 'text-ucsd-blue' : 'text-slate-600'} uppercase tracking-tighter whitespace-nowrap`}>
                              {opt.label}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {['price', 'shipping', 'compliance', 'risk'].map((field) => (
                          <tr key={field}>
                            <td className="p-3 capitalize text-slate-500 font-bold">{field}</td>
                            {msg.metadata.options.map((opt: any, i: number) => (
                              <td key={i} className={`p-3 ${i === 1 ? 'bg-blue-50/50 font-bold text-ucsd-blue' : 'text-slate-700 font-medium'}`}>
                                {opt[field]}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {msg.metadata?.type === 'compliance_checklist' && (
                  <div className="mt-4 space-y-2">
                    {msg.metadata.items.map((item: any, i: number) => (
                      <div 
                        key={i} 
                        className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200 animate-in slide-in-from-left duration-300 shadow-sm"
                        style={{ animationDelay: `${i * 150}ms` }}
                      >
                        <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                        <span className="text-xs font-bold text-slate-700">{item.text}</span>
                      </div>
                    ))}
                  </div>
                )}

                {msg.metadata?.type === 'email_draft' && (
                  <div className="mt-5 rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                    {/* Card Header */}
                    <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center gap-2">
                      <Mail size={14} className="text-slate-400" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Draft Email</span>
                    </div>
                    {/* Email Headers (To / Subject) */}
                    <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50 space-y-1">
                      <div className="flex text-xs">
                        <span className="w-16 font-bold text-slate-400 uppercase">To:</span>
                        <span className="font-medium text-slate-800">{msg.metadata.to}</span>
                      </div>
                      <div className="flex text-xs">
                        <span className="w-16 font-bold text-slate-400 uppercase">Subject:</span>
                        <span className="font-bold text-slate-800">{msg.metadata.subject}</span>
                      </div>
                    </div>
                    {/* Email Body */}
                    <div className="p-5 text-sm text-slate-700 leading-relaxed bg-white prose prose-sm max-w-none prose-slate">
                      <ReactMarkdown>{msg.metadata.message}</ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons - "Click and Run" Style */}
              {msg.actions && (
                <div className="mt-4 space-y-2.5 w-full">
                  {msg.actions.map((action, i) => (
                    <button 
                      key={i}
                      onClick={() => onSendMessage(action)}
                      className="w-full text-left px-6 py-4 rounded-xl border border-slate-200 text-slate-600 bg-white hover:border-ucsd-blue hover:text-ucsd-blue hover:shadow-md transition-all text-sm font-semibold flex items-center justify-between group"
                    >
                      {action}
                      <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>
              )}

              {/* Message Signature / Meta (Updated for Timestamps) */}
              <div className={`mt-2 flex items-center gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <span className="text-[10px] text-slate-400 font-semibold tracking-wider">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

            {/* User Avatar */}
            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center shrink-0 mt-2 shadow-sm overflow-hidden">
                <img src="https://picsum.photos/seed/drpalacios/100/100" alt="User" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        ))}

        {/* Processing Indicator */}
        {isTyping && (
          <div className="flex flex-col items-start max-w-[85%] w-full animate-in fade-in duration-500 pl-12">
            <div className="flex items-center gap-2 mb-4">
              <Loader2 size={12} className="text-ucsd-blue animate-spin" />
              <span className="text-[10px] font-black uppercase tracking-widest text-ucsd-blue animate-pulse">Agentic Reasoning Active...</span>
            </div>
            
            {isOraclePhase && (
              <div className="mb-4 w-full animate-in zoom-in-95 duration-700">
                <div className="bg-[#101827] text-white rounded-2xl p-6 flex items-center gap-6 border border-ucsd-gold/20 shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_3s_infinite]"></div>
                  <div className="relative z-10 w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                     <Database size={24} className="text-ucsd-gold animate-pulse" />
                  </div>
                  <div className="relative z-10 flex-1">
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-ucsd-gold mb-1">Secure Integration</p>
                    <h4 className="text-sm font-bold flex items-center gap-2 tracking-tight">
                      <Cloud size={16} className="text-blue-300" /> Oracle Financial Cloud Sync
                    </h4>
                    <div className="mt-3 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-ucsd-gold animate-progress-fast shadow-[0_0_15px_rgba(255,205,0,0.6)]"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 w-full shadow-inner space-y-4">
              {processingSteps.map((step) => (
                <div key={step.id} className={`flex items-start gap-4 transition-all duration-500 ${step.status === 'pending' ? 'opacity-30' : 'opacity-100'}`}>
                  <div className="mt-0.5">
                    {step.status === 'complete' ? (
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle2 size={12} className="text-green-600" />
                      </div>
                    ) : step.status === 'active' ? (
                      <Loader2 size={16} className="text-ucsd-blue animate-spin" />
                    ) : (
                      <Circle size={16} className="text-slate-300" />
                    )}
                  </div>
                  <div className="flex-1">
                     <p className={`text-sm font-bold tracking-tight ${
                       step.status === 'active' ? 'text-ucsd-blue' : 
                       step.status === 'complete' ? 'text-slate-600' : 'text-slate-400'
                     }`}>
                       {step.label}
                     </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Anchor for Auto-scroll */}
        <div ref={messagesEndRef} className="h-4 w-full" />
      </div>

      {/* Input Bar */}
      <div className="p-6 border-t border-slate-200 bg-slate-50 shadow-inner shrink-0">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex items-end gap-4">
          <div className="flex-1 relative">
            <div className="absolute left-5 bottom-4.5 text-slate-400 pointer-events-none">
              <Keyboard size={0} />
            </div>
            <textarea 
              ref={textareaRef}
              disabled={isTyping}
              value={inputValue}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              rows={1}
              style={{ maxHeight: '200px', resize: 'none' }}
              placeholder={isTyping ? "TritonProcure is orchestrating..." : "Type your message or select an option above..."}
              className={`w-full bg-white border border-slate-200 rounded-2xl pl-12 py-4 pr-24 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-ucsd-blue/10 transition-all shadow-sm overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] ${isTyping ? 'cursor-not-allowed opacity-50' : ''}`}
            />
            <div className="absolute right-4 bottom-4 hidden md:flex items-center gap-2 text-slate-400">
               <span className="text-[9px] font-bold border border-slate-200 rounded px-1.5 py-0.5 bg-white shadow-xs uppercase tracking-tighter">ENTER</span>
            </div>
          </div>
          <button 
            type="submit"
            disabled={isTyping || !inputValue.trim()}
            className="w-14 h-14 bg-ucsd-blue text-white rounded-2xl flex items-center justify-center hover:bg-ucsd-navy disabled:bg-slate-200 disabled:text-slate-400 transition-all shadow-lg shadow-ucsd-blue/10 transform active:scale-95 shrink-0"
          >
            <Send size={22} />
          </button>
        </form>
      </div>
    </div>
  );
};
