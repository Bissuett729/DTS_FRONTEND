export interface ILoginCredentials {
    clock: number;
    password: string;
}

export interface ILoginResponse {
    accessToken: string;
    user: {
        _id: string;
        username: string;
        email: string;
        clock: number;
        supervisor: string | null;
        active: boolean;
        requiresPasswordChange: boolean;
        businessUnitId: string;
        tools: string[];
        roleIds: string[];
        departmentId: string;
        createdAt: string;
        updatedAt: string;
        notifications?: string[];
        authorized: boolean;
    };
}

export interface IRefreshTokenResponse extends ILoginResponse {}