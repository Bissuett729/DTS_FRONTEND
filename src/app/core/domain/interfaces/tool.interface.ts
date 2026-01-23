export interface BusinessUnit {
  _id: string;
  name: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Tool {
  _id: string;
  title: string;
  link: string;
  toolMode: string[];
  businessUnitId: BusinessUnit;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
