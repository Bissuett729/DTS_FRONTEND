import { FormControl, FormGroup, Validators } from "@angular/forms";

export const classficationForm = new FormGroup({
    department: new FormControl<string | null>(null, { nonNullable: true, validators: [Validators.required] }),
    downtimeReported: new FormControl<string | null>(null, { nonNullable: true, validators: [Validators.required] }),
    problemDescription: new FormControl<string | null>(null),
});