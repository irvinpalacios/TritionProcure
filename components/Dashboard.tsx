
import React from 'react';
import { Search, ShoppingBag, Calendar, ArrowRight } from 'lucide-react';

interface DashboardProps {
  onStartWorkflow: (type: 'procure' | 'event') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onStartWorkflow }) => {
  return (
    <div className="flex-1 overflow-y-auto bg-white">
      {/* Top Welcome Bar */}
      <div className="px-12 py-6 flex justify-between items-center">
        <p className="text-slate-500 font-medium">Welcome back, Dr. Palacios</p>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Search orders..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-100/50 border-none rounded-xl text-sm focus:ring-2 focus:ring-ucsd-blue/10 focus:bg-white transition-all"
          />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-12 py-8">
        {/* Main Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Welcome to Triton Procure!
          </h2>
          <p className="text-slate-500 text-lg font-medium">
            Your one-stop shop for all procure to pay needs. What are you trying to do today?
          </p>
        </div>

        {/* Workflow Grid */}
        <div className="grid grid-cols-2 gap-8 mb-16">
          {/* Card 1: Procure */}
          <div 
            onClick={() => onStartWorkflow('procure')}
            className="group relative bg-white border border-slate-200 rounded-3xl p-8 hover:border-ucsd-blue hover:shadow-2xl hover:shadow-ucsd-blue/5 transition-all cursor-pointer overflow-hidden"
          >
            <div className="absolute -right-8 -top-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
              <ShoppingBag size={200} />
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-ucsd-blue group-hover:text-white transition-colors">
              <ShoppingBag size={24} className="text-ucsd-blue group-hover:text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Procure Goods & Services</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-8 pr-12">
              Purchase lab equipment, office supplies, software, or professional services. Includes Oracle compliance checks.
            </p>
            <div className="flex items-center gap-2 text-slate-400 group-hover:text-ucsd-blue font-bold text-xs tracking-widest uppercase transition-colors">
              Start Workflow <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Plan Event */}
          <div 
            onClick={() => onStartWorkflow('event')}
            className="group relative bg-white border border-slate-200 rounded-3xl p-8 hover:border-purple-500 hover:shadow-2xl hover:shadow-purple-500/5 transition-all cursor-pointer overflow-hidden"
          >
            <div className="absolute -right-8 -top-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity text-purple-900">
              <Calendar size={200} />
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-500 group-hover:text-white transition-colors">
              <Calendar size={24} className="text-purple-500 group-hover:text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Plan an Event</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-8 pr-12">
              Organize conferences, fundraisers, or team meetings. Manage venues, catering, speakers, and entertainment policy.
            </p>
            <div className="flex items-center gap-2 text-slate-400 group-hover:text-purple-500 font-bold text-xs tracking-widest uppercase transition-colors">
              Start Workflow <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
