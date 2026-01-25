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
      width: 8px;
    }

    .notifications-scroll::-webkit-scrollbar-track {
      background: #002b47;
      border-radius: 4px;
    }

    .notifications-scroll::-webkit-scrollbar-thumb {
      background: #035a8b;
      border-radius: 4px;
    }

    .notifications-scroll::-webkit-scrollbar-thumb:hover {
      background: #0478b8;
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
