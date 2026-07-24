import React, { useState } from 'react';
import {
  AttackEpisode,
  DurationOption,
  HeadPosition,
  SeverityLevel,
  SymptomType,
  TriggerCategory,
  VertigoSensation,
} from '../types';
import { formatDateTimeLocal, getSeverityLabel } from '../utils/helpers';

interface LogAttackModalProps {
  onClose: () => void;
  onSave: (episode: Omit<AttackEpisode, 'id' | 'createdAt'>) => void;
}

const DURATION_OPTIONS: DurationOption[] = [
  '< 5 min',
  '5-15 min',
  '15-60 min',
  '1-12 hrs',
  '> 12 hrs',
];

const SYMPTOM_TILES: { label: SymptomType; icon: string }[] = [
  { label: 'Tinnitus', icon: 'hearing' },
  { label: 'Hearing Loss', icon: 'hearing_disabled' },
  { label: 'Nausea', icon: 'sick' },
  { label: 'Headache', icon: 'detector_status' },
  { label: 'Blurred Vision', icon: 'visibility_off' },
  { label: 'Light Sensitivity', icon: 'brightness_6' },
  { label: 'Dizziness / Vertigo', icon: 'sync' },
  { label: 'Ear Fullness', icon: 'graphic_eq' },
];

const SENSATIONS: VertigoSensation[] = [
  'Room Spinning (Vertigo)',
  'Lightheadedness / Floating',
  'Unsteadiness / Off-Balance',
  'Bouncing Vision (Oscillopsia)',
];

const HEAD_POSITIONS: HeadPosition[] = [
  'Standing Up',
  'Turning Head Left/Right',
  'Lying Down',
  'Looking Up/Down',
  'Bending Over',
  'Sitting Still',
];

const TRIGGERS: TriggerCategory[] = [
  'Salty Meal / High Sodium',
  'Caffeine / Coffee',
  'Stress / Anxiety',
  'Weather / Pressure Drop',
  'Lack of Sleep',
  'Dehydration',
  'Screen Fatigue',
  'Travel / Motion',
];

export const LogAttackModal: React.FC<LogAttackModalProps> = ({ onClose, onSave }) => {
  const [timestamp, setTimestamp] = useState<string>(formatDateTimeLocal());
  const [duration, setDuration] = useState<DurationOption>('15-60 min');
  const [severity, setSeverity] = useState<SeverityLevel>(3);
  const [sensation, setSensation] = useState<VertigoSensation>('Room Spinning (Vertigo)');
  const [headPosition, setHeadPosition] = useState<HeadPosition>('Turning Head Left/Right');
  const [selectedSymptoms, setSelectedSymptoms] = useState<SymptomType[]>([
    'Tinnitus',
    'Nausea',
  ]);
  const [selectedTriggers, setSelectedTriggers] = useState<TriggerCategory[]>([
    'Salty Meal / High Sodium',
    'Stress / Anxiety',
  ]);
  const [notes, setNotes] = useState<string>('');
  const [isRecordingVoice, setIsRecordingVoice] = useState<boolean>(false);
  const [voiceRecorded, setVoiceRecorded] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const toggleSymptom = (symptom: SymptomType) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const toggleTrigger = (trig: TriggerCategory) => {
    if (selectedTriggers.includes(trig)) {
      setSelectedTriggers(selectedTriggers.filter((t) => t !== trig));
    } else {
      setSelectedTriggers([...selectedTriggers, trig]);
    }
  };

  const simulateVoiceRecording = () => {
    setIsRecordingVoice(true);
    setTimeout(() => {
      setIsRecordingVoice(false);
      setVoiceRecorded(true);
      setNotes((prev) =>
        prev
          ? prev + ' [AudioNote: Felt sudden ear ringing and dizziness after lunch.]'
          : 'Felt sudden ear ringing and dizziness after lunch.'
      );
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);

      onSave({
        timestamp,
        duration,
        severity,
        symptoms: selectedSymptoms,
        sensation,
        headPosition,
        triggers: selectedTriggers,
        barometricPressure: 1009,
        weatherCondition: 'Low Pressure / Overcast',
        notes: notes.trim() ? notes.trim() : undefined,
      });

      setTimeout(() => {
        onClose();
      }, 800);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#f3faff] overflow-y-auto min-h-screen pb-32">
      {/* Top App Bar */}
      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-5 h-16 bg-[#f3faff]/95 backdrop-blur-md border-b border-[#cfe6f2]/60">
        <div className="flex items-center">
          <button
            onClick={onClose}
            aria-label="Go back"
            className="flex items-center justify-center p-2 mr-2 rounded-full hover:bg-[#dbf1fe] active:scale-95 transition-all text-[#006284]"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="font-bold text-xl text-[#006284] font-headline">Log Attack</h1>
        </div>

        {/* Live Weather & Pressure Banner */}
        <div className="flex items-center gap-1.5 bg-[#e6f6ff] text-[#006284] px-3 py-1 rounded-full text-xs font-semibold border border-[#cfe6f2]">
          <span className="material-symbols-outlined text-sm text-[#006a64]">thermostat</span>
          <span>1009 hPa (Falling)</span>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="pt-20 px-5 max-w-[720px] mx-auto space-y-6">
        <form id="attack-log-form" onSubmit={handleSubmit} className="space-y-6">
          {/* Visual Header Card */}
          <div className="relative w-full p-5 rounded-2xl bg-gradient-to-br from-[#dbf1fe] to-[#cfe6f2] soft-card-shadow border border-[#cfe6f2]">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-[#006284]/10 rounded-xl text-[#006284]">
                <span className="material-symbols-outlined text-2xl fill-1">insights</span>
              </div>
              <div>
                <h3 className="font-semibold text-[#071e27] text-base mb-0.5">
                  Detailed Vertigo Episode Entry
                </h3>
                <p className="text-xs text-[#40484e]">
                  Automatic weather pressure (1009 hPa) and time tagged for your doctor report.
                </p>
              </div>
            </div>
          </div>

          {/* Date and Time Picker */}
          <section className="bg-white rounded-2xl p-5 soft-card-shadow border border-[#cfe6f2]/60">
            <label htmlFor="start_time" className="block text-sm font-semibold text-[#40484e] mb-2">
              Date and Time of Onset
            </label>
            <input
              id="start_time"
              type="datetime-local"
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
              className="w-full h-12 bg-[#e6f6ff] border border-[#bfc8ce]/40 rounded-xl px-4 text-base text-[#071e27] focus:outline-none focus:ring-2 focus:ring-[#9deee5] transition-all font-medium"
              required
            />
          </section>

          {/* Duration Selection */}
          <section className="bg-white rounded-2xl p-5 soft-card-shadow border border-[#cfe6f2]/60">
            <label className="block text-sm font-semibold text-[#40484e] mb-3">
              How long did it last?
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
              {DURATION_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setDuration(opt)}
                  className={`flex items-center justify-center h-12 px-2 border rounded-xl text-sm font-semibold transition-all active:scale-95 ${
                    duration === opt
                      ? 'bg-[#9deee5] text-[#0c6e68] border-transparent shadow-sm'
                      : 'border-[#bfc8ce]/50 text-[#40484e] hover:bg-[#d5ecf8]/50'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </section>

          {/* Severity Slider */}
          <section className="bg-white rounded-2xl p-5 soft-card-shadow border border-[#cfe6f2]/60">
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-semibold text-[#40484e]">
                Symptom Severity
              </label>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  severity >= 4
                    ? 'bg-[#ffdad6] text-[#93000a]'
                    : 'bg-[#2a7ba0] text-[#f7fbff]'
                }`}
              >
                {getSeverityLabel(severity)}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={severity}
              onChange={(e) => setSeverity(Number(e.target.value) as SeverityLevel)}
              className="w-full cursor-pointer accent-[#006284] my-2"
            />
            <div className="flex justify-between mt-2 text-xs font-medium text-[#40484e]">
              <span>1: Mild</span>
              <span>3: Moderate</span>
              <span>5: Severe</span>
            </div>
          </section>

          {/* Sensation Type & Head Position */}
          <section className="bg-white rounded-2xl p-5 soft-card-shadow border border-[#cfe6f2]/60 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#40484e] mb-2">
                Type of Dizziness Sensation
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {SENSATIONS.map((sens) => (
                  <button
                    key={sens}
                    type="button"
                    onClick={() => setSensation(sens)}
                    className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                      sensation === sens
                        ? 'bg-[#2a7ba0] text-white border-transparent shadow-xs'
                        : 'border-[#bfc8ce]/50 text-[#40484e] hover:bg-[#e6f6ff]'
                    }`}
                  >
                    {sens}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#40484e] mb-2">
                Head / Body Movement Position
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {HEAD_POSITIONS.map((pos) => (
                  <button
                    key={pos}
                    type="button"
                    onClick={() => setHeadPosition(pos)}
                    className={`p-2.5 rounded-xl border text-center text-xs font-semibold transition-all ${
                      headPosition === pos
                        ? 'bg-[#006284] text-white border-transparent'
                        : 'border-[#bfc8ce]/50 text-[#40484e] hover:bg-[#e6f6ff]'
                    }`}
                  >
                    {pos}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Associated Symptoms */}
          <section className="bg-white rounded-2xl p-5 soft-card-shadow border border-[#cfe6f2]/60">
            <label className="block text-sm font-semibold text-[#40484e] mb-3">
              Associated Symptoms
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {SYMPTOM_TILES.map(({ label, icon }) => {
                const isSelected = selectedSymptoms.includes(label);
                return (
                  <div
                    key={label}
                    onClick={() => toggleSymptom(label)}
                    className={`relative border rounded-xl p-3 flex items-center gap-3 cursor-pointer transition-all active:scale-95 ${
                      isSelected
                        ? 'bg-[#9deee5] border-transparent text-[#0c6e68] font-semibold shadow-sm'
                        : 'border-[#bfc8ce]/50 text-[#071e27] hover:bg-[#d5ecf8]/50'
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined ${
                        isSelected ? 'text-[#0c6e68]' : 'text-[#006284]'
                      }`}
                    >
                      {icon}
                    </span>
                    <span className="text-xs">{label}</span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Triggers Tagging */}
          <section className="bg-white rounded-2xl p-5 soft-card-shadow border border-[#cfe6f2]/60">
            <label className="block text-sm font-semibold text-[#40484e] mb-3">
              Suspected Attack Triggers
            </label>
            <div className="flex flex-wrap gap-2">
              {TRIGGERS.map((trig) => {
                const isSelected = selectedTriggers.includes(trig);
                return (
                  <button
                    key={trig}
                    type="button"
                    onClick={() => toggleTrigger(trig)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'bg-[#006a64] text-white border-transparent shadow-xs'
                        : 'border-[#bfc8ce]/50 text-[#40484e] hover:bg-[#e6f6ff]'
                    }`}
                  >
                    {trig}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Voice & Written Notes Field */}
          <section className="bg-white rounded-2xl p-5 soft-card-shadow border border-[#cfe6f2]/60 space-y-3">
            <div className="flex justify-between items-center">
              <label htmlFor="notes" className="text-sm font-semibold text-[#40484e]">
                Trigger Notes or Hands-Free Voice Dictation
              </label>
              <button
                type="button"
                onClick={simulateVoiceRecording}
                disabled={isRecordingVoice}
                className={`text-xs px-3 py-1.5 rounded-full flex items-center gap-1 font-semibold transition-all ${
                  isRecordingVoice
                    ? 'bg-[#ba1a1a] text-white animate-pulse'
                    : voiceRecorded
                    ? 'bg-[#9deee5] text-[#0c6e68]'
                    : 'bg-[#e6f6ff] text-[#006284] hover:bg-[#dbf1fe]'
                }`}
              >
                <span className="material-symbols-outlined text-sm">
                  {isRecordingVoice ? 'graphic_eq' : 'mic'}
                </span>
                {isRecordingVoice
                  ? 'Listening...'
                  : voiceRecorded
                  ? 'Voice Note Attached'
                  : 'Record Voice Note'}
              </button>
            </div>

            <textarea
              id="notes"
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., stressful day, salty meal, changed weather, lack of sleep..."
              className="w-full bg-[#e6f6ff] border border-[#bfc8ce]/40 rounded-xl p-3.5 text-sm text-[#071e27] focus:outline-none focus:ring-2 focus:ring-[#9deee5] transition-all resize-none"
            />
          </section>
        </form>
      </main>

      {/* Fixed Footer Action Button */}
      <footer className="fixed bottom-0 left-0 w-full bg-[#e6f6ff]/95 backdrop-blur-md p-4 flex flex-col items-center border-t border-[#bfc8ce]/30 z-50">
        <button
          form="attack-log-form"
          type="submit"
          disabled={isSaving || isSaved}
          className={`w-full max-w-[680px] h-14 font-semibold text-lg rounded-full shadow-lg transition-all duration-200 flex items-center justify-center gap-2 text-white active:scale-95 ${
            isSaved
              ? 'bg-[#006a64]'
              : isSaving
              ? 'bg-[#006284]/70 cursor-not-allowed'
              : 'bg-[#006284] hover:bg-[#006284]/90'
          }`}
        >
          {isSaved ? (
            <>
              <span className="material-symbols-outlined">check_circle</span>
              Log Saved
            </>
          ) : isSaving ? (
            <>
              <span className="material-symbols-outlined animate-spin">refresh</span>
              Saving Attack Log...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined fill-1">save</span>
              Save Attack Log
            </>
          )}
        </button>
        <div className="mt-2.5 h-1 w-32 bg-[#bfc8ce] rounded-full opacity-30"></div>
      </footer>
    </div>
  );
};

