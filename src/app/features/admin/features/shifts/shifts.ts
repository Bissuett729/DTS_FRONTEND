import { Component, inject, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { IShift } from '../../../../core/domain';
import { OpenModal } from '../../../../core/infrastructure';
import { ShiftStateService } from './shared/services/shift.state.service';
import { CreateShift, UpdateShift } from './shared/modals';
import { FoxcodeInput } from "../../../../shared";
import { FoxcodeButton, Card } from "../../../../shared/components";
import { InitShiftsSockets } from './core/sockets/init-sockets.socket';

@Component({
  selector: 'foxcode-shifts',
  imports: [FoxcodeInput, FoxcodeButton, Card],
  templateUrl: './shifts.html',
  styles: ``,
})
export class Shifts {

  private shiftsState = inject(ShiftStateService);
  private socketManager = inject(InitShiftsSockets);
  private destroy$ = new Subject<void>();

  searchControl = new FormControl('');
  searchTerm = signal<string>('');

  loading = this.shiftsState.loading;
  shifts = this.shiftsState.shifts;

  ngOnInit(): void {
    this.shiftsState.loadShifts(this.destroy$);
    // Setup socket connection and listeners
    this.socketManager.InitSockets();

    this.searchControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this.searchTerm.set(value || '');
      });
  }

  openCreateModal(): void {
    OpenModal(CreateShift, {
      disableClose: false,
      autoFocus: true
    }).afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          this.shiftsState.addShift(result);
        }
      });
  }

  openUpdateModal(shift: IShift): void {
    OpenModal(UpdateShift, {
      disableClose: false,
      autoFocus: true,
      data: { shift }
    }).afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          this.shiftsState.updateShift(result);
        }
      });
  }

  get searchControlValue() {
    return this.searchControl.value;
  }

}
