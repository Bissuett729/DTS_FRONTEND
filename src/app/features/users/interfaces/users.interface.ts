export interface IResponseUsers {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    users: IUser[];
}

export interface IUser {
    _id: string;
    username: string;
    email: string;
    clock: number;
    supervisor: null;
    active: boolean;
    requiresPasswordChange: boolean;
    businessUnitId: null;
    tools: ITool[];
    roleIds: IRole[];
    departmentId: null;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
    notifications: any[];
    authorized: boolean;
    profileImage?: null;
}

export interface IRole {
    _id: string;
    name: string;
    active: boolean;
}

export interface ITool {
    _id: string;
    title: string;
    link: string;
    toolMode: string[];
    businessUnitId: IRole | null;
    active: boolean;
}

export interface ICreateUpdateUser {
    username: string;
    email: string;
    password: string;
    clock: number;
    roleIds: string[];
    supervisor?: string;
    active?: boolean;
    authorized?: boolean;
}