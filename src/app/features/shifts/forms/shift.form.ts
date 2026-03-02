import { FormGroup, FormControl } from "@angular/forms";

export const ShiftForm = new FormGroup({
    shift: new FormControl<string>('', { nonNullable: true }),
    description: new FormControl<string>({ value: '', disabled: true }, { nonNullable: true }),
    startTime: new FormControl<Date | null>(null, { nonNullable: true }),
    endTime: new FormControl<Date | null>(null, { nonNullable: true }),
});