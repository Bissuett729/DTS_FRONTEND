import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { IToolsByBusinessUnit } from '../../../domain/interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class GetToolsUseCase {
  constructor(private userRepository: UserRepository) {}

  execute(): Observable<IToolsByBusinessUnit[]> {
    return this.userRepository.getToolsGroupedByBusinessUnit();
  }
}
