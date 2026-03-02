import { Shift } from '../shifts';

// ── API contract ──────────────────────────────────────────────────────────────

export interface ApiShift {
  _id: string;
  shift: string;       // "First Shift", "Second Shift", "Third Shift"
  description: string; // "6:00 to 15:30"
  startTime: string;   // "06:00"  OR  "2026-01-28T22:30:00.000Z"
  endTime: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// ── Color palette indexed by shift order ─────────────────────────────────────

const SHIFT_COLORS = [
  { color: '#f97316', dotClass: 'bg-orange-500' },
  { color: '#6366f1', dotClass: 'bg-indigo-500' },
  { color: '#a855f7', dotClass: 'bg-purple-500' },
  { color: '#10b981', dotClass: 'bg-emerald-500' },
  { color: '#3b82f6', dotClass: 'bg-blue-500'   },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Parses "HH:MM" or an ISO date string to a fractional hour in local time.
 * e.g. "15:30" → 15.5 | "2026-01-28T22:30:00.000Z" → 15.5  (UTC-7)
 */
function parseTimeToHour(t: string): number {
  if (t.includes('T') || t.endsWith('Z')) {
    const d = new Date(t);
    return d.getHours() + d.getMinutes() / 60;
  }
  const [h, m = '0'] = t.split(':');
  return Number(h) + Number(m) / 60;
}

/** Converts a fractional hour back to "HH:MM" */
function formatHour(h: number): string {
  const hh  = Math.floor(h);
  const mm  = Math.round((h - hh) * 60);
  return `${hh.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')}`;
}

/** Derives a Spanish time-of-day label from the start hour */
function shiftType(start: number): string {
  if (start >= 5  && start < 13) return 'Mañana';
  if (start >= 13 && start < 20) return 'Tarde';
  return 'Noche';
}

// ── Mapper ────────────────────────────────────────────────────────────────────

/**
 * Converts the raw API shift array to the Shift[] shape used by the UI.
 * Shifts are sorted by start time so colours and letters (A, B, C…) remain
 * consistent regardless of the order the API returns them.
 */
export function mapApiShiftsToShifts(apiShifts: ApiShift[]): Shift[] {
  const sorted = [...apiShifts].sort(
    (a, b) => parseTimeToHour(a.startTime) - parseTimeToHour(b.startTime),
  );

  return sorted.map((api, idx) => {
    const start   = parseTimeToHour(api.startTime);
    const end     = parseTimeToHour(api.endTime);
    const palette = SHIFT_COLORS[idx] ?? SHIFT_COLORS[SHIFT_COLORS.length - 1];
    const letter  = String.fromCharCode(65 + idx); // A, B, C…
    const type    = shiftType(start);

    return {
      id:        idx + 1,
      name:      api.shift,
      shortName: `Turno ${letter}`,
      type,
      start,
      end,
      color:     palette.color,
      dotClass:  palette.dotClass,
      status:    api.active,
      staff:     0,
      timeWindow: `${formatHour(start)} - ${formatHour(end)}`,
    };
  });
}
