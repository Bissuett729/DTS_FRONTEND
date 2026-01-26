import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'foxcode-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.html',
  styles: ``
})
export class Card {
  @Input() padding: 'none' | 'sm' | 'md' | 'lg' = 'sm';
  @Input() shadow: 'none' | 'sm' | 'md' | 'lg' | 'xl' = 'sm';
  @Input() rounded: 'none' | 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() border: boolean = true;

  get paddingClass(): string {
    const paddingMap = {
      none: '',
      sm: 'p-2',
      md: 'p-4',
      lg: 'p-6'
    };
    return paddingMap[this.padding];
  }

  get shadowClass(): string {
    const shadowMap = {
      none: '',
      sm: 'shadow-sm',
      md: 'shadow-md',
      lg: 'shadow-lg',
      xl: 'shadow-xl'
    };
    return shadowMap[this.shadow];
  }

  get roundedClass(): string {
    const roundedMap = {
      none: '',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl'
    };
    return roundedMap[this.rounded];
  }

  get borderClass(): string {
    return this.border ? 'border border-gray-200 dark:border-[#6b6b6b]' : '';
  }
}
