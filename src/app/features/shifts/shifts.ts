import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DtsCard, DtsButton } from "../../shared";

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
  status: 'ACTIVE' | 'STANDBY';
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

  private intervalId: any;
  public currentTime: Date = new Date();

  public shifts: Shift[] = [
    {
      id: 1,
      name: 'Turno A - Mañana',
      shortName: 'Turno A',
      type: 'Mañana',
      start: 6,
      end: 14,
      color: '#f97316',
      dotClass: 'bg-orange-500',
      status: 'ACTIVE',
      staff: 140,
      timeWindow: '06:00 - 14:00',
    },
    {
      id: 2,
      name: 'Turno B - Tarde',
      shortName: 'Turno B',
      type: 'Tarde',
      start: 14,
      end: 22,
      color: '#6366f1',
      dotClass: 'bg-indigo-500',
      status: 'STANDBY',
      staff: 140,
      timeWindow: '14:00 - 22:00',
    },
    {
      id: 3,
      name: 'Turno C - Noche',
      shortName: 'Turno C',
      type: 'Noche',
      start: 22,
      end: 6,
      color: '#a855f7',
      dotClass: 'bg-purple-500',
      status: 'STANDBY',
      staff: 140,
      timeWindow: '22:00 - 06:00',
    },
  ];

  public breakGroups: BreakGroup[] = [
    {
      shiftName: 'MORNING SHIFT',
      color: '#f97316',
      breaks: [
        { label: 'Coffee Break', start: '09:30', end: '09:45' },
        { label: 'Meal Time',    start: '12:00', end: '12:45' },
      ],
    },
    {
      shiftName: 'EVENING SHIFT',
      color: '#6366f1',
      breaks: [
        { label: 'Tea Break',    start: '16:30', end: '16:45' },
        { label: 'Dinner Time',  start: '19:00', end: '19:45' },
      ],
    },
  ];

  public timelineHours = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24];

  ngOnInit() {
    this.intervalId = setInterval(() => { this.currentTime = new Date(); }, 30000);
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
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
      const endMin   = s.end   * 60;
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
        const wEnd   = (s.end / 24) * 100;
        result.push({ shift: s, left: (s.start / 24) * 100, width: wStart, label: wStart >= wEnd });
        result.push({ shift: s, left: 0,                    width: wEnd,   label: wEnd > wStart  });
      }
    }
    return result;
  }

  formatHour(h: number): string {
    return h === 24 ? '24:00' : h.toString().padStart(2, '0') + ':00';
  }

  openNewShiftModal() {}
}

