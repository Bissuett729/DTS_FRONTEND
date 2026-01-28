import { Component, inject, signal } from '@angular/core';
import { Card, FoxcodeInput, FoxcodeButton } from "../../../../shared/components";
import { Subject, takeUntil } from 'rxjs';
import { DepartmentsStateService } from './shared/services/departments.state.service';
import { FormControl } from '@angular/forms';
import { IDepartment } from '../../../../core/domain';
import { CreateDepartment, UpdateDepartment } from './shared/modals';
import { OpenModal } from '../../../../core/infrastructure';
import { InitDepartmentsSockets } from './core/sockets/init-sockets.socket';

@Component({
  selector: 'foxcode-departments',
  imports: [Card, FoxcodeInput, FoxcodeButton],
  templateUrl: './departments.html',
  styles: ``,
})
export class Departments {

  private departmentsState = inject(DepartmentsStateService);
  private socketManager = inject(InitDepartmentsSockets);
  private destroy$ = new Subject<void>();

  searchControl = new FormControl('');
  searchTerm = signal<string>('');

  loading = this.departmentsState.loading;
  departments = this.departmentsState.departments;

  ngOnInit(): void {
    this.departmentsState.loadDepartments(this.destroy$);

    // Setup socket connection and listeners
    this.socketManager.InitSockets();

    this.searchControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this.searchTerm.set(value || '');
      });
  }

  openCreateModal(): void {
    OpenModal(CreateDepartment, {
      disableClose: false,
      autoFocus: true
    }).afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          this.departmentsState.addDepartment(result);
        }
      });
  }

  openUpdateModal(department: IDepartment): void {
    OpenModal(UpdateDepartment, {
      disableClose: false,
      autoFocus: true,
      data: { department }
    }).afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          this.departmentsState.updateDepartment(result);
        }
      });
  }

  get searchControlValue() {
    return this.searchControl.value;
  }
}
