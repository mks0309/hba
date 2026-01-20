
import React from 'react';
import { ListTodo, Activity, UserCircle2, Inbox, Send, History, Layers, FileClock, BarChart, PlusCircle, FileCheck } from 'lucide-react';
import { UserRole } from '../types';
import { SessionCard } from './SessionCard';

interface SidebarProps {
  role: UserRole;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ role, activeTab, onTabChange, onLogout }) => {
  
  const getMenuItems = () => {
    const items = [];

    // Applicant Specific
    if (role === 'Applicant') {
      items.push({ id: 'new', label: 'New Application', icon: PlusCircle });
    }

    // Common Items
    items.push({ id: 'inbox', label: 'Inbox', icon: Inbox });

    // ES Specific: Sanction Orders (Below Inbox)
    if (role === 'ES') {
      items.push({ id: 'sanction-orders', label: 'Sanction Orders', icon: FileCheck });
    }

    // Common Items
    items.push({ id: 'sent', label: 'Sent Items', icon: Send });

    // Reviewers/Approvers Archive
    if (['ES', 'Finance', 'HR', 'Admin'].includes(role)) {
       items.push({ id: 'archive', label: 'Archive', icon: History });
    }

    return items;
  };

  const items = getMenuItems();

  return (
    <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col h-full overflow-y-auto flex-shrink-0 z-30">
      <div className="py-6 flex-1 space-y-1">
        {items.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-6 py-3.5 border-l-4 transition-all duration-200 group relative
                ${isActive 
                  ? 'border-iocl-saffron bg-orange-50 text-iocl-blue shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]' 
                  : 'border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }
              `}
            >
              <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-iocl-saffron' : 'text-slate-400 group-hover:text-slate-600'}`} />
              <span className="font-bold text-sm tracking-wide">{item.label}</span>
              {isActive && (
                 <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-iocl-saffron shadow-sm" />
              )}
            </button>
          );
        })}
      </div>
      
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <SessionCard onLogout={onLogout} variant="light" />
      </div>
    </aside>
  );
};
