import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { DtsModalLayout, DtsCard, DtsButton, DtsInput } from '../../../../shared';
import { LinesRequestService } from '../../services/lines-request.service';
import { LinesState } from '../../state/lines-state';

@Component({
  selector: 'dts-create-line',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DtsModalLayout,
    DtsCard,
    DtsButton,
    DtsInput,
  ],
  templateUrl: './create-line.html',
})
export class CreateLine implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<CreateLine>);

  private readonly linesRequestService = inject(LinesRequestService);
  private linesState = inject(LinesState);

  readonly modalConfig = {
    title: 'Nueva Línea',
    subtitle: 'Configura el nombre, stages y estándares por hora.',
    icon: 'ri-layout-line',
  };

  readonly lineForm = new FormGroup({
    lineName: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    standardOutput: new FormControl<number>(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1)],
    }),
  });

  loading$ = this.linesState.loadingCreateLine;

  stages: { name: string }[] = [];
  newStage = new FormControl<string>('', { nonNullable: true });

  get canCreate(): boolean {
    return this.lineForm.valid && this.stages.length > 0;
  }

  ngOnInit(): void {}

  addStage(): void {
    const name = this.newStage.value.trim().toUpperCase();

    if (!name || this.stages.some((s) => s.name === name)) return;
    this.stages.push({ name });
    this.newStage.reset();
  }

  removeStage(index: number): void {
    this.stages.splice(index, 1);
  }

  async onCreate() {
    if (!this.canCreate) return;
    await this.linesRequestService.createLine({
      name: this.lineForm.controls.lineName.value,
      stages: this.stages,
      standardOutput: Number(this.lineForm.controls.standardOutput.value),
    });
    this.dialogRef.close();
  }

  onClose = () => this.dialogRef.close();
}
