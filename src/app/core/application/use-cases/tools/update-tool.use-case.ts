import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ITool } from '../../../domain/interfaces/tool.interface';
import { ToolsApiRepository } from '../../../infrastructure';

export interface UpdateToolDto {
  title?: string;
  link?: string;
  toolMode?: string[];
  businessUnitId?: string;
  active?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class UpdateToolUseCase {

  constructor(private toolsRepository: ToolsApiRepository) { }

  execute(toolId: string, tool: UpdateToolDto): Observable<ITool> {
    return this.toolsRepository.updateTool(toolId, tool);
  }
}
