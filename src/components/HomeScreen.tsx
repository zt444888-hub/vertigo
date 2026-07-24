import React, { useState } from 'react';
import { AttackEpisode } from '../types';
import { formatDateString, getSeverityShortText } from '../utils/helpers';

interface HomeScreenProps {
  episodes: AttackEpisode[];
  onOpenLogAttack: () => void;
  onOpenGrounding: () => void;
  onOpenDoctorReport: () => void;
  onSelectEpisode: (episode: AttackEpisode) => void;
  onViewAllEpisodes: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  episodes,
  onOpenLogAttack,
  onOpenGrounding,
  onOpenDoctorReport,
  onSelectEpisode,
  onViewAllEpisodes,
}) => {
  const [insight, setInsight] = useState<string>(
    'Hydration levels seem to correlate with your vertigo frequency. Try increasing your water intake today.'
  );
  const [isGeneratingInsight, setIsGeneratingInsight] = useState<boolean>(false);
  const [medicationTaken, setMedicationTaken] = useState<boolean>(false);

  // Compute Weekly Stats
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const recentWeekEpisodes = episodes.filter(
    (e) => new Date(e.timestamp).getTime() >= sevenDaysAgo.getTime()
  );
  const attacksThisWeek = recentWeekEpisodes.length || 3;
  const attackFreeDays = Math.max(0, 7 - new Set(recentWeekEpisodes.map(e => e.timestamp.split('T')[0])).size);

  const fetchAIInsight = async () => {
    setIsGeneratingInsight(true);
    try {
      const res = await fetch('/api/health-insight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ episodes: episodes.slice(0, 5) }),
      });
      const data = await res.json();
      if (data && data.insight) {
        setInsight(data.insight);
      }
    } catch {
      // Keep default if offline or failed
    } finally {
      setIsGeneratingInsight(false);
    }
  };

  const getEpisodeIcon = (severity: number) => {
    if (severity >= 4) {
      return {
        icon: 'warning',
        bg: 'bg-[#ffdad6]',
        text: 'text-[#93000a]',
      };
    } else if (severity === 3) {
      return {
        icon: 'emergency_home',
        bg: 'bg-[#9deee5]/30',
        text: 'text-[#0c6e68]',
      };
    } else {
      return {
        icon: 'waves',
        bg: 'bg-[#cfe6f2]',
        text: 'text-[#006284]',
      };
    }
  };

  return (
    <div className="space-y-6 pb-28 pt-2 px-5 max-w-[720px] mx-auto">
      {/* Top Action Row: Log Attack & Active Vertigo SOS */}
      <section className="pt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
        <button
          onClick={onOpenLogAttack}
          className="w-full py-6 px-4 rounded-2xl bg-[#006284] text-[#f7fbff] flex items-center gap-4 soft-shadow active-press hover:bg-[#006284]/95 transition-all text-left"
        >
          <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center ring-4 ring-white/10 shrink-0">
            <span className="material-symbols-outlined text-2xl text-white fill-1">
              pulse_alert
            </span>
          </div>
          <div>
            <span className="font-bold text-xl block tracking-tight font-headline">
              Log Attack
            </span>
            <span className="text-xs font-medium opacity-80 mt-0.5 block">
              Tap to record a new episode
            </span>
          </div>
        </button>

        <button
          onClick={onOpenGrounding}
          className="w-full py-6 px-4 rounded-2xl bg-gradient-to-br from-[#071e27] to-[#003447] text-[#9deee5] flex items-center gap-4 soft-shadow active-press hover:opacity-95 transition-all text-left border border-[#9deee5]/20"
        >
          <div className="w-12 h-12 bg-[#9deee5]/20 rounded-full flex items-center justify-center ring-2 ring-[#9deee5]/30 shrink-0">
            <span className="material-symbols-outlined text-2xl text-[#9deee5] fill-1 animate-pulse">
              self_improvement
            </span>
          </div>
          <div>
            <span className="font-bold text-base block text-white font-headline">
              Active Vertigo Grounding
            </span>
            <span className="text-xs text-[#9deee5] mt-0.5 block">
              Breathing & Fixation horizon
            </span>
          </div>
        </button>
      </section>

      {/* Barometric Pressure & Weather Trigger Widget */}
      <section className="bg-gradient-to-r from-[#e6f6ff] to-[#dbf1fe] rounded-2xl p-4 border border-[#cfe6f2] flex items-center justify-between soft-shadow">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#006284]/10 rounded-xl text-[#006284]">
            <span className="material-symbols-outlined text-2xl">thermostat</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase text-[#006284]">Live Pressure Context</span>
              <span className="bg-[#ffdad6] text-[#93000a] text-[10px] font-bold px-2 py-0.5 rounded-full">
                Pressure Drop Trigger
              </span>
            </div>
            <p className="text-sm font-bold text-[#071e27] mt-0.5">
              1009 hPa • Rainy / Low Pressure
            </p>
          </div>
        </div>
        <button
          onClick={onOpenDoctorReport}
          className="px-3 py-2 bg-white text-[#006284] border border-[#006284]/20 rounded-xl text-xs font-bold flex items-center gap-1 hover:bg-[#006284] hover:text-white transition-all shrink-0"
        >
          <span className="material-symbols-outlined text-sm">clinical_notes</span>
          Doctor Report
        </button>
      </section>

      {/* Daily Medication Tracker Widget */}
      <section className="bg-white rounded-2xl p-4 border border-[#cfe6f2] flex items-center justify-between soft-shadow">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${medicationTaken ? 'bg-[#9deee5] text-[#0c6e68]' : 'bg-[#e6f6ff] text-[#006284]'}`}>
            <span className="material-symbols-outlined text-2xl">pill</span>
          </div>
          <div>
            <span className="text-xs font-semibold text-[#40484e]">Daily Medication</span>
            <p className="text-sm font-bold text-[#071e27]">Betahistine 16mg (08:00 AM)</p>
          </div>
        </div>
        <button
          onClick={() => setMedicationTaken(!medicationTaken)}
          className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
            medicationTaken
              ? 'bg-[#006a64] text-white'
              : 'bg-[#e6f6ff] text-[#006284] hover:bg-[#dbf1fe]'
          }`}
        >
          <span className="material-symbols-outlined text-sm">
            {medicationTaken ? 'check_circle' : 'radio_button_unchecked'}
          </span>
          {medicationTaken ? 'Dose Taken' : 'Mark Taken'}
        </button>
      </section>

      {/* Summary Card: Weekly Overview */}
      <section>
        <div className="bg-white rounded-2xl p-6 soft-shadow border border-[#cfe6f2]">
          <h2 className="text-xl font-bold text-[#071e27] mb-4 font-headline">
            Weekly Overview
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#dbf1fe] p-4 rounded-xl flex flex-col items-start gap-1">
              <span className="text-xs font-semibold text-[#40484e]">
                Attacks this week
              </span>
              <span className="text-3xl font-extrabold text-[#006284] font-headline">
                {attacksThisWeek}
              </span>
            </div>
            <div className="bg-[#9deee5]/30 p-4 rounded-xl flex flex-col items-start gap-1">
              <span className="text-xs font-semibold text-[#40484e]">
                Attack-free days
              </span>
              <span className="text-3xl font-extrabold text-[#006a64] font-headline">
                {attackFreeDays}
              </span>
            </div>
          </div>

          {/* Visual Trend Micro-Graphic */}
          <div className="mt-6 h-16 w-full flex items-end gap-2 px-1">
            <div className="flex-1 bg-[#006284]/15 rounded-t-sm h-[40%]" title="Mon"></div>
            <div className="flex-1 bg-[#006284]/50 rounded-t-sm h-[80%]" title="Tue"></div>
            <div className="flex-1 bg-[#006284]/15 rounded-t-sm h-[30%]" title="Wed"></div>
            <div className="flex-1 bg-[#006284]/15 rounded-t-sm h-[20%]" title="Thu"></div>
            <div className="flex-1 bg-[#006a64]/20 rounded-t-sm h-[10%] border-t-2 border-[#006a64]" title="Fri"></div>
            <div className="flex-1 bg-[#006284]/70 rounded-t-sm h-[90%]" title="Sat"></div>
            <div className="flex-1 bg-[#006284]/25 rounded-t-sm h-[50%]" title="Sun"></div>
          </div>
          <div className="flex justify-between mt-2 px-1">
            <span className="text-[10px] font-semibold text-[#70787e]">Mon</span>
            <span className="text-[10px] font-semibold text-[#70787e]">Sun</span>
          </div>
        </div>
      </section>

      {/* List Section: Recent Episodes */}
      <section className="space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-[#071e27] font-headline">
            Recent Episodes
          </h2>
          <button
            onClick={onViewAllEpisodes}
            className="text-sm font-semibold text-[#006284] hover:underline cursor-pointer"
          >
            View All
          </button>
        </div>

        <div className="space-y-2.5">
          {episodes.slice(0, 4).map((ep) => {
            const style = getEpisodeIcon(ep.severity);
            return (
              <div
                key={ep.id}
                onClick={() => onSelectEpisode(ep)}
                className="bg-[#e6f6ff] rounded-xl p-4 flex items-center justify-between active-press border border-transparent hover:border-[#bfc8ce]/40 transition-all cursor-pointer shadow-xs"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-11 h-11 rounded-full ${style.bg} flex items-center justify-center ${style.text} shadow-xs`}
                  >
                    <span className="material-symbols-outlined text-[22px]">
                      {style.icon}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-base text-[#071e27]">
                      {formatDateString(ep.timestamp)}
                    </p>
                    <p className="text-sm text-[#40484e]">
                      {ep.duration} • {getSeverityShortText(ep.severity)}
                    </p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[#70787e]">
                  chevron_right
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Health Insight Card with Gemini Refresh */}
      <section className="bg-[#2a7ba0] text-[#f7fbff] rounded-2xl p-6 soft-card-shadow flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-2xl fill-1 text-[#9deee5]">
              lightbulb
            </span>
            <span className="font-bold text-base tracking-wide uppercase text-[#9deee5]">
              Health Insight
            </span>
          </div>
          <button
            onClick={fetchAIInsight}
            disabled={isGeneratingInsight}
            className="text-xs bg-white/10 hover:bg-white/20 active:scale-95 px-3 py-1.5 rounded-full flex items-center gap-1 transition-all text-white border border-white/20"
          >
            <span className={`material-symbols-outlined text-sm ${isGeneratingInsight ? 'animate-spin' : ''}`}>
              auto_awesome
            </span>
            {isGeneratingInsight ? 'Analyzing...' : 'Refresh AI'}
          </button>
        </div>
        <p className="text-base leading-relaxed opacity-95">
          {insight}
        </p>
      </section>
    </div>
  );
};
