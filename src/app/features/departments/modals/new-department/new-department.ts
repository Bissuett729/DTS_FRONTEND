import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DtsModalLayout, DtsCard, DtsButton, DtsInput } from "../../../../shared";
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { DepartmentRequestService } from '../../services/department-request.service';

@Component({
  selector: 'dts-new-department',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DtsModalLayout, DtsCard, DtsButton, DtsInput],
  templateUrl: './new-department.html',
  styles: [
  ]
})
export class NewDepartment {

  private readonly dialogRef = inject(MatDialogRef<NewDepartment>);
  private readonly departmentRequest = inject(DepartmentRequestService);

  departmentControl = new FormControl<string>('', { nonNullable: true });

  readonly modalConfig = {
    title: 'Nuevo Departamento',
    subtitle: 'Crea un nuevo departamento para organizar tus líneas de producción.',
    icon: 'ri-layout-line',
  };

  onClose = () => this.dialogRef.close();

  onCreate() {
    const department = this.departmentControl.value.trim();
    if (!department) {
      this.departmentControl.markAsTouched();
      return;
    }
    this.departmentRequest.createDepartment({ department });
    this.dialogRef.close();
  }

}
