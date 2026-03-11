import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DtsCard, DtsButton } from "../../shared";
import { ShiftRequestService } from './services/shift-request.service';
import { ShiftState } from './state/shift-state';
import { OpenModal } from '../../core/infrastructure';
import { NewShift } from './modals/new-shift/new-shift';
import { ShiftsSocketManager } from '../../shared/services/shifts-socket-manager.service';

export interface ShiftBreak {
  label: string;
  start: string;
  end: string;
}

export interface BreakGroup {
  shiftName: string;
  color: string;
  breaks: ShiftBreak[];
}

export interface Shift {
  id: number;
  name: string;
  shortName: string;
  type: string;
  start: number;
  end: number;
  color: string;
  dotClass: string;
  status: boolean;
  staff: number;
  timeWindow: string;
}

@Component({
  selector: 'dts-shifts',
  standalone: true,
  imports: [CommonModule, DtsCard, DtsButton],
  templateUrl: './shifts.html',
  styles: []
})
export class Shifts implements OnInit, OnDestroy {

  private readonly shiftRequest = inject(ShiftRequestService);
  private readonly shiftState = inject(ShiftState);
  private readonly shiftsSocketManager = inject(ShiftsSocketManager);

  private intervalId: any;
  public currentTime: Date = new Date();

  get shifts(): Shift[] { return this.shiftState.shifts(); }

  public timelineHours = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24];

  ngOnInit() {
    this.shiftRequest.getShift();
    this.intervalId = setInterval(() => { this.currentTime = new Date(); }, 30000);

    this.shiftsSocketManager.connect();
    this.shiftsSocketManager.onShiftCreated(() => this.shiftRequest.getShift(false));
    this.shiftsSocketManager.onShiftUpdated(() => this.shiftRequest.getShift(false));
    this.shiftsSocketManager.onShiftDeleted(() => this.shiftRequest.getShift(false));
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
    this.shiftsSocketManager.disconnect();
  }

  shiftDuration(start: number, end: number): number {
    const time = end > start ? end - start : (24 - start) + end;
    // Solo 1 decimal para evitar problemas de redondeo en el timeline
    return Math.round(time * 10) / 10;
  }

  get currentTimePercent(): number {
    const h = this.currentTime.getHours();
    const m = this.currentTime.getMinutes();
    return ((h + m / 60) / 24) * 100;
  }

  get currentShift(): Shift | undefined {
    const total = this.currentTime.getHours() * 60 + this.currentTime.getMinutes();
    return this.shifts.find(s => {
      const startMin = s.start * 60;
      const endMin = s.end * 60;
      return startMin < endMin
        ? total >= startMin && total < endMin
        : total >= startMin || total < endMin;
    });
  }

  get totalStaff(): number {
    return this.shifts.reduce((a, b) => a + b.staff, 0);
  }

  getShiftSegments(): { shift: Shift; left: number; width: number; label: boolean }[] {
    const result: { shift: Shift; left: number; width: number; label: boolean }[] = [];
    for (const s of this.shifts) {
      if (s.start < s.end) {
        result.push({ shift: s, left: (s.start / 24) * 100, width: ((s.end - s.start) / 24) * 100, label: true });
      } else {
        const wStart = ((24 - s.start) / 24) * 100;
        const wEnd = (s.end / 24) * 100;
        result.push({ shift: s, left: (s.start / 24) * 100, width: wStart, label: wStart >= wEnd });
        result.push({ shift: s, left: 0, width: wEnd, label: wEnd > wStart });
      }
    }
    return result;
  }

  formatHour(h: number): string {
    return h === 24 ? '24:00' : h.toString().padStart(2, '0') + ':00';
  }

  openNewShiftModal() {
    OpenModal(NewShift)
  }
}

