import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IBusinessUnit, UpdateBusinessUnitDto } from '../../../domain';
import { BusinessUnitApiRepository } from '../../../infrastructure/repositories/business-unit/business-unit-api.repository';

@Injectable({
  providedIn: 'root',
})
export class UpdateBusinessUnitUseCase {
  constructor(private businessUnitsRepository: BusinessUnitApiRepository) { }

  execute(businessUnitId: string, businessUnit: UpdateBusinessUnitDto): Observable<IBusinessUnit> {
    return this.businessUnitsRepository.updateBusinessUnit(businessUnitId, businessUnit); 
  }
}
