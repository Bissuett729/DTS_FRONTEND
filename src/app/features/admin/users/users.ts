import { Component, inject, OnInit } from '@angular/core';
import { Card, FoxcodeInput, FoxcodeButton } from "../../../shared/components";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

interface UserFilters {
  search: string;
  role: string;
  department: string;
  active: boolean;
}

@Component({
  selector: 'foxcode-users',
  standalone: true,
  imports: [Card, FoxcodeInput, FoxcodeButton, ReactiveFormsModule],
  templateUrl: './users.html',
  styles: ``,
})
export class Users implements OnInit {
  private fb = inject(FormBuilder);

  filterForm: FormGroup = this.fb.group({
    search: ['', [Validators.minLength(2)]]
  });

  ngOnInit(): void {
    this.filterForm.valueChanges.subscribe(filters => {
      console.log('Filters changed:', filters);
      this.applyFilters();
    });
  }

  get searchControl() {
    return this.filterForm.controls['search'] as FormControl;
  }

  get searchControlValue() {
    return this.filterForm.controls['search'].value;
  }

  applyFilters(): void {
    if (this.filterForm.valid) {
      const filters = this.filterForm.value;
      console.log('Applying filters:', filters);
      // TODO: Call service to fetch filtered users
    }
  }

  resetFilters(): void {
    this.filterForm.reset({
      search: ''
    });
  }
}
