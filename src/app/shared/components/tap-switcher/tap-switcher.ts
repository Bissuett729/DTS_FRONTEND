import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ITapSwitcher {
  label: string,
  icon?: string,
  iconClass?: string
  customClass?: string
}

@Component({
  selector: 'dts-tab-switcher',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tap-switcher.html',
})
export class TabSwitcherComponent {
  // Lista de tabs recibida como Input
  @Input({ required: true }) tabs: ITapSwitcher[] = [];

  // Índice seleccionado
  @Input({ required: true }) selectedIndex = 0;

  // Evento para notificar al padre
  @Output() selectedIndexChange = new EventEmitter<number>();

  selectTab(index: number) {
    this.selectedIndex = index;
    this.selectedIndexChange.emit(this.selectedIndex);
  }
}