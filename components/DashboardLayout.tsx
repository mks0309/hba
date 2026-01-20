
import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { CoreValuesTicker } from './CoreValuesTicker';
import { UserRole, User } from '../types';

interface DashboardLayoutProps {
  user: User; // Accepted from parent App.tsx
  userRole: UserRole;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  user,
  userRole, 
  activeTab, 
  onTabChange, 
  onLogout, 
  children 
}) => {
  
  return (
    <div className="h-screen w-full bg-slate-50 flex flex-col overflow-hidden font-sans text-slate-900">
      
      {/* 1. Header (Fixed at Top via Flex Structure) */}
      <div className="flex-shrink-0 z-50">
         <Header 
            userRole={userRole} 
            userName={user.name}
            userDesignation={user.designation}
         />
      </div>

      {/* 2. Main Layout Body (Sidebar + Scrollable Content) */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Sidebar (Static Left, Scrolls Internally) */}
        <Sidebar 
          role={userRole} 
          activeTab={activeTab} 
          onTabChange={onTabChange} 
          onLogout={onLogout} 
        />

        {/* Scrollable Content Area (Dynamic Right) */}
        <main className="flex-1 overflow-y-auto bg-slate-50/50 p-6 relative scroll-smooth pb-16">
          {children}
        </main>

        {/* 3. Bottom Ticker (Fixed Overlay) */}
        <CoreValuesTicker />
      </div>

    </div>
  );
};
