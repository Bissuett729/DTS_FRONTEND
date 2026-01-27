import { IBusinessUnit } from "./tool.interface";

export interface IToolGroupedByBusinessUnit {
  bu: string;
  tools: Array<{
    _id: string;
    title: string;
    link: string;
    toolMode: string[];
    businessUnitId: IBusinessUnit;
    active: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }>;
}