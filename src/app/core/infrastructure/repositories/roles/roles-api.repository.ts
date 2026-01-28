import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import {
  IRole,
} from '../../../domain/interfaces';
import { CreateRoleDto, RolesRepository, UpdateRoleDto } from '../../../domain';

@Injectable({
  providedIn: 'root',
})
export class RolesApiRepository extends RolesRepository {
  private readonly apiUrl = `${environment.userURL}/v1/roles`;

  constructor(private http: HttpClient) {
    super();
  }

  getRoles(): Observable<IRole[]> {

    return this.http.get<IRole[]>(this.apiUrl);
  }

  createRole(role: CreateRoleDto): Observable<IRole> {
    return this.http.post<IRole>(this.apiUrl, role);
  }

  updateRole(roleId: string, role: UpdateRoleDto): Observable<IRole> {
    const url = `${this.apiUrl}/${roleId}`;
    return this.http.put<IRole>(url, role);
  }

  deleteRole(roleId: string): Observable<void> {
    const url = `${this.apiUrl}/${roleId}`;
    return this.http.delete<void>(url);
  }
}

export const ROLES_REPOSITORY_PROVIDER = {
  provide: RolesRepository,
  useExisting: RolesApiRepository
};