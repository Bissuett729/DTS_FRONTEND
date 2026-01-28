import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IToolGroupedByBusinessUnit } from '../../../domain/interfaces';
import { ToolsApiRepository } from '../../../infrastructure';
@Injectable({
  providedIn: 'root',
})
export class GetToolsGroupedByBusinessUnitUseCase {
  constructor(private toolsRepository: ToolsApiRepository) { }

  execute(): Observable<IToolGroupedByBusinessUnit[]> {
    return this.toolsRepository.getGroupedByBusinessUnit();
  }
}
