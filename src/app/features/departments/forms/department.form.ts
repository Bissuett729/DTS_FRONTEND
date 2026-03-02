import { FormGroup, FormControl } from "@angular/forms";

export const DepartmentForm = new FormGroup({
    department: new FormControl<string>('', { nonNullable: true }),
    reasons: new FormControl<string[]>({ value: [], disabled: true }, { nonNullable: true }),
});