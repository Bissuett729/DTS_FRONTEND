import { FormGroup, FormControl } from "@angular/forms";

export const metricsForm = new FormGroup({
    actualOut: new FormControl<number | null>(null, { nonNullable: true }),
    standardOut: new FormControl<number | null>({ value: null, disabled: true }, { nonNullable: true }),
});