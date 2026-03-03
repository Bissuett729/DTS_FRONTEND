import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DtsModalLayout, DtsButton, DtsCard, DtsInput, DtsSelect } from '../../../../shared';
import { MatDialogRef } from '@angular/material/dialog';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UsersRequestService } from '../../services/users-request.service';
import { UsersState } from '../../state/users-state';
import { ICreateUpdateUser } from '../../interfaces/users.interface';

@Component({
  selector: 'dts-new-user',
  standalone: true,
  imports: [
    CommonModule,
    DtsModalLayout,
    DtsButton,
    DtsCard,
    DtsInput,
    FormsModule,
    ReactiveFormsModule,
    DtsSelect,
  ],
  templateUrl: './new-user.html',
})
export class NewUser implements OnInit {
  private readonly usersRequest = inject(UsersRequestService);
  private readonly usersState = inject(UsersState);
  private readonly dialogRef = inject(MatDialogRef<NewUser>);

  roles$ = this.usersState.roles;
  loadingRoles$ = this.usersState.loadingRoles;
  loadingCreateUser$ = this.usersState.loadingCreateUser;

  onClose = () => this.dialogRef.close();

  // Grupo de formulario
  readonly userForm = new FormGroup({
    username: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    clock: new FormControl<number | null>(null, {
      validators: [Validators.required, Validators.min(1)],
    }),
    roleIds: new FormControl<string[]>([], {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  readonly modalConfig = {
    title: 'Nuevo Usuario',
    subtitle: 'Crea un nuevo usuario para acceder a la plataforma.',
    icon: 'ri-user-add-line',
  };

  ngOnInit(): void {
    this.getRoles();
  }

  async getRoles() {
    await this.usersRequest.getRoles();
  }

  async createUser() {
    if (this.userForm.valid) {
      // console.log('User data:', this.userForm.value);
      await this.usersRequest.createUser(this.userForm.value as Partial<ICreateUpdateUser>);
      // Aquí iría la lógica para crear el usuario
      this.dialogRef.close(this.userForm.value);
    }
  }
}
