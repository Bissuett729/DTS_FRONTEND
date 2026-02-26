import { Component } from '@angular/core';
import { DtsCard, DtsButton, DtsInput, DtsTimePicker, DtsSelect, DtsDatePicker } from '../../shared';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'dts-downtime-register',
  imports: [DtsCard, DtsButton, DtsInput, DtsTimePicker, DtsSelect, FormsModule, ReactiveFormsModule, DtsDatePicker],
  templateUrl: './downtime-register.html',
  styles: ``,
})
export class DowntimeRegister {

  readonly shifts: { value: string; viewValue: string }[] = [
    { value: 'shift-a', viewValue: 'Turno A' },
    { value: 'shift-b', viewValue: 'Turno B' },
    { value: 'shift-c', viewValue: 'Turno C' }
  ];

  readonly lines: { value: string; viewValue: string }[] = [
    { value: 'line-1', viewValue: 'Línea 1' },
    { value: 'line-2', viewValue: 'Línea 2' },
    { value: 'line-3', viewValue: 'Línea 3' }
  ];

  async registerDownTime() {
    console.log('Se ejecuto el metodo registerDownTime');
  }

  readonly downtimeForm = new FormGroup({
    date: new FormControl<Date | null>(new Date(), { nonNullable: true }),
    weekNumber: new FormControl<number | null>(22, { nonNullable: true }),
    startTime: new FormControl<Date>((() => { const d = new Date(); d.setMinutes(0, 0, 0); return d; })(), { nonNullable: true }),
    endTime: new FormControl<Date>((() => { const d = new Date(); d.setMinutes(0, 0, 0); return d; })(), { nonNullable: true }),
    reason: new FormControl<string>('', { nonNullable: true }),
    shift: new FormControl<string | null>(null, { nonNullable: true }),
    line: new FormControl<string | null>(null, { nonNullable: true }),
    supervisor: new FormControl<string>('', { nonNullable: true }),
  });

  readonly metricsForm = new FormGroup({
    standarOut: new FormControl<number | null>(null, { nonNullable: true }),
    actualOut: new FormControl<number | null>(null, { nonNullable: true }),
  });

  getDownTimeFormControl(controlName: string): FormControl {
    return this.downtimeForm.get(controlName) as FormControl;
  }
  
  getMetricsFormControl(controlName: string): FormControl {
    return this.metricsForm.get(controlName) as FormControl;
  }
}
