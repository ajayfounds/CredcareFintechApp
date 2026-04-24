import React from 'react';
import { Home, ListTodo, TrendingUp, BookOpen, User } from 'lucide-react';
import { cn } from '../ui/WireframeComponents';
import { motion } from 'motion/react';

type Tab = 'home' | 'recovery' | 'tasks' | 'learn' | 'profile';

interface MobileLayoutProps {
  children: React.ReactNode;
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  showNav?: boolean;
}

export const MobileLayout = ({ children, activeTab, onTabChange, showNav = true }: MobileLayoutProps) => {
  return (
    <div className="min-h-screen bg-black/5 flex justify-center font-sans text-gray-900 overflow-hidden">
      {/* Phone Simulator Container */}
      <div className="w-full max-w-[420px] bg-[#F2F2F7] h-[100dvh] flex flex-col relative shadow-2xl sm:rounded-[40px] overflow-hidden box-content">
        
        {/* iOS Status Bar Placeholder */}
        <div className="h-12 bg-[#F2F2F7]/90 backdrop-blur-md w-full absolute top-0 left-0 z-50 flex justify-between items-end px-6 pb-2 text-xs font-semibold select-none">
           <span>9:41</span>
           <div className="flex gap-1.5 items-center">
             <div className="w-4 h-2.5 bg-black rounded-[1px] opacity-20 relative">
               <div className="absolute right-[-2px] top-[3px] w-[1.5px] h-1 bg-black/20 rounded-r-[1px]" />
             </div>
             <div className="w-4 h-4 bg-black rounded-full opacity-20" />
             <div className="w-6 h-3 bg-black rounded-[3px]" />
           </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto no-scrollbar pt-12 pb-24 scroll-smooth">
          {children}
        </main>

        {/* Bottom Navigation */}
        {showNav && (
          <div className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-200/50 px-2 pt-2 pb-8 h-[88px] flex justify-around items-start z-50">
            <NavItem 
              icon={<Home size={24} strokeWidth={activeTab === 'home' ? 2.5 : 2} />} 
              label="Home" 
              isActive={activeTab === 'home'} 
              onClick={() => onTabChange('home')} 
            />
            <NavItem 
              icon={<TrendingUp size={24} strokeWidth={activeTab === 'recovery' ? 2.5 : 2} />} 
              label="Recovery" 
              isActive={activeTab === 'recovery'} 
              onClick={() => onTabChange('recovery')} 
            />
            <NavItem 
              icon={<ListTodo size={24} strokeWidth={activeTab === 'tasks' ? 2.5 : 2} />} 
              label="Action" 
              isActive={activeTab === 'tasks'} 
              onClick={() => onTabChange('tasks')} 
            />
            <NavItem 
              icon={<BookOpen size={24} strokeWidth={activeTab === 'learn' ? 2.5 : 2} />} 
              label="Learn" 
              isActive={activeTab === 'learn'} 
              onClick={() => onTabChange('learn')} 
            />
            <NavItem 
              icon={<User size={24} strokeWidth={activeTab === 'profile' ? 2.5 : 2} />} 
              label="Profile" 
              isActive={activeTab === 'profile'} 
              onClick={() => onTabChange('profile')} 
            />
          </div>
        )}
        
        {/* iOS Home Indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[134px] h-[5px] bg-black rounded-full z-[60]" />
      </div>
    </div>
  );
};

const NavItem = ({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={cn(
      "flex flex-col items-center justify-center space-y-1 w-16 transition-all duration-200 active:scale-90",
      isActive ? "text-[#007AFF]" : "text-gray-400 hover:text-gray-500"
    )}
  >
    {icon}
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);
