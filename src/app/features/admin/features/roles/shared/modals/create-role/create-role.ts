import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { IBusinessUnit } from '../../../../../../../core/domain/interfaces/tool.interface';
import { FoxcodeInput, FoxcodeButton } from '../../../../../../../shared/components';
import { FoxcodeModalLayout } from '../../../../../../../shared/layouts/foxcode-modal-layout/foxcode-modal-layout';
import { CreateRoleUseCase } from '../../../../../../../core/application';

@Component({
  selector: 'foxcode-create-role',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FoxcodeInput, FoxcodeButton, FoxcodeModalLayout],
  templateUrl: './create-role.html',
  styles: []
})
export class CreateRole implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<CreateRole>);
  private destroy$ = new Subject<void>();

  private createRoleUseCase = inject(CreateRoleUseCase);

  submitting = signal<boolean>(false);
  businessUnits = signal<IBusinessUnit[]>([]);

  createForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]]
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

    this.createRoleUseCase.execute(formValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (createdRole) => {
          this.submitting.set(false);
          this.dialogRef.close(createdRole);
        },
        error: (error) => {
          console.error('Error creating role:', error);
          this.submitting.set(false);
        }
      });
  }

  close(): void {
    this.dialogRef.close();
  }

  get nameControl() {
    return this.createForm.get('name') as FormControl;
  }
}
