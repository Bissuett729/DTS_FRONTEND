import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DtsCard, DtsButton, DtsSelect, DtsDatePicker } from '../../shared';
import { DtsAnalyticsService, HourlyRecord } from '../downtime-register/services/dts-analytics.service';
import { LinesRequestService } from '../lines/services/lines-request.service';
import { LinesState } from '../lines/state/lines-state';
import { PendingSolutionsState } from '../pending-solutions/state/pending-solutions.state';
export type { PendingRow, ActionLogRow } from '../pending-solutions/state/pending-solutions.state';

// ── View model for a single table row ─────────────────────────────────────────
export interface HourRow {
  hour: string;
  standard: number;
  production: number;
  efficiency: number;
  topDept: string | null;
  dtReported: number;
  dtGenerated: number;
  dtNotReported: number;
  isCurrentHour?: boolean;
}

// ── Helpers ────────────────────────────────────────────────────────────────────
function toHourRange(startIso: string): string {
  const d = new Date(startIso);
  const h = d.getHours();
  return `${h}:00 - ${h + 1}:00`;
}

function topDeptFromClassification(rec: HourlyRecord): string | null {
  if (!rec.classification?.length) return null;
  return rec.classification.reduce((best, c) =>
    c.downTimeGenerated > (best?.downTimeGenerated ?? -1) ? c : best,
  rec.classification[0]).department ?? null;
}

function fmtMins(mins: number): string {
  if (!mins) return '0m';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

@Component({
  selector: 'dts-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DtsCard, DtsButton, DtsSelect, DtsDatePicker],
  templateUrl: './reports.html',
  styles: ``,
})
export class Reports implements OnInit {
  private analyticsSvc = inject(DtsAnalyticsService);
  private linesSvc     = inject(LinesRequestService);
  private linesState   = inject(LinesState);
  readonly pendingSvc  = inject(PendingSolutionsState);
  readonly fmtMins = fmtMins;

  activeTab = signal<'hourly' | 'pending' | 'actionlog'>('hourly');
  loading   = this.analyticsSvc.loadingHourly;

  dateControl = new FormControl(new Date());
  lineControl = new FormControl<string | null>(null);
  deptControl = new FormControl('Todos');
  statusControl = new FormControl('Todos');
  startDateControl = new FormControl<Date | null>(null);
  endDateControl = new FormControl<Date | null>(null);

  lines = computed(() => [
    { name: null as any, label: 'Todas las líneas' },
    ...this.linesState.lines().map(l => ({ name: l.name, label: l.name })),
  ]);
  loadingLines = this.linesState.loadingLines;

  departments = [
    { _id: 'Todos', name: 'Todos' },
    { _id: 'AUTO',  name: 'AUTO'  },
    { _id: 'DIAG',  name: 'DIAG'  },
    { _id: 'PMC',   name: 'PMC'   },
    { _id: 'MFG',   name: 'MFG'   },
  ];
  statuses = [
    { _id: 'Todos',   name: 'Todos'   },
    { _id: 'Abierto', name: 'Abierto' },
    { _id: 'Cerrado', name: 'Cerrado' },
  ];

  // ── Derived rows from raw API records ────────────────────────────────────
  hourlyRows = computed<HourRow[]>(() => {
    const now = new Date();
    return this.analyticsSvc.hourlyRows().map(rec => {
      const start = new Date(rec.startTime);
      const isCurrent = start.getHours() === now.getHours()
          && start.toDateString() === now.toDateString();
      return {
        hour:          toHourRange(rec.startTime),
        standard:      rec.standardOutput ?? 0,
        production:    rec.currentOutput  ?? 0,
        efficiency:    rec.efficiency     ?? 0,
        topDept:       topDeptFromClassification(rec),
        dtReported:    rec.downTimeReported    ?? 0,
        dtGenerated:   rec.downTimeGenerated   ?? 0,
        dtNotReported: rec.downTimeUnreported  ?? 0,
        isCurrentHour: isCurrent,
      };
    });
  });

  totals = computed(() => {
    const rows = this.hourlyRows();
    const eff  = rows.length ? rows.reduce((s, r) => s + r.efficiency, 0) / rows.length : 0;
    return {
      standard:      rows.reduce((s, r) => s + r.standard,      0),
      production:    rows.reduce((s, r) => s + r.production,    0),
      efficiency:    +eff.toFixed(2),
      dtGenerated:   rows.reduce((s, r) => s + r.dtGenerated,   0),
      dtNotReported: rows.reduce((s, r) => s + r.dtNotReported, 0),
    };
  });

  top3Depts = computed(() => {
    const palette = ['#ef4444','#f97316','#3a57e8'];
    const map = new Map<string, number>();
    this.analyticsSvc.hourlyRows().forEach(rec =>
      rec.classification?.forEach(c => {
        map.set(c.department, (map.get(c.department) ?? 0) + c.downTimeGenerated);
      }),
    );
    const sorted = Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 3);
    const maxVal = sorted[0]?.[1] ?? 1;
    return sorted.map(([name, mins], i) => ({
      name,
      time: fmtMins(mins),
      color: palette[i],
      pct: Math.round((mins / maxVal) * 100),
    }));
  });

  // ── KPI cards ─────────────────────────────────────────────────────────────
  totalDtGenerated = computed(() => this.totals().dtGenerated);
  totalDtNotReported = computed(() => this.totals().dtNotReported);
  avgEfficiency = computed(() => this.totals().efficiency);
  totalEvents = computed(() => this.hourlyRows().filter(r => r.dtGenerated > 0).length);

  // ── Pending & action log via shared PendingSolutionsState ──────────────────────
  get pendingRows() { return this.pendingSvc.pendingRows; }
  get actionLog()   { return this.pendingSvc.actionLog;   }
  saveSolution = (row: any) => this.pendingSvc.saveSolution(row);

  // ── Lifecycle ─────────────────────────────────────────────────────────────
  async ngOnInit() {
    await this.linesSvc.getLines();
    await this.applyFilter();
  }

  async applyFilter() {
    const date = this.dateControl.value ?? new Date();
    await this.analyticsSvc.fetchHourlyReport(date, {
      line: this.lineControl.value ?? undefined,
    });
    this.pendingSvc.refreshFromRecords(this.analyticsSvc.hourlyRows());
  }

  setToday() {
    this.dateControl.setValue(new Date());
    this.applyFilter();
  }

  filterActionLog() { /* future */ }
  exportToExcel()   { /* future */ }
}
