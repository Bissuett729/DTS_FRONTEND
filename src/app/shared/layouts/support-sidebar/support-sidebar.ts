import { Component, EventEmitter, Output, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'foxcode-support-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './support-sidebar.html',
  styles: [
    `
      :host {
        display: block;
      }

      /* Custom scrollbar for support sidebar */
      .support-scroll::-webkit-scrollbar {
        width: 8px;
      }

      .support-scroll::-webkit-scrollbar-track {
        background: #002b47;
        border-radius: 4px;
      }

      .support-scroll::-webkit-scrollbar-thumb {
        background: #035a8b;
        border-radius: 4px;
      }

      .support-scroll::-webkit-scrollbar-thumb:hover {
        background: #0478b8;
      }
    `,
  ],
})
export class SupportSidebar implements OnInit {
  @Output() onClose = new EventEmitter<void>();

  isVisible = signal(false);
  subject = '';
  details = '';
  priority = '';
  relatedTool = '';
  dragOver = false;

  priorities = ['Low', 'Medium', 'High', 'Critical'];
  tools = ['Tool 1', 'Tool 2', 'Tool 3', 'Tool 4'];

  ngOnInit(): void {
    // Trigger animation on init
    setTimeout(() => this.isVisible.set(true), 10);
  }

  close(): void {
    this.isVisible.set(false);
    setTimeout(() => this.onClose.emit(), 300);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.dragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragOver = false;
    // Handle file drop logic here
  }

  onFileSelect(event: any): void {
    // Handle file selection logic here
  }

  submitSupport(): void {
    // Handle form submission
    // console.log('Support request submitted', {
    //   subject: this.subject,
    //   details: this.details,
    //   priority: this.priority,
    //   relatedTool: this.relatedTool
    // });
  }
}
