export type ColumnType = 'text' | 'icon' | 'action' | 'date' | 'badge' | 'custom';

export interface ITableAction<T = any> {
  icon: string;
  label: string;
  class?: string;
  callback: (item: T) => void;
  show?: (item: T) => boolean;
}

export interface ITableColumn<T = any> {
  key: string; // Supports nesting with dot notation, e.g., 'user.profile.name'
  label: string; // Header text
  altern?: string; // Fallback value if null/undefined
  type?: ColumnType; // Data type for rendering
  icon?: string; // Icon name if type is 'icon'
  actions?: ITableAction<T>[]; // Actions if type is 'action'
  class?: string; // CSS class for the cell
  headerClass?: string; // CSS class for the header
  sortable?: boolean; // Flag for sorting
}

export interface IPagination {
  totalItems: number;
  pageSize: number;
  currentPage: number;
  pageSizeOptions?: number[];
}
