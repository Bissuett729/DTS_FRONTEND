import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'dts-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.html',
  styles: [
  ]
})
export class AlertComponent {

  @Input() type: 'info' | 'warning' | 'error' | 'success' = 'info';
  @Input() message: string = '';

}
