import { Injectable, signal } from '@angular/core';
import { IUser } from '../interfaces/users.interface';
import { IRoles } from '../interfaces/roles.interface';

@Injectable({
  providedIn: 'root'
})
export class UsersState {

    users = signal<IUser[]>([]);
    loadingUsers = signal<boolean>(false);

    roles = signal<IRoles[]>([]);
    loadingRoles = signal<boolean>(false);

    loadingCreateUser = signal<boolean>(false);
    
    loadingUpdateUser = signal<boolean>(false);
 
}
