import React, { useState } from 'react';
import { UserSettings } from '../types';

interface SettingsScreenProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  onOpenExportModal: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onUpdateSettings,
  onOpenExportModal,
}) => {
  const [showPrivacy, setShowPrivacy] = useState<boolean>(false);
  const [showTerms, setShowTerms] = useState<boolean>(false);
  const [loggedOut, setLoggedOut] = useState<boolean>(false);

  return (
    <div className="space-y-6 pb-28 pt-2 px-5 max-w-[720px] mx-auto">
      {/* Header Visual Card */}
      <div className="p-6 bg-white rounded-2xl soft-card-shadow border border-[#cfe6f2] relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-[#9deee5] rounded-full blur-2xl opacity-40"></div>
        <h2 className="text-xl font-bold text-[#071e27] mb-1 font-headline">
          Serene Equilibrium
        </h2>
        <p className="text-sm text-[#40484e] leading-relaxed">
          Adjust your preferences to keep your balance tracking steady, reliable, and tailored to your medical needs.
        </p>
      </div>

      {/* Section 1: EMERGENCY & CLINICAL CONTACTS */}
      <section className="space-y-2">
        <h3 className="text-xs font-bold text-[#006284] uppercase tracking-wider px-1 font-headline">
          Emergency & Physician Info
        </h3>
        <div className="bg-white rounded-2xl overflow-hidden border border-[#cfe6f2] soft-card-shadow p-4 space-y-3">
          <div>
            <label className="block text-xs font-semibold text-[#40484e] mb-1">
              Primary Physician / ENT Specialist
            </label>
            <input
              type="text"
              value={settings.doctorName || ''}
              onChange={(e) => onUpdateSettings({ doctorName: e.target.value })}
              placeholder="e.g. Dr. Sarah Jenkins (ENT)"
              className="w-full bg-[#e6f6ff] border border-[#bfc8ce]/40 rounded-xl px-3 py-2 text-sm text-[#071e27] focus:outline-none focus:ring-2 focus:ring-[#9deee5]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#40484e] mb-1">
                ICE Contact Name
              </label>
              <input
                type="text"
                value={settings.emergencyContactName || ''}
                onChange={(e) => onUpdateSettings({ emergencyContactName: e.target.value })}
                placeholder="e.g. Spouse / Family Member"
                className="w-full bg-[#e6f6ff] border border-[#bfc8ce]/40 rounded-xl px-3 py-2 text-sm text-[#071e27] focus:outline-none focus:ring-2 focus:ring-[#9deee5]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#40484e] mb-1">
                ICE Emergency Phone
              </label>
              <input
                type="tel"
                value={settings.emergencyContactPhone || ''}
                onChange={(e) => onUpdateSettings({ emergencyContactPhone: e.target.value })}
                placeholder="e.g. +1 (555) 019-2834"
                className="w-full bg-[#e6f6ff] border border-[#bfc8ce]/40 rounded-xl px-3 py-2 text-sm text-[#071e27] focus:outline-none focus:ring-2 focus:ring-[#9deee5]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: NOTIFICATIONS */}
      <section className="space-y-2">
        <h3 className="text-xs font-bold text-[#006284] uppercase tracking-wider px-1 font-headline">
          Notifications
        </h3>
        <div className="bg-white rounded-2xl overflow-hidden border border-[#cfe6f2] soft-card-shadow divide-y divide-[#cfe6f2]">
          {/* Medication Reminders */}
          <div className="flex items-center justify-between p-4 hover:bg-[#f3faff] transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#006284]/10 rounded-xl text-[#006284]">
                <span className="material-symbols-outlined text-2xl">medication</span>
              </div>
              <div>
                <p className="text-base font-semibold text-[#071e27]">Medication Reminders</p>
                <p className="text-xs text-[#40484e]">Daily at {settings.reminderTime}</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.medicationReminders}
                onChange={(e) => onUpdateSettings({ medicationReminders: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#bfc8ce] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#006a64]"></div>
            </label>
          </div>

          {/* Reminder Time */}
          <div className="flex items-center justify-between p-4 hover:bg-[#f3faff] transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#006284]/10 rounded-xl text-[#006284]">
                <span className="material-symbols-outlined text-2xl">schedule</span>
              </div>
              <p className="text-base font-semibold text-[#071e27]">Reminder Time</p>
            </div>
            <input
              type="time"
              value={settings.reminderTime}
              onChange={(e) => onUpdateSettings({ reminderTime: e.target.value })}
              className="bg-[#e6f6ff] border border-[#bfc8ce]/40 rounded-xl text-[#006284] font-semibold text-sm px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#9deee5]"
            />
          </div>
        </div>
      </section>

      {/* Section 2: DATA MANAGEMENT */}
      <section className="space-y-2">
        <h3 className="text-xs font-bold text-[#006284] uppercase tracking-wider px-1 font-headline">
          Data Management
        </h3>
        <div className="bg-white rounded-2xl overflow-hidden border border-[#cfe6f2] soft-card-shadow divide-y divide-[#cfe6f2]">
          {/* iCloud Sync */}
          <div className="flex items-center justify-between p-4 hover:bg-[#f3faff] transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#9deee5]/30 rounded-xl text-[#006a64]">
                <span className="material-symbols-outlined text-2xl">cloud_sync</span>
              </div>
              <p className="text-base font-semibold text-[#071e27]">iCloud Sync</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.iCloudSync}
                onChange={(e) => onUpdateSettings({ iCloudSync: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#bfc8ce] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#006a64]"></div>
            </label>
          </div>

          {/* Export Data */}
          <button
            onClick={onOpenExportModal}
            className="w-full flex items-center justify-between p-4 hover:bg-[#f3faff] transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#9deee5]/30 rounded-xl text-[#006a64]">
                <span className="material-symbols-outlined text-2xl">ios_share</span>
              </div>
              <div>
                <p className="text-base font-semibold text-[#071e27]">Export Data</p>
                <p className="text-xs text-[#40484e]">CSV or PDF format</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#70787e]">chevron_right</span>
          </button>
        </div>
      </section>

      {/* Section 3: ABOUT */}
      <section className="space-y-2">
        <h3 className="text-xs font-bold text-[#006284] uppercase tracking-wider px-1 font-headline">
          About
        </h3>
        <div className="bg-white rounded-2xl overflow-hidden border border-[#cfe6f2] soft-card-shadow divide-y divide-[#cfe6f2]">
          {/* App Version */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#667776]/10 rounded-xl text-[#4e5e5e]">
                <span className="material-symbols-outlined text-2xl">info</span>
              </div>
              <p className="text-base font-semibold text-[#071e27]">App Version</p>
            </div>
            <p className="text-sm font-semibold text-[#40484e]">v1.2.0</p>
          </div>

          {/* Privacy Policy */}
          <button
            onClick={() => setShowPrivacy(true)}
            className="w-full flex items-center justify-between p-4 hover:bg-[#f3faff] transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#667776]/10 rounded-xl text-[#4e5e5e]">
                <span className="material-symbols-outlined text-2xl">policy</span>
              </div>
              <p className="text-base font-semibold text-[#071e27]">Privacy Policy</p>
            </div>
            <span className="material-symbols-outlined text-[#70787e]">open_in_new</span>
          </button>

          {/* Terms of Service */}
          <button
            onClick={() => setShowTerms(true)}
            className="w-full flex items-center justify-between p-4 hover:bg-[#f3faff] transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#667776]/10 rounded-xl text-[#4e5e5e]">
                <span className="material-symbols-outlined text-2xl">gavel</span>
              </div>
              <p className="text-base font-semibold text-[#071e27]">Terms of Service</p>
            </div>
            <span className="material-symbols-outlined text-[#70787e]">open_in_new</span>
          </button>
        </div>
      </section>

      {/* Log out Button */}
      <button
        onClick={() => setLoggedOut(true)}
        className="w-full py-4 text-center text-[#ba1a1a] font-bold text-lg hover:bg-[#ffdad6]/40 rounded-2xl transition-colors cursor-pointer active:scale-95 border border-[#ffdad6]"
      >
        Log Out
      </button>

      {/* Privacy Modal */}
      {showPrivacy && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto space-y-4">
            <h3 className="text-xl font-bold text-[#071e27] font-headline">Privacy Policy</h3>
            <p className="text-sm text-[#40484e] leading-relaxed">
              BalanceLog values your health privacy. All recorded episodes, symptoms, and notes are encrypted locally or securely synced with your personal iCloud account.
            </p>
            <button
              onClick={() => setShowPrivacy(false)}
              className="w-full py-2.5 bg-[#006284] text-white font-semibold rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Terms Modal */}
      {showTerms && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto space-y-4">
            <h3 className="text-xl font-bold text-[#071e27] font-headline">Terms of Service</h3>
            <p className="text-sm text-[#40484e] leading-relaxed">
              BalanceLog is a personal tracking tool and does not provide formal medical diagnosis or emergency healthcare advice. Consult your physician for medical treatment.
            </p>
            <button
              onClick={() => setShowTerms(false)}
              className="w-full py-2.5 bg-[#006284] text-white font-semibold rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Logged Out Banner */}
      {loggedOut && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#ffdad6] text-[#93000a] flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-2xl">logout</span>
            </div>
            <h3 className="text-lg font-bold text-[#071e27]">Logged Out</h3>
            <p className="text-sm text-[#40484e]">
              You have been safely signed out. Your local records remain encrypted.
            </p>
            <button
              onClick={() => setLoggedOut(false)}
              className="w-full py-2.5 bg-[#006284] text-white font-semibold rounded-xl"
            >
              Sign Back In
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
