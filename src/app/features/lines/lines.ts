import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DtsCard, DtsButton, DtsSelect } from '../../shared';
import { FormControl } from '@angular/forms';
import { UpdateLine } from './features/update-line/update-line';
import { OpenModal } from '../../core/infrastructure';
import { CreateLine } from './modals/create-line/create-line';
import { LinesRequestService } from './services/lines-request.service';
import { LinesState } from './state/lines-state';
import { LinesSocketManager } from '../../shared/services/lines-socket-manager.service';

@Component({
  selector: 'dts-admin-lines',
  standalone: true,
  imports: [CommonModule, DtsCard, DtsButton, DtsSelect, UpdateLine],
  templateUrl: './lines.html',
  styles: [],
})
export class AdminLines implements OnInit, OnDestroy {
  private readonly linesRequestService = inject(LinesRequestService);
  private linesState = inject(LinesState);
  private readonly linesSocketManager = inject(LinesSocketManager);


  lines$ = this.linesState.lines;
  selectedLine$ = this.linesState.selectedLine;
  loadingLines$ = this.linesState.loadingLines;

  public line = new FormControl('', { nonNullable: true });

  ngOnInit(): void {
    this.linesRequestService.getLines();

    this.linesSocketManager.connect();
    this.linesSocketManager.onLineCreated(() => this.linesRequestService.getLines(false));
    this.linesSocketManager.onLineUpdated(() => this.linesRequestService.getLines(false));
    this.linesSocketManager.onLineDeleted(() => this.linesRequestService.getLines(false));
  }

  ngOnDestroy(): void {
    this.linesSocketManager.disconnect();
  }

  addNewLine() {
    OpenModal(CreateLine);
  }

  selectLine(_id: string) {
    const line = this.lines$().find((line) => line._id === _id);
    this.linesState.selectedLine.set(line || null);
    console.log('selectedLine:', this.selectedLine$());
    
  }
}
