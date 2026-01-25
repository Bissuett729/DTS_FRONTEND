import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'foxcode-header-tool',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header-tool.html',
  styles: ``,
})
export class HeaderTool {

  @Input() toolName: string = 'HEADER TOOL';

  @Input() menus: Array<{ label: string; link: string, childrens?: Array<{ label: string; link: string }> }> = [];

  @Input() options: Array<{ label: string; action: () => void }> = [];

  openOptionsDropdown = signal(false);

  toggleOptions(): void {
    this.openOptionsDropdown.update(v => !v);
  }

  executeOption(action: () => void): void {
    action();
    this.openOptionsDropdown.set(false);
  }
}
