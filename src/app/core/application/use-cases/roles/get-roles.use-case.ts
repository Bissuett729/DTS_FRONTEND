import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IRole } from '../../../domain';
import { RolesApiRepository } from '../../../infrastructure';

@Injectable({
  providedIn: 'root',
})
export class GetRolesUseCase {
  constructor(private rolesRepository: RolesApiRepository) {}

  execute(): Observable<IRole[]> {
    return this.rolesRepository.getRoles();
  }
}