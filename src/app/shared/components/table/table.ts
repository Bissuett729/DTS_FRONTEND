import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ElapsedTimePipe, StatusClassPipe, TruncateWordsPipe } from '../../pipes';
import { ITableAction, ITableColumn } from '../../interfaces';

@Component({
  selector: 'foxcode-dynamic-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTooltipModule,
    ElapsedTimePipe,
    StatusClassPipe,
    TruncateWordsPipe
  ],
  providers: [DatePipe],
  templateUrl: './table.html',
  styleUrls: ['./table.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Table {
  /** Columnas de la tabla (definición y configuración) */
  @Input({ required: true }) columns: ITableColumn[] = [];
  /** Datos a mostrar en la tabla */
  @Input({ required: true }) data: any[] = [];
  /** Acciones generales (columna de acciones) */
  @Input() actions?: ITableAction[] = [];
  /** Etiqueta para la columna de acciones */
  @Input() labelAction?: string = 'Actions';

  /** Columna actualmente ordenada */
  public sortColumn: string | null = null;
  /** Dirección de ordenamiento actual */
  public sortDirection: 'asc' | 'desc' | null = null;

  /** Emite cuando se hace click en una acción */
  @Output() actionClicked = new EventEmitter<{ action: string, row: any }>();

  /** Copia local de los datos para ordenamiento (evita mutar el input) */
  private originalData: any[] = [];

  constructor(private datePipe: DatePipe) { }

  ngOnChanges(): void {
    // Mantener copia original para restaurar orden
    this.originalData = [...this.data];
  }

  /**
   * Emite el evento de acción
   */
  public onAction(action: string, row: any): void {
    this.actionClicked.emit({ action, row });
  }

  /**
   * Obtiene el valor anidado de un objeto a partir de un path (e.g. 'user.name')
   */
  public getNestedValue(obj: any, path: string): any {
    if (!obj || !path) return '-';
    return path.split('.').reduce((acc, key) => acc?.[key], obj) ?? '-';
  }

  /**
   * Aplica un pipe o transformación al valor de la celda
   */
  public applyPipe(value: any, col: ITableColumn): any {
    const isEmpty = value === null || value === undefined || value === '';
    if (isEmpty) return col.defaultValue ?? '-';

    if (typeof col.pipe === 'function') return col.pipe(value);
    if (typeof col.pipe === 'string') {
      switch (col.pipe) {
        case 'date':
          const date = new Date(value);
          if (isNaN(date.getTime())) return col.defaultValue ?? '-';
          return this.datePipe.transform(value, ...(col.pipeArgs || []));
        default:
          return value;
      }
    }
    return value;
  }

  /**
   * Evalúa una condición personalizada o booleana para columnas condicionales
   */
  public evaluateConditional(row: any, col: ITableColumn, shouldBeTrue: boolean): boolean | null {
    let result: boolean | null = null;
    if (typeof col.customCondition === 'function') {
      result = col.customCondition(row);
    } else {
      const value = this.getNestedValue(row, col.key);
      if (value === null || value === undefined) return null;
      result = !!value;
    }
    if (col.invertConditional) {
      result = !result;
    }
    return result === shouldBeTrue ? true : false;
  }

  /**
   * Determina si el valor condicional es nulo o indefinido
   */
  public isNullConditional(row: any, col: ITableColumn): boolean {
    const value = typeof col.customCondition === 'function'
      ? col.customCondition(row)
      : this.getNestedValue(row, col.key);
    return value === null || value === undefined;
  }

  /**
   * trackBy para *ngFor, mejora el rendimiento
   */
  public trackByFn(index: number, item: any): any {
    return item?.id ?? index;
  }

  /**
   * Determina si se debe mostrar el badge de acción
   */
  public showBadge(action: any, row: any): boolean {
    return typeof action?.badgesCount?.(row) === 'number';
  }

  /**
   * Calcula el valor de progreso para la barra
   */
  public progressValue(row: any, col: ITableColumn): number {
    if (typeof col.progressFn === 'function') {
      return col.progressFn(row) ?? 0;
    }
    const value = this.getNestedValue(row, col.key);
    return typeof value === 'number' ? value : 0;
  }

  /**
   * Obtiene el texto del tooltip para una acción
   */
  public getToolTipText(action: ITableAction, row: any) {
    return typeof action.tooltip === 'function' ? action.tooltip(row) : action.tooltip ?? '';
  }

  /**
   * Obtiene la etiqueta de una acción
   */
  public getLabelOfAction(action: ITableAction, row: any) {
    return typeof action.label === 'function' ? action.label(row) : action.label ?? '';
  }

  /**
   * Obtiene la clase CSS de una acción
   */
  public getClassOfAction(action: ITableAction, row: any) {
    return typeof action.class === 'function' ? action.class(row) : action.class ?? '';
  }

  /**
   * Obtiene la clase del icono de una acción
   */
  public getActionIconClass(action: ITableAction, row: any): string {
    const icon = typeof action.icon === 'function' ? action.icon(row) : action.icon ?? '';
    const iconClass = typeof action.iconClass === 'function' ? action.iconClass(row) : action.iconClass ?? '';
    return `${icon} ${iconClass}`.trim();
  }

  /**
   * Determina si una acción es visible
   */
  public isActionVisible(action: ITableAction, row: any): boolean {
    if (typeof action.visible === 'function') {
      return action.visible(row);
    }
    return action.visible !== false;
  }

  /**
   * Obtiene el máximo de palabras para truncar texto
   */
  public getMaxWords(col: ITableColumn, row: any): number {
    if (typeof col.maxWords === 'function') {
      return col.maxWords(row);
    }
    return col.maxWords ?? 0;
  }

  /**
   * Maneja el cambio en un input dentro de la tabla
   */
  public onInputChange(row: any, col: ITableColumn, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    col.inputOptions?.onChange?.(row, value);
  }

  /**
   * Ordena la tabla por la columna seleccionada, soportando tipos mixtos
   */
  public onSort(columnKey: string): void {
    if (this.sortColumn === columnKey) {
      // Alternar entre ascendente, descendente y sin orden
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : this.sortDirection === 'desc' ? null : 'asc';
    } else {
      // Ordenar por una nueva columna
      this.sortColumn = columnKey;
      this.sortDirection = 'asc';
    }

    if (this.sortDirection) {
      // Copia para no mutar el input
      this.data = [...this.data].sort((a, b) => this.compareValues(this.getNestedValue(a, columnKey), this.getNestedValue(b, columnKey)) * (this.sortDirection === 'asc' ? 1 : -1));
    } else {
      // Restaurar el orden original
      this.data = [...this.originalData];
    }
  }

  /**
   * Compara valores para ordenamiento, soportando strings, números y fechas
   */
  private compareValues(a: any, b: any): number {
    // Si ambos son números
    if (!isNaN(a) && !isNaN(b)) {
      return Number(a) - Number(b);
    }
    // Si ambos son fechas
    const dateA = new Date(a);
    const dateB = new Date(b);
    if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
      return dateA.getTime() - dateB.getTime();
    }
    // Comparar como string
    return String(a).localeCompare(String(b));
  }
}

