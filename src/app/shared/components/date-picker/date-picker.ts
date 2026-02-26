import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'dts-date-picker',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule
  ],
  templateUrl: './date-picker.html',
  styles: []
})
export class DtsDatePicker {

  @Input() label: string = '';
  @Input() control?: FormControl;
  @Input() readonly: boolean = false;
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() hint?: string;
  @Input() minDate?: Date;
  @Input() maxDate?: Date;

  // Custom error messages
  @Input() errorMessages: { [key: string]: string } = {};

  isFocused = signal(false);

  onChange: any = () => { };
  onTouched: any = () => { };

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onFocus(): void {
    this.isFocused.set(true);
  }

  get hasError(): boolean {
    return !!(this.control && this.control.invalid && (this.control.dirty || this.control.touched));
  }

  get errorMessage(): string {
    if (!this.control || !this.hasError) return '';

    const errors = this.control.errors;
    if (!errors) return '';

    // Custom error messages
    for (const key in errors) {
      if (this.errorMessages[key]) {
        return this.errorMessages[key];
      }
    }

    // Default error messages
    if (errors['required']) return `${this.label || 'This field'} is required`;
    if (errors['matDatepickerMin']) return `Date must be on or after ${this.minDate?.toLocaleDateString()}`;
    if (errors['matDatepickerMax']) return `Date must be on or before ${this.maxDate?.toLocaleDateString()}`;
    if (errors['matDatepickerParse']) return 'Invalid date format';

    return 'Invalid value';
  }

  get isDisabled(): boolean {
    return this.disabled || this.control?.disabled || false;
  }
}
