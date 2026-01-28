import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { BusinessUnitRepository } from '../../../domain/repositories';
import { CreateBusinessUnitDto, IBusinessUnit, UpdateBusinessUnitDto } from '../../../domain';

@Injectable({
  providedIn: 'root'
})
export class BusinessUnitApiRepository extends BusinessUnitRepository {
  private http = inject(HttpClient);
  private businessUnitsURL = `${environment.userURL}/v1/business-units`;

  getBusinessUnits(): Observable<IBusinessUnit[]> {
    return this.http.get<IBusinessUnit[]>(this.businessUnitsURL);
  }

  createBusinessUnit(businessUnit: CreateBusinessUnitDto): Observable<IBusinessUnit> {
    return this.http.post<IBusinessUnit>(this.businessUnitsURL, businessUnit);
  }

  updateBusinessUnit(businessUnitId: string, businessUnit: UpdateBusinessUnitDto): Observable<IBusinessUnit> {
    const url = `${this.businessUnitsURL}/${businessUnitId}`;
    return this.http.put<IBusinessUnit>(url, businessUnit);
  }
}

export const BUSINESS_UNIT_REPOSITORY_PROVIDER = {
  provide: BusinessUnitRepository,
  useExisting: BusinessUnitApiRepository
};
