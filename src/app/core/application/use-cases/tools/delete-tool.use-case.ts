import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ITool } from '../../../domain';
import { ToolsApiRepository } from '../../../infrastructure';

@Injectable({
  providedIn: 'root',
})
export class DeleteToolUseCase {

  constructor(private toolsRepository: ToolsApiRepository) { }

  execute(toolId: string): Observable<ITool> {
    return this.toolsRepository.deleteTool(toolId);
  }
}
