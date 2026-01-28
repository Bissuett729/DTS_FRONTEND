import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IRole, UpdateRoleDto } from '../../../domain';
import { RolesApiRepository } from '../../../infrastructure';

@Injectable({
  providedIn: 'root',
})
export class UpdateRoleUseCase {
  constructor(private rolesRepository: RolesApiRepository) {}

  execute(roleId: string, role: UpdateRoleDto): Observable<IRole> {
    return this.rolesRepository.updateRole(roleId, role);
  }
}
