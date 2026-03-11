import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DtsCard, DtsInput, DtsButton } from "../../shared";
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersRequestService } from './services/users-request.service';
import { UsersState } from './state/users-state';
import { OpenModal } from '../../core/infrastructure';
import { NewUser } from './modals/new-user/new-user';
import { UpdateUser } from './modals/update-user/update-user';
import { IUser } from './interfaces/users.interface';
import { UsersSocketManager } from '../../shared/services/users-socket-manager.service';

@Component({
  selector: 'foxcode-users',
  standalone: true,
  imports: [CommonModule, DtsCard, DtsInput, DtsButton, FormsModule, ReactiveFormsModule],
  templateUrl: './users.html'
})
export class UsersComponent implements OnInit, OnDestroy {

  private readonly userRequest = inject(UsersRequestService);
  private readonly userState = inject(UsersState);
  private readonly usersSocketManager = inject(UsersSocketManager);

  userFilter = new FormControl('', { validators: [Validators.minLength(3)] });

  users$ = this.userState.users;
  loadingUsers$ = this.userState.loadingUsers;

  ngOnInit(): void {
    this.getUsers();

    this.usersSocketManager.connect();
    this.usersSocketManager.onUserCreated(() => this.userRequest.getUsers(false));
    this.usersSocketManager.onUserUpdated(() => this.userRequest.getUsers(false));
    this.usersSocketManager.onUserDeleted(() => this.userRequest.getUsers(false));
  }

  ngOnDestroy(): void {
    this.usersSocketManager.disconnect();
  }

  private async getUsers() {
    await this.userRequest.getUsers();
  }

  openUpdateUserModal(data: IUser) {
    OpenModal(UpdateUser, { data });
  }

  openNewUserModal() {
    OpenModal(NewUser);
  }

  deleteUser(userId: string) {
    this.userRequest.deleteUser(userId);
  }

}
