import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'foxcode-loader-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loader-page.html',
  styleUrls: ['./loader-page.scss'],
})
export class LoaderPage {
  message = input<string>('Loading...');
}
