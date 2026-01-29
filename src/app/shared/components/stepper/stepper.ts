import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface IStep {
  id: string | number;
  label: string;
  icon?: string;
  description?: string;
  optional?: boolean;
}

@Component({
  selector: 'foxcode-stepper',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full py-4">
      <div class="flex items-center w-full">
        @for (step of steps; track step.id; let i = $index; let last = $last) {
          <!-- Step Circle & Connector -->
          <div class="flex items-center" [class.flex-1]="!last">
            <!-- Step Wrapper -->
            <div class="relative flex flex-col items-center group">
              <!-- Circle -->
              <div
                (click)="onStepClick(i)"
                [class.cursor-pointer]="clickable"
                [class.bg-foxcode]="i <= currentStep"
                [class.border-foxcode]="i <= currentStep"
                [class.bg-white]="i > currentStep"
                [class.border-gray-200]="i > currentStep"
                [class.text-white]="i <= currentStep"
                [class.text-gray-400]="i > currentStep"
                class="w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 z-10 shadow-sm"
              >
                @if (step.icon) {
                  <i [class]="step.icon + ' text-lg'"></i>
                } @else {
                  <span class="font-bold text-sm">{{ i + 1 }}</span>
                }

                <!-- Badge for completed -->
                @if (i < currentStep) {
                  <div
                    class="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center"
                  >
                    <i class="ri-check-line text-[10px] text-white"></i>
                  </div>
                }
              </div>

              <!-- Label -->
              <div class="absolute top-12 whitespace-nowrap text-center">
                <p
                  [class.text-foxcode]="i === currentStep"
                  [class.font-bold]="i === currentStep"
                  [class.text-gray-400]="i > currentStep"
                  [class.text-gray-900]="i < currentStep"
                  class="text-xs transition-colors duration-300"
                >
                  {{ step.label }}
                </p>
                @if (step.description) {
                  <p class="text-[10px] text-gray-400 mt-0.5 leading-tight">
                    {{ step.description }}
                  </p>
                }
              </div>
            </div>

            <!-- Connector Line -->
            @if (!last) {
              <div
                class="flex-1 h-0.5 mx-4 transition-all duration-500"
                [class.bg-foxcode]="i < currentStep"
                [class.bg-gray-100]="i >= currentStep"
              ></div>
            }
          </div>
        }
      </div>

      <!-- Spacer for labels -->
      <div class="h-12"></div>
    </div>
  `,
  styles: [],
})
export class Stepper {
  @Input() steps: IStep[] = [];
  @Input() currentStep: number = 0;
  @Input() clickable: boolean = false;

  @Output() stepChange = new EventEmitter<number>();

  onStepClick(index: number): void {
    if (this.clickable) {
      this.stepChange.emit(index);
    }
  }
}
