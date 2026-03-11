import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DtsCard, DtsButton, DtsSelect, DtsDatePicker } from '../../shared';
import { DtsAnalyticsService } from '../downtime-register/services/dts-analytics.service';
import { LinesRequestService } from '../lines/services/lines-request.service';
import { LinesState } from '../lines/state/lines-state';
import { PendingSolutionsState } from './state/pending-solutions.state';

function fmtMins(mins: number): string {
  if (!mins) return '0m';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

@Component({
  selector: 'dts-pending-solutions',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule,
            DtsCard, DtsButton, DtsSelect, DtsDatePicker],
  templateUrl: './pending-solutions.html',
})
export class PendingSolutions implements OnInit {
  private analyticsSvc = inject(DtsAnalyticsService);
  private linesSvc     = inject(LinesRequestService);
  private linesState   = inject(LinesState);
  readonly pendingSvc  = inject(PendingSolutionsState);
  readonly fmtMins     = fmtMins;

  loading     = this.analyticsSvc.loadingHourly;
  dateControl = new FormControl(new Date());
  lineControl = new FormControl<string | null>(null);

  lines = () => [
    { name: null as any, label: 'Todas las líneas' },
    ...this.linesState.lines().map(l => ({ name: l.name, label: l.name })),
  ];

  activeSection = 'pending' as 'pending' | 'actionlog';

  async ngOnInit() {
    await this.linesSvc.getLines();
    await this.load();
  }

  async load() {
    const date = this.dateControl.value ?? new Date();
    await this.analyticsSvc.fetchHourlyReport(date, {
      line: this.lineControl.value ?? undefined,
    });
    this.pendingSvc.refreshFromRecords(this.analyticsSvc.hourlyRows());
  }

  saveSolution = (row: any) => this.pendingSvc.saveSolution(row);
}
