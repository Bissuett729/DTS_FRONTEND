import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ITool } from '../../../domain/interfaces/tool.interface';
import { ToolsApiRepository } from '../../../infrastructure';

@Injectable({
  providedIn: 'root',
})
export class GetToolsUseCase {
  constructor(private toolsRepository: ToolsApiRepository) {}

  execute(): Observable<ITool[]> {
    return this.toolsRepository.getTools();
  }
}
