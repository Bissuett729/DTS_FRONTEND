import { inject, Injectable } from '@angular/core';
import { HttpService } from '../../../core/application/services/http';
import { environment } from '../../../../environments/environment';
import { UsersState } from '../state/users-state';
import { finalize } from 'rxjs';
import { AlertService } from '../../../shared';
import { ICreateUpdateUser, IResponseUsers } from '../interfaces/users.interface';
import { IRoles } from '../interfaces/roles.interface';

@Injectable({
  providedIn: 'root'
})
export class UsersRequestService {

  private readonly http = inject(HttpService);
  private readonly alert = inject(AlertService);
  private userState = inject(UsersState);

  private readonly userURL = environment.userURL;

  async getUsers(loading = true) {
    if (loading) {
      this.userState.loadingUsers.set(true);
    }
    this.http.get<IResponseUsers>(`${this.userURL}/v1/users`)
      .pipe(finalize(() => this.userState.loadingUsers.set(false)))
      .subscribe({
        next: (response) => {
          console.log('Users fetched successfully:', response);
          this.userState.users.set(response.users);
        },
        error: (error) => {
          console.error('Error fetching users:', error);
          this.alert.error('Failed to load users. Please try again later.');
        }
      });
  }

  async getRoles(loading = true) {
    if (loading) {
      this.userState.loadingRoles.set(true);
    }
    this.http.get<IRoles[]>(`${this.userURL}/v1/roles`)
      .pipe(finalize(() => this.userState.loadingRoles.set(false)))
      .subscribe({
        next: (response) => {
          console.log('Roles fetched successfully:', response);
          this.userState.roles.set(response);
        },
        error: (error) => {
          console.error('Error fetching roles:', error);
          this.alert.error('Failed to load roles. Please try again later.');
        }
      });
  }

  async createUser(userData: Partial<ICreateUpdateUser>) {

    const payload = {
      ...userData,
      clock: Number(userData.clock)
    };

    this.http.post(`${this.userURL}/v1/users`, payload)
      .subscribe({
        next: (response) => {
          console.log('User created successfully:', response);
          this.alert.success('User created successfully!');
        },
        error: (error) => {
          console.error('Error creating user:', error);
          this.alert.error('Failed to create user. Please check the data and try again.');
        }
      });
  }

  async updateUser(userId: string, userData: Partial<ICreateUpdateUser>) {

    const payload = {
      ...userData,
      clock: Number(userData.clock)
    };

    this.http.put(`${this.userURL}/v1/users/${userId}`, payload)
      .subscribe({
        next: (response) => {
          console.log('User updated successfully:', response);
          this.alert.success('User updated successfully!');
        },
        error: (error) => {
          console.error('Error updating user:', error);
          this.alert.error('Failed to update user. Please check the data and try again.');
        }
      });
  }
}
