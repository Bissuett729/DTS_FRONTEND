import { Observable } from 'rxjs';
import {
  IUser,
  ICreateUserDto,
  IUpdateUserDto,
  IUserFilters,
  IUserListResponse,
} from '../../interfaces/user.interface';

/**
 * Contrato del repositorio de usuarios
 * Define las operaciones que cualquier implementación debe cumplir
 */
export abstract class UserRepository {
  /**
   * Obtener lista de usuarios con filtros y paginación
   */
  abstract getUsers(filters?: IUserFilters): Observable<IUserListResponse>;

  /**
   * Obtener un usuario por ID
   */
  abstract getUserById(userId: string): Observable<IUser>;

  /**
   * Crear un nuevo usuario
   */
  abstract createUser(user: ICreateUserDto): Observable<IUser>;

  /**
   * Actualizar un usuario existente
   */
  abstract updateUser(userId: string, user: IUpdateUserDto): Observable<IUser>;

  /**
   * Eliminar un usuario
   */
  abstract deleteUser(userId: string): Observable<void>;

  /**
   * Cambiar el estado activo/inactivo de un usuario
   */
  abstract toggleUserStatus(userId: string, active: boolean): Observable<IUser>;


  /**
 * Aplicar un tool template a un usuario
 */
  abstract applyToolTemplate(userId: string, templateId: string): Observable<IUser>;
}
