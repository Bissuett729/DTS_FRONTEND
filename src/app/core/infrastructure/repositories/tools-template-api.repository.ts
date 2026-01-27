import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ToolsTemplatesRepository } from '../../domain/repositories/tools-templates.repository';
import { IToolTemplate } from '../../domain';

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
