import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DtsCard, DtsButton, DtsSelect, DtsDatePicker } from '../../shared';

export interface HourRow {
  hour: string;
  standard: number;
  production: number;
  efficiency: number;
  mfgTop: string | null;
  mfgNr: string | null;
  dtReported: string;
  realTime: string;
  dtGenerated: string;
  dtNotReported: string;
  isCurrentHour?: boolean;
}

export interface ActionLogRow {
  department: string;
  cause: string;
  start: string;
  startHour: string;
  endHour: string;
  total: string;
  actionNum: number;
  status: 'Abierto' | 'Cerrado';
  dueDate: string;
  overdueTime: string;
  closeDate: string;
  rca: string;
  ica: string;
  pca: string;
}

@Component({
  selector: 'dts-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DtsCard, DtsButton, DtsSelect, DtsDatePicker],
  templateUrl: './reports.html',
  styles: ``,
})
export class Reports {
  activeTab = signal<'hourly' | 'actionlog'>('hourly');

  dateControl = new FormControl(new Date());
  lineControl = new FormControl('SA2');
  deptControl = new FormControl('Todos');
  statusControl = new FormControl('Todos');
  startDateControl = new FormControl<Date | null>(null);
  endDateControl = new FormControl<Date | null>(null);

  lines = [
    { _id: 'SA2', name: 'SA2' },
    { _id: 'FA1', name: 'FA1' },
    { _id: 'FA2', name: 'FA2' },
  ];
  departments = [
    { _id: 'Todos', name: 'Todos' },
    { _id: 'AUTO', name: 'AUTO' },
    { _id: 'DIAG', name: 'DIAG' },
    { _id: 'PMC',  name: 'PMC'  },
    { _id: 'MFG',  name: 'MFG'  },
  ];
  statuses = [
    { _id: 'Todos',   name: 'Todos'   },
    { _id: 'Abierto', name: 'Abierto' },
    { _id: 'Cerrado', name: 'Cerrado' },
  ];

  hourlyRows: HourRow[] = [
    { hour: '0:00 - 1:00',   standard: 157, production: 370, efficiency: 235.67, mfgTop: null,  mfgNr: null,        dtReported: '0:00', realTime: '0:00', dtGenerated: '0:00',  dtNotReported: '0:00'  },
    { hour: '1:00 - 2:00',   standard: 157, production: 270, efficiency: 171.97, mfgTop: null,  mfgNr: null,        dtReported: '0:00', realTime: '0:00', dtGenerated: '0:00',  dtNotReported: '0:00'  },
    { hour: '2:00 - 3:00',   standard: 157, production: 415, efficiency: 264.33, mfgTop: null,  mfgNr: null,        dtReported: '0:00', realTime: '0:00', dtGenerated: '0:00',  dtNotReported: '0:00'  },
    { hour: '3:00 - 4:00',   standard: 90,  production: 325, efficiency: 361.11, mfgTop: null,  mfgNr: null,        dtReported: '0:00', realTime: '0:00', dtGenerated: '0:00',  dtNotReported: '0:00'  },
    { hour: '4:00 - 5:00',   standard: 157, production: 395, efficiency: 251.59, mfgTop: null,  mfgNr: null,        dtReported: '0:00', realTime: '0:00', dtGenerated: '0:00',  dtNotReported: '0:00'  },
    { hour: '5:00 - 6:00',   standard: 157, production: 365, efficiency: 232.48, mfgTop: null,  mfgNr: null,        dtReported: '0:00', realTime: '0:00', dtGenerated: '0:00',  dtNotReported: '0:00'  },
    { hour: '6:00 - 7:00',   standard: 80,  production: 60,  efficiency: 75.00,  mfgTop: '0:00', mfgNr: 'NR: 10:00', dtReported: '0:00', realTime: '0:00', dtGenerated: '10:00', dtNotReported: '10:00' },
    { hour: '7:00 - 8:00',   standard: 157, production: 200, efficiency: 127.39, mfgTop: null,  mfgNr: null,        dtReported: '0:00', realTime: '0:00', dtGenerated: '0:00',  dtNotReported: '0:00'  },
    { hour: '8:00 - 9:00',   standard: 157, production: 345, efficiency: 219.75, mfgTop: null,  mfgNr: null,        dtReported: '0:00', realTime: '0:00', dtGenerated: '0:00',  dtNotReported: '0:00'  },
    { hour: '9:00 - 10:00',  standard: 157, production: 315, efficiency: 200.64, mfgTop: null,  mfgNr: null,        dtReported: '0:00', realTime: '0:00', dtGenerated: '0:00',  dtNotReported: '0:00'  },
    { hour: '10:00 - 11:00', standard: 157, production: 290, efficiency: 184.71, mfgTop: null,  mfgNr: null,        dtReported: '0:00', realTime: '0:00', dtGenerated: '0:00',  dtNotReported: '0:00',  isCurrentHour: true  },
  ];

  totals = computed(() => ({
    standard:      this.hourlyRows.reduce((s, r) => s + r.standard, 0),
    production:    this.hourlyRows.reduce((s, r) => s + r.production, 0),
    efficiency:    +(this.hourlyRows.reduce((s, r) => s + r.efficiency, 0) / this.hourlyRows.length).toFixed(2),
    dtGenerated:   '10:00',
    dtNotReported: '10:00',
  }));

  top3Depts = [
    { name: 'MFG',  time: '10:00', color: '#ef4444' },
  ];

  actionLog: ActionLogRow[] = [
    { department: 'AUTO', cause: 'Espera de Soporte', start: '30/12/2025', startHour: '12:54:58', endHour: '14:47:05', total: '112:07', actionNum: 4773, status: 'Abierto', dueDate: '--', overdueTime: '--', closeDate: '--', rca: '', ica: '', pca: '' },
    { department: 'AUTO', cause: 'Espera de Soporte', start: '06/10/2025', startHour: '16:10:39', endHour: '16:39:35', total: '28:56',  actionNum: 4729, status: 'Abierto', dueDate: '--', overdueTime: '--', closeDate: '--', rca: '', ica: '', pca: '' },
    { department: 'DIAG', cause: 'Paro por Diag',     start: '04/10/2025', startHour: '17:31:56', endHour: '17:45:22', total: '13:26',  actionNum: 4725, status: 'Abierto', dueDate: '--', overdueTime: '--', closeDate: '--', rca: '', ica: '', pca: '' },
    { department: 'PMC',  cause: 'Espera de Surtido', start: '04/10/2025', startHour: '13:04:31', endHour: '13:31:33', total: '27:02',  actionNum: 4718, status: 'Abierto', dueDate: '--', overdueTime: '--', closeDate: '--', rca: '', ica: '', pca: '' },
  ];

  exportToExcel(): void { console.log('Export to Excel'); }
  applyFilter():   void { console.log('Apply filter'); }
  setToday():      void { this.dateControl.setValue(new Date()); }
  filterActionLog(): void { console.log('Filter action log'); }
}
