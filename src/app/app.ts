import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { initModalHelper } from './core/infrastructure/repositories/modal/open-modal.repository';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
})
export class App {
  private dialog = inject(MatDialog);

  constructor() {
    initModalHelper(this.dialog);
    this.printFoxCodeTerminal();
  }

  printFoxCodeTerminal(): void {
    console.log(`
      ██████╗    ████████████   █████████
      ██╔═══██╗  ╚═══╗██╔═══╝   ███╔════╝
      ██║   ██║      ║██║       █████████
      ██║   ██║      ║██║       ╔═════███
      ╚██████╔╝      ║██║       █████████
      ╚═════╝        ╚══╝       ╚═══════╝
    `);
  }
}
