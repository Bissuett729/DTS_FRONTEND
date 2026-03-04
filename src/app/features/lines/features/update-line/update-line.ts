import { Component, effect, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DtsCard, DtsInput, DtsButton } from '../../../../shared';
import { generalInfoForm } from '../../forms/information.form';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { IStandard } from '../../interfaces/standard.interface';
import { DtsToggle } from '../../../../shared/components/toggle/toggle.component';
import { AlertComponent } from '../../../../shared/components/alert/alert';
import {
  TabSwitcherComponent,
} from '../../../../shared/components/tap-switcher/tap-switcher';
import { LinesState } from '../../state/lines-state';
import { IHourlyStandard } from '../../interfaces/line.interface';
import { LinesRequestService } from '../../services/lines-request.service';

@Component({
  selector: 'dts-update-line',
  standalone: true,
  imports: [
    CommonModule,
    DtsCard,
    DtsInput,
    FormsModule,
    ReactiveFormsModule,
    DtsToggle,
    DtsButton,
    AlertComponent,
    TabSwitcherComponent,
  ],
  templateUrl: './update-line.html',
  styles: [],
})
export class UpdateLine implements OnDestroy {
  private linesState = inject(LinesState);
  private linesService = inject(LinesRequestService);

  readonly generalInfoForm = generalInfoForm;

  /** Stages con estándares modificados. Clave = stageId */
  private _modifiedStages = new Map<string, { stageId: string; standards: { startHour: number; standard: number }[] }>();
  private _standardsSub = new Subscription();

  selectedLine$ = this.linesState.selectedLine;
  loadingLines$ = this.linesState.loadingLines;

  get stages() {
    return this.selectedLine$()?.stages?.map((stage) => ({ label: stage?.name })) || [];
  }

  public stageSelectedIndex = 0;
  public standardTotal: number = 0;
  public hourlyStandards: IHourlyStandard[] = [];

  constructor() {
    effect(() => {
      const line = this.selectedLine$(); // se suscribe al signal
      if (!line) return;

      this._modifiedStages.clear();
      this.stageSelectedIndex = 0;

      this.generalInfoForm.patchValue({
        lineName: line.name,
        standard: line.standardOutput,
        status: line.active,
      });
      this.generalInfoForm.markAsPristine();

      this.getHourlyStandard(0);
    });
  }

  /** Captura los estándares del stage activo si fueron modificados */
  private captureCurrentStage(): void {
    const stage = this.selectedLine$()?.stages?.[this.stageSelectedIndex];
    if (!stage || !this.hourlyStandards.length) return;

    const hasChanges = this.hourlyStandards.some(
      (hs) => hs.standardControl!.value !== hs.standard
    );

    if (hasChanges) {
      this._modifiedStages.set(stage._id, {
        stageId: stage._id,
        standards: this.hourlyStandards.map((hs) => ({
          startHour: hs.startHour,
          standard: hs.standardControl!.value,
        })),
      });
    } else {
      this._modifiedStages.delete(stage._id);
    }
  }

  getHourlyStandard(index: number) {
    this.captureCurrentStage(); // guardar cambios del stage anterior antes de cambiar
    this.stageSelectedIndex = index;
    const stageIndex = this.selectedLine$()?.stages?.findIndex((_, i) => i === index);
    this.hourlyStandards = stageIndex !== undefined && stageIndex >= 0
      ? this.selectedLine$()?.stages?.[stageIndex]?.hourlyStandards.map((hs) => ({
          ...hs,
          standardControl: new FormControl(hs.standard, { nonNullable: true }),
        })) || []
      : [];

    // Calcular total inicial y suscribirse a cambios de cada control
    this._standardsSub.unsubscribe();
    this._standardsSub = new Subscription();

    const recalcTotal = () => {
      this.standardTotal = this.hourlyStandards.reduce(
        (sum, hs) => sum + (hs.standardControl?.value ?? hs.standard), 0
      );
    };

    recalcTotal();

    this.hourlyStandards.forEach((hs) => {
      this._standardsSub.add(
        hs.standardControl!.valueChanges.subscribe(() => recalcTotal())
      );
    });
  }

  ngOnDestroy(): void {
    this._standardsSub.unsubscribe();
  }

  public saveStandardHourly(): void {
    this.captureCurrentStage(); // capturar el stage activo antes de guardar

    const line = this.selectedLine$();
    if (!line) return;

    // ── Actualizar info general si el formulario fue modificado ──────────
    if (this.generalInfoForm.dirty) {
      const { lineName, standard, status } = this.generalInfoForm.value;
      this.linesService.updateLine(line._id, {
        name: lineName,
        standardOutput: standard,
        active: status,
      });
      this.generalInfoForm.markAsPristine();
    }

    // ── Actualizar estándares horarios de cada stage modificado ──────────
    this._modifiedStages.forEach(({ stageId, standards }) => {
      this.linesService.updateHourlyBulk(line._id, stageId, standards);
    });
    this._modifiedStages.clear();
  }
}
