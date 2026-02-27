import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DtsCard, DtsButton, DtsInput, DtsTimePicker, DtsSelect, DtsDatePicker } from '../../shared';
import { departments, lines, reasons, shifts } from './data';
import { classficationForm, downtimeForm, downtimeTotalForm, metricsForm } from './forms';
import { IDowntimeClassification } from './models/downtime-classification.model';
import { CommonModule } from '@angular/common';

/** =SWITCH(E2, 6,113, 7,142, ...) — salida estándar por hora de inicio */
const STD_OUT_MAP: Record<number, number> = {
  3: 127, 6: 113, 7: 142, 11: 142,
  12: 113, 15: 127, 18: 85, 23: 113,
};

/** Tiempo de espera esperado por hora de inicio (para cálculo de tiempo muerto) */
const EXPECTED_TIME_MAP: Record<number, number> = {
  3: 45, 6: 40, 7: 50, 11: 50,
  12: 40, 15: 45, 18: 30, 23: 40,
};

@Component({
  selector: 'dts-downtime-register',
  imports: [CommonModule, DtsCard, DtsButton, DtsInput, DtsTimePicker, DtsSelect, FormsModule, ReactiveFormsModule, DtsDatePicker],
  templateUrl: './downtime-register.html',
  styles: ``,
})
export class DowntimeRegister implements OnInit {

  private readonly destroyRef = inject(DestroyRef);

  readonly shifts = shifts;
  readonly lines = lines;
  readonly departments = departments;

  readonly downtimeForm = downtimeForm;
  readonly metricsForm = metricsForm;
  readonly downtimeTotalForm = downtimeTotalForm;
  readonly classficationForm = classficationForm;

  readonly reasons = reasons;

  classifications: IDowntimeClassification[] = [];

  // ─── Getters ────────────────────────────────────────────────────────────────

  /** =SWITCH(hora, ...) — salida estándar */
  get standardOut(): number {
    const hour = this.downtimeForm.controls.startTime.value?.getHours();
    return STD_OUT_MAP[hour!] ?? 170;
  }

  /** Eficiencia = salida actual / salida estándar */
  get efficiency(): number {
    const actualOut = this.metricsForm.controls.actualOut.value;
    if (!actualOut || this.standardOut === 0) return 0;
    return Math.round((actualOut / this.standardOut) * 100);
  }

  /** =ABS(MIN(0, ROUNDDOWN(12*60/STD, 0) - esperado)) */
  get generatedDowntime(): number {
    const hour = this.downtimeForm.controls.startTime.value?.getHours();
    const expectedTime = EXPECTED_TIME_MAP[hour!] ?? 60;
    const actualOut = this.metricsForm.controls.actualOut.value ?? 12;
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
    this.metricsForm.controls.standardOut.setValue(this.standardOut);
    this.downtimeTotalForm.controls.generatedDowntime.setValue(this.generatedDowntime);
    this.downtimeTotalForm.controls.unreportedDowntime.setValue(this.unreportedDowntime);

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
      });

    this.downtimeTotalForm.controls.totalReportedDowntime.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.syncUnreportedDowntime());
  }

  // ─── Actions ────────────────────────────────────────────────────────────────

  registerDownTime(): void {
    console.log('downtimeForm:', this.downtimeForm.value);
    console.log('metricsForm:', this.metricsForm.value);
    console.log('STD:', this.standardOut);
    console.log('Eficiencia:', this.efficiency + '%');
    console.log('Tiempo muerto no reportado:', this.unreportedDowntime);
    console.log('Tiempo muerto generado:', this.generatedDowntime);
  }

  addClassifyDowntime(): void {
    if (!this.classficationForm.valid) return;

    const department = this.classficationForm.controls.department.value!;
    const downtimeReported = Number(this.classficationForm.controls.downtimeReported.value);
    const existing = this.classifications.find(c => c.department === department);

    if (existing) {
      existing.downtimeReported = downtimeReported;
    } else {
      this.classifications.push({
        department,
        downtimeReported,
        problemDescription: this.classficationForm.controls.problemDescription.value
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

  private syncTotalReportedDowntime(): void {
    const total = this.classifications.reduce((sum, c) => sum + c.downtimeReported, 0);
    this.downtimeTotalForm.controls.totalReportedDowntime.setValue(total);
  }

  private syncUnreportedDowntime(): void {
    this.downtimeTotalForm.controls.unreportedDowntime.setValue(this.unreportedDowntime);
  }
}


