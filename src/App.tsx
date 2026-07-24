/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './components/HomeScreen';
import { ChartsScreen } from './components/ChartsScreen';
import { MonthlyViewScreen } from './components/MonthlyViewScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { LogAttackModal } from './components/LogAttackModal';
import { EpisodeDetailModal } from './components/EpisodeDetailModal';
import { ExportDataModal } from './components/ExportDataModal';
import { VestibularGroundingModal } from './components/VestibularGroundingModal';
import { DoctorReportModal } from './components/DoctorReportModal';
import { SwiftCodeViewer } from './components/SwiftCodeViewer';
import { INITIAL_EPISODES, DEFAULT_SETTINGS } from './data/initialData';
import { AttackEpisode, UserSettings, ActiveTab } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [episodes, setEpisodes] = useState<AttackEpisode[]>(() => {
    try {
      const saved = localStorage.getItem('balancelog_episodes');
      return saved ? JSON.parse(saved) : INITIAL_EPISODES;
    } catch {
      return INITIAL_EPISODES;
    }
  });

  const [settings, setSettings] = useState<UserSettings>(() => {
    try {
      const saved = localStorage.getItem('balancelog_settings');
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [isLogAttackOpen, setIsLogAttackOpen] = useState<boolean>(false);
  const [isGroundingOpen, setIsGroundingOpen] = useState<boolean>(false);
  const [isDoctorReportOpen, setIsDoctorReportOpen] = useState<boolean>(false);
  const [selectedEpisode, setSelectedEpisode] = useState<AttackEpisode | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [showNotificationToast, setShowNotificationToast] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('balancelog_episodes', JSON.stringify(episodes));
    } catch (e) {
      console.error('Failed to save episodes', e);
    }
  }, [episodes]);

  useEffect(() => {
    try {
      localStorage.setItem('balancelog_settings', JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings', e);
    }
  }, [settings]);

  const handleSaveAttack = (newEp: Omit<AttackEpisode, 'id' | 'createdAt'>) => {
    const fullEpisode: AttackEpisode = {
      ...newEp,
      id: `ep-${Date.now()}`,
      createdAt: Date.now(),
    };
    setEpisodes([fullEpisode, ...episodes]);
  };

  const handleDeleteAttack = (id: string) => {
    setEpisodes(episodes.filter((ep) => ep.id !== id));
  };

  const handleUpdateAttack = (updated: AttackEpisode) => {
    setEpisodes(episodes.map((ep) => (ep.id === updated.id ? updated : ep)));
  };

  const handleUpdateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <div className="min-h-screen bg-[#f3faff] text-[#071e27] font-['Inter',sans-serif] selection:bg-[#9deee5] selection:text-[#0c6e68] flex flex-col justify-between">
      {/* Container wrapper for native mobile aesthetic */}
      <div className="w-full max-w-[720px] mx-auto min-h-screen flex flex-col relative bg-[#f3faff] shadow-2xl">
        {/* Header */}
        <Header
          activeTab={activeTab}
          onNotificationClick={() => setShowNotificationToast(!showNotificationToast)}
        />

        {/* Notification Toast Dropdown */}
        {showNotificationToast && (
          <div className="mx-5 my-2 p-4 bg-[#2a7ba0] text-[#f7fbff] rounded-2xl shadow-lg border border-white/20 animate-fade-in z-30">
            <div className="flex justify-between items-start">
              <div className="flex gap-2.5 items-center">
                <span className="material-symbols-outlined text-[#9deee5] text-2xl">
                  notifications_active
                </span>
                <div>
                  <p className="font-bold text-sm">Medication Reminder</p>
                  <p className="text-xs opacity-90">
                    Daily {settings.medicationName || 'Betahistine'} scheduled for {settings.reminderTime}.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowNotificationToast(false)}
                className="text-white/80 hover:text-white"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
          </div>
        )}

        {/* Main Body per Active Tab */}
        <main className="flex-1">
          {activeTab === 'home' && (
            <HomeScreen
              episodes={episodes}
              onOpenLogAttack={() => setIsLogAttackOpen(true)}
              onOpenGrounding={() => setIsGroundingOpen(true)}
              onOpenDoctorReport={() => setIsDoctorReportOpen(true)}
              onSelectEpisode={(ep) => setSelectedEpisode(ep)}
              onViewAllEpisodes={() => setActiveTab('monthly')}
            />
          )}

          {activeTab === 'charts' && (
            <ChartsScreen
              episodes={episodes}
              onOpenMonthlyView={() => setActiveTab('monthly')}
            />
          )}

          {activeTab === 'monthly' && (
            <MonthlyViewScreen
              episodes={episodes}
              onSelectEpisode={(ep) => setSelectedEpisode(ep)}
              onOpenExportModal={() => setIsExportModalOpen(true)}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsScreen
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              onOpenExportModal={() => setIsExportModalOpen(true)}
            />
          )}

          {activeTab === 'swiftCode' && <SwiftCodeViewer />}
        </main>

        {/* Bottom Tab Bar Navigation */}
        <BottomNav activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab)} />
      </div>

      {/* Log Attack Full-Screen Form Modal */}
      {isLogAttackOpen && (
        <LogAttackModal
          onClose={() => setIsLogAttackOpen(false)}
          onSave={handleSaveAttack}
        />
      )}

      {/* Active Vertigo Grounding SOS Modal */}
      {isGroundingOpen && (
        <VestibularGroundingModal
          settings={settings}
          onClose={() => setIsGroundingOpen(false)}
          onOpenLogAttack={() => setIsLogAttackOpen(true)}
        />
      )}

      {/* Doctor Report Printable Summary Modal */}
      {isDoctorReportOpen && (
        <DoctorReportModal
          episodes={episodes}
          settings={settings}
          onClose={() => setIsDoctorReportOpen(false)}
        />
      )}

      {/* Episode Detail View / Edit Modal */}
      {selectedEpisode && (
        <EpisodeDetailModal
          episode={selectedEpisode}
          onClose={() => setSelectedEpisode(null)}
          onDelete={handleDeleteAttack}
          onUpdate={handleUpdateAttack}
        />
      )}

      {/* Export Data Modal */}
      {isExportModalOpen && (
        <ExportDataModal
          episodes={episodes}
          onClose={() => setIsExportModalOpen(false)}
        />
      )}
    </div>
  );
}

