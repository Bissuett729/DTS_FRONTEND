import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { IBusinessUnit } from '../../../domain';

@Injectable({
  providedIn: 'root',
})
export class GetBusinessUnitsUseCase {
  private userRepository = inject(UserRepository);

  execute(): Observable<IBusinessUnit[]> {
    return this.userRepository.getBusinessUnits();
  }
}
