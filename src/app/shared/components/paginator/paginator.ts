import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { IPagination } from './paginator.interface';
import { FoxcodeSelect } from "../select/select";

@Component({
  selector: 'foxcode-paginator',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatIconModule,
    FoxcodeSelect
],
  templateUrl: './paginator.html'
})
export class FoxcodePaginator implements OnChanges {

  @Input() totalPages: number = 0;
  @Input() currentPage: number = 1;
  @Input() currentPageSize: number = 5;

  @Output() paginationChange = new EventEmitter<IPagination>();



  page: number = 1;
  pageSize = new FormControl<number>(5)

  ngOnChanges(changes: SimpleChanges) {
    if (changes['currentPage'] && changes['currentPage'].currentValue !== undefined) {
      this.page = changes['currentPage'].currentValue;
    }
    if (changes['currentPageSize'] && changes['currentPageSize'].currentValue !== undefined) {
      this.pageSize = changes['currentPageSize'].currentValue;
    }
  }
  
  private emitChange() {
    this.paginationChange.emit({ page: this.page, pageSize: this.pageSize.value ?? 5 });
  }

  setPageSize(size: number) {
    this.pageSize.setValue(size);
    this.page = 1;
    this.emitChange();
  }

  goToFirst() {
    if (this.page !== 1) {
      this.page = 1;
      this.emitChange();
    }
  }

  goToPrev() {
    if (this.page > 1) {
      this.page--;
      this.emitChange();
    }
  }

  goToNext() {
    if (this.page < this.totalPages) {
      this.page++;
      this.emitChange();
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.page = page;
      this.emitChange();
    }
  }
}