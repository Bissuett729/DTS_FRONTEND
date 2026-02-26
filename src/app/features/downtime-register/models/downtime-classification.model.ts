import { FormControl } from '@angular/forms';

export interface IDowntimeClassification {
  department: string;
  downtimeReported: number;
  problemDescription: FormControl<string | null>;
  actionTaken: FormControl<string | null>;
}
