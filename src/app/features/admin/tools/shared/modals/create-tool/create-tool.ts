import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { CreateToolUseCase } from '../../../../../../core/application/use-cases/tools';
import { GetBusinessUnitsUseCase } from '../../../../../../core/application/use-cases/users';
import { IBusinessUnit } from '../../../../../../core/domain/interfaces/tool.interface';
import { FoxcodeInput, FoxcodeButton, FoxcodeSelect } from '../../../../../../shared/components';
import { FoxcodeModalLayout } from '../../../../../../shared/layouts/foxcode-modal-layout/foxcode-modal-layout';

@Component({
  selector: 'foxcode-create-tool',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FoxcodeInput, FoxcodeButton, FoxcodeModalLayout, FoxcodeSelect],
  templateUrl: './create-tool.html',
  styles: []
})
export class CreateTool implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<CreateTool>);
  private destroy$ = new Subject<void>();

  private createToolUseCase = inject(CreateToolUseCase);
  private getBusinessUnitsUseCase = inject(GetBusinessUnitsUseCase);

  loading = signal<boolean>(true);
  submitting = signal<boolean>(false);
  businessUnits = signal<IBusinessUnit[]>([]);

  toolModes = [
    { value: 'development', label: 'Development' },
    { value: 'production', label: 'Production' }
  ];

  createForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    link: ['', [Validators.required]],
    toolMode: [['development'], [Validators.required]],
    businessUnitId: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.loadBusinessUnits();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadBusinessUnits(): void {
    this.getBusinessUnitsUseCase.execute()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (businessUnits) => {
          this.businessUnits.set(businessUnits);
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error loading business units:', error);
          this.loading.set(false);
        }
      });
  }

  toggleToolMode(mode: string): void {
    const currentModes = this.createForm.get('toolMode')?.value || [];
    if (currentModes.includes(mode)) {
      const updated = currentModes.filter((m: string) => m !== mode);
      this.createForm.patchValue({ toolMode: updated.length > 0 ? updated : [mode] });
    } else {
      this.createForm.patchValue({ toolMode: [...currentModes, mode] });
    }
  }

  isToolModeSelected(mode: string): boolean {
    return this.createForm.get('toolMode')?.value?.includes(mode) || false;
  }

  onSubmit(): void {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    const formValue = this.createForm.value;

    this.createToolUseCase.execute(formValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (createdTool) => {
          this.submitting.set(false);
          this.dialogRef.close(createdTool);
        },
        error: (error) => {
          console.error('Error creating tool:', error);
          this.submitting.set(false);
        }
      });
  }

  close(): void {
    this.dialogRef.close();
  }

  get titleControl() {
    return this.createForm.get('title') as FormControl;
  }

  get linkControl() {
    return this.createForm.get('link') as FormControl;
  }

  get businessUnitControl() {
    return this.createForm.get('businessUnitId') as FormControl;
  }
}
