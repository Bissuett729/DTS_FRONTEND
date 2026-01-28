import { Component, inject, signal } from '@angular/core';
import { Card, FoxcodeInput, FoxcodeButton } from "../../../../shared/components";
import { FormControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { IBusinessUnit } from '../../../../core/domain';
import { OpenModal } from '../../../../core/infrastructure';
import { BusinessUnitStateService } from './shared/services/business-unit.state.service';
import { CreateBusinessUnit, UpdateBusinessUnit } from './shared/modals';
import { InitBusinessUnitsSockets } from './core/sockets/init-sockets.socket';

@Component({
  selector: 'foxcode-business-units',
  imports: [Card, FoxcodeInput, FoxcodeButton],
  templateUrl: './business-units.html',
  styles: ``,
})
export class BusinessUnits {

  private businessUnitsState = inject(BusinessUnitStateService);
  private socketManager = inject(InitBusinessUnitsSockets);
  private destroy$ = new Subject<void>();

  searchControl = new FormControl('');
  searchTerm = signal<string>('');

  loading = this.businessUnitsState.loading;
  businessUnits = this.businessUnitsState.businessUnits;

  ngOnInit(): void {
    this.businessUnitsState.loadBusinessUnits(this.destroy$);
    // Setup socket connection and listeners
    this.socketManager.InitSockets();

    this.searchControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this.searchTerm.set(value || '');
      });
  }

  openCreateModal(): void {
    OpenModal(CreateBusinessUnit, {
      disableClose: false,
      autoFocus: true
    }).afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          this.businessUnitsState.addBusinessUnit(result);
        }
      });
  }

  openUpdateModal(businessUnit: IBusinessUnit): void {
    OpenModal(UpdateBusinessUnit, {
      disableClose: false,
      autoFocus: true,
      data: { businessUnit }
    }).afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          this.businessUnitsState.updateBusinessUnit(result);
        }
      });
  }

  get searchControlValue() {
    return this.searchControl.value;
  }

}
