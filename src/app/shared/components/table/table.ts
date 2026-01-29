import { Component, EventEmitter, Input, Output, ContentChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ITableColumn } from './table.interface';
import { Paginator } from '../paginator/paginator';

@Component({
  selector: 'foxcode-table',
  standalone: true,
  imports: [CommonModule, Paginator],
  template: `
    <div class="w-full">
      <div class="overflow-x-auto rounded-lg border border-gray-200 shadow-sm bg-white">
        <table class="w-full text-left border-collapse min-w-full">
          <thead>
            <tr class="bg-[#4d4d4d] text-white text-[10px] uppercase tracking-wider">
              @for (col of columns; track col.key) {
                <th
                  [class]="
                    'px-4 py-3 font-semibold border-r border-gray-600 last:border-r-0 text-center ' +
                    (col.headerClass || '')
                  "
                >
                  {{ col.label }}
                </th>
              }
            </tr>
          </thead>
          <tbody class="text-xs text-gray-700">
            @for (row of data; track row._id || $index) {
              <tr
                class="border-b border-gray-200 hover:bg-gray-50 transition-colors last:border-b-0"
              >
                @for (col of columns; track col.key) {
                  <td
                    [class]="
                      'px-4 py-3 border-r border-gray-100 last:border-r-0 text-center ' +
                      (col.class || '')
                    "
                  >
                    @switch (col.type) {
                      @case ('icon') {
                        <i [class]="col.icon + ' text-lg text-gray-500'"></i>
                      }
                      @case ('action') {
                        <div class="flex justify-center gap-2">
                          @for (action of col.actions; track action.label) {
                            @if (!action.show || action.show(row)) {
                              <button
                                (click)="action.callback(row)"
                                [title]="action.label"
                                [class]="
                                  'p-1 rounded hover:bg-gray-100 transition-colors bg-transparent border-none cursor-pointer ' +
                                  (action.class || '')
                                "
                              >
                                <i [class]="action.icon + ' text-lg'"></i>
                              </button>
                            }
                          }
                        </div>
                      }
                      @case ('custom') {
                        <ng-container
                          *ngTemplateOutlet="customCell; context: { $implicit: row, column: col }"
                        ></ng-container>
                      }
                      @case ('date') {
                        {{ resolveKey(row, col.key) | date: 'dd/MM/yyyy HH:mm' }}
                      }
                      @default {
                        {{ resolveKey(row, col.key) || col.altern || '-' }}
                      }
                    }
                  </td>
                }
              </tr>
            } @empty {
              <tr>
                <td
                  [attr.colspan]="columns.length"
                  class="px-4 py-12 text-center text-gray-400 italic bg-white"
                >
                  No data available to display
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      @if (showPagination && totalItems > 0) {
        <foxcode-paginator
          [totalItems]="totalItems"
          [pageSize]="pageSize"
          [currentPage]="currentPage"
          (pageChange)="onPageChange($event)"
          (pageSizeChange)="onPageSizeChange($event)"
          (homeClick)="onHomeClick()"
        >
        </foxcode-paginator>
      }
    </div>
  `,
  styles: [],
})
export class Table {
  @Input() data: any[] = [];
  @Input() columns: ITableColumn[] = [];

  // Pagination Inputs
  @Input() showPagination: boolean = true;
  @Input() totalItems: number = 0;
  @Input() pageSize: number = 5;
  @Input() currentPage: number = 1;

  // Outputs
  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();
  @Output() homeClick = new EventEmitter<void>();

  @ContentChild('customCell') customCell!: TemplateRef<any>;

  /**
   * Resolves a nested key string (e.g. 'user.profile.name') from an object
   */
  resolveKey(obj: any, key: string): any {
    if (!key) return null;
    return key.split('.').reduce((prev, curr) => {
      return prev ? prev[curr] : null;
    }, obj);
  }

  onPageChange(page: number): void {
    this.pageChange.emit(page);
  }

  onPageSizeChange(size: number): void {
    this.pageSizeChange.emit(size);
  }

  onHomeClick(): void {
    this.homeClick.emit();
  }
}
