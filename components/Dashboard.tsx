
import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface DashboardProps {
  onStartQuery: (text: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onStartQuery }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onStartQuery(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-white flex flex-col items-center justify-center p-6">
      <div className="max-w-3xl w-full">
        {/* Main Hero Section */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <h2 className="text-5xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
            Welcome to <span className="text-ucsd-blue">Triton Procure</span>!
          </h2>
          <p className="text-slate-500 text-xl font-medium max-w-2xl mx-auto">
            Your one-stop shop for all procure to pay needs. Order research equipment, plan departmental events, or verify compliance policies. What are you trying to do today?
          </p>
        </div>

        {/* Minimalist Chat Interface */}
        <div className="animate-in slide-in-from-bottom-8 duration-700 delay-200">
          <form 
            onSubmit={handleSubmit}
            className="bg-white border border-slate-200 shadow-lg shadow-slate-200/50 rounded-2xl overflow-hidden flex flex-col"
          >
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask TritonProcure to order supplies, plan an event, or check policies..."
              className="w-full bg-transparent resize-none outline-none p-6 text-slate-900 placeholder:text-slate-400 text-lg"
              rows={3}
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="bg-ucsd-blue text-white rounded-xl p-3 hover:bg-ucsd-navy transition-colors self-end m-3 disabled:bg-slate-100 disabled:text-slate-300 transition-all active:scale-95"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
