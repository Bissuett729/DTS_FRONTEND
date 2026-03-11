import { Injectable, signal } from '@angular/core';
import { HourlyRecord } from '../../downtime-register/services/dts-analytics.service';

// ── Interfaces ────────────────────────────────────────────────────────────────
export interface PendingRow {
  id:         string;
  line:       string;
  shift:      string;
  date:       string;
  hourRange:  string;
  department: string;
  reason:     string;
  dt:         number;
  rca:        string;
  ica:        string;
  pca:        string;
}

export interface ActionLogRow {
  actionNum:  string;
  line:       string;
  shift:      string;
  date:       string;
  hourRange:  string;
  department: string;
  reason:     string;
  dt:         number;
  status:     'Abierto' | 'Cerrado';
  rca:        string;
  ica:        string;
  pca:        string;
  savedAt:    string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function toHourRange(startIso: string): string {
  const d = new Date(startIso);
  const h = d.getHours();
  return `${h}:00 - ${h + 1}:00`;
}

@Injectable({ providedIn: 'root' })
export class PendingSolutionsState {
  private counter = 0;

  readonly savedIds    = signal<Set<string>>(new Set());
  readonly pendingRows = signal<PendingRow[]>([]);
  readonly actionLog   = signal<ActionLogRow[]>([]);

  refreshFromRecords(records: HourlyRecord[]) {
    const saved   = this.savedIds();
    const current = new Map(this.pendingRows().map(r => [r.id, r]));
    const result: PendingRow[] = [];

    records.forEach(rec => {
      if (!rec.classification?.length) return;
      const hourRange = toHourRange(rec.startTime);
      const date      = new Date(rec.startTime).toLocaleDateString('es-MX');
      rec.classification.forEach((c, idx) => {
        const id = `${rec._id}-${idx}`;
        if (saved.has(id)) return;
        result.push(current.get(id) ?? {
          id, line: rec.line ?? '—', shift: rec.shift ?? '—',
          date, hourRange, department: c.department,
          reason: c.reason, dt: c.downTimeGenerated,
          rca: '', ica: '', pca: '',
        });
      });
    });

    this.pendingRows.set(result);
  }

  saveSolution(row: PendingRow) {
    if (!row.rca.trim()) return;
    this.counter++;
    const num = `ACT-${String(this.counter).padStart(4, '0')}`;
    const savedAt = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });

    this.actionLog.update(log => [...log, {
      actionNum: num, line: row.line, shift: row.shift,
      date: row.date, hourRange: row.hourRange,
      department: row.department, reason: row.reason,
      dt: row.dt, status: 'Abierto' as const,
      rca: row.rca, ica: row.ica, pca: row.pca, savedAt,
    }]);

    this.savedIds.update(s => { const n = new Set(s); n.add(row.id); return n; });
    this.pendingRows.update(rows => rows.filter(r => r.id !== row.id));
  }
}
