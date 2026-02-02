import { Component, inject, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { ToolsStateService } from './shared/services/tools.state.service';
import { CreateTool } from './shared/modals/create-tool/create-tool';
import { UpdateTool } from './shared/modals/update-tool/update-tool';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ITool, IBusinessUnit } from '../../../../core/domain';
import { OpenModal } from '../../../../core/infrastructure/repositories/modal/open-modal.repository';
import { FoxcodeInput } from '../../../../shared';
import { FoxcodeButton, FoxcodeExpander, FoxcodeCard } from '../../../../shared/components';
import { InitToolsSockets } from './core/sockets/init-sockets.socket';

@Component({
  selector: 'foxcode-tools',
  standalone: true,
  imports: [CommonModule, FoxcodeButton, FoxcodeInput, FoxcodeExpander, ReactiveFormsModule, FoxcodeCard],
  templateUrl: './tools.html',
  styles: ``,
})
export class Tools implements OnInit, OnDestroy {
  private toolsState = inject(ToolsStateService);
  private toolsManager = inject(InitToolsSockets);
  private destroy$ = new Subject<void>();

  loading = this.toolsState.loading;
  toolsGrouped = this.toolsState.toolsGrouped;

  searchControl = new FormControl('');
  searchTerm = signal<string>('');
  expandedGroups = signal<Set<string>>(new Set());
  multiExpand = signal<boolean>(false);

  totalTools = computed(() => {
    return this.toolsGrouped().reduce((total, group) => total + group.tools.length, 0);
  });

  filteredGroups = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.toolsGrouped();

    return this.toolsGrouped()
      .map(group => ({
        ...group,
        tools: group.tools.filter((tool: ITool) => {
          const title = tool.title?.toLowerCase() || '';
          const link = tool.link?.toLowerCase() || '';
          const buName = group.bu?.toLowerCase() || '';

          return title.includes(term) || link.includes(term) || buName.includes(term);
        })
      }))
      .filter(group => group.tools.length > 0);
  });

  ngOnInit(): void {
    this.toolsState.loadTools(this.destroy$);

    // Setup socket connection and listeners
    this.toolsManager.InitSockets();

    this.searchControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this.searchTerm.set(value || '');
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleGroup(buName: string): void {
    this.expandedGroups.update(groups => {
      const newGroups = new Set(groups);
      if (newGroups.has(buName)) {
        newGroups.delete(buName);
      } else {
        if (!this.multiExpand()) {
          // Solo uno abierto (acordeón)
          newGroups.clear();
        }
        newGroups.add(buName);
      }
      return newGroups;
    });
  }

  isGroupExpanded(buName: string): boolean {
    return this.expandedGroups().has(buName);
  }

  onExpanderChange(buName: string, expanded: boolean): void {
    this.expandedGroups.update(groups => {
      const newGroups = new Set(groups);
      if (expanded) {
        if (!this.multiExpand()) {
          newGroups.clear();
        }
        newGroups.add(buName);
      } else {
        newGroups.delete(buName);
      }
      return newGroups;
    });
  }

  expandAll(): void {
    const all = new Set(this.filteredGroups().map(g => g.bu));
    this.expandedGroups.set(all);
  }

  collapseAll(): void {
    this.expandedGroups.set(new Set());
  }

  openCreateModal(): void {
    OpenModal(CreateTool, {
      disableClose: false,
      autoFocus: true
    }).afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          this.toolsState.addTool(result);
        }
      });
  }

  openUpdateModal(tool: ITool): void {
    OpenModal(UpdateTool, {
      disableClose: false,
      autoFocus: true,
      data: { tool }
    }).afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          this.toolsState.updateTool(result);
        }
      });
  }

  getBusinessUnitName(tool: any): string {
    if (typeof tool.businessUnitId === 'object' && tool.businessUnitId !== null) {
      return (tool.businessUnitId as IBusinessUnit).name || 'N/A';
    }
    return 'N/A';
  }

  getToolModeLabel(mode: string): string {
    const labels: Record<string, string> = {
      development: 'Dev',
      production: 'Prod'
    };
    return labels[mode] || mode;
  }

  getToolModeColor(mode: string): string {
    const colors: Record<string, string> = {
      development: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      production: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
    };
    return colors[mode] || 'bg-gray-100 text-gray-700';
  }

  get searchControlValue() {
    return this.searchControl.value;
  }
}
