import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { FoxcodeInput, FoxcodeButton } from '../../../../../../../shared/components';
import { FoxcodeModalLayout } from '../../../../../../../shared/layouts/foxcode-modal-layout/foxcode-modal-layout';
import { IBusinessUnit } from '../../../../../../../core/domain';
import { UpdateBusinessUnitUseCase } from '../../../../../../../core/application';

@Component({
  selector: 'foxcode-update-business-unit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FoxcodeInput, FoxcodeButton, FoxcodeModalLayout],
  templateUrl: './update-business-unit.html',
  styles: []
})
export class UpdateBusinessUnit implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<UpdateBusinessUnit>);
  private data: { businessUnit: IBusinessUnit } = inject(MAT_DIALOG_DATA);
  private destroy$ = new Subject<void>();

  private updateBusinessUnitUseCase = inject(UpdateBusinessUnitUseCase);

  submitting = signal<boolean>(false);

  updateForm: FormGroup = this.fb.group({
    name: [this.data.businessUnit.name, [Validators.required, Validators.minLength(3)]],
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

    this.updateBusinessUnitUseCase.execute(this.data.businessUnit._id, formValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedBusinessUnit) => {
          this.submitting.set(false);
          this.dialogRef.close(updatedBusinessUnit);
        },
        error: (error) => {
          console.error('Error updating business unit:', error);
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
