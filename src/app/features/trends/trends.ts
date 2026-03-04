import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DtsCard, DtsButton, DtsSelect, DtsDatePicker } from '../../shared';

export interface WeekData {
  label: string;
  dt: number;       // minutos de downtime
  predicted: boolean;
}

export interface CauseTrend {
  cause: string;
  dept: string;
  currentWeek: number;
  prevWeek: number;
  trend: 'up' | 'down' | 'stable';
  predicted: number;
}

export interface Insight {
  type: 'warning' | 'success' | 'info';
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'dts-trends',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DtsCard, DtsButton, DtsSelect, DtsDatePicker],
  templateUrl: './trends.html',
  styles: ``,
})
export class Trends {
  lineControl  = new FormControl('Todas');
  deptControl  = new FormControl('Todos');
  startControl = new FormControl<Date | null>(null);

  lines = [
    { _id: 'Todas', name: 'Todas las líneas' },
    { _id: 'SA2',   name: 'SA2' },
    { _id: 'FA1',   name: 'FA1' },
    { _id: 'FA2',   name: 'FA2' },
  ];
  depts = [
    { _id: 'Todos', name: 'Todos' },
    { _id: 'AUTO',  name: 'AUTO'  },
    { _id: 'DIAG',  name: 'DIAG'  },
    { _id: 'MFG',   name: 'MFG'   },
    { _id: 'PMC',   name: 'PMC'   },
  ];

  weeklyData: WeekData[] = [
    { label: 'Sem 44',  dt: 820,  predicted: false },
    { label: 'Sem 45',  dt: 740,  predicted: false },
    { label: 'Sem 46',  dt: 960,  predicted: false },
    { label: 'Sem 47',  dt: 680,  predicted: false },
    { label: 'Sem 48',  dt: 590,  predicted: false },
    { label: 'Sem 49',  dt: 630,  predicted: false }, // current week
    { label: 'Sem 50*', dt: 550,  predicted: true  }, // predicted
    { label: 'Sem 51*', dt: 490,  predicted: true  }, // predicted
  ];

  maxDt = computed(() => Math.max(...this.weeklyData.map(w => w.dt)));

  barWidth(dt: number): number {
    return Math.round((dt / this.maxDt()) * 100);
  }

  // KPI computed values
  currentWeekDt  = 630;  // minutes
  predictedNextDt = 550;
  prevWeekDt     = 590;

  kpiTrend = computed(() => {
    const delta = ((this.currentWeekDt - this.prevWeekDt) / this.prevWeekDt) * 100;
    return { value: Math.abs(delta).toFixed(1), up: delta > 0 };
  });

  expectedReduction = computed(() => {
    const r = ((this.currentWeekDt - this.predictedNextDt) / this.currentWeekDt) * 100;
    return r.toFixed(1);
  });

  // Top cause trends
  causeTrends: CauseTrend[] = [
    { cause: 'Espera de Soporte',  dept: 'AUTO', currentWeek: 210, prevWeek: 180, trend: 'up',     predicted: 190 },
    { cause: 'Paro por Diag',      dept: 'DIAG', currentWeek: 140, prevWeek: 155, trend: 'down',   predicted: 125 },
    { cause: 'Espera de Surtido',  dept: 'PMC',  currentWeek: 110, prevWeek: 108, trend: 'stable', predicted: 105 },
    { cause: 'Falla de Equipo',    dept: 'MFG',  currentWeek: 95,  prevWeek: 130, trend: 'down',   predicted: 75  },
    { cause: 'Setup Excesivo',     dept: 'AUTO', currentWeek: 75,  prevWeek: 60,  trend: 'up',     predicted: 55  },
  ];

  insights: Insight[] = [
    {
      type: 'warning',
      icon: 'ri-alarm-warning-line',
      title: 'AUTO — Espera de Soporte en aumento',
      description: 'Esta causa subió 16.7% vs. semana anterior. Sin intervención se proyecta alcanzar 215 min/sem en Sem 51.'
    },
    {
      type: 'success',
      icon: 'ri-trending-down-line',
      title: 'DIAG — Paro por Diag con tendencia positiva',
      description: 'Reducción sostenida por 2 semanas consecutivas. Se predice finalizar bajo 125 min/sem la próxima semana.'
    },
    {
      type: 'info',
      icon: 'ri-lightbulb-line',
      title: 'Ventana óptima detectada: Sem 50',
      description: 'El modelo predice el menor tiempo muerto acumulado de las últimas 8 semanas. Oportunidad para preventivos.'
    },
    {
      type: 'warning',
      icon: 'ri-user-settings-line',
      title: 'Setup Excesivo — patrón recurrente lunes AM',
      description: 'El 78% de los eventos ocurren entre 6:00 y 8:00 del lunes. Revisar procedimiento de arranque de semana.'
    },
  ];

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

  applyFilter(): void { console.log('Apply filter'); }
}
