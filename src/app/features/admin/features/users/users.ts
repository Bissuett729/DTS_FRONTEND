import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { UsersStateService } from './shared/services/users.state.service';
import { UpdateUser } from './shared/modals/update-user/update-user';
import { OpenModal } from '../../../../core/infrastructure/repositories/modal/open-modal.repository';
import { FoxcodeInput } from '../../../../shared';
import { FoxcodeCard, FoxcodeButton } from '../../../../shared/components';
import { InitUserSockets } from './core/sockets/init-sockets.socket';

@Component({
  selector: 'foxcode-users',
  standalone: true,
  imports: [FoxcodeCard, FoxcodeInput, FoxcodeButton, ReactiveFormsModule, CommonModule],
  templateUrl: './users.html',
  styles: ``,
})
export class Users implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private destroy$ = new Subject<void>();

  private readonly stateService = inject(UsersStateService);
  private readonly initSockets = inject(InitUserSockets);

  filterForm: FormGroup = this.fb.group({
    username: ['', [Validators.minLength(2)]]
  });

  ngOnInit(): void {
    this.initSockets.InitSockets();
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.stateService.clear();
  }

  loadUsers(): void {
    const searchValue = this.searchControl.value;
    const filters: any = {
      page: this.currentPage(),
      limit: this.pageSize()
    };

    if (searchValue) {
      // Si es un número, buscar por clock, sino por username
      const isNumeric = /^\d+$/.test(searchValue);
      if (isNumeric) {
        filters.clock = parseInt(searchValue, 10);
      } else {
        filters.username = searchValue;
      }
    }

    this.stateService.loadUsers(filters, this.destroy$);
  }

  applyFilters(): void {
    if (this.filterForm.valid) {
      this.stateService.resetPagination();
      this.loadUsers();
    }
  }

  resetFilters(): void {
    this.filterForm.reset({ username: '' });
    this.loadUsers();
  }


  get searchControl() {
    return this.filterForm.controls['username'] as FormControl;
  }

  get searchControlValue() {
    return this.filterForm.controls['username'].value;
  }

  get users() {
    return this.stateService.users;
  }

  get loading() {
    return this.stateService.loading;
  }

  get totalUsers() {
    return this.stateService.totalUsers;
  }

  get currentPage() {
    return this.stateService.currentPage;
  }

  get pageSize() {
    return this.stateService.pageSize;
  }

  openEditUserModal(userId: string): void {
    const dialogRef = OpenModal(UpdateUser, { data: userId });
    
    dialogRef.afterClosed().subscribe((updatedUser) => {
      if (updatedUser) {
        // Update the user in the list
        this.stateService.updateUserInList(updatedUser);
      }
    });
  }

  toggleAuthorization(userId: string, currentStatus: boolean): void {
    this.stateService.updateUserById(userId, { authorized: !currentStatus }, this.destroy$);
  }
}