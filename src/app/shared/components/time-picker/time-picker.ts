import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'foxcode-time-picker',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatTimepickerModule, ReactiveFormsModule],
  templateUrl: './time-picker.html',
  styles: [
  ]
})
export class TimePicker {

  @Input() label: string = '';
  @Input() control?: FormControl;
  @Input() readonly: boolean = false;
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() hint?: string;

  // Custom error messages
  @Input() errorMessages: { [key: string]: string } = {};

  isFocused = signal(false);

  // ControlValueAccessor
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
    if (errors['email']) return 'Please enter a valid email address';
    if (errors['minlength']) return `Minimum length is ${errors['minlength'].requiredLength} characters`;
    if (errors['min']) return `Minimum value is ${errors['min'].min}`;
    if (errors['max']) return `Maximum value is ${errors['max'].max}`;
    if (errors['pattern']) return 'Invalid format';

    return 'Invalid value';
  }

  get isDisabled(): boolean {
    return this.disabled || this.control?.disabled || false;
  }
}