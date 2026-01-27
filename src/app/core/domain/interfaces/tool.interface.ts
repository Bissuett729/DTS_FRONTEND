export interface IBusinessUnit {
  _id: string;
  name: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ITool {
  _id: string;
  title: string;
  link: string;
  toolMode: string[];
  businessUnitId: IBusinessUnit;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
