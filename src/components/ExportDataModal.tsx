import React, { useState } from 'react';
import { AttackEpisode } from '../types';
import { generateCSV } from '../utils/helpers';

interface ExportDataModalProps {
  episodes: AttackEpisode[];
  onClose: () => void;
}

export const ExportDataModal: React.FC<ExportDataModalProps> = ({
  episodes,
  onClose,
}) => {
  const [format, setFormat] = useState<'csv' | 'pdf'>('csv');
  const [exported, setExported] = useState<boolean>(false);

  const handleExportCSV = () => {
    const csvContent = generateCSV(episodes);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `BalanceLog_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExported(true);
    setTimeout(() => {
      setExported(false);
      onClose();
    }, 1200);
  };

  const handleExportPDF = () => {
    window.print();
    setExported(true);
    setTimeout(() => {
      setExported(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-[#cfe6f2] relative">
        <div className="flex justify-between items-center border-b border-[#cfe6f2] pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006284] text-2xl">
              ios_share
            </span>
            <h3 className="text-xl font-bold text-[#071e27] font-headline">
              Export Attack History
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#70787e] hover:bg-[#e6f6ff]"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <p className="text-sm text-[#40484e]">
          Export your complete vertigo episode logs ({episodes.length} records) to share with your ENT physician or audiologist.
        </p>

        {/* Format Selector */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setFormat('csv')}
            className={`p-4 rounded-xl border text-center transition-all cursor-pointer ${
              format === 'csv'
                ? 'bg-[#9deee5]/30 border-[#006a64] text-[#006a64] font-bold shadow-xs'
                : 'border-[#bfc8ce]/50 text-[#40484e]'
            }`}
          >
            <span className="material-symbols-outlined text-2xl block mb-1">
              table_chart
            </span>
            CSV Data
          </button>
          <button
            type="button"
            onClick={() => setFormat('pdf')}
            className={`p-4 rounded-xl border text-center transition-all cursor-pointer ${
              format === 'pdf'
                ? 'bg-[#9deee5]/30 border-[#006a64] text-[#006a64] font-bold shadow-xs'
                : 'border-[#bfc8ce]/50 text-[#40484e]'
            }`}
          >
            <span className="material-symbols-outlined text-2xl block mb-1">
              picture_as_pdf
            </span>
            PDF Summary
          </button>
        </div>

        {exported ? (
          <div className="p-3 bg-[#9deee5] text-[#0c6e68] rounded-xl text-center font-bold text-sm flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">check_circle</span>
            Data Exported Successfully!
          </div>
        ) : (
          <button
            onClick={format === 'csv' ? handleExportCSV : handleExportPDF}
            className="w-full py-3.5 bg-[#006284] text-white font-bold text-base rounded-xl hover:bg-[#006284]/90 transition-all flex items-center justify-center gap-2 shadow-md"
          >
            <span className="material-symbols-outlined text-xl">download</span>
            Download {format.toUpperCase()}
          </button>
        )}
      </div>
    </div>
  );
};
