import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'ghost' | 'outline';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type ButtonType = 'button' | 'submit' | 'reset';

@Component({
  selector: 'foxcode-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.html',
  styles: ``
})
export class FoxcodeButton {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() type: ButtonType = 'button';
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Input() fullWidth: boolean = false;
  @Input() icon?: string; // Remixicon class for leading icon
  @Input() iconTrailing?: string; // Remixicon class for trailing icon
  @Input() label?: string;
  @Input() tooltip?: string;
  @Input() rounded: boolean = true;
  @Input() shadow: boolean = false;
  
  @Output() onClick = new EventEmitter<Event>();
  
  handleClick(event: Event): void {
    if (!this.disabled && !this.loading) {
      this.onClick.emit(event);
    }
  }
  
  get buttonClasses(): string {
    const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 outline-none focus:ring-2 focus:ring-offset-1';
    
    // Size classes
    const sizeMap = {
      xs: 'px-2.5 py-1.5 text-xs gap-1',
      sm: 'px-3 py-2 text-sm gap-1.5',
      md: 'px-4 py-2.5 text-sm gap-2',
      lg: 'px-5 py-3 text-base gap-2',
      xl: 'px-6 py-3.5 text-base gap-2.5'
    };
    
    // Variant classes
    const variantMap = {
      primary: 'bg-foxcode hover:bg-foxcode/90 text-white focus:ring-foxcode/30 active:bg-foxcode/80',
      secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-600/30 active:bg-gray-800',
      danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-600/30 active:bg-red-800',
      success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-600/30 active:bg-green-800',
      warning: 'bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-500/30 active:bg-yellow-700',
      ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-gray-400/30',
      outline: 'bg-transparent border-2 border-foxcode text-foxcode hover:bg-foxcode/5 focus:ring-foxcode/30 active:bg-foxcode/10'
    };
    
    // Rounded classes
    const roundedClass = this.rounded ? 'rounded-lg' : 'rounded-none';
    
    // Shadow classes
    const shadowClass = this.shadow ? 'shadow-md hover:shadow-lg' : '';
    
    // Width classes
    const widthClass = this.fullWidth ? 'w-full' : '';
    
    // Disabled/Loading classes
    const disabledClass = (this.disabled || this.loading) ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer';
    
    return `${baseClasses} ${sizeMap[this.size]} ${variantMap[this.variant]} ${roundedClass} ${shadowClass} ${widthClass} ${disabledClass}`;
  }
  
  get iconSizeClass(): string {
    const iconSizeMap = {
      xs: 'text-sm',
      sm: 'text-base',
      md: 'text-lg',
      lg: 'text-xl',
      xl: 'text-2xl'
    };
    return iconSizeMap[this.size];
  }
  
  get spinnerSizeClass(): string {
    const spinnerSizeMap = {
      xs: 'w-3 h-3',
      sm: 'w-4 h-4',
      md: 'w-4 h-4',
      lg: 'w-5 h-5',
      xl: 'w-6 h-6'
    };
    return spinnerSizeMap[this.size];
  }
}
