
import React from 'react';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Box, 
  History, 
  Settings, 
  ShieldCheck,
  Zap
} from 'lucide-react';
import { ProjectInfo } from '../types';

interface SidebarProps {
  projectInfo: ProjectInfo;
  activeTab: 'dashboard' | 'chat';
  setActiveTab: (tab: 'dashboard' | 'chat') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ projectInfo, activeTab, setActiveTab }) => {
  return (
    <aside className="w-72 bg-ucsd-navy text-white flex flex-col shrink-0">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-4 mb-10 group cursor-default">
          <div className="w-10 h-10 bg-ucsd-gold rounded-xl flex items-center justify-center shadow-lg shadow-ucsd-gold/20 shrink-0 transform transition-transform group-hover:scale-110 group-hover:rotate-3">
            <Zap size={20} className="text-ucsd-navy fill-ucsd-navy" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter leading-none">TritonProcure</span>
            <span className="text-[9px] font-bold text-ucsd-gold uppercase tracking-[0.2em] mt-1 opacity-80">Agentic AI</span>
          </div>
        </div>

        <nav className="space-y-1">
          <NavItem 
            icon={<LayoutDashboard size={20} />} 
            label="Home" 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')}
          />
          <NavItem 
            icon={<MessageSquare size={20} />} 
            label="Agent Chat" 
            active={activeTab === 'chat'} 
            onClick={() => setActiveTab('chat')}
          />
          <NavItem icon={<Box size={20} />} label="Asset Manager" onClick={() => {}} />
          <NavItem icon={<History size={20} />} label="Order History" badge="3" onClick={() => {}} />
          <NavItem icon={<ShieldCheck size={20} />} label="Compliance Logs" onClick={() => {}} />
        </nav>
      </div>

      <div className="p-6 flex-1 overflow-y-auto">
        <div className="mb-6">
          <p className="text-[10px] uppercase tracking-widest text-slate-400 font-black mb-3">Active Project</p>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10 shadow-inner">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-sm">{projectInfo.name}</h3>
              <span className="text-[9px] bg-ucsd-blue/40 text-blue-200 px-1.5 py-0.5 rounded font-black tracking-wider">NIH</span>
            </div>
            <p className="text-[10px] text-slate-400 mb-4 font-medium italic">Grant #2024-BR-UCSD</p>
            
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] font-bold mb-1">
                <span className="text-slate-300">Budget Utilization</span>
                <span className="text-ucsd-gold">{projectInfo.utilization}%</span>
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-ucsd-gold shadow-[0_0_10px_rgba(255,205,0,0.5)] transition-all duration-1000 ease-out" 
                  style={{ width: `${projectInfo.utilization}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 mt-auto">
        <button className="flex items-center gap-3 text-slate-400 hover:text-white transition-all text-sm font-semibold w-full group">
          <Settings size={18} className="group-hover:rotate-45 transition-transform duration-500" />
          <span>System Settings</span>
        </button>
      </div>
    </aside>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  badge?: string;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, badge, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all ${
    active ? 'bg-ucsd-blue text-white shadow-xl shadow-ucsd-blue/30' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
  }`}>
    <div className="flex items-center gap-3">
      {icon}
      <span className="font-bold text-sm">{label}</span>
    </div>
    {badge && (
      <span className="bg-ucsd-gold text-ucsd-navy text-[10px] font-black px-2 py-0.5 rounded-full">
        {badge}
      </span>
    )}
  </button>
);
