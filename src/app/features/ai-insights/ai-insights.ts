import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DtsCard, DtsButton } from '../../shared';
import { DtsAnalyticsService, HourlyRecord } from '../downtime-register/services/dts-analytics.service';

// ── Types ────────────────────────────────────────────────────────────────────
export type RiskLevel = 'critical' | 'high' | 'medium' | 'low';

export interface AIPrediction {
  id: string;
  risk: RiskLevel;
  horizon: string;
  line: string;
  department: string;
  cause: string;
  probability: number;   // 0–100
  estimatedDt: number;   // avg minutes per occurrence
  occurrences: number;
  action: string;
  icon: string;
}

export interface InsightCard {
  icon: string;
  label: string;
  value: string;
  color: string;
  bg: string;
}

function fmtMins(mins: number): string {
  if (!mins) return '0m';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

// ── Department action catalog ─────────────────────────────────────────────────
const DEPT_ACTIONS: Record<string, string> = {
  PMC:      'Coordinar con planeación y material para garantizar surtido previo al siguiente turno. Revisar kanban y órdenes pendientes.',
  AUTO:     'Verificar estado de tester ATS, escalar a mantenimiento de automatización para revisión preventiva.',
  SMT:      'Revisar inventario de material SMT y confirmar kanban con almacén. Verificar estado de pasta y stencils.',
  WH:       'Confirmar surtido pendiente con almacén y coordinar ruta de material con logística.',
  RH:       'Confirmar headcount completo y gestionar cobertura de posiciones faltantes antes del turno.',
  MFG:      'Verificar disponibilidad de material ESD y equipo especial. Confirmar plan de manufactura con supervisor.',
  QA:       'Revisar criterios de aceptación vigentes y reforzar capacitación en proceso con el equipo de turno.',
  ICC:      'Programar ventana de ajuste e intervención con el equipo de ICC antes del inicio de operaciones.',
  TEST:     'Verificar estado de equipos de prueba (EPIA, SIMs, etc.) y escalar a mantenimiento de tester.',
  PROCESS:  'Verificar disponibilidad de herramental y equipo de proceso (escáneres, impresoras, plantillas).',
  IT:       'Asegurar estabilidad del sistema FIS / ERP y tener escalamiento de IT en standby durante el turno.',
  Training: 'Confirmar plan de entrenamiento y disponibilidad de instructor antes del inicio del turno.',
};

const DEFAULT_ACTION = 'Revisar causa raíz con el supervisor responsable del departamento afectado.';

// ── Department icon catalog ───────────────────────────────────────────────────
const DEPT_ICONS: Record<string, string> = {
  PMC:      'ri-box-3-fill',
  AUTO:     'ri-settings-5-fill',
  SMT:      'ri-cpu-fill',
  WH:       'ri-store-3-fill',
  RH:       'ri-group-fill',
  MFG:      'ri-tools-fill',
  QA:       'ri-shield-check-fill',
  ICC:      'ri-wrench-fill',
  TEST:     'ri-flask-fill',
  PROCESS:  'ri-settings-3-fill',
  IT:       'ri-computer-fill',
  Training: 'ri-graduation-cap-fill',
};

const DEFAULT_ICON = 'ri-alert-fill';

const HORIZONS = [
  'Próxima 1 hora',
  'Próximas 2 horas',
  'Próximas 3 horas',
  'Próximas 4 horas',
  'Próximas 5 horas',
  'Próximas 6 horas',
];

// ── Component ─────────────────────────────────────────────────────────────────
@Component({
  selector: 'foxcode-ai-insights',
  standalone: true,
  imports: [CommonModule, DtsCard, DtsButton],
  templateUrl: './ai-insights.html',
})
export class AiInsights implements OnInit {

  private readonly analyticsSvc = inject(DtsAnalyticsService);

  // ── UI state ──────────────────────────────────────────────────────────────
  isAnalyzing  = signal(false);
  fetchError   = signal<string | null>(null);
  lastAnalysis = signal<Date | null>(null);

  // ── Data state ────────────────────────────────────────────────────────────
  predictions    = signal<AIPrediction[]>([]);
  dismissed      = signal<Set<string>>(new Set());
  analyzedEvents = signal(0);
  totalDt        = signal(0);
  modelAccuracy  = signal(0);

  // ── Derived ───────────────────────────────────────────────────────────────
  visiblePredictions = computed(() =>
    this.predictions().filter(p => !this.dismissed().has(p.id))
  );

  criticalCount = computed(() =>
    this.visiblePredictions().filter(p => p.risk === 'critical' || p.risk === 'high').length
  );

  insightCards = computed<InsightCard[]>(() => [
    {
      icon: 'ri-radar-line',
      label: 'Predicciones activas',
      value: String(this.visiblePredictions().length),
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      icon: 'ri-alarm-warning-line',
      label: 'Riesgo alto / crítico',
      value: String(this.criticalCount()),
      color: 'text-red-600 dark:text-red-400',
      bg: 'bg-red-50 dark:bg-red-900/20',
    },
    {
      icon: 'ri-bar-chart-grouped-line',
      label: 'Clasificaciones analizadas',
      value: String(this.analyzedEvents()),
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    },
    {
      icon: 'ri-time-fill',
      label: 'DT total analizado',
      value: fmtMins(this.totalDt()),
      color: 'text-orange-600 dark:text-orange-400',
      bg: 'bg-orange-50 dark:bg-orange-900/20',
    },
  ]);

  // ── Lifecycle ─────────────────────────────────────────────────────────────
  ngOnInit(): void {
    this.runAnalysis();
  }

  // ── Main analysis ─────────────────────────────────────────────────────────
  async runAnalysis(): Promise<void> {
    this.isAnalyzing.set(true);
    this.fetchError.set(null);
    this.predictions.set([]);
    this.dismissed.set(new Set());

    try {
      const records = await this.fetchCurrentWeekRecords();
      this.buildPredictions(records);
    } catch {
      this.fetchError.set('No fue posible obtener los datos del servidor. Verifique la conexión.');
    } finally {
      this.isAnalyzing.set(false);
      this.lastAnalysis.set(new Date());
    }
  }

  /** Fetches and merges all hourly records from Monday of the current week until today */
  private async fetchCurrentWeekRecords(): Promise<HourlyRecord[]> {
    const now = new Date();
    const monday = new Date(now);
    const dow = monday.getDay();
    monday.setDate(monday.getDate() - (dow === 0 ? 6 : dow - 1));
    monday.setHours(0, 0, 0, 0);

    const accumulated: HourlyRecord[] = [];
    const cursor = new Date(monday);

    while (cursor <= now) {
      await this.analyticsSvc.fetchHourlyReport(new Date(cursor));
      accumulated.push(...this.analyticsSvc.hourlyRows());
      cursor.setDate(cursor.getDate() + 1);
    }

    return accumulated;
  }

  // ── Alert engine ──────────────────────────────────────────────────────────
  private buildPredictions(records: HourlyRecord[]): void {
    // 1. Flatten all classification entries
    type ClassEntry = { department: string; reason: string; downTimeGenerated: number; line: string };
    const allEntries: ClassEntry[] = records.flatMap(r =>
      r.classification.map(c => ({ ...c, line: r.line }))
    );

    this.analyzedEvents.set(allEntries.length);
    const sumDt = allEntries.reduce((s, c) => s + c.downTimeGenerated, 0);
    this.totalDt.set(sumDt);

    if (allEntries.length === 0) {
      this.modelAccuracy.set(0);
      return;
    }

    // 2. Group by department
    type DeptAgg = {
      totalDt: number;
      occurrences: number;
      reasons: Map<string, number>;
      lines: Set<string>;
    };
    const deptMap = new Map<string, DeptAgg>();

    for (const entry of allEntries) {
      if (!deptMap.has(entry.department)) {
        deptMap.set(entry.department, { totalDt: 0, occurrences: 0, reasons: new Map(), lines: new Set() });
      }
      const agg = deptMap.get(entry.department)!;
      agg.totalDt     += entry.downTimeGenerated;
      agg.occurrences += 1;
      agg.lines.add(entry.line);
      agg.reasons.set(entry.reason, (agg.reasons.get(entry.reason) ?? 0) + entry.downTimeGenerated);
    }

    // 3. Sort by total DT descending — worst offenders become top predictions
    const sorted = [...deptMap.entries()].sort((a, b) => b[1].totalDt - a[1].totalDt);

    // 4. Model accuracy based on data completeness
    const withClassification = records.filter(r => r.classification.length > 0).length;
    const completeness        = records.length > 0 ? (withClassification / records.length) : 0;
    this.modelAccuracy.set(Math.round(Math.min(95, completeness * 55 + 40)));

    // 5. Build top-6 predictions
    const preds: AIPrediction[] = sorted
      .filter(([, agg]) => agg.totalDt > 0)
      .slice(0, 6)
      .map(([dept, agg], idx) => {
        const topReason   = [...agg.reasons.entries()].sort((a, b) => b[1] - a[1])[0][0];
        const avgDt       = Math.round(agg.totalDt / agg.occurrences);
        const freqRatio   = agg.occurrences / allEntries.length;
        const dtRatio     = sumDt > 0 ? agg.totalDt / sumDt : 0;
        const probability = Math.min(95, Math.round(freqRatio * 80 + dtRatio * 60 + 10));
        const linesStr    = [...agg.lines].sort().join(', ');

        return {
          id:          `pred-${dept}`,
          risk:        this.calcRisk(agg.totalDt),
          horizon:     HORIZONS[idx] ?? 'Próximas 6 horas',
          line:        linesStr,
          department:  dept,
          cause:       `${topReason} — ocurrió ${agg.occurrences} vez${agg.occurrences > 1 ? 'es' : ''} acumulando ${fmtMins(agg.totalDt)} de tiempo muerto`,
          probability,
          estimatedDt: avgDt,
          occurrences: agg.occurrences,
          action:      DEPT_ACTIONS[dept] ?? DEFAULT_ACTION,
          icon:        DEPT_ICONS[dept]   ?? DEFAULT_ICON,
        };
      });

    this.predictions.set(preds);
  }

  private calcRisk(totalDt: number): RiskLevel {
    if (totalDt >= 30) return 'critical';
    if (totalDt >= 15) return 'high';
    if (totalDt >= 8)  return 'medium';
    return 'low';
  }

  // ── UI helpers ────────────────────────────────────────────────────────────
  dismissPrediction(id: string): void {
    this.dismissed.update(s => new Set([...s, id]));
  }

  riskLabel(risk: RiskLevel): string {
    return { critical: 'Crítico', high: 'Alto', medium: 'Medio', low: 'Bajo' }[risk];
  }

  riskBadgeClass(risk: RiskLevel): string {
    return {
      critical: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
      high:     'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
      medium:   'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
      low:      'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    }[risk];
  }

  riskBorderClass(risk: RiskLevel): string {
    return {
      critical: 'border-red-200 dark:border-red-800/40',
      high:     'border-orange-200 dark:border-orange-800/40',
      medium:   'border-yellow-200 dark:border-yellow-800/40',
      low:      'border-blue-200 dark:border-blue-800/40',
    }[risk];
  }

  riskIconBg(risk: RiskLevel): string {
    return {
      critical: 'bg-red-100 dark:bg-red-900/20 text-red-500',
      high:     'bg-orange-100 dark:bg-orange-900/20 text-orange-500',
      medium:   'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-500',
      low:      'bg-blue-100 dark:bg-blue-900/20 text-blue-500',
    }[risk];
  }

  probBarColor(risk: RiskLevel): string {
    return {
      critical: '#ef4444',
      high:     '#f97316',
      medium:   '#eab308',
      low:      '#3b82f6',
    }[risk];
  }

  formatTime(d: Date): string {
    return d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
  }

  readonly fmtMins = fmtMins;
}
