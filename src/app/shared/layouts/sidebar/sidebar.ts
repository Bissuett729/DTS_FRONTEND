import { Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'foxcode-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styles: [
  ]
})
export class Sidebar implements OnInit {

  @Input() collapsed: boolean = false;
  @Input() businessUnit: string = 'MICROSOFT';
  @Output() onClose = new EventEmitter<void>();

  isVisible = signal(false);

  ngOnInit(): void {
    // Trigger animation on init
    setTimeout(() => this.isVisible.set(true), 10);
  }

  close(): void {
    this.isVisible.set(false);
    setTimeout(() => this.onClose.emit(), 300);
  }

}
