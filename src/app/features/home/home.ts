import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalStateService } from '../../core/application';

@Component({
  selector: 'foxcode-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
})
export class Home {
  private globalState = inject(GlobalStateService);
}
