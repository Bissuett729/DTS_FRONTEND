import { Injectable, signal } from '@angular/core';
import { ILine } from '../interfaces/line.interface';

@Injectable({
  providedIn: 'root',
})
export class LinesState {
  lines = signal<ILine[]>([]);
  selectedLine = signal<ILine | null>(null);

  loadingLines = signal<boolean>(false);
  loadingCreateLine = signal<boolean>(false);
  loadingUpdateLine = signal<boolean>(false);
  loadingUpdateHourly = signal<boolean>(false);
  loadingDeleteLine = signal<boolean>(false);
}
