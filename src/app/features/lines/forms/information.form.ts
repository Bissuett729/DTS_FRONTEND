import { FormControl, FormGroup } from "@angular/forms";

export const generalInfoForm = new FormGroup({
    lineName: new FormControl<string | null>(null, { nonNullable: true }),
    standard: new FormControl<number | null>(null, { nonNullable: true }),
    status: new FormControl<boolean>(false, { nonNullable: true }),
});