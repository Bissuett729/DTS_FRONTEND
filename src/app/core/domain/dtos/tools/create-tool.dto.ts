export interface CreateToolDto {
    title: string;
    link: string;
    toolMode: string[];
    businessUnitId: string;
    active?: boolean;
}