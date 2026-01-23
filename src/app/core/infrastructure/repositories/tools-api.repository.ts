import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ToolsRepository } from '../../domain/repositories/tools.repository';
import { Tool } from '../../domain/interfaces/tool.interface';

@Injectable({
  providedIn: 'root'
})
export class ToolsApiRepository extends ToolsRepository {
  private http = inject(HttpClient);
  private toolsURL = `${environment.userURL}/tools`;

  getTools(): Observable<Tool[]> {
    return this.http.get<Tool[]>(this.toolsURL);
  }
}
