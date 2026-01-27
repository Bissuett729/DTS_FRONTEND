import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ITool } from '../../../domain/interfaces/tool.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

export interface CreateToolDto {
  title: string;
  link: string;
  toolMode: string[];
  businessUnitId: string;
  active?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class CreateToolUseCase {
  constructor(private http: HttpClient) {}

  execute(tool: CreateToolDto): Observable<ITool> {
    return this.http.post<ITool>(`${environment.userURL}/v1/tools`, tool);
  }
}
