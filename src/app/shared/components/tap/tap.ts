import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ITap } from './tap.interface';

@Component({
  selector: 'foxcode-tab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tap.html',
})
export class Tab {
  // Lista de tabs recibida como Input
  @Input({required: true}) tabs: ITap[] = [];

  // Índice seleccionado
  @Input({required: true}) selectedIndex = 0;

  // Evento para notificar al padre
  @Output() selectedIndexChange = new EventEmitter<number>();

  selectTab(index: number) {
    this.selectedIndex = index;
    this.selectedIndexChange.emit(this.selectedIndex);
  }
}