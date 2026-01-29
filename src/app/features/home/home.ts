import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalStateService } from '../../core/application';
import { Card, Table, ITableColumn } from '../../shared/components';

@Component({
  selector: 'foxcode-home',
  standalone: true,
  imports: [CommonModule, Card, Table],
  templateUrl: './home.html',
  styles: ``,
})
export class Home {
  private globalState = inject(GlobalStateService);

  // Constants
  readonly TABS = [
    { id: 'support', label: 'Support report' },
    { id: 'documentation', label: 'Documentation repository' },
    { id: 'team', label: 'Team of developers' },
  ];

  // State
  activeTab = signal<string>('documentation');
  selectedBU = signal<string>('MICROSOFT');

  // Table Configuration
  tableColumns: ITableColumn[] = [
    { key: 'title', label: 'Title:', type: 'text' },
    { key: 'businessUnitId.name', label: 'Unit:', type: 'text' },
    { key: 'version', label: 'Version:', type: 'text', altern: '1.0.0' },
    { key: 'associated', label: 'Associated:', type: 'icon', icon: 'ri-contacts-book-2-line' },
    { key: 'file', label: 'File:', type: 'icon', icon: 'ri-attachment-line' },
  ];

  // Signals from Global State
  user = this.globalState.currentUser;

  // Computed properties
  userFullName = computed(() => {
    const user = this.user();
    if (!user) return 'Guest';
    return `${user.username}`.toUpperCase();
  });

  userClock = computed(() => this.user()?.clock || 'N/A');

  // Logic to group tools by BU for the sidebar
  toolsSummaryByBU = computed(() => {
    const tools = this.user()?.tools || [];
    const summary: Record<string, number> = {};

    tools.forEach((tool) => {
      const bu = tool.businessUnitId?.name || 'Unknown';
      summary[bu] = (summary[bu] || 0) + 1;
    });

    return Object.entries(summary).map(([name, count]) => ({ name, count }));
  });

  // Filtered tools for the table
  filteredTools = computed(() => {
    const tools = this.user()?.tools || [];
    const buFilter = this.selectedBU();

    return tools.filter(
      (tool) => tool.businessUnitId?.name.toUpperCase() === buFilter.toUpperCase(),
    );
  });

  // Methods
  setTab(tabId: string): void {
    this.activeTab.set(tabId);
  }

  setBU(buName: string): void {
    this.selectedBU.set(buName);
  }
}
