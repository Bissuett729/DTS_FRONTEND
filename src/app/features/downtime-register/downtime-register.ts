import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  DtsCard,
  DtsButton,
  DtsInput,
  DtsTimePicker,
  DtsSelect,
  DtsDatePicker,
} from '../../shared';
import { departments, lines, reasons, shifts } from './data';
import { classficationForm, downtimeForm, downtimeTotalForm, metricsForm } from './forms';
import { IDowntimeClassification } from './models/downtime-classification.model';
import { CommonModule } from '@angular/common';
import { DowntimeState } from './state/downtime-state';
import { DowntimeRequestService } from './services/downtime-request.service';
import { GlobalStateService } from '../../core/application';

@Component({
  selector: 'dts-downtime-register',
  imports: [
    CommonModule,
    DtsCard,
    DtsButton,
    DtsInput,
    DtsTimePicker,
    DtsSelect,
    FormsModule,
    ReactiveFormsModule,
    DtsDatePicker,
  ],
  templateUrl: './downtime-register.html',
  styles: ``,
})
export class DowntimeRegister implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly downtimeRequestService = inject(DowntimeRequestService);
  private readonly downtimeState = inject(DowntimeState);
  private readonly globalState = inject(GlobalStateService);

  readonly shifts$ = this.downtimeState.shifts;
  readonly lines$ = this.downtimeState.lines;
  readonly departments = departments;

  readonly downtimeForm = downtimeForm;
  readonly metricsForm = metricsForm;
  readonly downtimeTotalForm = downtimeTotalForm;
  readonly classficationForm = classficationForm;

  readonly reasons = reasons;

  classifications: IDowntimeClassification[] = [];

  /** Número de semana ISO actual */
  readonly currentWeek: number = this.getWeekNumber();

  // ─── Getters ────────────────────────────────────────────────────────────────

  /** Stages de la línea seleccionada */
  get stages() {
    const lineName = this.downtimeForm.controls.line.value;
    const line = this.lines$().find((l) => l.name === lineName);
    return line?.stages ?? [];
  }

  /**
   * Estándar de salida según la línea, stage y hora de inicio seleccionados.
   * Busca el IHourlyStandard cuyo rango cubre la hora: startHour <= hour < endHour.
   */
  get standardOut(): number {
    const startTime = this.downtimeForm.controls.startTime.value;
    const lineName = this.downtimeForm.controls.line.value;
    const stageName = this.downtimeForm.controls.stage.value;

    if (!startTime || !lineName || !stageName) return 0;

    const hour = startTime.getHours();
    const line = this.lines$().find((l) => l.name === lineName);
    const stage = line?.stages.find((s) => s.name === stageName);

    const hourlyStandard = stage?.hourlyStandards.find(
      (h) => hour >= h.startHour && hour < h.endHour,
    );

    return hourlyStandard?.standard ?? 0;
  }

  /** Puede guardar si actualOut tiene valor y no hay tiempo muerto no reportado */
  get canSave(): boolean {
    const actualOut = this.metricsForm.controls.actualOut.value;
    const unreported = this.downtimeTotalForm.controls.unreportedDowntime.value ?? 0;
    return !!actualOut && unreported === 0;
  }

  /** Eficiencia = salida actual / salida estándar */
  get efficiency(): number {
    const actualOut = this.metricsForm.controls.actualOut.value;
    if (!actualOut || this.standardOut === 0) return 0;
    return Math.round((actualOut / this.standardOut) * 100);
  }

  /**
   * Tiempo muerto generado = ABS(MIN(0, tiempoCalculado - tiempoEsperado)).
   * El tiempo esperado se obtiene del IHourlyStandard activo (endHour - startHour) * 60.
   */
  get generatedDowntime(): number {
    const startTime = this.downtimeForm.controls.startTime.value;
    const lineName = this.downtimeForm.controls.line.value;
    const stageName = this.downtimeForm.controls.stage.value;
    const actualOut = this.metricsForm.controls.actualOut.value ?? 0;

    if (!startTime || !lineName || !stageName || this.standardOut === 0) return 0;

    const hour = startTime.getHours();
    const line = this.lines$().find((l) => l.name === lineName);
    const stage = line?.stages.find((s) => s.name === stageName);
    const hourlyStandard = stage?.hourlyStandards.find(
      (h) => hour >= h.startHour && hour < h.endHour,
    );

    // Minutos esperados = duración del rango en horas × 60
    const rangeHours = hourlyStandard ? hourlyStandard.endHour - hourlyStandard.startHour : 1;
    const expectedTime = rangeHours * 60;
    const calculatedTime = Math.floor((actualOut * 60) / this.standardOut);

    return Math.abs(Math.min(0, calculatedTime - expectedTime));
  }

  /** =ABS(MIN(0, ROUNDDOWN(totalReportado - generado, 0))) */
  get unreportedDowntime(): number {
    const reported = this.downtimeTotalForm.controls.totalReportedDowntime.value ?? 0;
    return Math.abs(Math.min(0, Math.floor(reported - this.generatedDowntime)));
  }

  // ─── Lifecycle ──────────────────────────────────────────────────────────────

  ngOnInit(): void {
    this.getLines();
    this.getDepartments();
    this.getShifts();

    this.metricsForm.controls.standardOut.setValue(this.standardOut);
    this.downtimeTotalForm.controls.generatedDowntime.setValue(this.generatedDowntime);
    this.downtimeTotalForm.controls.unreportedDowntime.setValue(this.unreportedDowntime);

    this.downtimeForm.controls.weekNumber.setValue(this.currentWeek);
    this.downtimeForm.controls.supervisor.setValue(
      this.globalState.currentUser()?.supervisor?.clock ?? null,
    );

    this.metricsForm.controls.actualOut.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.metricsForm.controls.standardOut.setValue(this.standardOut);
        this.downtimeTotalForm.controls.generatedDowntime.setValue(this.generatedDowntime);
        this.syncUnreportedDowntime();
      });

    this.downtimeForm.controls.startTime.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((startTime) => {
        if (!startTime) return;
        const endTime = new Date(startTime);
        endTime.setHours(endTime.getHours() + 1, 0, 0, 0);
        this.downtimeForm.controls.endTime.setValue(endTime);
        this.syncStandardOut();
      });

    this.downtimeForm.controls.line.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        // Al cambiar la línea se limpia el stage previo y se recalcula el estándar
        this.downtimeForm.controls.stage.setValue(null);
        this.syncStandardOut();
      });

    this.downtimeForm.controls.stage.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.syncStandardOut());

    this.downtimeTotalForm.controls.totalReportedDowntime.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.syncUnreportedDowntime());
  }

  async getLines() {
    await this.downtimeRequestService.getLines();
  }

  async getDepartments() {
    await this.downtimeRequestService.getDepartments();
  }

  async getShifts() {
    await this.downtimeRequestService.getShift();
  }

  // ─── Actions ────────────────────────────────────────────────────────────────

  registerDownTime(): void {
    // console.log('downtimeForm:', this.downtimeForm.value);
    // console.log('metricsForm:', this.metricsForm.value);
    // console.log('STD:', this.standardOut);
    // console.log('Eficiencia:', this.efficiency + '%');
    // console.log('Tiempo muerto no reportado:', this.unreportedDowntime);
    // console.log('Tiempo muerto generado:', this.generatedDowntime);
  }

  addClassifyDowntime(): void {
    if (!this.classficationForm.valid) return;

    const department = this.classficationForm.controls.department.value!;
    const downtimeReported = Number(this.classficationForm.controls.downtimeReported.value);
    const existing = this.classifications.find((c) => c.department === department);

    if (existing) {
      existing.downtimeReported = downtimeReported;
    } else {
      this.classifications.push({
        department,
        downtimeReported,
        problemDescription: this.classficationForm.controls.problemDescription.value,
      });
    }

    this.classficationForm.reset();
    this.syncTotalReportedDowntime();
  }

  removeClassification(index: number): void {
    this.classifications.splice(index, 1);
    this.syncTotalReportedDowntime();
  }

  getReasons(department: string): string[] {
    const r = this.reasons as Record<string, string[]>;
    return r[department] ?? r['AUTO'] ?? [];
  }

  // ─── Private ────────────────────────────────────────────────────────────────

  /** Retorna el número de semana ISO 8601 de la fecha dada (por defecto hoy) */
  private getWeekNumber(date: Date = new Date()): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7; // Lunes=1 … Domingo=7
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7);
  }

  /** Sincroniza standardOut y generatedDowntime en los formularios */
  private syncStandardOut(): void {
    this.metricsForm.controls.standardOut.setValue(this.standardOut);
    this.downtimeTotalForm.controls.generatedDowntime.setValue(this.generatedDowntime);
    this.syncUnreportedDowntime();
  }

  private syncTotalReportedDowntime(): void {
    const total = this.classifications.reduce((sum, c) => sum + c.downtimeReported, 0);
    this.downtimeTotalForm.controls.totalReportedDowntime.setValue(total);
  }

  private syncUnreportedDowntime(): void {
    this.downtimeTotalForm.controls.unreportedDowntime.setValue(this.unreportedDowntime);
  }
}
