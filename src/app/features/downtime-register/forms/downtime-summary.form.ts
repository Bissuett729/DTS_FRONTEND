import { FormControl, FormGroup } from "@angular/forms";

export const downtimeTotalForm = new FormGroup({
    generatedDowntime: new FormControl<number | null>({ value: null, disabled: true }, { nonNullable: true }),
    unreportedDowntime: new FormControl<number | null>({ value: null, disabled: true }, { nonNullable: true }),
    totalReportedDowntime: new FormControl<number | null>({ value: 0, disabled: true }, { nonNullable: true }),
});