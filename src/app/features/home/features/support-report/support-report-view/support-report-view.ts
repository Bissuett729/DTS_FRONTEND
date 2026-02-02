import { Component, effect, EffectRef, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewImageSupport } from './modals/view-image-support/view-image-support';
import { SignalsSupportReport } from '../shared/storage/signals.signal';
import { ActivatedRoute } from '@angular/router';
import { IHistory, IRespImages, ISupportReport } from '../shared/interfaces/support-report.interface';
import { finalize } from 'rxjs';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddImagesComponent } from './modals/add-images/add-images';
import { Header, FoxcodeCard, FoxcodeButton, FoxcodeSelect, AlertService } from "../../../../../shared";
import { GlobalStateService, HttpService } from '../../../../../core/application';
import { OpenModal } from '../../../../../core/infrastructure';
import { environment } from '../../../../../../environments/environment';
import { SupportReportSocketManager } from '../core/sockets/support-report-socket-manager.service';

type SupportStatus = 'open' | 'review' | 'in-progress' | 'resolved' | 'closed' | 'rejected';

@Component({
  selector: 'app-support-report-view',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Header,
    FoxcodeCard,
    FoxcodeButton,
    FoxcodeSelect
  ],
  templateUrl: './support-report-view.html'
})
export class SupportReportView implements OnInit {

  private readonly http = inject(HttpService)
  public globalState = inject(GlobalStateService);
  readonly signals = inject(SignalsSupportReport)
  private readonly alert = inject(AlertService)
  private readonly route = inject(ActivatedRoute);
  private readonly sockets = inject(SupportReportSocketManager);

  public loadingData = false;
  public loadingImagesData = false;
  public loadingEmitMessage = false;
  public loadingChangeStatus = false;

  private readonly supportStatusArr: SupportStatus[] = [
    'open',
    'review',
    'in-progress',
    'resolved',
    'closed',
    'rejected',
  ];

  private isSupportStatus(value: any): value is SupportStatus {
    return this.supportStatusArr.includes(value);
  }

  public isDev = false;
  public idSupport = '';

  public messageCtrl = new FormControl<string>('', Validators.required)
  public status = new FormControl<string>('', Validators.required)

  @ViewChild('commentsList') commentsList!: ElementRef<HTMLDivElement>;

  private commentsEffect = effect(() => {
    const comments = this.signals.$report()?.comments ?? [];

    queueMicrotask(() => {
      if (this.commentsList) {
        this.scrollToBottom();
      }
    });
  });

  statusArr = [
    { value: 'open', view: 'Open' },
    { value: 'review', view: 'Review' },
    { value: 'in-progress', view: 'In progress' },
    { value: 'resolved', view: 'Resolved' }
  ];

  private STATUS_COLORS: Record<SupportStatus, { bg: string; text: string }> = {
    open: { bg: 'bg-orange-400', text: 'text-orange-600 dark:text-orange-400' },
    review: { bg: 'bg-yellow-500', text: 'text-yellow-600 dark:text-yellow-400' },
    'in-progress': { bg: 'bg-cyan-400', text: 'text-cyan-600 dark:text-cyan-400' },
    resolved: { bg: 'bg-green-500', text: 'text-green-600 dark:text-green-400' },
    closed: { bg: 'bg-slate-500', text: 'text-slate-600 dark:text-slate-400' },
    rejected: { bg: 'bg-red-500', text: 'text-red-600 dark:text-red-400' }
  };

  constructor() {
    this.initSockets();
  }

  ngOnInit(): void {
    this.route.paramMap?.subscribe(params => {
      const code = params.get('code')
      if (code) this.loadReport();
    });

    setTimeout(() => {
      const user = this.globalState.currentUser();
      this.isDev = !!user?.roleIds?.some(rol => rol.name === 'Development');
    }, 200);
  }

  expandImagesModal(imgB64: string, title: string) {
    OpenModal(ViewImageSupport, { data: { title, imgB64 }, disableClose: false })
  }

  loadReport() {
    if (this.loadingData) return;
    this.loadingData = true;

    const code = this.route.snapshot.paramMap.get('code')!;
    this.http.get<ISupportReport>(`${environment.SUPPORT_REPORT}/bug-tracking/${code}`)
      .pipe(finalize(() => this.loadingData = false))
      .subscribe({
        next: (value) => {
          this.signals.$report.set(value);
          this.idSupport = value._id;
          this.status.setValue(value.status);
          this.loadImagesByIds(value.images);
        },
        error: err => this.alert.error(err)
      });
  }

  private get userId(): string | undefined {
    return this.globalState.currentUser()?._id
  }

  async loadImagesByIds(ids: string[]) {
    if (this.loadingImagesData) return;
    this.loadingImagesData = true;

    this.http.post<IRespImages[]>(`${environment.SUPPORT_REPORT}/bug-tracking/images/by-ids/multiple`, { ids })
      .pipe(finalize(() => this.loadingImagesData = false))
      .subscribe({
        next: value => this.signals.$images.set(value),
        error: err => this.alert.error(err)
      });
  }

  async sendCommand() {
    if (this.messageCtrl.invalid || this.loadingEmitMessage || this.messageCtrl.value!.trim() === '') return;

    this.loadingEmitMessage = true;
    const id = this.signals.$report()?._id;

    this.http.post<ISupportReport>(`${environment.SUPPORT_REPORT}/bug-tracking/${id}/comments`, {
      user: this.userId,
      message: this.messageCtrl.value
    })
      .pipe(finalize(() => this.loadingEmitMessage = false))
      .subscribe({
        next: () => {
          this.messageCtrl.reset();
          this.alert.success('Comment successfully added');
        },
        error: err => this.alert.error(err)
      });
  }

  async changeStatus(status?: string) {
    if (this.status.invalid || this.loadingChangeStatus) return;

    this.loadingChangeStatus = true;
    const id = this.signals.$report()?._id;

    this.http.put(`${environment.SUPPORT_REPORT}/bug-tracking/${id}/status`, {
      user: this.userId,
      status: status || this.status.value
    })
      .pipe(finalize(() => this.loadingChangeStatus = false))
      .subscribe({
        next: () => this.alert.success('Status successfully updated'),
        error: err => this.alert.error(err)
      });
  }

  mapAction(h: IHistory) {
    switch (h.action) {
      case 'created': return '📌 Report Created';
      case 'status-changed': return `🔄 Status: ${h.from} → ${h.to}`;
      default: return h.action;
    }
  }

  getHistoryColor(h: IHistory): string {
    if (h.action === 'created') return 'bg-primary';
    if (this.isSupportStatus(h.to)) {
      return this.STATUS_COLORS[h.to as SupportStatus].bg;
    }
    return 'bg-primary';
  }

  getHistoryTextColor(h: IHistory): string {
    if (h.action === 'created') return 'text-primary';
    if (this.isSupportStatus(h.to)) {
      return this.STATUS_COLORS[h.to as SupportStatus].text;
    }
    return 'text-primary';
  }

  openAddImagesModal() {
    OpenModal(AddImagesComponent);
  }

  private scrollToBottom(): void {
    try {
      const el = this.commentsList?.nativeElement;
      if (!el) return;

      el.style.scrollBehavior = 'smooth';
      el.scrollTop = el.scrollHeight;
    } catch { }
  }

  trackByCommentId(_: number, comment: any) {
    return comment?._id ?? `${comment?.user?._id}-${comment?.date}`;
  }

  private initSockets() {
    const match = (resp: any) => this.idSupport === resp?.id;

    this.sockets.onUpdatedSupportReport(resp => match(resp) && this.loadReport());
    this.sockets.onCommentAddedSupportReport(resp => match(resp) && this.loadReport());
    this.sockets.onHistoryAddedSupportReport(resp => match(resp) && this.loadReport());
    this.sockets.onStatusChangedSupportReport(resp => match(resp) && this.loadReport());
    this.sockets.onClosedSupportReport(resp => match(resp) && this.loadReport());
    this.sockets.onAddedImageToSupportReport(resp => match(resp) && this.loadReport());
  }
}