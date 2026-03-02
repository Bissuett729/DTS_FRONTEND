import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DtsModalLayout, DtsCard, DtsButton, DtsInput, DtsTimePicker } from "../../../../shared";
import { MatDialogRef } from '@angular/material/dialog';
import { ShiftForm } from '../../forms';
import { ShiftRequestService } from '../../services/shift-request.service';
import { ShiftState } from '../../state/shift-state';

@Component({
  selector: 'dts-new-shift',
  standalone: true,
  imports: [CommonModule, DtsModalLayout, DtsCard, DtsButton, DtsInput, DtsTimePicker],
  templateUrl: './new-shift.html',
  styles: [
  ]
})
export class NewShift implements OnInit {

  private readonly dialogRef = inject(MatDialogRef<NewShift>);
  private readonly shiftRequestService = inject(ShiftRequestService);
  private shiftState = inject(ShiftState);

  loadingNewShift$ = this.shiftState.loadingCreateShift

  readonly shiftForm = ShiftForm;

  readonly modalConfig = {
    title: 'Nuevo Turno',
    subtitle: 'Crea un nuevo turno para organizar tus líneas de producción.',
    icon: 'ri-layout-line',
  };

  ngOnInit(): void {
    this.shiftForm.get('startTime')?.valueChanges.subscribe(startTime => {
      const endTime = this.shiftForm.get('endTime')?.value;
      this.shiftForm.get('description')?.setValue(`${startTime?.toLocaleTimeString()} to ${endTime?.toLocaleTimeString()}`);
    });

    this.shiftForm.get('endTime')?.valueChanges.subscribe(endTime => {
      const startTime = this.shiftForm.get('startTime')?.value;
      this.shiftForm.get('description')?.setValue(`${startTime?.toLocaleTimeString()} to ${endTime?.toLocaleTimeString()}`);
    });
  }

  onClose = () => this.dialogRef.close();

  onCreate() {
    this.shiftRequestService.createShift(this.shiftForm.getRawValue())
    this.dialogRef.close();
  }

}
