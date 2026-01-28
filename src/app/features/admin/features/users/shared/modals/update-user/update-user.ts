import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject, takeUntil, forkJoin } from 'rxjs';
import { GetBusinessUnitsUseCase, GetDepartmentsUseCase, GetRolesUseCase, GetToolsGroupedByBusinessUnitUseCase, GetToolTemplatesUseCase, GetUserByIdUseCase, UpdateUserUseCase } from '../../../../../../../core/application';
import { IUser, IRole, IDepartment, IBusinessUnit, IToolsByBusinessUnit, IToolTemplate } from '../../../../../../../core/domain';
import { FoxcodeInput, FoxcodeSelect } from '../../../../../../../shared';
import { FoxcodeButton } from '../../../../../../../shared/components';
import { FoxcodeModalLayout } from '../../../../../../../shared/layouts/foxcode-modal-layout/foxcode-modal-layout';

@Component({
  selector: 'foxcode-update-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FoxcodeInput, FoxcodeButton, FoxcodeSelect, FoxcodeModalLayout],
  templateUrl: './update-user.html',
  styles: []
})
export class UpdateUser implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<UpdateUser>);
  private userId = inject<string>(MAT_DIALOG_DATA);
  private destroy$ = new Subject<void>();

  private getUserByIdUseCase = inject(GetUserByIdUseCase);
  private getRolesUseCase = inject(GetRolesUseCase);
  private getDepartmentsUseCase = inject(GetDepartmentsUseCase);
  private getBusinessUnitsUseCase = inject(GetBusinessUnitsUseCase);
  private getToolsGroupedByBusinessUnitUseCase = inject(GetToolsGroupedByBusinessUnitUseCase);
  private getToolTemplatesUseCase = inject(GetToolTemplatesUseCase);
  private updateUserUseCase = inject(UpdateUserUseCase);

  loading = signal<boolean>(true);
  submitting = signal<boolean>(false);
  user = signal<IUser | null>(null);
  roles = signal<IRole[]>([]);
  departments = signal<IDepartment[]>([]);
  businessUnits = signal<IBusinessUnit[]>([]);
  toolsByBusinessUnit = signal<IToolsByBusinessUnit[]>([]);
  selectedToolIds = signal<string[]>([]);
  expandedBusinessUnits = signal<Set<string>>(new Set());
  toolTemplates = signal<IToolTemplate[]>([]);

  updateForm: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.email]],
    clock: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
    roleIds: [[], [Validators.required]],
    departmentId: [''],
    businessUnitId: [''],
    active: [true],
    authorized: [false]
  });

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadData(): void {
    forkJoin({
      user: this.getUserByIdUseCase.execute(this.userId),
      roles: this.getRolesUseCase.execute(),
      departments: this.getDepartmentsUseCase.execute(),
      businessUnits: this.getBusinessUnitsUseCase.execute(),
      toolsByBu: this.getToolsGroupedByBusinessUnitUseCase.execute(),
      toolTemplates: this.getToolTemplatesUseCase.execute()
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ user, roles, departments, businessUnits, toolsByBu, toolTemplates }) => {
          this.user.set(user);
          this.roles.set(roles);
          this.departments.set(departments);
          this.businessUnits.set(businessUnits);
          this.toolsByBusinessUnit.set(toolsByBu);
          this.toolTemplates.set(toolTemplates);
          this.populateForm(user);
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error loading data:', error);
          this.loading.set(false);
        }
      });
  }

  private populateForm(user: IUser): void {
    this.updateForm.patchValue({
      username: user.username,
      email: user.email,
      clock: user.clock,
      roleIds: user.roleIds?.map(r => typeof r === 'string' ? r : r._id) || [],
      departmentId: typeof user.departmentId === 'string' ? user.departmentId : user.departmentId?._id || '',
      businessUnitId: typeof user.businessUnitId === 'string' ? user.businessUnitId : user.businessUnitId?._id || '',
      active: user.active,
      authorized: user.authorized
    });

    // Set selected tools
    const toolIds = user.tools?.map(t => typeof t === 'string' ? t : t._id) || [];
    this.selectedToolIds.set(toolIds);
  }

  toggleTool(toolId: string): void {
    const current = this.selectedToolIds();
    if (current.includes(toolId)) {
      this.selectedToolIds.set(current.filter(id => id !== toolId));
    } else {
      this.selectedToolIds.set([...current, toolId]);
    }
  }

  isToolSelected(toolId: string): boolean {
    return this.selectedToolIds().includes(toolId);
  }

  toggleBusinessUnit(buName: string): void {
    const expanded = new Set(this.expandedBusinessUnits());
    if (expanded.has(buName)) {
      expanded.delete(buName);
    } else {
      expanded.add(buName);
    }
    this.expandedBusinessUnits.set(expanded);
  }

  isBusinessUnitExpanded(buName: string): boolean {
    return this.expandedBusinessUnits().has(buName);
  }

  applyTemplate(templateId: string): void {
    if (!templateId) return;

    // Find the selected template
    const template = this.toolTemplates().find(t => t._id === templateId);
    if (!template || !template.tools) return;

    // Get current selected tool IDs
    const currentToolIds = new Set(this.selectedToolIds());

    // Add only the tools from template that are not already selected
    template.tools.forEach(toolId => {
      if (!currentToolIds.has(toolId)) {
        currentToolIds.add(toolId);
      }
    });

    // Update the selected tools
    this.selectedToolIds.set(Array.from(currentToolIds));
  }

  getToolsForSelectedBusinessUnit() {
    const businessUnitId = this.updateForm.get('businessUnitId')?.value;
    if (!businessUnitId) return [];

    const selectedBu = this.businessUnits().find(bu => bu._id === businessUnitId);
    if (!selectedBu) return [];

    const buGroup = this.toolsByBusinessUnit().find(group => group.bu === selectedBu.name);
    return buGroup?.tools || [];
  }

  onSubmit(): void {
    console.log('Ejecutando peticion par aactualizar usuario');

    if (this.updateForm.invalid) {
      this.updateForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    const formValue = this.updateForm.value;

    const updateData: any = {
      username: formValue.username,
      email: formValue.email,
      clock: parseInt(formValue.clock, 10),
      roleIds: formValue.roleIds,
      departmentId: formValue.departmentId || undefined,
      businessUnitId: formValue.businessUnitId || undefined,
      tools: this.selectedToolIds(),
      active: formValue.active,
      authorized: formValue.authorized
    };

    this.updateUserUseCase.execute(this.userId, updateData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedUser) => {
          this.submitting.set(false);
          this.dialogRef.close(updatedUser);
        },
        error: (error) => {
          console.error('Error updating user:', error);
          this.submitting.set(false);
        }
      });
  }

  close(): void {
    this.dialogRef.close();
  }

  get usernameControl() {
    return this.updateForm.get('username') as FormControl;
  }

  get emailControl() {
    return this.updateForm.get('email') as FormControl;
  }

  get clockControl() {
    return this.updateForm.get('clock') as FormControl;
  }

  get rolesControl() {
    return this.updateForm.get('roleIds') as FormControl;
  }

  get departmentControl() {
    return this.updateForm.get('departmentId') as FormControl;
  }

  get businessUnitControl() {
    return this.updateForm.get('businessUnitId') as FormControl;
  }
}
