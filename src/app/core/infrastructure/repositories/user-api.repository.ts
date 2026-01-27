import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { UserRepository } from '../../domain/repositories/user.repository';
import {
  IUser,
  ICreateUserDto,
  IUpdateUserDto,
  IUserFilters,
  IUserListResponse,
  IRole,
  IDepartment,
  IBusinessUnit,
  IToolsByBusinessUnit,
  IToolTemplate,
} from '../../domain/interfaces';

@Injectable({
  providedIn: 'root',
})
export class UserApiRepository extends UserRepository {
  private readonly apiUrl = `${environment.userURL}/v1/users`;

  constructor(private http: HttpClient) {
    super();
  }

  getUsers(filters?: IUserFilters): Observable<IUserListResponse> {
    let params = new HttpParams();

    if (filters) {
      if (filters.username) params = params.set('username', filters.username);
      if (filters.clock) params = params.set('clock', filters.clock.toString());
      if (filters.roleId) params = params.set('roleId', filters.roleId);
      if (filters.departmentId) params = params.set('departmentId', filters.departmentId);
      if (filters.businessUnitId) params = params.set('businessUnitId', filters.businessUnitId);
      if (filters.active !== undefined) params = params.set('active', filters.active.toString());
      if (filters.page !== undefined) params = params.set('page', filters.page.toString());
      if (filters.limit) params = params.set('limit', filters.limit.toString());
    }

    return this.http.get<IUserListResponse>(this.apiUrl, { params });
  }

  getUserById(userId: string): Observable<IUser> {
    return this.http.get<IUser>(`${this.apiUrl}/${userId}`);
  }

  createUser(user: ICreateUserDto): Observable<IUser> {
    return this.http.post<IUser>(this.apiUrl, user);
  }

  updateUser(userId: string, user: IUpdateUserDto): Observable<IUser> {
    return this.http.put<IUser>(`${this.apiUrl}/${userId}`, user);
  }

  deleteUser(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${userId}`);
  }

  toggleUserStatus(userId: string, active: boolean): Observable<IUser> {
    return this.http.patch<IUser>(`${this.apiUrl}/${userId}/status`, { active });
  }

  getRoles(): Observable<IRole[]> {
    return this.http.get<IRole[]>(`${environment.userURL}/v1/roles`);
  }

  getDepartments(businessUnit?: string): Observable<IDepartment[]> {
    let params = new HttpParams();
    if (businessUnit) {
      params = params.set('businessUnit', businessUnit);
    }
    return this.http.get<IDepartment[]>(`${environment.userURL}/v1/departments`, { params });
  }

  getBusinessUnits(): Observable<IBusinessUnit[]> {
    return this.http.get<IBusinessUnit[]>(`${environment.userURL}/v1/business-units`);
  }

  getToolsGroupedByBusinessUnit(): Observable<IToolsByBusinessUnit[]> {
    return this.http.get<IToolsByBusinessUnit[]>(`${environment.userURL}/v1/tools/grouped-by-business-unit`);
  }

  getToolTemplates(): Observable<IToolTemplate[]> {
    return this.http.get<IToolTemplate[]>(`${environment.userURL}/v1/tool-templates`);
  }

  applyToolTemplate(userId: string, templateId: string): Observable<IUser> {
    return this.http.post<IUser>(`${this.apiUrl}/${userId}/apply-tool-template`, { templateId });
  }
}
