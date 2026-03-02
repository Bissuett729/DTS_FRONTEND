export interface IDepartment {
  _id: string;
  department: string;
  description?: string;
  reasons: string[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UIDepartment extends IDepartment {
  addingReason: boolean;
  newReasonText: string;
  editingName: boolean;
  editingNameText: string;
}

export interface IEditingState {
  deptIndex: number;
  reasonIndex: number;
  originalText: string;
  text: string;
}