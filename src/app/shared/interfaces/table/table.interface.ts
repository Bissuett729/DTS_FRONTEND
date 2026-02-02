export interface ITableAction {
    label?: string | ((row: any) => string);
    callbackName: string;
    class?: string | ((row: any) => string);
    disabledFn?: (row: any) => boolean;
    tooltip?: string | ((row: any) => string);
    disableTooltip?: string;
    badgesClass?: string;
    badgesCount?: (row: any) => number;
    icon?: string | ((row: any) => string);
    iconClass?: string | ((row: any) => string);
    visible?: boolean | ((row: any) => boolean);
}

export interface ITableColumn {
    key: string;
    label: string;
    pipe?: string | ((value: any) => any);
    pipeArgs?: any[];
    defaultValue?: string | number;
    keyToolTip?: string;
    invertConditional?: boolean;
    rowBackground?: string;
    customCondition?: (row: any) => boolean;
    fallbackKey?: string;
    fallbackIf?: (row: any) => boolean;
    cellClassFn?: (row: any, col?: ITableColumn) => string | string[] | { [klass: string]: boolean };
    progressFn?: (row: any) => number; // función opcional que retorna un número
    progressMax?: number; // máximo de la barra (por defecto 100)
    progressShowLabel?: boolean; // mostrar % o no
    /** Color base de la barra (se aplicará al gradiente) */
    progressColor?: string;
    sortable?: boolean;
    /** Configuración para el tipo boolean */
    booleanOptions?: {
        trueLabel?: string;
        falseLabel?: string;
        trueClass?: string;
        falseClass?: string;
    };
    type?: 'status' | 'counter' | 'conditional' | 'boolean' | 'progress' | 'action' | 'truncateText' | 'input';
    inputOptions?: {
        placeholder?: string;
        type?: string; // 'text', 'number', 'date', etc.
        class?: string;
        onChange?: (row: any, value: any) => void; // callback cuando cambia
    };
    position?: 'vertical' | 'horizontal'
    actions?: ITableAction[];
    valueFn?: (row: any) => any;
    maxWords?: number | ((row: any) => number);
    truncateClass?: (row: any, col?: ITableColumn) => string | string[] | { [klass: string]: boolean };
}