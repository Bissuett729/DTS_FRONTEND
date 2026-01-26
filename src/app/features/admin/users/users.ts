import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Card, FoxcodeInput, FoxcodeButton, Loading } from "../../../shared/components";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil, debounceTime } from 'rxjs';
import { UsersStateService } from './shared/services/users.state.service';
import { UsersSocketManagerService } from './core/sockets/sockets.manager';

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
    search: ['', [Validators.minLength(2)]]
  });

  ngOnInit(): void {
    this.socketManager.connect(this.destroy$);
    this.socketManager.setupListeners(this.destroy$);
    this.loadUsers();
    this.setupFilters();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.socketManager.disconnect();
    this.stateService.clear();
  }

  private setupFilters(): void {
    this.filterForm.valueChanges
      .pipe(
        debounceTime(300),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.stateService.resetPagination();
        this.loadUsers();
      });
  }

  loadUsers(): void {
    const filters = {
      search: this.searchControl.value || undefined
    };
    this.stateService.loadUsers(filters, this.destroy$);
  }

  applyFilters(): void {
    if (this.filterForm.valid) {
      this.loadUsers();
    }
  }

  resetFilters(): void {
    this.filterForm.reset({ search: '' });
    this.loadUsers();
  }


  get searchControl() {
    return this.filterForm.controls['search'] as FormControl;
  }

  get searchControlValue() {
    return this.filterForm.controls['search'].value;
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

  toggleAuthorization(userId: string, currentStatus: boolean): void {
    // TODO: Implement API call to authorize/unauthorize user
    console.log(`Toggling authorization for user ${userId} from ${currentStatus} to ${!currentStatus}`);
    
    // Example API call structure:
    // this.userService.updateAuthorization(userId, !currentStatus)
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe({
    //     next: (updatedUser) => {
    //       this.stateService.updateUser(updatedUser);
    //       // Show success notification
    //     },
    //     error: (error) => {
    //       console.error('Error updating authorization:', error);
    //       // Show error notification
    //     }
    //   });
  }
}