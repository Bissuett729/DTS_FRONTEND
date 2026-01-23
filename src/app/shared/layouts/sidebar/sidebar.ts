import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'foxcode-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styles: [
  ]
})
export class Sidebar {

  @Input() collapsed: boolean = false;

}
