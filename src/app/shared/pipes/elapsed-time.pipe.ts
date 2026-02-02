import { Pipe, PipeTransform, ChangeDetectorRef, NgZone, OnDestroy } from '@angular/core';

@Pipe({ name: 'elapsedTime', pure: false, standalone: true })
export class ElapsedTimePipe implements PipeTransform, OnDestroy {
    private interval: any;
    private value!: Date;

    constructor(private cdr: ChangeDetectorRef, private zone: NgZone) { }

    transform(value: Date | string): string {
        this.value = new Date(value);

        if (!this.interval) {
            this.zone.runOutsideAngular(() => {
                this.interval = setInterval(() => {
                    this.zone.run(() => this.cdr.markForCheck());
                }, 1000);
            });
        }

        return this.getElapsedTime(this.value);
    }

    ngOnDestroy(): void {
        clearInterval(this.interval);
    }

    private getElapsedTime(start: Date): string {
        const now = new Date();
        let seconds = Math.floor((now.getTime() - start.getTime()) / 1000);

        const years = Math.floor(seconds / (365 * 24 * 60 * 60)); seconds -= years * 365 * 24 * 60 * 60;
        const months = Math.floor(seconds / (30 * 24 * 60 * 60)); seconds -= months * 30 * 24 * 60 * 60;
        const days = Math.floor(seconds / (24 * 60 * 60)); seconds -= days * 24 * 60 * 60;
        const hours = Math.floor(seconds / (60 * 60)); seconds -= hours * 60 * 60;
        const minutes = Math.floor(seconds / 60);

        const parts = [];
        if (years) parts.push(`${years}y`);
        if (months) parts.push(`${months}mo`);
        if (days) parts.push(`${days}d`);
        if (hours) parts.push(`${hours}h`);
        if (minutes) parts.push(`${minutes}m`);
        return parts.join(' ') || '0m';
    }
}