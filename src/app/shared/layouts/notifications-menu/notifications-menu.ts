import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'foxcode-notifications-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications-menu.html',
  styles: [`
    /* Custom scrollbar for notifications menu */
    .notifications-scroll::-webkit-scrollbar {
      width: 6px;
    }

    .notifications-scroll::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 4px;
    }

    .notifications-scroll::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 4px;
    }

    .notifications-scroll::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }

    /* Dark mode scrollbar */
    :host-context(.dark) .notifications-scroll::-webkit-scrollbar-track {
      background: #1b1f28;
    }

    :host-context(.dark) .notifications-scroll::-webkit-scrollbar-thumb {
      background: #353b43;
    }

    :host-context(.dark) .notifications-scroll::-webkit-scrollbar-thumb:hover {
      background: #424b60;
    }
  `]
})
export class NotificationsMenu {

  @Input() notifications: any[] = []; // tipar luego
  @Output() onNotificationAction = new EventEmitter<any[]>();
  
  emitNotificationAction() {
    this.onNotificationAction.emit();
  }

}
