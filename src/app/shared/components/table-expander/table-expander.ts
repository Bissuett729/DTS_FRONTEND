import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input, Output, EventEmitter, ElementRef, QueryList, SimpleChanges, ViewChildren, NgZone, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ElapsedTimePipe, StatusClassPipe } from '../../pipes';
import { TableExpanderComponentType } from './table-expander.type';
import { ITableAction, ITableColumn } from '../../interfaces';

@Component({
  selector: 'foxcode-table-expander',
  standalone: true,
  imports: [
    CommonModule,
    MatTooltipModule,
    ElapsedTimePipe,
    StatusClassPipe
  ],
  providers: [DatePipe],
  templateUrl: './table-expander.html',
  styleUrls: ['./table-expander.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableExpander {
  /** Columnas de la tabla (definición y configuración) */
  @Input({ required: true }) columns: ITableColumn[] = [];
  /** Datos a mostrar en la tabla */
  @Input({ required: true }) data: any[] = [];
  /** Acciones generales (columna de acciones) */
  @Input() actions?: ITableAction[] = [];
  /** Etiqueta para la columna de acciones */
  @Input() labelAction: string = 'Actions';
  /** Token opcional para autenticación o tracking */
  @Input() token: string = '';
  /** Componente a renderizar en la expansión */
  @Input({ required: true }) expanderComponent!: TableExpanderComponentType;
  /** Permite múltiples filas expandidas */
  @Input() allowMultipleExpander: boolean = false;
  /** Índice externo para expandir una fila desde fuera */
  @Input() externalToggleIndex: number | null = null;
  /** Clases condicionales para la expansión */
  @Input() classConditional: string = '!max-h-[23rem] 2xl:!max-h-[35rem] p-2';

  /** Columna actualmente ordenada */
  public sortColumn: string | null = null;
  /** Dirección de ordenamiento actual */
  public sortDirection: 'asc' | 'desc' | null = null;

  /** Emite cuando se hace click en una acción */
  @Output() actionClicked = new EventEmitter<{ action: string, row: any }>();

  @ViewChildren('tableRow') tableRows!: QueryList<ElementRef<HTMLTableRowElement>>;

  /** Permite múltiples filas expandidas (cada nivel independiente) */
  public expandedRows = new Set<any>();
  /** Copia local de los datos para restaurar orden */
  private originalData: any[] = [];

  constructor(private datePipe: DatePipe, private zone: NgZone, private cdr: ChangeDetectorRef) { }

  ngAfterViewInit(): void {
    this.tableRows.changes.subscribe(() => {
      if (this.externalToggleIndex != null) {
        this.scrollToRow(this.externalToggleIndex);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('externalToggleIndex' in changes) {
      const i = changes['externalToggleIndex'].currentValue;
      if (typeof i === 'number' && i >= 0) {
        this.openRowByIndex(i);
        // ⚠️ Espera a que Angular aplique la expansión/DOM
        this.cdr.detectChanges();
        this.zone.onStable.asObservable().pipe().subscribe(() => {
          setTimeout(() => this.scrollToRow(i), 80);
        });
      }
    }
    if ('data' in changes) {
      this.originalData = [...this.data];
    }
  }

  /** Expande la fila por índice */
  private openRowByIndex(i: number) {
    const row = this.data?.[i];
    if (!row) return;
    if (!this.allowMultipleExpander) this.expandedRows.clear();
    this.expandedRows.add(row);
  }

  /** Hace scroll a la fila expandida */
  private scrollToRow(index: number) {
    const rowEl = this.tableRows?.get(index)?.nativeElement;
    if (!rowEl) return;
    const scrollHost = this.findScrollableParent(rowEl) ?? document.scrollingElement ?? document.documentElement;
    const rowTop = this.offsetTopRelativeTo(rowEl, scrollHost as HTMLElement);
    const target = rowTop - (scrollHost.clientHeight - rowEl.clientHeight) / 2;
    (scrollHost as HTMLElement).scrollTo({
      top: target,
      behavior: 'smooth',
    });
  }

  /** Busca el ancestro con overflow-y: auto|scroll */
  private findScrollableParent(el: HTMLElement): HTMLElement | null {
    let p: HTMLElement | null = el.parentElement;
    while (p) {
      const style = getComputedStyle(p);
      const oy = style.overflowY;
      if (oy === 'auto' || oy === 'scroll') return p;
      p = p.parentElement;
    }
    return null;
  }

  /** offsetTop relativo a un ancestro (en lugar del documento) */
  private offsetTopRelativeTo(el: HTMLElement, ancestor: HTMLElement): number {
    let y = 0;
    let node: HTMLElement | null = el;
    while (node && node !== ancestor && node instanceof HTMLElement) {
      y += node.offsetTop;
      node = node.offsetParent as HTMLElement | null;
    }
    return y;
  }

  /** Alternancia de colores según índice */
  public isEven(index: number): boolean {
    return index % 2 === 0;
  }

  /** Alterna la expansión de una fila */
  public toggleRow(row: any) {
    if (!this.expanderComponent) return;
    if (this.expandedRows.has(row)) {
      this.expandedRows.delete(row);
    } else {
      if (!this.allowMultipleExpander) {
        this.expandedRows.clear();
      }
      this.expandedRows.add(row);
    }
  }

  /** Indica si la fila está expandida */
  public isRowExpanded(row: any): boolean {
    return this.expandedRows.has(row);
  }

  /** Obtiene valor anidado de un objeto */
  public getNestedValue(obj: any, path: string): any {
    if (!obj || !path) return '-';
    return path.split('.').reduce((acc, key) => acc?.[key], obj) ?? '-';
  }

  /** Aplica pipes o transformaciones a la celda */
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

  /** Evalúa condición personalizada o booleana */
  public evaluateConditional(row: any, col: ITableColumn, shouldBeTrue: boolean): boolean {
    let result: boolean;
    if (typeof col.customCondition === 'function') {
      result = col.customCondition(row);
    } else {
      const value = this.getNestedValue(row, col.key);
      result = !!value;
    }
    if (col.invertConditional) {
      result = !result;
    }
    return result === shouldBeTrue;
  }

  /** trackBy para *ngFor, mejora el rendimiento */
  public trackByFn(index: number, item: any): any {
    return `${item?.id ?? index}-${this.expanderComponent?.name || 'root'}`;
  }

  /** Emite el evento de acción */
  public onAction(action: string, row: any): void {
    this.actionClicked.emit({ action, row });
  }

  /** Calcula el valor de progreso para la barra */
  public progressValue(row: any, col: ITableColumn): number {
    if (typeof col.progressFn === 'function') {
      return col.progressFn(row) ?? 0;
    }
    const value = this.getNestedValue(row, col.key);
    return typeof value === 'number' ? value : 0;
  }

  /** Determina si se debe mostrar el badge de acción */
  public showBadge(action: any, row: any): boolean {
    return typeof action?.badgesCount?.(row) === 'number';
  }

  /** Obtiene el texto del tooltip para una acción */
  public getToolTipText(action: ITableAction, row: any) {
    return typeof action.tooltip === 'function' ? action.tooltip(row) : action.tooltip ?? '';
  }

  /** Obtiene la clase del icono de una acción */
  public getActionIconClass(action: ITableAction, row: any): string {
    const icon = typeof action.icon === 'function' ? action.icon(row) : action.icon ?? '';
    const iconClass = typeof action.iconClass === 'function' ? action.iconClass(row) : action.iconClass ?? '';
    return `${icon} ${iconClass}`.trim();
  }

  /** Ordena la tabla por la columna seleccionada, soportando tipos mixtos */
  public onSort(columnKey: string): void {
    if (this.sortColumn === columnKey) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : this.sortDirection === 'desc' ? null : 'asc';
    } else {
      this.sortColumn = columnKey;
      this.sortDirection = 'asc';
    }
    if (this.sortDirection) {
      this.data = [...this.data].sort((a, b) => this.compareValues(this.getNestedValue(a, columnKey), this.getNestedValue(b, columnKey)) * (this.sortDirection === 'asc' ? 1 : -1));
    } else {
      this.data = [...this.originalData];
    }
  }

  /** Compara valores para ordenamiento, soportando strings, números y fechas */
  private compareValues(a: any, b: any): number {
    if (!isNaN(a) && !isNaN(b)) {
      return Number(a) - Number(b);
    }
    const dateA = new Date(a);
    const dateB = new Date(b);
    if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
      return dateA.getTime() - dateB.getTime();
    }
    return String(a).localeCompare(String(b));
  }
}