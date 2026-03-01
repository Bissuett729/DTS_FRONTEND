import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DtsModalLayout, DtsCard, DtsButton, DtsInput } from "../../../../shared";
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'dts-new-department',
  standalone: true,
  imports: [CommonModule, DtsModalLayout, DtsCard, DtsButton, DtsInput],
  templateUrl: './new-department.html',
  styles: [
  ]
})
export class NewDepartment {

  private readonly dialogRef = inject(MatDialogRef<NewDepartment>);

  departmentCotrol = new FormControl<string>('', { nonNullable: true });

  readonly modalConfig = {
    title: 'Nuevo Departamento',
    subtitle: 'Crea un nuevo departamento para organizar tus líneas de producción.',
    icon: 'ri-layout-line',
  };

  onClose = () => this.dialogRef.close();

  onCreate() {}

}
