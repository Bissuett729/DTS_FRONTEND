import { Component, Input, Output, EventEmitter, forwardRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';

export interface SelectOption {
  value: any;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'foxcode-select',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTooltipModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './select.html',
  styles: [`
    ::ng-deep .foxcode-select-field .mat-mdc-text-field-wrapper .mat-mdc-form-field-flex .mat-mdc-floating-label:not(.mdc-floating-label--float-above) {
      top: calc(var(--mat-form-field-container-height, 37px) / 2);
    }
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FoxcodeSelect),
      multi: true
    }
  ]
})
export class FoxcodeSelect implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() placeholder: string = 'Select an option';
  @Input() control?: FormControl;
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() hint?: string;
  @Input() icon?: string; // Remixicon class
  @Input() options: any[] = [];
  @Input() optionValue: string = 'value'; // Property name for option value
  @Input() optionLabel: string = 'label'; // Property name for option label
  @Input() optionDisabled: string = 'disabled'; // Property name for disabled state
  @Input() multiple: boolean = false;
  @Input() showSelectAll: boolean = false; // Show "Select All" option for multiple selects

  @Output() selectionChange = new EventEmitter<any>();

  value = signal<any>(null);
  showPassword = signal(false);
  formControlInternal = new FormControl();

  // ControlValueAccessor properties
  onChange: any = () => { };
  onTouched: any = () => { };

  get isDisabled(): boolean {
    return this.disabled || this.control?.disabled || false;
  }

  get hasError(): boolean {
    return !!(this.control?.invalid && (this.control?.dirty || this.control?.touched));
  }

  get errorMessage(): string {
    if (!this.control?.errors) return '';

    const errors = this.control.errors;
    if (errors['required']) return `${this.label || 'This field'} is required`;
    if (errors['email']) return 'Invalid email format';
    if (errors['minlength']) return `Minimum ${errors['minlength'].requiredLength} characters required`;
    if (errors['maxlength']) return `Maximum ${errors['maxlength'].requiredLength} characters allowed`;
    if (errors['pattern']) return 'Invalid format';
    if (errors['min']) return `Minimum value is ${errors['min'].min}`;
    if (errors['max']) return `Maximum value is ${errors['max'].max}`;

    return 'Invalid value';
  }

  // ControlValueAccessor methods
  writeValue(value: any): void {
    this.value.set(value);
    if (!this.control) {
      this.formControlInternal.setValue(value, { emitEvent: false });
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (!this.control) {
      if (isDisabled) {
        this.formControlInternal.disable({ emitEvent: false });
      } else {
        this.formControlInternal.enable({ emitEvent: false });
      }
    }
  }

  onSelectionChange(event: any): void {
    const newValue = event.value;
    this.value.set(newValue);
    this.onChange(newValue);
    this.onTouched();
    this.selectionChange.emit(newValue);
  }

  onBlur(): void {
    this.onTouched();
  }

  getOptionValue(option: any): any {
    return typeof option === 'object' ? option[this.optionValue] : option;
  }

  getOptionLabel(option: any): string {
    return typeof option === 'object' ? option[this.optionLabel] : String(option);
  }

  isOptionDisabled(option: any): boolean {
    return typeof option === 'object' ? !!option[this.optionDisabled] : false;
  }

  get allSelected(): boolean {
    if (!this.multiple || !this.options.length) return false;
    const currentValue = this.value();
    if (!Array.isArray(currentValue)) return false;
    const enabledOptions = this.options.filter(opt => !this.isOptionDisabled(opt));
    return enabledOptions.length > 0 && enabledOptions.every(opt => currentValue.includes(this.getOptionValue(opt)));
  }

  toggleSelectAll(): void {
    if (!this.multiple) return;

    const enabledOptions = this.options.filter(opt => !this.isOptionDisabled(opt));
    let newValue: any[];

    if (this.allSelected) {
      // Deselect all
      newValue = [];
    } else {
      // Select all enabled options
      newValue = enabledOptions.map(opt => this.getOptionValue(opt));
    }

    this.value.set(newValue);
    this.onChange(newValue);
    this.onTouched();
    this.selectionChange.emit(newValue);
  }
}
