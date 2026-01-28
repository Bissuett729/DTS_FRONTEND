import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { ITool } from '../../../domain/interfaces/tool.interface';
import { CreateToolDto, IToolGroupedByBusinessUnit, UpdateToolDto } from '../../../domain';
import { ToolsRepository } from '../../../domain/repositories';

@Injectable({
  providedIn: 'root'
})
export class ToolsApiRepository extends ToolsRepository {
  private http = inject(HttpClient);
  private toolsURL = `${environment.userURL}/v1/tools`;

  getTools(): Observable<ITool[]> {
    return this.http.get<ITool[]>(this.toolsURL);
  }

  createTool(tool: CreateToolDto): Observable<ITool> {
    return this.http.post<ITool>(this.toolsURL, tool);
  }

  updateTool(toolId: string, tool: UpdateToolDto): Observable<ITool> {
    return this.http.put<ITool>(`${this.toolsURL}/${toolId}`, tool);
  }

  deleteTool(toolId: string): Observable<ITool> {
    return this.http.delete<ITool>(`${this.toolsURL}/${toolId}`);
  }

  getGroupedByBusinessUnit(): Observable<IToolGroupedByBusinessUnit[]> {
    return this.http.get<IToolGroupedByBusinessUnit[]>(`${this.toolsURL}/grouped-by-business-unit`);
  }
}

export const TOOLS_REPOSITORY_PROVIDER = {
  provide: ToolsRepository,
  useExisting: ToolsApiRepository
};