import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DeleteToolUseCase {
  constructor(private http: HttpClient) {}

  execute(toolId: string): Observable<any> {
    return this.http.delete(`${environment.userURL}/v1/tools/${toolId}`);
  }
}
