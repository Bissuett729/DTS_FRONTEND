import { Injectable, signal } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { IBusinessUnit } from '../../../../../../core/domain';
import { GetBusinessUnitsUseCase } from '../../../../../../core/application';

@Injectable({ providedIn: 'root' })
export class BusinessUnitStateService {
  loading = signal<boolean>(false);
  businessUnits = signal<IBusinessUnit[]>([]);

  constructor(private getBusinessUnitsUseCase: GetBusinessUnitsUseCase) { }

  loadBusinessUnits(destroy$: Subject<void>): void {
    if (this.loading()) return;
    this.loading.set(true);
    this.getBusinessUnitsUseCase.execute()
      .pipe(takeUntil(destroy$))
      .subscribe({
        next: (grouped) => {
          this.businessUnits.set(grouped);
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error loading business units:', error);
          this.loading.set(false);
        }
      });
  }

  addBusinessUnit(businessUnit: IBusinessUnit): void {
    // Si existe, actualizar; si no, agregar al inicio
    this.businessUnits.update(businessUnits => {
      const index = businessUnits.findIndex(bu => bu._id === businessUnit._id);
      if (index !== -1) {
        // Actualizar el existente
        return businessUnits.map(bu =>
          bu._id === businessUnit._id ? { ...bu, ...businessUnit } : bu
        );
      } else {
        // Agregar al inicio
        return [...businessUnits, businessUnit];
      }
    });
  }

  updateBusinessUnit(updatedBusinessUnit: any): void {
    this.businessUnits.update(businessUnits =>
      businessUnits.map(bu => {
        const businessUnitIdToMatch = updatedBusinessUnit._id
        if (bu._id === businessUnitIdToMatch) {
          // Merge para preservar relaciones populadas que puedan venir del listado inicial
          return {
            ...bu,
            ...updatedBusinessUnit,
            _id: bu._id, // Preservar el _id original
          };
        }
        return bu;
      })
    );
  }

  removeBusinessUnit(businessUnitId: string): void {
    this.businessUnits.update(businessUnits => businessUnits.filter(bu => bu._id !== businessUnitId));
  }

  clear(): void {
    this.loading.set(false);
  }
}