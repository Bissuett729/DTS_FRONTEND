import { Component, Input, Output, EventEmitter, forwardRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR, AbstractControl, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TextFieldModule } from '@angular/cdk/text-field';

@Component({
  selector: 'dts-textarea',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatIconModule,
    MatButtonModule,
    TextFieldModule
  ],
  templateUrl: './textarea.html',
  styles: ``,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DtsTextarea),
      multi: true
    }
  ]
})
export class DtsTextarea implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() control?: AbstractControl;
  @Input() readonly: boolean = false;
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() hint?: string;
  @Input() icon?: string; // Remixicon class
  @Input() maxlength: string | number | null = null;
  @Input() rows: number = 4;
  @Input() autoResize: boolean = false;

  // Features
  @Input() showCopy: boolean = false;
  @Input() showClear: boolean = true;

  // Custom error messages
  @Input() errorMessages: { [key: string]: string } = {};

  // Events
  @Output() onKeyInput = new EventEmitter<string>();
  @Output() onCopy = new EventEmitter<string>();
  @Output() onClear = new EventEmitter<void>();

  // Internal state
  value = signal<string>('');
  isFocused = signal(false);

  // ControlValueAccessor
  onChange: any = () => { };
  onTouched: any = () => { };

  writeValue(value: any): void {
    this.value.set(value || '');
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    this.value.set(textarea.value);
    this.onChange(textarea.value);
    this.onKeyInput.emit(textarea.value);
  }

  onFocus(): void {
    this.isFocused.set(true);
  }

  onBlur(): void {
    this.isFocused.set(false);
    this.onTouched();
  }

  async copyToClipboard(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.value());
      this.onCopy.emit(this.value());
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }

  clearInput(): void {
    this.value.set('');
    this.onChange('');
    this.onClear.emit();
    if (this.control) {
      this.control.setValue('');
    }
  }

  get hasError(): boolean {
    return !!(this.control && this.control.invalid && (this.control.dirty || this.control.touched));
  }

  get formControl(): FormControl<any> {
    return this.control instanceof FormControl ? this.control : new FormControl();
  }

  get errorMessage(): string {
    if (!this.control || !this.hasError) return '';

    const errors = this.control.errors;
    if (!errors) return '';

    for (const key in errors) {
      if (this.errorMessages[key]) {
        return this.errorMessages[key];
      }
    }

    if (errors['required']) return `${this.label || 'This field'} is required`;
    if (errors['minlength']) return `Minimum length is ${errors['minlength'].requiredLength} characters`;
    if (errors['maxlength']) return `Maximum length is ${errors['maxlength'].requiredLength} characters`;
    if (errors['pattern']) return 'Invalid format';

    return 'Invalid value';
  }

  get showClearButton(): boolean {
    return this.showClear && this.value().length > 0 && !this.readonly && !this.isDisabled;
  }

  get isDisabled(): boolean {
    return this.disabled || this.control?.disabled || false;
  }
}
