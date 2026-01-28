import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ITool } from '../../../domain/interfaces/tool.interface';
import { CreateToolDto } from '../../../domain';
import { ToolsApiRepository } from '../../../infrastructure';

@Injectable({
  providedIn: 'root',
})
export class CreateToolUseCase {
  constructor(private toolsRepository: ToolsApiRepository) { }

  execute(tool: CreateToolDto): Observable<ITool> {
    return this.toolsRepository.createTool(tool);
  }
}
