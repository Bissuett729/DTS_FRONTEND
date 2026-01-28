import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { IBusinessUnit } from '../../../../../../../core/domain/interfaces/tool.interface';
import { FoxcodeInput, FoxcodeButton } from '../../../../../../../shared/components';
import { FoxcodeModalLayout } from '../../../../../../../shared/layouts/foxcode-modal-layout/foxcode-modal-layout';
import { CreateShiftUseCase } from '../../../../../../../core/application/use-cases/shifts';
import { TimePicker } from "../../../../../../../shared/components/time-picker/time-picker";

@Component({
  selector: 'foxcode-create-shift',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FoxcodeInput, FoxcodeButton, FoxcodeModalLayout, TimePicker],
  templateUrl: './create-shift.html',
  styles: []
})
export class CreateShift implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<CreateShift>);
  private destroy$ = new Subject<void>();

  private createShiftUseCase = inject(CreateShiftUseCase);

  submitting = signal<boolean>(false);
  businessUnits = signal<IBusinessUnit[]>([]);

  createForm: FormGroup = this.fb.group({
    shift: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required]],
    startTime: ['', [Validators.required]],
    endTime: ['', [Validators.required]]
  });

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(): void {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    if( this.submitting()) return;

    this.submitting.set(true);
    const formValue = this.createForm.value;

    this.createShiftUseCase.execute(formValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (createdShift) => {
          this.submitting.set(false);
          this.dialogRef.close(createdShift);
        },
        error: (error) => {
          console.error('Error creating shift:', error);
          this.submitting.set(false);
        }
      });
  }

  close(): void {
    this.dialogRef.close();
  }

  get shiftControl() {
    return this.createForm.get('shift') as FormControl;
  }

  get descriptionControl() {
    return this.createForm.get('description') as FormControl;
  }

  get startTimeControl() {
    return this.createForm.get('startTime') as FormControl;
  }

  get endTimeControl() {
    return this.createForm.get('endTime') as FormControl;
  }
}
