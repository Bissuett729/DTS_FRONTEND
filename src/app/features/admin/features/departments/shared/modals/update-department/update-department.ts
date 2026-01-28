import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { FoxcodeInput, FoxcodeButton } from '../../../../../../../shared/components';
import { FoxcodeModalLayout } from '../../../../../../../shared/layouts/foxcode-modal-layout/foxcode-modal-layout';
import { IDepartment } from '../../../../../../../core/domain';
import { UpdateDepartmentUseCase } from '../../../../../../../core/application';

@Component({
  selector: 'foxcode-update-department',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FoxcodeInput, FoxcodeButton, FoxcodeModalLayout],
  templateUrl: './update-department.html',
  styles: []
})
export class UpdateDepartment implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<UpdateDepartment>);
  private data: { department: IDepartment } = inject(MAT_DIALOG_DATA);
  private destroy$ = new Subject<void>();

  private updateDepartmentUseCase = inject(UpdateDepartmentUseCase);

  submitting = signal<boolean>(false);

  updateForm: FormGroup = this.fb.group({
    name: [this.data.department.name, [Validators.required, Validators.minLength(3)]],
  });

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(): void {
    if (this.updateForm.invalid) {
      this.updateForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    const formValue = this.updateForm.value;

    this.updateDepartmentUseCase.execute(this.data.department._id, formValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedDepartment) => {
          this.submitting.set(false);
          this.dialogRef.close(updatedDepartment);
        },
        error: (error) => {
          console.error('Error updating department:', error);
          this.submitting.set(false);
        }
      });
  }

  close(): void {
    this.dialogRef.close();
  }

  get nameControl() {
    return this.updateForm.get('name') as FormControl;
  }
}
