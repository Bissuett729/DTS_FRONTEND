import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { FoxcodeInput, FoxcodeButton } from '../../../../../../../shared/components';
import { FoxcodeModalLayout } from '../../../../../../../shared/layouts/foxcode-modal-layout/foxcode-modal-layout';
import { IRole } from '../../../../../../../core/domain';
import { UpdateRoleUseCase } from '../../../../../../../core/application';

@Component({
  selector: 'foxcode-update-role',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FoxcodeInput, FoxcodeButton, FoxcodeModalLayout],
  templateUrl: './update-role.html',
  styles: []
})
export class UpdateRole implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<UpdateRole>);
  private data: { role: IRole } = inject(MAT_DIALOG_DATA);
  private destroy$ = new Subject<void>();

  private updateRoleUseCase = inject(UpdateRoleUseCase);

  submitting = signal<boolean>(false);

  updateForm: FormGroup = this.fb.group({
    name: [this.data.role.name, [Validators.required, Validators.minLength(3)]],
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

    this.updateRoleUseCase.execute(this.data.role._id, formValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedRole) => {
          this.submitting.set(false);
          this.dialogRef.close(updatedRole);
        },
        error: (error) => {
          console.error('Error updating role:', error);
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
