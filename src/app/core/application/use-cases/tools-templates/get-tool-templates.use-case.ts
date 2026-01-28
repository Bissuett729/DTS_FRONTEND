import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { IToolTemplate } from '../../../domain/interfaces/user.interface';
import { ToolsTemplateApiRepository } from '../../../infrastructure';

@Injectable({
  providedIn: 'root',
})
export class GetToolTemplatesUseCase {
  private toolsTemplatesRepository = inject(ToolsTemplateApiRepository);

  execute(): Observable<IToolTemplate[]> {
    return this.toolsTemplatesRepository.getTemplateTools();
  }
}
