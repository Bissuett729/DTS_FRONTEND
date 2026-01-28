import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'foxcode-modal-layout',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './foxcode-modal-layout.html',
    styles: []
})
export class FoxcodeModalLayout {
    @Input() title: string = '';
    @Input() subtitle: string = '';
    @Input() icon: string = 'ri-file-list-line';
    @Input() maxWidth: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' = '3xl';
    @Input() minWidth: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' = '5xl';
    @Input() loading: boolean = false;
    @Input() loadingMessage: string = 'Loading...';

    @Output() closeModal = new EventEmitter<void>();

    get maxWidthClass(): string {
        const widths = {
            'sm': 'max-w-sm',
            'md': 'max-w-md',
            'lg': 'max-w-lg',
            'xl': 'max-w-xl',
            '2xl': 'max-w-2xl',
            '3xl': 'max-w-3xl',
            '4xl': 'max-w-4xl',
            '5xl': 'max-w-5xl',
            '6xl': 'max-w-6xl',
            '7xl': 'max-w-7xl'
        };
        return widths[this.maxWidth];
    }

    get minWidthClass(): string {
        const widths = {
            'sm': 'min-w-sm',
            'md': 'min-w-md',
            'lg': 'min-w-lg',
            'xl': 'min-w-xl',
            '2xl': 'min-w-2xl',
            '3xl': 'min-w-3xl',
            '4xl': 'min-w-4xl',
            '5xl': 'min-w-5xl',
            '6xl': 'min-w-6xl',
            '7xl': 'min-w-7xl'
        };
        return widths[this.minWidth];
    }

    onClose(): void {
        this.closeModal.emit();
    }
}
