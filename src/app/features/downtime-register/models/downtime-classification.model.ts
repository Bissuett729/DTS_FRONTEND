import { FormControl } from '@angular/forms';

export interface IDowntimeClassification {
  department: string;
  downtimeReported: number;
  problemDescription: string | null;
}
