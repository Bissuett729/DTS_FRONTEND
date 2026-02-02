import { Component, inject, signal } from '@angular/core';
import { FoxcodeCard, FoxcodeInput, FoxcodeButton } from "../../../../shared/components";
import { RolesStateService } from './shared/services/roles.state.service';
import { FormControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { IRole } from '../../../../core/domain';
import { OpenModal } from '../../../../core/infrastructure';
import { CreateRole, UpdateRole } from './shared/modals';
import { InitRolesSockets } from './core/sockets/init-sockets.socket';

@Component({
  selector: 'foxcode-roles',
  imports: [FoxcodeCard, FoxcodeInput, FoxcodeButton],
  templateUrl: './roles.html',
  styles: ``,
})
export class Roles {

  private rolesState = inject(RolesStateService);
  private socketManager = inject(InitRolesSockets);
  private destroy$ = new Subject<void>();

  searchControl = new FormControl('');
  searchTerm = signal<string>('');

  loading = this.rolesState.loading;
  roles = this.rolesState.roles;

  ngOnInit(): void {
    this.rolesState.loadRoles(this.destroy$);
    // Setup socket connection and listeners
    this.socketManager.InitSockets();

    this.searchControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this.searchTerm.set(value || '');
      });
  }

  openCreateModal(): void {
    OpenModal(CreateRole, {
      disableClose: false,
      autoFocus: true
    }).afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          this.rolesState.addRole(result);
        }
      });
  }

  openUpdateModal(role: IRole): void {
    OpenModal(UpdateRole, {
      disableClose: false,
      autoFocus: true,
      data: { role }
    }).afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          this.rolesState.updateRole(result);
        }
      });
  }

  get searchControlValue() {
    return this.searchControl.value;
  }

}
