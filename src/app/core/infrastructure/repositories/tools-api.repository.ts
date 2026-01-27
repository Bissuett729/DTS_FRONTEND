import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ToolsRepository } from '../../domain/repositories/tools.repository';
import { ITool } from '../../domain/interfaces/tool.interface';

@Injectable({
  providedIn: 'root'
})
export class ToolsApiRepository extends ToolsRepository {
  private http = inject(HttpClient);
  private toolsURL = `${environment.userURL}/v1/tools`;

  getTools(): Observable<ITool[]> {
    return this.http.get<ITool[]>(this.toolsURL);
  }
}
