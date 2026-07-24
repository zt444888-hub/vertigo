import React from 'react';
import { AttackEpisode, UserSettings } from '../types';
import { formatDateString, getMostCommonSymptom, getSeverityShortText } from '../utils/helpers';

interface DoctorReportModalProps {
  episodes: AttackEpisode[];
  settings: UserSettings;
  onClose: () => void;
}

export const DoctorReportModal: React.FC<DoctorReportModalProps> = ({
  episodes,
  settings,
  onClose,
}) => {
  const mostCommonSymptom = getMostCommonSymptom(episodes);
  const avgSeverity = (
    episodes.reduce((sum, ep) => sum + ep.severity, 0) / (episodes.length || 1)
  ).toFixed(1);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 md:p-8 space-y-6 shadow-2xl border border-[#cfe6f2] relative text-[#071e27]">
        {/* Modal Controls Bar */}
        <div className="flex justify-between items-center border-b border-[#cfe6f2] pb-4 print:hidden">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006284] text-2xl">
              clinical_notes
            </span>
            <h3 className="text-xl font-bold font-headline text-[#006284]">
              Physician Clinical Summary
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-[#006284] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs hover:bg-[#006284]/90 transition-all"
            >
              <span className="material-symbols-outlined text-base">print</span>
              Print Report / PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-[#70787e] hover:bg-[#e6f6ff]"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        {/* Clinical Document Printable Body */}
        <div className="space-y-6 print:p-0">
          {/* Header Banner */}
          <div className="border-b-2 border-[#006284] pb-4 flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-[#006284] font-headline">
                BalanceLog — Vertigo & Vestibular Episode History
              </h1>
              <p className="text-xs text-[#40484e] mt-1">
                Generated for medical review with ENT / Neurologist
              </p>
            </div>
            <div className="text-right text-xs text-[#40484e]">
              <p className="font-semibold text-[#071e27]">Report Date: {new Date().toLocaleDateString()}</p>
              <p>Primary Physician: {settings.doctorName || 'Not specified'}</p>
            </div>
          </div>

          {/* Key Metrics Summary Cards */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-[#e6f6ff] p-3.5 rounded-xl border border-[#cfe6f2]">
              <p className="text-xs font-semibold text-[#40484e] uppercase">Total Logs</p>
              <p className="text-2xl font-extrabold text-[#006284] mt-0.5">{episodes.length}</p>
            </div>
            <div className="bg-[#e6f6ff] p-3.5 rounded-xl border border-[#cfe6f2]">
              <p className="text-xs font-semibold text-[#40484e] uppercase">Avg Severity</p>
              <p className="text-2xl font-extrabold text-[#006284] mt-0.5">{avgSeverity} / 5</p>
            </div>
            <div className="bg-[#9deee5]/30 p-3.5 rounded-xl border border-[#9deee5]">
              <p className="text-xs font-semibold text-[#0c6e68] uppercase">Top Symptom</p>
              <p className="text-sm font-bold text-[#006a64] mt-1 truncate">{mostCommonSymptom}</p>
            </div>
          </div>

          {/* Episode Table */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-[#071e27] uppercase tracking-wider font-headline">
              Detailed Episode Logs ({episodes.length})
            </h4>
            <div className="border border-[#cfe6f2] rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#dbf1fe] text-[#006284] font-bold border-b border-[#cfe6f2]">
                    <th className="p-2.5">Date & Time</th>
                    <th className="p-2.5">Duration</th>
                    <th className="p-2.5">Severity</th>
                    <th className="p-2.5">Symptoms & Triggers</th>
                    <th className="p-2.5">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#cfe6f2]">
                  {episodes.map((ep) => (
                    <tr key={ep.id} className="hover:bg-[#f3faff]">
                      <td className="p-2.5 font-semibold text-[#071e27] whitespace-nowrap">
                        {formatDateString(ep.timestamp)}
                      </td>
                      <td className="p-2.5 whitespace-nowrap">{ep.duration}</td>
                      <td className="p-2.5 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                            ep.severity >= 4
                              ? 'bg-[#ffdad6] text-[#93000a]'
                              : 'bg-[#2a7ba0] text-white'
                          }`}
                        >
                          {ep.severity} ({getSeverityShortText(ep.severity)})
                        </span>
                      </td>
                      <td className="p-2.5">
                        <p className="font-semibold text-[#006284]">{ep.symptoms.join(', ')}</p>
                        {ep.triggers && ep.triggers.length > 0 && (
                          <p className="text-[10px] text-[#40484e] mt-0.5">
                            Triggers: {ep.triggers.join(', ')}
                          </p>
                        )}
                      </td>
                      <td className="p-2.5 italic text-[#40484e]">
                        {ep.notes || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Patient Note Footer */}
          <div className="text-xs text-[#70787e] border-t border-[#cfe6f2] pt-4">
            <p>
              Note: This report is compiled from user self-reported vertigo tracking in BalanceLog and serves as supplemental data for clinical consultations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
