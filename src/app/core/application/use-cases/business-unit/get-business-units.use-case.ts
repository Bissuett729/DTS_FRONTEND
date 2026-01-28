import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IBusinessUnit } from '../../../domain';
import { BusinessUnitApiRepository } from '../../../infrastructure/repositories/business-unit/business-unit-api.repository';

@Injectable({
  providedIn: 'root',
})
export class GetBusinessUnitsUseCase {
  private businessUnitRepository = inject(BusinessUnitApiRepository);

  execute(): Observable<IBusinessUnit[]> {
    return this.businessUnitRepository.getBusinessUnits();
  }
}
