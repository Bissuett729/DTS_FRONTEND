import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { IToolTemplate } from '../../../domain';
import { ToolsTemplatesRepository } from '../../../domain/repositories';

@Injectable({
  providedIn: 'root'
})
export class ToolsTemplateApiRepository extends ToolsTemplatesRepository {
  private http = inject(HttpClient);
  private toolsTemplateURL = `${environment.userURL}/v1/tool-templates`;

  getTemplateTools(): Observable<IToolTemplate[]> {
    return this.http.get<IToolTemplate[]>(this.toolsTemplateURL);
  }
}

export const TOOLS_TEMPLATES_REPOSITORY_PROVIDER = {
  provide: ToolsTemplatesRepository,
  useExisting: ToolsTemplateApiRepository
};