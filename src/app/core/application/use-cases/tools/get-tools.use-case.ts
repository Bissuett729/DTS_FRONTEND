import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ITool } from '../../../domain/interfaces/tool.interface';
import { ToolsRepository } from '../../../domain/repositories/tools.repository';

@Injectable({
  providedIn: 'root',
})
export class GetToolsUseCase {
  constructor(private toolsRepository: ToolsRepository) {}

  execute(): Observable<ITool[]> {
    return this.toolsRepository.getTools();
  }
}
