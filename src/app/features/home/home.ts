import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalStateService } from '../../core/application';
import { ITableColumn } from '../../shared/interfaces';
import { Tab, ITap, FoxcodeCard } from "../../shared/components";
import { SupportReport } from "./features/support-report/support-report";
import { Developers } from "./features/developers/developers";

@Component({
  selector: 'foxcode-home',
  standalone: true,
  imports: [CommonModule, FoxcodeCard, Tab, SupportReport, Developers],
  templateUrl: './home.html',
})
export class Home {
  private globalState = inject(GlobalStateService);

  // Constants
  readonly TABS: ITap[] = [
    { label: 'Support report', icon: 'ri-coupon-line' },
    { label: 'Documentation repository', icon: 'ri-book-line' },
    { label: 'Team of developers', icon: 'ri-team-line' },
  ];

  // State
  activeTabIndex = signal<number>(0);
  selectedBU = signal<string>('MICROSOFT');

  // Table Configuration
  tableColumns: ITableColumn[] = [
    { key: 'title', label: 'Title:' },
    { key: 'businessUnitId.name', label: 'Unit:' },
    { key: 'version', label: 'Version:' },
    { key: 'associated', label: 'Associated:' },
    { key: 'file', label: 'File:' },
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
  setTab(tabIndex: number): void {
    this.activeTabIndex.set(tabIndex);
  }

  setBU(buName: string): void {
    this.selectedBU.set(buName);
  }
}
