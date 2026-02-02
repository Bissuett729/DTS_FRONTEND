import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupportTable } from './shared/components/support-table/support-table';
import { finalize } from 'rxjs';
import { ISupportReportResp } from './shared/interfaces/support-report.interface';
import { SignalsSupportReport } from './shared/storage/signals.signal';
import { FormControl } from '@angular/forms';
import { GlobalStateService, HttpService } from '../../../../core/application';
import { AlertService, FoxcodeInput, FoxcodePaginator, FoxcodeCard, FoxcodeSelect, FoxcodeButton, IPagination } from '../../../../shared';
import { environment } from '../../../../../environments/environment';
import { SupportReportSocketManager } from './core/sockets/support-report-socket-manager.service';

@Component({
  selector: 'foxcode-support-report',
  standalone: true,
  imports: [
    CommonModule,
    SupportTable,
    FoxcodeInput,
    FoxcodePaginator,
    FoxcodeCard,
    FoxcodeSelect,
    FoxcodeButton,
  ],
  templateUrl: './support-report.html',
})
export class SupportReport implements OnInit {

  private readonly http = inject(HttpService)
  private globalState = inject(GlobalStateService);
  public readonly signals = inject(SignalsSupportReport)
  private readonly alert = inject(AlertService)
  private readonly sockets = inject(SupportReportSocketManager);

  public filter = new FormControl<string>('')
  public priority = new FormControl<number | null>(null)
  public status = new FormControl<string>('')

  public priorityArr = [
    { value: null, view: 'N/A' },
    { value: 1, view: 'Low' },
    { value: 2, view: 'Medium' },
    { value: 3, view: 'High' },
  ]

  public statusArr = [
    { value: null, view: 'N/A' },
    { value: 'open', view: 'Open' },
    { value: 'in-progress', view: 'In progress' },
    { value: 'review', view: 'Review' },
    { value: 'resolved', view: 'Resolved' },
    { value: 'closed', view: 'Closed' },
    { value: 'rejected', view: 'Rejected' }
  ]

  public currentPage = 1;
  public currentPageSize = 10;
  public totalPages = 0;
  public totalItems = 0;

  public loadingData = false;

  constructor() {
    this.initSockets();
  }

  ngOnInit(): void {
    setTimeout(() => this.loadReports(), 200);
  }

  filterData() {
    const filter = this.filter.value || '';
    this.signals.$clonReportsArr.set(
      this.signals.$reportsArr().filter(r =>
        r.code.includes(filter) ||
        r.title.includes(filter) ||
        r.tool.includes(filter) ||
        r.status.includes(filter)
      )
    );
  }

  async loadReports(event?: IPagination) {
    if (this.loadingData) return;

    this.loadingData = true;

    const filter = this.filter.value;
    const priority = this.priority.value;
    const status = this.status.value;
    const dev = this.globalState.currentUser()?.roleIds?.[0]?.name === 'DEVELOPER';
    const userId = this.globalState.currentUser()?._id;

    this.http.get<ISupportReportResp>(
      `${environment.SUPPORT_REPORT}/bug-tracking/filter?page=${event?.page || 1}&limit=${event?.pageSize || 5}&text=${filter}&status=${status}&priority=${priority}&dev=${dev}&userId=${userId}`
    )
      .pipe(finalize(() => this.loadingData = false))
      .subscribe({
        next: (value) => {
          this.signals.$reportsArr.set(value?.items);
          this.signals.$clonReportsArr.set(value?.items);
          this.totalPages = value?.totalPages || 0;
        },
        error: (err) => {
          this.alert.error(err);
        }
      });
  }

  private initSockets() {
    const sockets = this.sockets;

    sockets.onStatusChangedSupportReport(resp => {
      this.updateReport(resp.id, report => {
        if (report.status === resp.status) return null; // no cambios → no render
        return { ...report, status: resp.status };
      });
    });

    sockets.onNewSupportReport(resp => {
      this.addReport(resp);
    });
  }

  /** actualizar sin sobrescribir */
  private updateReport(id: string, updateFn: (item: any) => any | null) {
    this.signals.$clonReportsArr.update(list =>
      list.map(report => {
        if (report._id !== id) return report;
        const updated = updateFn(report);
        return updated ? updated : report;
      })
    );
  }

  /** evitar duplicados */
  private addReport(newReport: any) {
    this.signals.$clonReportsArr.update(list => {
      const exists = list.some(r => r._id === newReport._id);
      if (exists) return list;
      return [newReport, ...list];
    });
  }
}