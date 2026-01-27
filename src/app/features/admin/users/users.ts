import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Card, FoxcodeInput, FoxcodeButton, Loading } from "../../../shared/components";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil, debounceTime } from 'rxjs';
import { UsersStateService } from './shared/services/users.state.service';
import { UsersSocketManagerService } from './core/sockets/sockets.manager';
import { OpenModal } from '../../../core/infrastructure/repositories/open-modal.repository';
import { UpdateUser } from './shared/modals/update-user/update-user';

@Component({
  selector: 'foxcode-users',
  standalone: true,
  imports: [Card, FoxcodeInput, FoxcodeButton, ReactiveFormsModule, CommonModule, Loading],
  providers: [UsersStateService, UsersSocketManagerService],
  templateUrl: './users.html',
  styles: ``,
})
export class Users implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private destroy$ = new Subject<void>();

  private readonly stateService = inject(UsersStateService);
  private readonly socketManager = inject(UsersSocketManagerService);

  filterForm: FormGroup = this.fb.group({
    username: ['', [Validators.minLength(2)]]
  });

  ngOnInit(): void {
    this.socketManager.connect(this.destroy$);
    this.socketManager.setupListeners(this.destroy$);
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.socketManager.disconnect();
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

  get socketConnected() {
    return this.socketManager.socketConnected;
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