import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DtsModalLayout, DtsButton, DtsCard, DtsInput, DtsSelect } from "../../../../shared";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersRequestService } from '../../services/users-request.service';
import { UsersState } from '../../state/users-state';
import { ICreateUpdateUser, IUser } from '../../interfaces/users.interface';
import { DtsToggle } from "../../../../shared/components/toggle/toggle.component";

@Component({
  selector: 'dts-update-user',
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
    DtsToggle
],
  templateUrl: './update-user.html'
})
export class UpdateUser implements OnInit {

  private readonly usersRequest = inject(UsersRequestService);
  private readonly usersState = inject(UsersState);
  readonly userData = inject<IUser>(MAT_DIALOG_DATA);

  private readonly dialogRef = inject(MatDialogRef<UpdateUser>);

  roles$ = this.usersState.roles;
  loadingRoles$ = this.usersState.loadingRoles;
  loadingUpdateUser$ = this.usersState.loadingUpdateUser;

  onClose = () => this.dialogRef.close();

  // Grupo de formulario
  readonly userForm = new FormGroup({
    username: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    email: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    clock: new FormControl<number | null>(null, { validators: [Validators.required, Validators.min(1)] }),
    roleIds: new FormControl<string[]>([], { nonNullable: true, validators: [Validators.required] }),
    authorized: new FormControl<boolean>(false, { nonNullable: true })
  });



  readonly modalConfig = {
    title: 'Actualizar Usuario',
    subtitle: 'Actualiza la información del usuario seleccionado.',
    icon: 'ri-user-line',
  }

  ngOnInit(): void {

    const roles = this.userData.roleIds.map(role => role._id);

    this.userForm.patchValue({
      username: this.userData.username,
      email: this.userData.email,
      clock: this.userData.clock,
      roleIds: roles,
      authorized: this.userData.authorized
    });

    this.getRoles();
  }

  async getRoles() {
    await this.usersRequest.getRoles();
  }

  async updateUser() {
    if (this.userForm.valid) {
      console.log('User data:', this.userForm.value);
      await this.usersRequest.updateUser(this.userData._id, this.userForm.value as Partial<ICreateUpdateUser>)
      this.dialogRef.close(this.userForm.value);
    }
  }

}
