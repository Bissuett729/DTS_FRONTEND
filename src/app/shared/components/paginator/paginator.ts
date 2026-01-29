import { Component, EventEmitter, Input, Output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'foxcode-paginator',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center justify-between px-2 py-3 bg-transparent">
      <div class="flex items-center gap-3">
        @if (showPageSize) {
          <span class="text-[10px] text-gray-500 uppercase font-bold tracking-wider"
            >Page size</span
          >
          <div class="relative group">
            <select
              [value]="pageSize"
              (change)="onPageSizeChange($event)"
              class="appearance-none bg-white border border-gray-300 rounded px-3 py-1 text-[10px] font-bold text-gray-700 cursor-pointer hover:border-foxcode focus:outline-none transition-colors pr-6"
            >
              @for (option of pageSizeOptions; track option) {
                <option [value]="option">{{ option }}</option>
              }
            </select>
            <i
              class="ri-arrow-down-s-fill absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs"
            ></i>
          </div>
        }
      </div>

      <div class="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
        Page {{ currentPage }} of {{ totalPages() }}
      </div>

      <div class="flex items-center gap-6">
        <button
          (click)="goToPage(1)"
          [disabled]="currentPage === 1"
          class="text-gray-400 hover:text-foxcode disabled:opacity-30 disabled:cursor-not-allowed transition-colors bg-transparent border-none p-0 cursor-pointer"
          title="First Page"
        >
          <i class="ri-skip-back-line text-lg"></i>
        </button>

        <button
          (click)="goToPage(currentPage - 1)"
          [disabled]="currentPage === 1"
          class="text-gray-400 hover:text-foxcode disabled:opacity-30 disabled:cursor-not-allowed transition-colors bg-transparent border-none p-0 cursor-pointer"
          title="Previous Page"
        >
          <i class="ri-arrow-left-s-line text-xl"></i>
        </button>

        <button
          (click)="onHomeClick()"
          class="text-gray-400 hover:text-foxcode transition-colors bg-transparent border-none p-0 cursor-pointer"
          title="Home"
        >
          <i class="ri-home-4-line text-lg"></i>
        </button>

        <button
          (click)="goToPage(currentPage + 1)"
          [disabled]="currentPage >= totalPages()"
          class="text-gray-400 hover:text-foxcode disabled:opacity-30 disabled:cursor-not-allowed transition-colors bg-transparent border-none p-0 cursor-pointer"
          title="Next Page"
        >
          <i class="ri-arrow-right-s-line text-xl"></i>
        </button>

        <button
          (click)="goToPage(totalPages())"
          [disabled]="currentPage >= totalPages()"
          class="text-gray-400 hover:text-foxcode disabled:opacity-30 disabled:cursor-not-allowed transition-colors bg-transparent border-none p-0 cursor-pointer"
          title="Last Page"
        >
          <i class="ri-skip-forward-line text-lg"></i>
        </button>
      </div>
    </div>
  `,
  styles: [],
})
export class Paginator {
  @Input() totalItems: number = 0;
  @Input() pageSize: number = 5;
  @Input() currentPage: number = 1;
  @Input() pageSizeOptions: number[] = [5, 10, 25, 50];
  @Input() showPageSize: boolean = true;

  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();
  @Output() homeClick = new EventEmitter<void>();

  totalPages = computed(() => {
    if (this.totalItems <= 0) return 1;
    return Math.ceil(this.totalItems / this.pageSize);
  });

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages() && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }

  onPageSizeChange(event: any): void {
    const newSize = Number(event.target.value);
    this.pageSizeChange.emit(newSize);
  }

  onHomeClick(): void {
    this.homeClick.emit();
  }
}
