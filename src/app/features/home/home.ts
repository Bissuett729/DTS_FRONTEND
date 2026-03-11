import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GlobalStateService } from '../../core/application';
import { DtsAnalyticsService, DashboardStats } from '../downtime-register/services/dts-analytics.service';
import { PendingSolutionsState } from '../pending-solutions/state/pending-solutions.state';
import {
  NgApexchartsModule,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexGrid,
  ApexLegend,
  ApexPlotOptions,
  ApexResponsive,
  ApexStroke,
  ApexXAxis,
  ApexYAxis,
  ApexTooltip,
  ApexAnnotations,
  ApexTheme,
} from 'ng-apexcharts';

const DARK_CHART = {
  background: 'transparent',
  foreColor: '#94a3b8',
};

const DEPT_COLORS = ['#3a57e8','#6366f1','#f97316','#a855f7','#10b981','#ef4444'];
const DAY_LABELS  = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

function fmtMins(mins: number): string {
  if (!mins) return '0m';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

@Component({
  selector: 'foxcode-home',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule, RouterModule],
  templateUrl: './home.html',
})
export class Home implements OnInit {
  private globalState  = inject(GlobalStateService);
  protected analyticsSvc = inject(DtsAnalyticsService);
  readonly pendingSvc    = inject(PendingSolutionsState);

  readonly fmtMins = fmtMins;
  loading = this.analyticsSvc.loadingDashboard;

  // ── KPI signals ───────────────────────────────────────────────────────────
  totalDtMin  = signal(0);
  totalDtPrev = signal(0);

  dtDeltaPct = computed(() => {
    const prev = this.totalDtPrev();
    if (!prev) return 0;
    return Math.round(((this.totalDtMin() - prev) / prev) * 100);
  });

  dtBarPct = computed(() => Math.min(Math.round(this.totalDtMin() / 600 * 100), 100));

  // MTTR: promedio de minutos por incidente
  mttr = computed(() => {
    const d = this.analyticsSvc.dashboard();
    const count = d?.kpiCurrent?.count ?? 0;
    if (!count) return 0;
    return Math.round((d!.kpiCurrent.totalDt) / count);
  });

  mttrBarPct = computed(() => Math.min(Math.round(this.mttr() / 120 * 100), 100));

  // MTBF: (tiempo operativo − DT) / nº incidentes, en horas
  mtbf = computed(() => {
    const d = this.analyticsSvc.dashboard();
    const count = d?.kpiCurrent?.count ?? 0;
    if (!d || !count) return 0;
    const operMins = (d.heatmap.length || 168) * 60;
    const uptimeMins = Math.max(0, operMins - d.kpiCurrent.totalDt);
    return +(uptimeMins / count / 60).toFixed(1);
  });

  mtbfBarPct = computed(() => Math.min(Math.round(this.mtbf() / 200 * 100), 100));

  // Disponibilidad: tiempo activo / ventana total
  availability = computed(() => {
    const d = this.analyticsSvc.dashboard();
    if (!d) return 0;
    const operMins = (d.heatmap.length || 168) * 60;
    const uptimeMins = Math.max(0, operMins - d.kpiCurrent.totalDt);
    return +(uptimeMins / operMins * 100).toFixed(1);
  });

  departments = signal<{ name: string; pct: number; color: string }[]>([]);

  // ── Chart option signals ──────────────────────────────────────────────────
  paretoOptions  = signal<any>(this.emptyPareto());
  donutOptions   = signal<any>(this.emptyDonut());
  heatmapOptions = signal<any>(this.emptyHeatmap());
  trendOptions   = signal<any>(this.emptyTrend());

  pendingPreview = computed(() => this.pendingSvc.pendingRows().slice(0, 5));

  // ─────────────────────────────────────────────────────────────────────────
  async ngOnInit() {
    await this.analyticsSvc.fetchDashboard();
    const data = this.analyticsSvc.dashboard();
    if (data) this.applyData(data);

    // Populate pending-solutions widget with today's data
    await this.analyticsSvc.fetchHourlyReport(new Date());
    this.pendingSvc.refreshFromRecords(this.analyticsSvc.hourlyRows());
  }

  private applyData(data: DashboardStats) {
    // KPIs
    this.totalDtMin.set(data.kpiCurrent.totalDt);
    this.totalDtPrev.set(data.kpiPrev.totalDt);

    // Pareto
    const paretoReasons = data.pareto.map(p => p._id ?? 'Unknown');
    const paretoDt      = data.pareto.map(p => p.totalDt);
    const paretoTotal   = paretoDt.reduce((s, v) => s + v, 0) || 1;
    let cumSum = 0;
    const paretoCum = paretoDt.map(v => { cumSum += v; return Math.round((cumSum / paretoTotal) * 100); });
    this.paretoOptions.set(this.buildPareto(paretoReasons, paretoDt, paretoCum, paretoTotal));

    // Donut
    const deptDist = data.deptDist.slice(0, 6);
    const deptTotal = deptDist.reduce((s, d) => s + d.totalDt, 0) || 1;
    const deptSeries = deptDist.map(d => Math.round((d.totalDt / deptTotal) * 100));
    const deptLabels = deptDist.map(d => d._id ?? 'Unknown');
    this.departments.set(deptDist.map((d, i) => ({
      name:  d._id ?? 'Unknown',
      pct:   deptSeries[i],
      color: DEPT_COLORS[i % DEPT_COLORS.length],
    })));
    this.donutOptions.set(this.buildDonut(deptSeries, deptLabels, data.kpiCurrent.totalDt));

    // Weekly trend (area chart: 7 days Mon-Sun)
    const reportedByDay:   number[] = Array(7).fill(0);
    const unreportedByDay: number[] = Array(7).fill(0);
    data.weeklyTrend.forEach(w => {
      const idx = (w._id - 1 + 7) % 7; // ISO 1=Mon…7=Sun → idx 0-6
      reportedByDay[idx]   = w.reported;
      unreportedByDay[idx] = w.unreported;
    });
    this.trendOptions.set(this.buildTrend(reportedByDay, unreportedByDay));

    // Heatmap
    this.heatmapOptions.set(this.buildHeatmap(data.heatmap));
  }

  // ── Chart builders ────────────────────────────────────────────────────────

  private buildPareto(categories: string[], dtData: number[], cumData: number[], total: number) {
    return {
      series: [
        { name: 'Duration (min)', type: 'bar',  data: dtData  },
        { name: 'Cumulative %',   type: 'line', data: cumData },
      ],
      chart: { type: 'bar', height: 260, toolbar: { show: false }, ...DARK_CHART } as ApexChart,
      plotOptions: { bar: { borderRadius: 4, columnWidth: '55%' } } as ApexPlotOptions,
      colors: ['#3a57e8', '#f97316'],
      dataLabels: {
        enabled: true,
        enabledOnSeries: [0],
        formatter: (val: number) => total ? `${Math.round((val / total) * 100)}%` : '0%',
        style: { fontSize: '11px', colors: ['#fff'] },
      } as ApexDataLabels,
      stroke: { width: [0, 2], curve: 'smooth' } as ApexStroke,
      xaxis: {
        categories,
        labels: { style: { colors: '#94a3b8', fontSize: '11px' }, rotate: -20 },
        axisBorder: { show: false }, axisTicks: { show: false },
      } as ApexXAxis,
      yaxis: [
        { labels: { style: { colors: '#94a3b8', fontSize: '11px' }, formatter: (v: number) => v + ' min' }, axisBorder: { show: false } },
        { opposite: true, min: 0, max: 100, labels: { style: { colors: '#f97316', fontSize: '11px' }, formatter: (v: number) => v + '%' } },
      ] as ApexYAxis,
      grid:    { borderColor: '#ffffff0f', strokeDashArray: 4 } as ApexGrid,
      legend:  { show: false },
      fill:    { opacity: [0.85, 1] } as ApexFill,
      tooltip: { theme: 'dark' } as ApexTooltip,
      theme:   { mode: 'dark' }  as ApexTheme,
    };
  }

  private buildDonut(series: number[], labels: string[], totalDtMin: number) {
    const totalH = Math.floor(totalDtMin / 60);
    const totalM = totalDtMin % 60;
    const totalLabel = totalH ? `${totalH}h ${totalM}m` : `${totalM}m`;
    return {
      series,
      chart:  { type: 'donut', height: 200, ...DARK_CHART } as ApexChart,
      colors: DEPT_COLORS,
      labels,
      plotOptions: {
        pie: { donut: { size: '68%', labels: { show: true,
          total: { show: true, label: 'TOTAL', color: '#94a3b8', fontSize: '11px', formatter: () => totalLabel },
          value: { color: '#fff', fontSize: '22px', fontWeight: 700 },
        } } },
      } as ApexPlotOptions,
      dataLabels: { enabled: false } as ApexDataLabels,
      legend:  { show: false },
      stroke:  { width: 2, colors: ['#1e1e2e'] } as ApexStroke,
      tooltip: { theme: 'dark' } as ApexTooltip,
      theme:   { mode: 'dark' } as ApexTheme,
    };
  }

  private buildTrend(reported: number[], unreported: number[]) {
    return {
      series: [
        { name: 'Reported',   data: reported   },
        { name: 'Unreported', data: unreported },
      ],
      chart: { type: 'area', height: 200, toolbar: { show: false }, ...DARK_CHART } as ApexChart,
      colors: ['#3a57e8', '#475569'],
      fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05 } } as ApexFill,
      stroke: { curve: 'smooth', width: [3, 2], dashArray: [0, 5] } as ApexStroke,
      dataLabels: { enabled: false } as ApexDataLabels,
      xaxis: {
        categories: DAY_LABELS,
        labels: { style: { colors: '#94a3b8', fontSize: '11px' } },
        axisBorder: { show: false }, axisTicks: { show: false },
      } as ApexXAxis,
      yaxis: { labels: { style: { colors: '#94a3b8', fontSize: '11px' }, formatter: (v: number) => v + 'min' }, axisBorder: { show: false } } as ApexYAxis,
      grid:    { borderColor: '#ffffff0f', strokeDashArray: 4 } as ApexGrid,
      legend:  { show: false },
      tooltip: { theme: 'dark' } as ApexTooltip,
      theme:   { mode: 'dark' } as ApexTheme,
    };
  }

  private buildHeatmap(rawHeatmap: { _id: { day: number; hour: number }; value: number }[]) {
    // Build 7 days × 12 bi-hourly slots matrix
    const hours = [0,2,4,6,8,10,12,14,16,18,20,22];
    const matrix: Record<number, Record<number, number>> = {};
    for (let d = 1; d <= 7; d++) {
      matrix[d] = {};
      hours.forEach(h => matrix[d][h] = 0);
    }
    rawHeatmap.forEach(pt => {
      const d = pt._id.day;
      const h = Math.floor(pt._id.hour / 2) * 2; // snap to bi-hour
      if (matrix[d] && h in matrix[d]) matrix[d][h] += pt.value;
    });
    const days = ['Sun','Sat','Fri','Thu','Wed','Tue','Mon'];
    const series = days.map((day, di) => {
      const isoDay = 7 - di; // Mon=1…Sun=7 reversed for display
      return { name: day, data: hours.map(h => matrix[isoDay]?.[h] ?? 0) };
    });
    return {
      series,
      chart: { type: 'heatmap', height: 160, toolbar: { show: false }, ...DARK_CHART } as ApexChart,
      dataLabels: { enabled: false } as ApexDataLabels,
      colors: ['#3a57e8'],
      xaxis: {
        categories: ['00:00','02:00','04:00','06:00','08:00','10:00','12:00','14:00','16:00','18:00','20:00','22:00'],
        labels: { style: { colors: '#94a3b8', fontSize: '10px' } },
        axisBorder: { show: false }, axisTicks: { show: false },
      } as ApexXAxis,
      yaxis: { labels: { style: { colors: '#94a3b8', fontSize: '10px' } } } as ApexYAxis,
      grid: { padding: { top: 0, right: 0, bottom: 0, left: 0 } } as ApexGrid,
      tooltip: { theme: 'dark' } as ApexTooltip,
      theme: { mode: 'dark' } as ApexTheme,
      plotOptions: { heatmap: { shadeIntensity: 0.6, radius: 3, colorScale: { ranges: [
        { from: 0,  to: 2,   color: '#1e1e2e', name: 'None'   },
        { from: 3,  to: 10,  color: '#1e3a5f', name: 'Low'    },
        { from: 11, to: 30,  color: '#2e5fa3', name: 'Medium' },
        { from: 31, to: 999, color: '#3a57e8', name: 'High'   },
      ] } } } as ApexPlotOptions,
    };
  }

  // ── Empty defaults ────────────────────────────────────────────────────────

  private emptyPareto() { return this.buildPareto([], [], [], 1); }
  private emptyDonut()  { return this.buildDonut([], [], 0); }
  private emptyTrend()  { return this.buildTrend(Array(7).fill(0), Array(7).fill(0)); }
  private emptyHeatmap(){ return this.buildHeatmap([]); }
}
