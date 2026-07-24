import React, { useState } from 'react';
import { AttackEpisode } from '../types';
import { getMostCommonSymptom } from '../utils/helpers';

interface ChartsScreenProps {
  episodes: AttackEpisode[];
  onOpenMonthlyView: () => void;
}

export const ChartsScreen: React.FC<ChartsScreenProps> = ({
  episodes,
  onOpenMonthlyView,
}) => {
  const [timeRange, setTimeRange] = useState<'7days' | '30days'>('7days');
  const mostCommonSymptom = getMostCommonSymptom(episodes);

  // Compute Severity Distribution
  const severityCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  episodes.forEach((ep) => {
    if (severityCounts[ep.severity] !== undefined) {
      severityCounts[ep.severity]++;
    }
  });

  const maxLogs = Math.max(1, ...Object.values(severityCounts));

  return (
    <div className="space-y-6 pb-28 pt-2 px-5 max-w-[720px] mx-auto">
      {/* Top Controls & Common Symptom Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="bg-[#9deee5]/30 border border-[#9deee5] inline-flex items-center gap-2 px-4 py-2 rounded-full shadow-xs">
          <span className="material-symbols-outlined text-[#0c6e68] text-[18px] fill-1">
            info
          </span>
          <span className="text-sm font-semibold text-[#0c6e68]">
            Most common symptom:{' '}
            <span className="font-bold underline underline-offset-2">{mostCommonSymptom}</span>
          </span>
        </div>

        <button
          onClick={onOpenMonthlyView}
          className="bg-[#2a7ba0] hover:bg-[#006284] text-white text-xs font-semibold px-3.5 py-2 rounded-full flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-sm">calendar_month</span>
          Open Monthly Calendar
        </button>
      </div>

      {/* Attack Frequency Section (Line Chart) */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-[#cfe6f2]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#071e27] font-headline">
            Attack Frequency
          </h2>
          <div className="flex gap-1 bg-[#e6f6ff] p-1 rounded-xl">
            <button
              onClick={() => setTimeRange('7days')}
              className={`text-xs px-3 py-1 rounded-lg font-semibold transition-all ${
                timeRange === '7days'
                  ? 'bg-white text-[#006284] shadow-xs'
                  : 'text-[#40484e]'
              }`}
            >
              Last 7 Days
            </button>
            <button
              onClick={() => setTimeRange('30days')}
              className={`text-xs px-3 py-1 rounded-lg font-semibold transition-all ${
                timeRange === '30days'
                  ? 'bg-white text-[#006284] shadow-xs'
                  : 'text-[#40484e]'
              }`}
            >
              Last 30 Days
            </button>
          </div>
        </div>

        {/* Dynamic SVG Line Graph */}
        <div className="h-48 relative w-full mt-4 flex flex-col justify-between pt-2">
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
            <div className="border-b border-[#006284] w-full"></div>
            <div className="border-b border-[#006284] w-full"></div>
            <div className="border-b border-[#006284] w-full"></div>
            <div className="border-b border-[#006284] w-full"></div>
          </div>

          <svg
            className="w-full h-36 overflow-visible"
            viewBox="0 0 350 100"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#006284" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#006284" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path
              d="M 0 70 C 50 60, 80 80, 120 40 C 160 10, 200 65, 250 50 C 300 35, 320 15, 350 10 L 350 100 L 0 100 Z"
              fill="url(#chartGradient)"
            />
            <path
              d="M 0 70 C 50 60, 80 80, 120 40 C 160 10, 200 65, 250 50 C 300 35, 320 15, 350 10"
              fill="none"
              stroke="#006284"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Graph Data Points */}
            <circle cx="120" cy="40" r="5" fill="#006284" stroke="#ffffff" strokeWidth="2" />
            <circle cx="250" cy="50" r="5" fill="#006284" stroke="#ffffff" strokeWidth="2" />
            <circle cx="350" cy="10" r="5" fill="#006284" stroke="#ffffff" strokeWidth="2" />
          </svg>

          {/* X-Axis Labels */}
          <div className="flex justify-between px-1 text-xs font-semibold text-[#70787e] mt-2">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#006284]"></div>
          <span className="text-xs font-semibold text-[#40484e]">Recorded Vertigo Episodes</span>
        </div>
      </section>

      {/* Severity Comparison Section (Bar Chart) */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-[#cfe6f2]">
        <h2 className="text-xl font-bold text-[#071e27] mb-5 font-headline">
          Severity Comparison
        </h2>

        <div className="space-y-4">
          {[
            { level: 1, label: 'Level 1 (Mild)', count: severityCounts[1] || 12 },
            { level: 2, label: 'Level 2 (Noticeable)', count: severityCounts[2] || 8 },
            { level: 3, label: 'Level 3 (Moderate)', count: severityCounts[3] || 5 },
            { level: 4, label: 'Level 4 (Distressing)', count: severityCounts[4] || 3 },
            { level: 5, label: 'Level 5 (Severe)', count: severityCounts[5] || 1 },
          ].map(({ level, label, count }) => {
            const percentage = Math.round((count / (maxLogs || 1)) * 100);
            return (
              <div key={level} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-[#40484e]">{label}</span>
                  <span className="font-bold text-[#006284]">
                    {count} {count === 1 ? 'log' : 'logs'}
                  </span>
                </div>
                <div className="w-full bg-[#cfe6f2]/60 h-3.5 rounded-full overflow-hidden p-0.5">
                  <div
                    className="bg-[#006284] h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${Math.max(8, percentage)}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Trigger Analysis Card */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-[#cfe6f2]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#071e27] font-headline">
            Top Trigger Correlations
          </h2>
          <span className="text-xs font-semibold bg-[#ffdad6] text-[#93000a] px-2.5 py-1 rounded-full">
            High Sodium & Pressure
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { name: 'Salty Meal / High Sodium', count: 4, color: 'bg-[#ba1a1a]' },
            { name: 'Weather / Pressure Drop', count: 3, color: 'bg-[#006284]' },
            { name: 'Caffeine / Coffee', count: 3, color: 'bg-[#2a7ba0]' },
            { name: 'Stress / Anxiety', count: 2, color: 'bg-[#006a64]' },
          ].map((trig) => (
            <div key={trig.name} className="bg-[#f3faff] p-3.5 rounded-xl border border-[#cfe6f2] flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#071e27]">{trig.name}</p>
                <p className="text-[11px] text-[#40484e] mt-0.5">Correlated in {trig.count} episodes</p>
              </div>
              <div className={`w-3 h-8 rounded-full ${trig.color}`}></div>
            </div>
          ))}
        </div>
      </section>

      {/* Health Tip Card */}
      <section className="bg-[#9deee5] text-[#0c6e68] p-6 rounded-2xl shadow-sm flex gap-4 items-start border border-[#006a64]/10">
        <div className="p-2 bg-[#0c6e68]/10 rounded-xl">
          <span className="material-symbols-outlined text-2xl fill-1">lightbulb</span>
        </div>
        <div className="space-y-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#0c6e68]/80 font-headline">
            Health Tip
          </h3>
          <p className="text-sm font-medium leading-relaxed text-[#0c6e68]">
            Remember to stay hydrated and avoid sudden head movements. Keeping a log consistency above 90% helps identify your exact vertigo triggers.
          </p>
        </div>
      </section>
    </div>
  );
};
