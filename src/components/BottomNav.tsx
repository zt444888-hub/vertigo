import React from 'react';
import { ActiveTab } from '../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#e6f6ff] border-t border-[#bfc8ce]/30 rounded-t-2xl shadow-lg max-w-[720px] mx-auto h-20 px-4 pb-3 flex justify-around items-center">
      {/* Home Tab */}
      <button
        onClick={() => onTabChange('home')}
        className={`flex flex-col items-center justify-center py-1.5 px-5 rounded-full transition-all duration-200 active:scale-95 ${
          activeTab === 'home'
            ? 'bg-[#9deee5] text-[#0c6e68] shadow-sm font-semibold'
            : 'text-[#40484e] hover:bg-[#d5ecf8]'
        }`}
      >
        <span
          className={`material-symbols-outlined text-[24px] ${
            activeTab === 'home' ? 'fill-1' : ''
          }`}
        >
          home
        </span>
        <span className="text-[11px] font-medium mt-0.5">Home</span>
      </button>

      {/* Charts Tab */}
      <button
        onClick={() => onTabChange('charts')}
        className={`flex flex-col items-center justify-center py-1.5 px-5 rounded-full transition-all duration-200 active:scale-95 ${
          activeTab === 'charts'
            ? 'bg-[#9deee5] text-[#0c6e68] shadow-sm font-semibold'
            : 'text-[#40484e] hover:bg-[#d5ecf8]'
        }`}
      >
        <span
          className={`material-symbols-outlined text-[24px] ${
            activeTab === 'charts' ? 'fill-1' : ''
          }`}
        >
          bar_chart
        </span>
        <span className="text-[11px] font-medium mt-0.5">Charts</span>
      </button>

      {/* Monthly View Tab */}
      <button
        onClick={() => onTabChange('monthly')}
        className={`flex flex-col items-center justify-center py-1.5 px-5 rounded-full transition-all duration-200 active:scale-95 ${
          activeTab === 'monthly'
            ? 'bg-[#9deee5] text-[#0c6e68] shadow-sm font-semibold'
            : 'text-[#40484e] hover:bg-[#d5ecf8]'
        }`}
      >
        <span
          className={`material-symbols-outlined text-[24px] ${
            activeTab === 'monthly' ? 'fill-1' : ''
          }`}
        >
          calendar_month
        </span>
        <span className="text-[11px] font-medium mt-0.5">Calendar</span>
      </button>

      {/* Settings Tab */}
      <button
        onClick={() => onTabChange('settings')}
        className={`flex flex-col items-center justify-center py-1.5 px-3.5 rounded-full transition-all duration-200 active:scale-95 ${
          activeTab === 'settings'
            ? 'bg-[#9deee5] text-[#0c6e68] shadow-sm font-semibold'
            : 'text-[#40484e] hover:bg-[#d5ecf8]'
        }`}
      >
        <span
          className={`material-symbols-outlined text-[24px] ${
            activeTab === 'settings' ? 'fill-1' : ''
          }`}
        >
          settings
        </span>
        <span className="text-[11px] font-medium mt-0.5">Settings</span>
      </button>

      {/* iOS Swift Code Tab */}
      <button
        onClick={() => onTabChange('swiftCode')}
        className={`flex flex-col items-center justify-center py-1.5 px-3.5 rounded-full transition-all duration-200 active:scale-95 ${
          activeTab === 'swiftCode'
            ? 'bg-[#006284] text-white shadow-sm font-semibold'
            : 'text-[#006284] hover:bg-[#d5ecf8]'
        }`}
      >
        <span
          className={`material-symbols-outlined text-[24px] ${
            activeTab === 'swiftCode' ? 'fill-1' : ''
          }`}
        >
          code
        </span>
        <span className="text-[11px] font-medium mt-0.5">iOS Swift</span>
      </button>
    </nav>
  );
};
