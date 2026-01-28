import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { FoxcodeInput, FoxcodeButton } from '../../../../../../../shared/components';
import { FoxcodeModalLayout } from '../../../../../../../shared/layouts/foxcode-modal-layout/foxcode-modal-layout';
import { IRole, IShift } from '../../../../../../../core/domain';
import { UpdateShiftUseCase } from '../../../../../../../core/application/use-cases/shifts';
import { TimePicker } from "../../../../../../../shared/components/time-picker/time-picker";

@Component({
  selector: 'foxcode-update-shift',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FoxcodeInput, FoxcodeButton, FoxcodeModalLayout, TimePicker],
  templateUrl: './update-shift.html',
  styles: []
})
export class UpdateShift implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<UpdateShift>);
  private data: { shift: IShift } = inject(MAT_DIALOG_DATA);
  private destroy$ = new Subject<void>();

  private updateShiftUseCase = inject(UpdateShiftUseCase);
  submitting = signal<boolean>(false);

  updateForm: FormGroup = this.fb.group({
    shift: [this.data.shift.shift, [Validators.required, Validators.minLength(3)]],
    description: [this.data.shift.description, [Validators.required]],
    startTime: [this.data.shift.startTime, [Validators.required]],
    endTime: [this.data.shift.endTime, [Validators.required]]
  });

  ngOnInit(): void {

  }

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

    const shiftId = this.data?.shift?._id;
    if (!shiftId) {
      console.error('No shift ID provided');
      this.submitting.set(false);
      return;
    }
    this.updateShiftUseCase.execute(shiftId, formValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedShift) => {
          this.submitting.set(false);
          this.dialogRef.close(updatedShift);
        },
        error: (error) => {
          console.error('Error updating shift:', error);
          this.submitting.set(false);
        }
      });
  }

  close(): void {
    this.dialogRef.close();
  }

  get shiftControl() {
    return this.updateForm.get('shift') as FormControl;
  }

  get descriptionControl() {
    return this.updateForm.get('description') as FormControl;
  }

  get startTimeControl() {
    return this.updateForm.get('startTime') as FormControl;
  }

  get endTimeControl() {
    return this.updateForm.get('endTime') as FormControl;
  }
}
