import { IDepartment } from './department.interface';
import { IRole } from './roles.interface';
import { IBusinessUnit, ITool } from './tool.interface';

export interface IUser {
  _id: string;
  username: string;
  clock: number;
  email: string;
  roleIds: IRole[];
  departmentId?: IDepartment;
  businessUnitId?: IBusinessUnit;
  tools: ITool[];
  active: boolean;
  authorized: boolean;
  requiresPasswordChange?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  lastLogin?: Date;
}

export interface IToolsByBusinessUnit {
  bu: string;
  tools: ITool[];
}

export interface IToolTemplate {
  _id: string;
  title: string;
  tools: string[];
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICreateUserDto {
  name: string;
  lastName: string;
  email: string;
  password: string;
  roleId: string;
  departmentId: string;
  businessUnit: string;
}

export type IUpdateUserDto = Partial<Omit<IUser, '_id' | 'createdAt' | 'updatedAt'>>;

export interface IUserFilters {
  username?: string;
  clock?: number;
  roleId?: string;
  departmentId?: string;
  businessUnitId?: string;
  active?: boolean;
  page?: number;
  limit?: number;
}

export interface IUserListResponse {
  users: IUser[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
