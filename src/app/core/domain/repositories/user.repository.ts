import { Observable } from 'rxjs';
import {
  IUser,
  ICreateUserDto,
  IUpdateUserDto,
  IUserFilters,
  IUserListResponse,
  IRole,
  IDepartment,
  IToolsByBusinessUnit,
  IToolTemplate,
} from '../interfaces/user.interface';
import { IBusinessUnit } from '../interfaces';

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
   * Obtener todos los roles disponibles
   */
  abstract getRoles(): Observable<IRole[]>;

  /**
   * Obtener todos los departamentos
   */
  abstract getDepartments(businessUnit?: string): Observable<IDepartment[]>;

  /**
   * Obtener todas las unidades de negocio
   */
  abstract getBusinessUnits(): Observable<IBusinessUnit[]>;

  /**
   * Obtener todas las tools agrupadas por business unit
   */
  abstract getToolsGroupedByBusinessUnit(): Observable<IToolsByBusinessUnit[]>;

  /**
   * Obtener todos los tool templates disponibles
   */
  abstract getToolTemplates(): Observable<IToolTemplate[]>;

  /**
   * Aplicar un tool template a un usuario
   */
  abstract applyToolTemplate(userId: string, templateId: string): Observable<IUser>;
}
