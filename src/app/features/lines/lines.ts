import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DtsCard, DtsButton, DtsSelect } from '../../shared';
import { FormControl } from '@angular/forms';
import { UpdateLine } from './features/update-line/update-line';
import { OpenModal } from '../../core/infrastructure';
import { CreateLine } from './modals/create-line/create-line';
import { LinesRequestService } from './services/lines-request.service';

@Component({
  selector: 'dts-admin-lines',
  standalone: true,
  imports: [CommonModule, DtsCard, DtsButton, DtsSelect, UpdateLine],
  templateUrl: './lines.html',
  styles: [],
})
export class AdminLines implements OnInit {
  private readonly linesRequestService = inject(LinesRequestService);

  public line = new FormControl('', { nonNullable: true });

  ngOnInit(): void {
    this.linesRequestService.getLines();
  }

  addNewLine() {
    OpenModal(CreateLine);
  }
}
