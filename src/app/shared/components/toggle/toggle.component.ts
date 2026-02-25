import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'dts-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <label class="relative inline-flex items-center cursor-pointer h-full">
      <input [checked]="isChecked" (click)="handleAuthorizeToggle($event)" class="sr-only peer" type="checkbox">
      <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-[#787878] peer-checked:after:translate-x-full 
          peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:after:left-0.5 after:bg-white 
          after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 
          after:transition-all dark:border-gray-600 peer-checked:bg-[#1975d2]"></div>
    </label>
  `
})
export class DtsToggle {

  @Input() isChecked: boolean = false;

  @Output() toggleChange = new EventEmitter<boolean>();

  public async handleAuthorizeToggle(event: MouseEvent) {
    event.preventDefault();
    this.toggleChange.emit(!this.isChecked);
  }

}