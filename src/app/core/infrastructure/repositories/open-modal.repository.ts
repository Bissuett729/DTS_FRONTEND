import { MatDialog, MatDialogRef } from '@angular/material/dialog';

let dialogInstance: MatDialog | null = null;

export function OpenModal<T>(
    component: T,
    config?: {
        data?: any;
        disableClose?: boolean;
        maxWidth?: string;
        maxHeight?: string;
    }
): MatDialogRef<any> {
    if (!dialogInstance) {
        throw new Error(`Instance doesn't exist`);
    }

    return dialogInstance.open(component as any, {
        data: config?.data ?? null,
        closeOnNavigation: true,
        disableClose: config?.disableClose ?? true,
        maxWidth: config?.maxWidth ?? '90vw',
        maxHeight: config?.maxHeight ?? '90vh',
    });
}

export function initModalHelper(dialog: MatDialog) {
    dialogInstance = dialog;
}
