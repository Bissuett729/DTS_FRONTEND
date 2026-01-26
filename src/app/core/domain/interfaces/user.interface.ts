export interface IUser {
  _id: string;
  username: string;
  email: string;
  roleIds: IRole[];
  departmentId?: IDepartment;
  businessUnitId?: IBusinessUnit;
  tools: ITool[];
  active: boolean;
  authorized: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  lastLogin?: Date;
}

export interface ITool {
  _id: string;
  title: string;
  link: string;
  toolMode: string[];
  businessUnitId: IBusinessUnit;
  active: boolean;
}

export interface IRole {
  _id: string;
  name: string;
  active: boolean;
}

export interface IDepartment {
  _id: string;
  name: string;
  description: string;
  businessUnit: string;
  active: boolean;
}

export interface IBusinessUnit {
  _id: string;
  name: string;
  active: boolean;
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

export interface IUpdateUserDto {
  name?: string;
  lastName?: string;
  email?: string;
  roleId?: string;
  departmentId?: string;
  businessUnit?: string;
  active?: boolean;
}

export interface IUserFilters {
  search?: string;
  roleId?: string;
  departmentId?: string;
  businessUnit?: string;
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