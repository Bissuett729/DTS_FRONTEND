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
} from '../../domain/interfaces/user.interface';

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
      if (filters.search) params = params.set('search', filters.search);
      if (filters.roleId) params = params.set('roleId', filters.roleId);
      if (filters.departmentId) params = params.set('departmentId', filters.departmentId);
      if (filters.businessUnit) params = params.set('businessUnit', filters.businessUnit);
      if (filters.active !== undefined) params = params.set('active', filters.active.toString());
      if (filters.page) params = params.set('page', filters.page.toString());
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
    return this.http.patch<IUser>(`${this.apiUrl}/${userId}`, user);
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
}
