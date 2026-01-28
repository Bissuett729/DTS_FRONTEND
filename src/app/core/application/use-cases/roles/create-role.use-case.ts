import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateRoleDto, IRole } from '../../../domain';
import { RolesApiRepository } from '../../../infrastructure';

@Injectable({
  providedIn: 'root',
})
export class CreateRoleUseCase {
  constructor(private rolesRepository: RolesApiRepository) {}

  execute(role: CreateRoleDto): Observable<IRole> {
    return this.rolesRepository.createRole(role);
  }
}
