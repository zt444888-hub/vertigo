import { AttackEpisode, SeverityLevel } from '../types';

export function getSeverityLabel(level: SeverityLevel): string {
  switch (level) {
    case 1:
      return '1 - Mild';
    case 2:
      return '2 - Noticeable';
    case 3:
      return '3 - Moderate';
    case 4:
      return '4 - Distressing';
    case 5:
      return '5 - Severe';
    default:
      return `${level}`;
  }
}

export function getSeverityShortText(level: SeverityLevel): string {
  switch (level) {
    case 1:
      return 'Mild';
    case 2:
      return 'Noticeable';
    case 3:
      return 'Moderate';
    case 4:
      return 'Distressing';
    case 5:
      return 'Severe';
    default:
      return `${level}`;
  }
}

export function getMostCommonSymptom(episodes: AttackEpisode[]): string {
  if (!episodes.length) return 'None recorded';
  const counts: Record<string, number> = {};
  episodes.forEach((ep) => {
    ep.symptoms.forEach((sym) => {
      counts[sym] = (counts[sym] || 0) + 1;
    });
  });

  let topSymptom = 'Tinnitus';
  let maxCount = 0;
  Object.entries(counts).forEach(([sym, count]) => {
    if (count > maxCount) {
      maxCount = count;
      topSymptom = sym;
    }
  });

  return topSymptom;
}

export function formatDateString(isoString: string): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return isoString;
  }
}

export function formatDateTimeLocal(date: Date = new Date()): string {
  const pad = (n: number) => (n < 10 ? '0' + n : n);
  const YYYY = date.getFullYear();
  const MM = pad(date.getMonth() + 1);
  const DD = pad(date.getDate());
  const hh = pad(date.getHours());
  const mm = pad(date.getMinutes());
  return `${YYYY}-${MM}-${DD}T${hh}:${mm}`;
}

export function generateCSV(episodes: AttackEpisode[]): string {
  const headers = ['ID', 'Date & Time', 'Duration', 'Severity Level', 'Severity Label', 'Symptoms', 'Notes'];
  const rows = episodes.map(ep => [
    ep.id,
    `"${ep.timestamp}"`,
    `"${ep.duration}"`,
    ep.severity,
    `"${getSeverityShortText(ep.severity)}"`,
    `"${ep.symptoms.join(', ')}"`,
    `"${(ep.notes || '').replace(/"/g, '""')}"`
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}
