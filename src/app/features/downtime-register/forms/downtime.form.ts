import { FormGroup, FormControl } from "@angular/forms";

export const downtimeForm = new FormGroup({
    date: new FormControl<Date | null>(new Date(), { nonNullable: true }),
    weekNumber: new FormControl<number | null>(22, { nonNullable: true }),
    startTime: new FormControl<Date>((() => { const d = new Date(); d.setMinutes(0, 0, 0); return d; })(), { nonNullable: true }),
    endTime: new FormControl<Date>({ value: (() => { const d = new Date(); d.setHours(d.getHours() + 1, 0, 0, 0); return d; })(), disabled: true }, { nonNullable: true }),
    reason: new FormControl<string>('', { nonNullable: true }),
    shift: new FormControl<string | null>(null, { nonNullable: true }),
    line: new FormControl<string | null>(null, { nonNullable: true }),
    supervisor: new FormControl<string>('', { nonNullable: true }),
});