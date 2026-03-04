export interface IDepartment {
    _id: string;
    department: string;
    reasons: string[];
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
}
