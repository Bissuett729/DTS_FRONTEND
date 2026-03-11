import { inject, Injectable, signal } from '@angular/core';
import { HttpService } from '../../../core/application/services/http';
import { environment } from '../../../../environments/environment';
import { firstValueFrom } from 'rxjs';

export interface DashboardStats {
  kpiCurrent:  { totalDt: number; count: number };
  kpiPrev:     { totalDt: number; count: number };
  pareto:      { _id: string; totalDt: number; dept: string }[];
  deptDist:    { _id: string; totalDt: number }[];
  weeklyTrend: { _id: number; reported: number; unreported: number; generated: number }[];
  heatmap:     { _id: { day: number; hour: number }; value: number; count: number }[];
}

export interface HourlyRecord {
  _id: string;
  startTime: string;
  endTime: string;
  week: number;
  shift: string;
  line: string;
  stage: string;
  standardOutput: number;
  currentOutput: number;
  efficiency: number;
  downTimeGenerated: number;
  downTimeUnreported: number;
  downTimeReported: number;
  classification: { downTimeGenerated: number; department: string; reason: string }[];
}

export interface WeeklyTrendsData {
  weeklyData:   { _id: number; totalDt: number; totalReported: number; totalUnreported: number; avgEfficiency: number; count: number }[];
  causeTrends:  { _id: { reason: string; dept: string }; weeks: { week: number; totalDt: number }[] }[];
  currentWeek:  number;
  weeksRange:   number[];
}

@Injectable({ providedIn: 'root' })
export class DtsAnalyticsService {
  private readonly http    = inject(HttpService);
  private readonly dtsURL  = environment.dtsURL;

  loadingDashboard  = signal(false);
  loadingHourly     = signal(false);
  loadingTrends     = signal(false);

  dashboard  = signal<DashboardStats | null>(null);
  hourlyRows = signal<HourlyRecord[]>([]);
  trends     = signal<WeeklyTrendsData | null>(null);

  // ── Dashboard ─────────────────────────────────────────────────────────────

  async fetchDashboard(filters?: { line?: string; stage?: string }) {
    this.loadingDashboard.set(true);
    try {
      const params = new URLSearchParams();
      if (filters?.line)  params.set('line',  filters.line);
      if (filters?.stage) params.set('stage', filters.stage);
      const q = params.toString() ? `?${params}` : '';
      const data = await firstValueFrom(
        this.http.get<DashboardStats>(`${this.dtsURL}/v1/down-time/analytics/dashboard${q}`),
      );
      this.dashboard.set(data);
    } finally {
      this.loadingDashboard.set(false);
    }
  }

  // ── Hourly report ─────────────────────────────────────────────────────────

  async fetchHourlyReport(date: Date, filters?: { line?: string; stage?: string }) {
    this.loadingHourly.set(true);
    try {
      const params = new URLSearchParams({ date: date.toISOString() });
      if (filters?.line)  params.set('line',  filters.line);
      if (filters?.stage) params.set('stage', filters.stage);
      const data = await firstValueFrom(
        this.http.get<HourlyRecord[]>(`${this.dtsURL}/v1/down-time/analytics/hourly?${params}`),
      );
      this.hourlyRows.set(data);
    } finally {
      this.loadingHourly.set(false);
    }
  }

  // ── Weekly trends ─────────────────────────────────────────────────────────

  async fetchWeeklyTrends(filters?: { numWeeks?: number; line?: string; stage?: string; dept?: string }) {
    this.loadingTrends.set(true);
    try {
      const params = new URLSearchParams();
      if (filters?.numWeeks) params.set('numWeeks', String(filters.numWeeks));
      if (filters?.line)     params.set('line',     filters.line);
      if (filters?.stage)    params.set('stage',    filters.stage);
      if (filters?.dept)     params.set('dept',     filters.dept);
      const q = params.toString() ? `?${params}` : '';
      const data = await firstValueFrom(
        this.http.get<WeeklyTrendsData>(`${this.dtsURL}/v1/down-time/analytics/weekly-trends${q}`),
      );
      this.trends.set(data);
    } finally {
      this.loadingTrends.set(false);
    }
  }
}
