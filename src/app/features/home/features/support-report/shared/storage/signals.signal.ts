import { Injectable, signal } from '@angular/core';
import { IRespImages, ISupportReport } from '../interfaces/support-report.interface';

@Injectable({
    providedIn: 'root'
})
export class SignalsSupportReport {

    public $reportsArr = signal<ISupportReport[]>([]);
    public $clonReportsArr = signal<ISupportReport[]>([]);
    public $report = signal<ISupportReport>({} as ISupportReport);
    public $images = signal<IRespImages[]>([]);

    public setMany(values: Partial<Record<keyof SignalsSupportReport, any>>): void {
        Object.entries(values).forEach(([key, value]) => {
            const signalRef: any = (this as any)[key];
            if (signalRef?.set) {
                signalRef.set(value);
            }
        });
    }

    public resetAll(): void { }
}