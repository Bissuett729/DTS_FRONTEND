import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DtsCard, DtsButton, DtsSelect } from '../../shared';
import { FormControl } from '@angular/forms';
import { UpdateLine } from "./features/update-line/update-line";
import { OpenModal } from '../../core/infrastructure';
import { CreateLine } from './modals/create-line/create-line';

@Component({
  selector: 'dts-admin-lines',
  standalone: true,
  imports: [CommonModule, DtsCard, DtsButton, DtsSelect, UpdateLine],
  templateUrl: './admin-lines.html',
  styles: [
  ]
})
export class AdminLines {

  public line = new FormControl('', { nonNullable: true });

  addNewLine() {
    OpenModal(CreateLine);
  }

}