import React from 'react';
import { CLINICIAN_AVATAR } from '../data/initialData';
import { ActiveTab } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  onNotificationClick?: () => void;
  hasUnreadNotification?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  title,
  showBack,
  onBack,
  onNotificationClick,
  hasUnreadNotification = true,
}) => {
  const renderTitle = () => {
    if (title) return title;
    switch (activeTab) {
      case 'home':
        return 'BalanceLog';
      case 'charts':
        return 'Charts';
      case 'monthly':
        return 'Monthly View';
      case 'settings':
        return 'Settings';
      default:
        return 'BalanceLog';
    }
  };

  return (
    <header className="sticky top-0 left-0 w-full z-40 flex justify-between items-center px-5 h-16 bg-[#f3faff] border-b border-[#cfe6f2]/40 backdrop-blur-md">
      <div className="flex items-center gap-3">
        {showBack ? (
          <button
            onClick={onBack}
            aria-label="Go back"
            className="flex items-center justify-center p-2 rounded-full hover:bg-[#dbf1fe] active:scale-95 transition-all text-[#006284]"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
        ) : activeTab === 'home' ? (
          <div className="w-10 h-10 rounded-full overflow-hidden bg-[#2a7ba0] flex items-center justify-center ring-2 ring-[#9deee5]/50 shadow-sm">
            <img
              src={CLINICIAN_AVATAR}
              alt="Medical Profile"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        ) : activeTab === 'charts' ? (
          <div className="w-9 h-9 rounded-full bg-[#dbf1fe] flex items-center justify-center text-[#006284]">
            <span className="material-symbols-outlined">waves</span>
          </div>
        ) : activeTab === 'settings' ? (
          <div className="w-9 h-9 rounded-full bg-[#2a7ba0] flex items-center justify-center text-[#f7fbff]">
            <span className="material-symbols-outlined fill-1">person</span>
          </div>
        ) : null}

        <h1 className="text-xl font-bold text-[#006284] tracking-tight font-headline">
          {renderTitle()}
        </h1>
      </div>

      <button
        onClick={onNotificationClick}
        className="relative p-2 rounded-full text-[#006284] hover:bg-[#dbf1fe] active:scale-95 transition-all"
        title="Notifications"
      >
        <span className="material-symbols-outlined">notifications</span>
        {hasUnreadNotification && (
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#ba1a1a] rounded-full ring-2 ring-[#f3faff]"></span>
        )}
      </button>
    </header>
  );
};
