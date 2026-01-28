import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BusinessUnitApiRepository } from '../../../infrastructure/repositories/business-unit/business-unit-api.repository';
import { CreateBusinessUnitDto, IBusinessUnit } from '../../../domain';

@Injectable({
  providedIn: 'root',
})
export class CreateBusinessUnitUseCase {
  constructor(private businessUnitsRepository: BusinessUnitApiRepository) {}

  execute(businessUnit: CreateBusinessUnitDto): Observable<IBusinessUnit> {
    return this.businessUnitsRepository.createBusinessUnit(businessUnit);
  }
}
