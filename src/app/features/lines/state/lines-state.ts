import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LinesState {
  
  lines = signal<any>([]);
  
  loadingLines = signal<boolean>(false);
  loadingCreateLine = signal<boolean>(false);
  loadingUpdateLine = signal<boolean>(false);
  loadingDeleteLine = signal<boolean>(false);

}
