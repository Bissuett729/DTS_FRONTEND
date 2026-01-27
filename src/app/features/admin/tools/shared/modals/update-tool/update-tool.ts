import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { UpdateToolUseCase } from '../../../../../../core/application/use-cases/tools';
import { GetBusinessUnitsUseCase } from '../../../../../../core/application/use-cases/users';
import { IBusinessUnit, ITool } from '../../../../../../core/domain/interfaces/tool.interface';
import { FoxcodeInput, FoxcodeButton, FoxcodeSelect } from '../../../../../../shared/components';
import { FoxcodeModalLayout } from '../../../../../../shared/layouts/foxcode-modal-layout/foxcode-modal-layout';

@Component({
  selector: 'foxcode-update-tool',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FoxcodeInput, FoxcodeButton, FoxcodeModalLayout, FoxcodeSelect],
  templateUrl: './update-tool.html',
  styles: []
})
export class UpdateTool implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<UpdateTool>);
  private data: { tool: ITool } = inject(MAT_DIALOG_DATA);
  private destroy$ = new Subject<void>();

  private updateToolUseCase = inject(UpdateToolUseCase);
  private getBusinessUnitsUseCase = inject(GetBusinessUnitsUseCase);

  loading = signal<boolean>(true);
  submitting = signal<boolean>(false);
  businessUnits = signal<IBusinessUnit[]>([]);
  tool: ITool = this.data.tool;

  toolModes = [
    { value: 'development', label: 'Development' },
    { value: 'production', label: 'Production' }
  ];

  updateForm: FormGroup = this.fb.group({
    title: [this.tool.title, [Validators.required, Validators.minLength(3)]],
    link: [this.tool.link, [Validators.required]],
    toolMode: [this.tool.toolMode || ['development'], [Validators.required]],
    businessUnitId: [
      typeof this.tool.businessUnitId === 'string' 
        ? this.tool.businessUnitId 
        : (this.tool.businessUnitId as any)?._id || '',
      [Validators.required]
    ],
    active: [this.tool.active ?? true]
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
    const currentModes = this.updateForm.get('toolMode')?.value || [];
    if (currentModes.includes(mode)) {
      const updated = currentModes.filter((m: string) => m !== mode);
      this.updateForm.patchValue({ toolMode: updated.length > 0 ? updated : [mode] });
    } else {
      this.updateForm.patchValue({ toolMode: [...currentModes, mode] });
    }
  }

  isToolModeSelected(mode: string): boolean {
    return this.updateForm.get('toolMode')?.value?.includes(mode) || false;
  }

  onSubmit(): void {
    if (this.updateForm.invalid) {
      this.updateForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    const formValue = this.updateForm.value;

    this.updateToolUseCase.execute(this.tool._id, formValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedTool) => {
          this.submitting.set(false);
          this.dialogRef.close(updatedTool);
        },
        error: (error) => {
          console.error('Error updating tool:', error);
          this.submitting.set(false);
        }
      });
  }

  close(): void {
    this.dialogRef.close();
  }

  get titleControl() {
    return this.updateForm.get('title') as FormControl;
  }

  get linkControl() {
    return this.updateForm.get('link') as FormControl;
  }

  get businessUnitControl() {
    return this.updateForm.get('businessUnitId') as FormControl;
  }
}
