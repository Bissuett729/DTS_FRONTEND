import { Component, Input, Output, EventEmitter, forwardRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';

@Component({
  selector: 'foxcode-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './input.html',
  styles: ``,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FoxcodeInput),
      multi: true
    }
  ]
})
export class FoxcodeInput implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() type: InputType = 'text';
  @Input() control?: FormControl;
  @Input() readonly: boolean = false;
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() hint?: string;
  @Input() icon?: string; // Remixicon class
  @Input() maxlength: string | number | null = null;
  
  // Features
  @Input() showCopy: boolean = false;
  @Input() showPaste: boolean = false;
  @Input() showScan: boolean = false;
  @Input() showClear: boolean = true;
  @Input() showPasswordToggle: boolean = false;
  
  // Custom error messages
  @Input() errorMessages: { [key: string]: string } = {};
  
  // Events
  @Output() onKeyInput = new EventEmitter<string>();
  @Output() onScan = new EventEmitter<void>();
  @Output() onCopy = new EventEmitter<string>();
  @Output() onPaste = new EventEmitter<void>();
  @Output() onClear = new EventEmitter<void>();
  
  // Internal state
  value = signal<string>('');
  isFocused = signal(false);
  showPassword = signal(false);
  
  // ControlValueAccessor
  onChange: any = () => {};
  onTouched: any = () => {};
  
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
  
  // Internal methods
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.value.set(input.value);
    this.onChange(input.value);
    this.onKeyInput.emit(input.value);
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
  
  async pasteFromClipboard(): Promise<void> {
    try {
      const text = await navigator.clipboard.readText();
      this.value.set(text);
      this.onChange(text);
      this.onPaste.emit();
      if (this.control) {
        this.control.setValue(text);
      }
    } catch (err) {
      console.error('Failed to paste:', err);
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
  
  togglePasswordVisibility(): void {
    this.showPassword.update(v => !v);
  }
  
  triggerScan(): void {
    this.onScan.emit();
  }
  
  get inputType(): string {
    if (this.type === 'password' && this.showPassword()) {
      return 'text';
    }
    return this.type;
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
    if (errors['maxlength']) return `Maximum length is ${errors['maxlength'].requiredLength} characters`;
    if (errors['min']) return `Minimum value is ${errors['min'].min}`;
    if (errors['max']) return `Maximum value is ${errors['max'].max}`;
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
