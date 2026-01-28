import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RolesApiRepository } from '../../../infrastructure';

@Injectable({
  providedIn: 'root',
})
export class DeleteRoleUseCase {
  constructor(private rolesRepository: RolesApiRepository) {}

  execute(roleId: string): Observable<void> {
    return this.rolesRepository.deleteRole(roleId);
  }
}
