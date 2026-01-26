import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Card, FoxcodeInput, FoxcodeButton } from "../../../shared/components";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil, debounceTime } from 'rxjs';
import { UsersStateService } from './shared/services/users.state.service';
import { UsersSocketManagerService } from './shared/services/users.socket-manager.service';

/**
 * Componente de gestión de usuarios
 * Responsable únicamente de la presentación y delegando lógica a servicios
 */
@Component({
  selector: 'foxcode-users',
  standalone: true,
  imports: [Card, FoxcodeInput, FoxcodeButton, ReactiveFormsModule, CommonModule],
  providers: [UsersStateService, UsersSocketManagerService],
  templateUrl: './users.html',
  styles: ``,
})
export class Users implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private destroy$ = new Subject<void>();

  // Servicios
  stateService = inject(UsersStateService);
  socketManager = inject(UsersSocketManagerService);

  // Math for template
  Math = Math;

  // Formulario de filtros
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

  /**
   * Configurar listeners para cambios en filtros
   */
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

  /**
   * Cargar usuarios con filtros actuales
   */
  loadUsers(): void {
    const filters = {
      search: this.searchControl.value || undefined
    };
    this.stateService.loadUsers(filters, this.destroy$);
  }

  /**
   * Aplicar filtros manualmente
   */
  applyFilters(): void {
    if (this.filterForm.valid) {
      this.loadUsers();
    }
  }

  /**
   * Reiniciar filtros y recargar
   */
  resetFilters(): void {
    this.filterForm.reset({ search: '' });
    this.loadUsers();
  }

  // Getters para acceso en template
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
}