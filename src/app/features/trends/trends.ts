import { Component, computed, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DtsCard, DtsButton, DtsSelect } from '../../shared';
import { DtsAnalyticsService, WeeklyTrendsData } from '../downtime-register/services/dts-analytics.service';

export interface WeekData {
  label: string;
  dt: number;
  predicted: boolean;
}

export interface CauseTrend {
  cause:       string;
  dept:        string;
  currentWeek: number;
  prevWeek:    number;
  trend:       'up' | 'down' | 'stable';
}

export interface Insight {
  type: 'warning' | 'success' | 'info';
  icon: string;
  title: string;
  description: string;
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
  selector: 'dts-trends',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DtsCard, DtsButton, DtsSelect],
  templateUrl: './trends.html',
  styles: ``,
})
export class Trends implements OnInit {
  private analyticsSvc = inject(DtsAnalyticsService);
  readonly fmtMins = fmtMins;

  loading = this.analyticsSvc.loadingTrends;

  lineControl  = new FormControl<string | null>(null);
  deptControl  = new FormControl<string | null>(null);

  lines = [
    { _id: null,           name: 'Todas las líneas' },
    { _id: 'FA HY',        name: 'FA HY'            },
    { _id: 'TEST HY',      name: 'TEST HY'          },
    { _id: 'FA 1',         name: 'FA 1'             },
    { _id: 'FA 2',         name: 'FA 2'             },
    { _id: 'FA DOCKING 1', name: 'FA DOCKING 1'     },
    { _id: 'FA DOCKING 2', name: 'FA DOCKING 2'     },
  ];
  depts = [
    { _id: null,         name: 'Todos'      },
    { _id: 'AUTO',       name: 'AUTO'       },
    { _id: 'FACILITIES', name: 'FACILITIES' },
    { _id: 'MFG',        name: 'MFG'        },
    { _id: 'PMC',        name: 'PMC'        },
    { _id: 'PROCESS',    name: 'PROCESS'    },
    { _id: 'QA',         name: 'QA'         },
  ];

  // ── Derived from API ──────────────────────────────────────────────────────
  weeklyData = computed<WeekData[]>(() => {
    const raw = this.analyticsSvc.trends()?.weeklyData ?? [];
    return raw.map(w => ({
      label:     `Sem ${w._id}`,
      dt:        w.totalDt,
      predicted: false,
    }));
  });

  maxDt = computed(() => Math.max(...this.weeklyData().map(w => w.dt), 1));
  barWidth(dt: number): number { return Math.round((dt / this.maxDt()) * 100); }

  currentWeekDt  = computed(() => {
    const d = this.analyticsSvc.trends();
    if (!d) return 0;
    const cw = d.currentWeek;
    return d.weeklyData.find(w => w._id === cw)?.totalDt ?? 0;
  });

  prevWeekDt = computed(() => {
    const d = this.analyticsSvc.trends();
    if (!d) return 0;
    const cw = d.currentWeek;
    return d.weeklyData.find(w => w._id === cw - 1)?.totalDt ?? 0;
  });

  kpiTrend = computed(() => {
    const curr = this.currentWeekDt();
    const prev = this.prevWeekDt();
    if (!prev) return { value: '0.0', up: false };
    const delta = ((curr - prev) / prev) * 100;
    return { value: Math.abs(delta).toFixed(1), up: delta > 0 };
  });

  causeTrends = computed<CauseTrend[]>(() => {
    const d = this.analyticsSvc.trends();
    if (!d?.causeTrends?.length) return [];
    const cw = d.currentWeek;
    return d.causeTrends.map(ct => {
      const cwData   = ct.weeks.find((w: any) => w.week === cw);
      const prevData = ct.weeks.find((w: any) => w.week === cw - 1);
      const curr     = cwData?.totalDt   ?? 0;
      const prev     = prevData?.totalDt ?? 0;
      const trend: 'up' | 'down' | 'stable' =
             curr > prev + 5  ? 'up'
           : curr < prev - 5  ? 'down'
           :                    'stable';
      return {
        cause:       ct._id.reason,
        dept:        ct._id.dept,
        currentWeek: curr,
        prevWeek:    prev,
        trend,
      };
    }).sort((a, b) => b.currentWeek - a.currentWeek).slice(0, 5);
  });

  // Dynamic insights based on cause trends
  insights = computed<Insight[]>(() => {
    const trends = this.causeTrends();
    const list: Insight[] = [];
    for (const ct of trends) {
      if (ct.trend === 'up' && ct.currentWeek > 0) {
        list.push({
          type: 'warning', icon: 'ri-alarm-warning-line',
          title: `${ct.dept} — ${ct.cause} en aumento`,
          description: `Esta causa subió de ${fmtMins(ct.prevWeek)} a ${fmtMins(ct.currentWeek)} esta semana.`,
        });
      } else if (ct.trend === 'down' && ct.prevWeek > 0) {
        list.push({
          type: 'success', icon: 'ri-trending-down-line',
          title: `${ct.dept} — ${ct.cause} mejorando`,
          description: `Reducción de ${fmtMins(ct.prevWeek)} a ${fmtMins(ct.currentWeek)} vs semana anterior.`,
        });
      }
    }
    if (!list.length && trends.length) {
      list.push({
        type: 'info', icon: 'ri-lightbulb-line',
        title: 'Tendencia estable detectada',
        description: 'Las principales causas se mantienen estables entre semanas.',
      });
    }
    return list.slice(0, 4);
  });

  insightBg: Record<string, string> = {
    warning: 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/40',
    success: 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800/40',
    info:    'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800/40',
  };
  insightIcon: Record<string, string> = {
    warning: 'text-amber-500',
    success: 'text-green-500',
    info:    'text-blue-500',
  };

  async ngOnInit() {
    await this.applyFilter();
  }

  async applyFilter() {
    await this.analyticsSvc.fetchWeeklyTrends({
      numWeeks: 8,
      line:     this.lineControl.value  ?? undefined,
      dept:     this.deptControl.value  ?? undefined,
    });
  }
}


