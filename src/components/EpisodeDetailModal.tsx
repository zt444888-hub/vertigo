import React, { useState } from 'react';
import { AttackEpisode } from '../types';
import { formatDateString, getSeverityLabel } from '../utils/helpers';

interface EpisodeDetailModalProps {
  episode: AttackEpisode;
  onClose: () => void;
  onDelete: (id: string) => void;
  onUpdate: (updated: AttackEpisode) => void;
}

export const EpisodeDetailModal: React.FC<EpisodeDetailModalProps> = ({
  episode,
  onClose,
  onDelete,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>(episode.notes || '');

  const handleSave = () => {
    onUpdate({ ...episode, notes: notes.trim() });
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl border border-[#cfe6f2] relative animate-fade-in">
        {/* Top Header */}
        <div className="flex justify-between items-center border-b border-[#cfe6f2] pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006284] text-2xl">
              event_note
            </span>
            <h3 className="text-xl font-bold text-[#071e27] font-headline">
              Episode Details
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#70787e] hover:bg-[#e6f6ff] transition-all"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Date & Onset */}
        <div className="bg-[#e6f6ff] p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#40484e] uppercase tracking-wider">
              Date & Onset
            </p>
            <p className="text-base font-bold text-[#071e27] mt-0.5">
              {formatDateString(episode.timestamp)}
            </p>
          </div>
          <span className="px-3 py-1 bg-[#2a7ba0] text-[#f7fbff] rounded-full text-xs font-bold">
            {getSeverityLabel(episode.severity)}
          </span>
        </div>

        {/* Duration, Severity & Pressure Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="bg-[#f3faff] border border-[#cfe6f2] p-3 rounded-xl">
            <p className="text-xs font-semibold text-[#40484e]">Duration</p>
            <p className="text-sm font-bold text-[#006284] mt-0.5">{episode.duration}</p>
          </div>
          <div className="bg-[#f3faff] border border-[#cfe6f2] p-3 rounded-xl">
            <p className="text-xs font-semibold text-[#40484e]">Severity Score</p>
            <p className="text-sm font-bold text-[#006284] mt-0.5">{episode.severity} / 5</p>
          </div>
          <div className="bg-[#f3faff] border border-[#cfe6f2] p-3 rounded-xl col-span-2 md:col-span-1">
            <p className="text-xs font-semibold text-[#40484e]">Barometric Pressure</p>
            <p className="text-sm font-bold text-[#006a64] mt-0.5">
              {episode.barometricPressure ? `${episode.barometricPressure} hPa` : '1011 hPa'}
            </p>
          </div>
        </div>

        {/* Vertigo Sensation & Head Position */}
        {(episode.sensation || episode.headPosition) && (
          <div className="bg-[#e6f6ff]/60 border border-[#cfe6f2] p-3.5 rounded-xl space-y-2">
            {episode.sensation && (
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-[#006284]">3d_rotation</span>
                <p className="text-xs text-[#071e27]">
                  <span className="font-bold">Sensation:</span> {episode.sensation}
                </p>
              </div>
            )}
            {episode.headPosition && (
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-[#006284]">accessibility_new</span>
                <p className="text-xs text-[#071e27]">
                  <span className="font-bold">Head Position:</span> {episode.headPosition}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Triggers Tagged */}
        {episode.triggers && episode.triggers.length > 0 && (
          <div>
            <p className="text-xs font-bold text-[#40484e] uppercase tracking-wider mb-2">
              Tagged Triggers
            </p>
            <div className="flex flex-wrap gap-1.5">
              {episode.triggers.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 bg-[#ffdad6]/40 text-[#93000a] text-xs font-bold rounded-lg border border-[#ffdad6]"
                >
                  ⚡ {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Associated Symptoms */}
        <div>
          <p className="text-xs font-bold text-[#40484e] uppercase tracking-wider mb-2">
            Associated Symptoms
          </p>
          <div className="flex flex-wrap gap-2">
            {episode.symptoms.map((s) => (
              <span
                key={s}
                className="px-3 py-1.5 bg-[#9deee5]/30 text-[#0c6e68] font-semibold text-xs rounded-full border border-[#9deee5] flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">check_circle</span>
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <p className="text-xs font-bold text-[#40484e] uppercase tracking-wider">
              Trigger & Activity Notes
            </p>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-xs text-[#006284] font-semibold hover:underline flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-xs">edit</span> Edit
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full bg-[#e6f6ff] border border-[#bfc8ce] rounded-xl p-3 text-sm text-[#071e27] focus:outline-none focus:ring-2 focus:ring-[#9deee5]"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 text-xs text-[#70787e] hover:underline"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-1.5 bg-[#006284] text-white text-xs font-semibold rounded-lg"
                >
                  Save Note
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-[#f3faff] border border-[#cfe6f2] p-3.5 rounded-xl text-sm text-[#071e27] italic leading-relaxed">
              {episode.notes ? `"${episode.notes}"` : 'No trigger notes recorded for this attack episode.'}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-3 border-t border-[#cfe6f2]">
          <button
            onClick={() => {
              if (confirm('Are you sure you want to delete this log entry?')) {
                onDelete(episode.id);
                onClose();
              }
            }}
            className="flex-1 py-3 border border-[#ffdad6] text-[#ba1a1a] font-semibold text-sm rounded-xl hover:bg-[#ffdad6]/30 transition-all flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">delete</span> Delete Log
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-[#006284] text-white font-semibold text-sm rounded-xl hover:bg-[#006284]/90 transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
