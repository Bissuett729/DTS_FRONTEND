import { Observable } from 'rxjs';
import { IRole } from '../../interfaces';

/**
 * Contrato del repositorio de roles
 * Define las operaciones que cualquier implementación debe cumplir
 */
export abstract class RolesRepository {

  /**
   * Obtener todos los roles disponibles
   */
  abstract getRoles(): Observable<IRole[]>;

  abstract createRole(role: import('../../dtos').CreateRoleDto): Observable<IRole>;

  abstract updateRole(roleId: string, role: import('../../dtos').UpdateRoleDto): Observable<IRole>;

  abstract deleteRole(roleId: string): Observable<void>;
}
