import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'foxcode-loading',
  standalone: true,
  imports: [CommonModule, MatProgressBarModule],
  templateUrl: './loading.html',
  styles: []
})
export class Loading {

  @Input() messageLoading: string = 'Loading information, please wait.';
  @Input() styles: string = 'text-xs font-medium';

}
