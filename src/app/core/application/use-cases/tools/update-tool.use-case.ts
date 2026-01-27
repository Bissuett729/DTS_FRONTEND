import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ITool } from '../../../domain/interfaces/tool.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

export interface UpdateToolDto {
  title?: string;
  link?: string;
  toolMode?: string[];
  businessUnitId?: string;
  active?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class UpdateToolUseCase {
  constructor(private http: HttpClient) {}

  execute(toolId: string, tool: UpdateToolDto): Observable<ITool> {
    return this.http.put<ITool>(`${environment.userURL}/v1/tools/${toolId}`, tool);
  }
}
