import React, { useState, useEffect } from 'react';
import { UserSettings } from '../types';

interface VestibularGroundingModalProps {
  settings: UserSettings;
  onClose: () => void;
  onOpenLogAttack: () => void;
}

export const VestibularGroundingModal: React.FC<VestibularGroundingModalProps> = ({
  settings,
  onClose,
  onOpenLogAttack,
}) => {
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [breathTimer, setBreathTimer] = useState<number>(4);

  useEffect(() => {
    const interval = setInterval(() => {
      setBreathTimer((prev) => {
        if (prev > 1) return prev - 1;
        setBreathPhase((current) => {
          if (current === 'Inhale') return 'Hold';
          if (current === 'Hold') return 'Exhale';
          return 'Inhale';
        });
        return 4;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-[#071e27] text-white flex flex-col justify-between p-6 overflow-y-auto animate-fade-in">
      {/* Top Header */}
      <div className="flex justify-between items-center pt-2">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#9deee5] text-2xl fill-1">
            self_improvement
          </span>
          <h2 className="text-xl font-bold font-headline text-white">Active Vertigo Grounding</h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      {/* Center Horizon Anchor & Breathing Circle */}
      <div className="flex flex-col items-center justify-center py-8 my-auto space-y-8 text-center">
        {/* Visual Fixation Anchor Dot */}
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-widest text-[#9deee5] font-semibold">
            Visual Fixation Point
          </p>
          <p className="text-sm text-white/80 max-w-xs">
            Focus gently on the steady blue dot below to anchor your visual horizon and reduce nystagmus.
          </p>
        </div>

        {/* Breathing Circle Container */}
        <div className="relative w-60 h-60 flex items-center justify-center">
          {/* Animated Pulsing Ring */}
          <div
            className={`absolute inset-0 rounded-full border-4 border-[#9deee5]/40 transition-all duration-1000 ${
              breathPhase === 'Inhale'
                ? 'scale-110 border-[#9deee5]'
                : breathPhase === 'Hold'
                ? 'scale-105 border-[#2a7ba0]'
                : 'scale-90 border-[#006284]'
            }`}
          ></div>

          <div
            className={`w-40 h-40 rounded-full bg-gradient-to-br from-[#006284] to-[#2a7ba0] flex flex-col items-center justify-center text-white shadow-2xl transition-all duration-1000 ${
              breathPhase === 'Inhale' ? 'scale-105 ring-8 ring-[#9deee5]/30' : 'scale-95'
            }`}
          >
            {/* Fixation Dot */}
            <div className="w-4 h-4 rounded-full bg-[#9deee5] shadow-[0_0_15px_#9deee5] mb-2 animate-pulse"></div>
            <span className="text-lg font-bold font-headline">{breathPhase}</span>
            <span className="text-2xl font-extrabold text-[#9deee5]">{breathTimer}s</span>
          </div>
        </div>

        {/* Reassuring Guidance */}
        <div className="bg-white/10 border border-white/15 rounded-2xl p-5 max-w-sm text-left space-y-2 backdrop-blur-md">
          <div className="flex items-center gap-2 text-[#9deee5] font-bold text-sm">
            <span className="material-symbols-outlined text-lg">medical_services</span>
            Vestibular Guidance
          </div>
          <ul className="text-sm text-white/90 space-y-1.5 list-disc list-inside leading-relaxed">
            <li>Sit or lie flat with your head firmly supported.</li>
            <li>Keep eyes open and focused on the center dot.</li>
            <li>Avoid sudden head turns or looking down.</li>
            <li>Remember: This dizziness episode is temporary and will subside.</li>
          </ul>
        </div>
      </div>

      {/* Bottom Emergency / Action Bar */}
      <div className="space-y-3 pt-4 border-t border-white/10">
        <div className="flex gap-3">
          {settings.emergencyContactPhone && (
            <a
              href={`tel:${settings.emergencyContactPhone}`}
              className="flex-1 py-3.5 bg-[#ba1a1a] hover:bg-[#ba1a1a]/90 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
            >
              <span className="material-symbols-outlined">call</span>
              Call ICE ({settings.emergencyContactName.split(' ')[0]})
            </a>
          )}
          <button
            onClick={() => {
              onClose();
              onOpenLogAttack();
            }}
            className="flex-1 py-3.5 bg-[#006284] hover:bg-[#006284]/90 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
          >
            <span className="material-symbols-outlined">add_circle</span>
            Record Attack Log
          </button>
        </div>
      </div>
    </div>
  );
};
