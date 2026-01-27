import { Injectable, signal } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { GetToolsGroupedByBusinessUnitUseCase } from '../../../../../core/application/use-cases/tools';
import { IToolGroupedByBusinessUnit } from '../../../../../core/domain';

@Injectable()
export class ToolsStateService {
  toolsGrouped = signal<IToolGroupedByBusinessUnit[]>([]);
  loading = signal<boolean>(false);

  constructor(private getToolsGroupedUseCase: GetToolsGroupedByBusinessUnitUseCase) {}

  loadTools(destroy$: Subject<void>): void {
    if (this.loading()) return;

    this.loading.set(true);

    this.getToolsGroupedUseCase.execute()
      .pipe(takeUntil(destroy$))
      .subscribe({
        next: (grouped) => {
          this.toolsGrouped.set(grouped);
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error loading tools:', error);
          this.loading.set(false);
        }
      });
  }

  addTool(tool: any): void {
    this.toolsGrouped.update(groups => {
      const buName = typeof tool.businessUnitId === 'object' 
        ? tool.businessUnitId.name 
        : tool.businessUnitId;
      
      const groupIndex = groups.findIndex(g => g.bu === buName);
      
      if (groupIndex >= 0) {
        const updatedGroups = [...groups];
        updatedGroups[groupIndex] = {
          ...updatedGroups[groupIndex],
          tools: [tool, ...updatedGroups[groupIndex].tools]
        };
        return updatedGroups;
      } else {
        return [...groups, { bu: buName, tools: [tool] }];
      }
    });
  }

  updateTool(updatedTool: any): void {
    this.toolsGrouped.update(groups =>
      groups.map(group => ({
        ...group,
        tools: group.tools.map(t => {
          const toolIdToMatch = updatedTool._id || updatedTool.toolId;
          if (t._id === toolIdToMatch) {
            return {
              ...t,
              ...updatedTool,
              _id: t._id,
            };
          }
          return t;
        })
      }))
    );
  }

  removeTool(toolId: string): void {
    this.toolsGrouped.update(groups =>
      groups.map(group => ({
        ...group,
        tools: group.tools.filter(t => t._id !== toolId)
      })).filter(group => group.tools.length > 0)
    );
  }

  clear(): void {
    this.toolsGrouped.set([]);
    this.loading.set(false);
  }
}
