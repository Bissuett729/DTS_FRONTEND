export interface ISupportReportResp {
    items: ISupportReport[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface ISupportReport {
    _id: string;
    title: string;
    description: string;
    code: string;
    priority: number;
    tool: string;
    images: string[];
    browser: string;
    os: string;
    reportTime: Date;
    version: string;
    ipBrowser: string;
    port: string;
    userIp: string;
    createdBy: ISupportUser;
    status: string;
    comments: IComment[];
    history: IHistory[];
    createdAt: Date;
    updatedAt: Date;
    __v: number;
}

export interface IComment {
    user: ISupportUser;
    message: string;
    date: Date;
}

export interface ISupportUser {
    _id: string,
    clock: number | string,
    userName: string
}

export interface IHistory {
    action: string;
    user: ISupportUser;
    date: Date;
    from: null;
    to: string;
}

export interface IRespImages {
    base64: string;
    createdAt: Date;
    name: string;
    size: number;
    updatedAt: string;
    __v: number;
    _id: string;
}
