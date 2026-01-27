import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'foxcode-expander',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './expander.html',
  styles: ``
})
export class FoxcodeExpander {
  @Input() expanded: boolean = false;
  @Input() disabled: boolean = false;
  @Input() headerClass: string = '';
  @Input() contentClass: string = '';
  @Input() borderless: boolean = false;

  @Input() padding: 'none' | 'sm' | 'md' | 'lg' = 'none';
  @Input() shadow: 'none' | 'sm' | 'md' | 'lg' | 'xl' = 'sm';
  @Input() rounded: 'none' | 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() border: boolean = true;

  @Output() expandedChange = new EventEmitter<boolean>();

  isExpanded = signal<boolean>(false);

  ngOnInit(): void {
    setTimeout(() => {
      this.isExpanded.set(this.expanded);
    });
  }

  ngOnChanges(): void {
    this.isExpanded.set(this.expanded);
  }

  toggle(): void {
    if (this.disabled) return;
    this.isExpanded.update(value => {
      const next = !value;
      this.expandedChange.emit(next);
      return next;
    });
  }

  expand(): void {
    if (!this.disabled) {
      this.isExpanded.set(true);
      this.expandedChange.emit(true);
    }
  }

  collapse(): void {
    if (!this.disabled) {
      this.isExpanded.set(false);
      this.expandedChange.emit(false);
    }
  }

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
