import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DtsCard, DtsButton } from '../../../shared';

@Component({
  selector: 'dts-dashboard-lines',
  standalone: true,
  imports: [CommonModule, DtsCard, DtsButton],
  templateUrl: './dashboard-lines.component.html',
  styles: [
  ]
})
export class DashboardLines {

  addNewLine() {}

}
