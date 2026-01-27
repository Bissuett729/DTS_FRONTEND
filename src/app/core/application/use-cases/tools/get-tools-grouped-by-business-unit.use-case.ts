import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { IToolGroupedByBusinessUnit } from '../../../domain/interfaces';



@Injectable({
  providedIn: 'root',
})
export class GetToolsGroupedByBusinessUnitUseCase {
  private http = inject(HttpClient);
  private toolsURL = `${environment.userURL}/v1/tools/grouped-by-business-unit`;

  execute(): Observable<IToolGroupedByBusinessUnit[]> {
    return this.http.get<IToolGroupedByBusinessUnit[]>(this.toolsURL);
  }
}
