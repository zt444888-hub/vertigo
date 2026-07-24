import React, { useState } from 'react';
import { AttackEpisode } from '../types';

interface MonthlyViewScreenProps {
  episodes: AttackEpisode[];
  onSelectEpisode: (episode: AttackEpisode) => void;
  onOpenExportModal: () => void;
}

export const MonthlyViewScreen: React.FC<MonthlyViewScreenProps> = ({
  episodes,
  onSelectEpisode,
  onOpenExportModal,
}) => {
  const [selectedDay, setSelectedDay] = useState<number>(24);
  const [selectedMonthYear] = useState<{ month: string; year: number }>({
    month: 'October',
    year: 2023,
  });

  // Dates in October 2023 that have attack logs
  const attackDates = new Set([2, 5, 18, 21, 24, 27]);

  // Episodes for selected day
  const selectedDayEpisodes = episodes.filter((ep) => {
    const d = new Date(ep.timestamp);
    return d.getDate() === selectedDay || (selectedDay === 24 && ep.id === 'ep-1');
  });

  return (
    <div className="space-y-6 pb-28 pt-2 px-5 max-w-[720px] mx-auto">
      {/* Calendar Section */}
      <section className="bg-white rounded-2xl soft-card-shadow p-5 border border-[#cfe6f2]">
        <div className="flex justify-between items-center mb-4 px-1">
          <h2 className="text-xl font-bold text-[#071e27] font-headline">
            {selectedMonthYear.month} {selectedMonthYear.year}
          </h2>
          <div className="flex gap-3 text-[#006284]">
            <button className="p-1 hover:bg-[#dbf1fe] rounded-full transition-all">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button className="p-1 hover:bg-[#dbf1fe] rounded-full transition-all">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Days Header */}
        <div className="grid grid-cols-7 text-center text-xs font-semibold text-[#40484e] mb-2">
          <div className="py-1">Su</div>
          <div className="py-1">Mo</div>
          <div className="py-1">Tu</div>
          <div className="py-1">We</div>
          <div className="py-1">Th</div>
          <div className="py-1">Fr</div>
          <div className="py-1">Sa</div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Oct 2023 starts on Sunday */}
          {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
            const hasAttack = attackDates.has(day);
            const isSelected = day === selectedDay;

            return (
              <div
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`h-12 flex flex-col items-center justify-center cursor-pointer rounded-xl transition-all active:scale-95 ${
                  isSelected
                    ? 'bg-[#006284] text-white shadow-md font-bold scale-105 z-10'
                    : 'text-[#071e27] hover:bg-[#e6f6ff]'
                }`}
              >
                <span className="text-sm">{day}</span>
                {hasAttack && (
                  <div
                    className={`w-1.5 h-1.5 rounded-full mt-0.5 ${
                      isSelected ? 'bg-[#ffdad6]' : 'bg-[#ba1a1a]'
                    }`}
                  ></div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Selected Date Details */}
      <section className="animate-fade-in space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="w-1.5 h-6 bg-[#006284] rounded-full"></div>
          <h3 className="text-xl font-bold text-[#071e27] font-headline">
            October {selectedDay}
          </h3>
        </div>

        {selectedDayEpisodes.length > 0 ? (
          <div
            onClick={() => onSelectEpisode(selectedDayEpisodes[0])}
            className="bg-[#e6f6ff] border border-[#cfe6f2] rounded-2xl p-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-[#dbf1fe] transition-all shadow-xs"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#ffdad6] flex items-center justify-center text-[#93000a] shrink-0">
                <span className="material-symbols-outlined text-[26px]">warning</span>
              </div>
              <div>
                <p className="text-base text-[#071e27] font-bold">
                  {selectedDayEpisodes.length}{' '}
                  {selectedDayEpisodes.length === 1 ? 'attack' : 'attacks'} logged on this day
                </p>
                <p className="text-xs text-[#40484e] mt-0.5">
                  Click to view full log details & notes
                </p>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#006284]">
              chevron_right
            </span>
          </div>
        ) : (
          <div className="bg-[#9deee5]/20 border border-[#9deee5] rounded-2xl p-4 flex items-center gap-3">
            <span className="material-symbols-outlined text-[#0c6e68]">
              check_circle
            </span>
            <p className="text-sm font-semibold text-[#0c6e68]">
              No attacks logged on October {selectedDay}. Attack-free day!
            </p>
          </div>
        )}
      </section>

      {/* Monthly Summary Card */}
      <section>
        <div className="bg-white rounded-2xl soft-card-shadow p-6 border border-[#cfe6f2]">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006284]">analytics</span>
              <h3 className="text-xl font-bold text-[#071e27] font-headline">
                Monthly Summary
              </h3>
            </div>
            <button
              onClick={onOpenExportModal}
              className="text-xs text-[#006284] font-semibold flex items-center gap-1 hover:underline"
            >
              <span className="material-symbols-outlined text-base">picture_as_pdf</span>
              Export PDF
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#e6f6ff] p-4 rounded-xl flex flex-col gap-1">
              <span className="text-xs font-semibold text-[#40484e] uppercase tracking-wider">
                Total Attacks
              </span>
              <span className="text-3xl font-extrabold text-[#006284] font-headline">
                12
              </span>
            </div>

            <div className="bg-[#9deee5]/25 p-4 rounded-xl flex flex-col gap-1">
              <span className="text-xs font-semibold text-[#40484e] uppercase tracking-wider">
                Most Frequent Trigger
              </span>
              <span className="text-lg font-bold text-[#006a64]">
                Salty meals
              </span>
            </div>
          </div>

          <div className="mt-5 pt-5 border-t border-[#cfe6f2]">
            <div className="flex justify-between items-center text-[#40484e] mb-2 text-sm font-semibold">
              <span>Log Consistency</span>
              <span className="text-[#006284] font-bold">92%</span>
            </div>
            <div className="w-full bg-[#cfe6f2] h-2.5 rounded-full overflow-hidden">
              <div className="bg-[#006284] h-full rounded-full" style={{ width: '92%' }}></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
