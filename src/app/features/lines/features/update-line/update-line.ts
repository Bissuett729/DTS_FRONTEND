import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DtsCard, DtsInput, DtsButton } from '../../../../shared';
import { generalInfoForm } from '../../forms/information.form';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IStandard } from '../../interfaces/standard.interface';
import { DtsToggle } from '../../../../shared/components/toggle/toggle.component';
import { AlertComponent } from '../../../../shared/components/alert/alert';
import {
  ITapSwitcher,
  TabSwitcherComponent,
} from '../../../../shared/components/tap-switcher/tap-switcher';
import { LinesState } from '../../state/lines-state';

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
export class UpdateLine implements OnInit {
  private linesState = inject(LinesState);

  readonly generalInfoForm = generalInfoForm;

  lines$ = this.linesState.lines;
  loadingLines$ = this.linesState.loadingLines;

  public readonly hourlyStandardsData: IStandard[] = [
    { startTime: '00:00', finishTime: '01:00', line: 'FAA', standard: 100 },
    { startTime: '01:00', finishTime: '02:00', line: 'FAA', standard: 100 },
    { startTime: '02:00', finishTime: '03:00', line: 'FAA', standard: 100 },
    { startTime: '03:00', finishTime: '04:00', line: 'FAA', standard: 100 },
    { startTime: '04:00', finishTime: '05:00', line: 'FAA', standard: 100 },
    { startTime: '05:00', finishTime: '06:00', line: 'FAA', standard: 100 },
    { startTime: '06:00', finishTime: '07:00', line: 'FAA', standard: 100 },
    { startTime: '07:00', finishTime: '08:00', line: 'FAA', standard: 100 },
    { startTime: '08:00', finishTime: '09:00', line: 'FAA', standard: 100 },
    { startTime: '09:00', finishTime: '10:00', line: 'FAA', standard: 100 },
    { startTime: '10:00', finishTime: '11:00', line: 'FAA', standard: 100 },
    { startTime: '11:00', finishTime: '12:00', line: 'FAA', standard: 100 },
    { startTime: '12:00', finishTime: '13:00', line: 'FAA', standard: 100 },
    { startTime: '13:00', finishTime: '14:00', line: 'FAA', standard: 100 },
    { startTime: '14:00', finishTime: '15:00', line: 'FAA', standard: 100 },
    { startTime: '15:00', finishTime: '16:00', line: 'FAA', standard: 100 },
    { startTime: '16:00', finishTime: '17:00', line: 'FAA', standard: 100 },
    { startTime: '17:00', finishTime: '18:00', line: 'FAA', standard: 100 },
    { startTime: '18:00', finishTime: '19:00', line: 'FAA', standard: 100 },
    { startTime: '19:00', finishTime: '20:00', line: 'FAA', standard: 100 },
    { startTime: '20:00', finishTime: '21:00', line: 'FAA', standard: 100 },
    { startTime: '21:00', finishTime: '22:00', line: 'FAA', standard: 100 },
    { startTime: '22:00', finishTime: '23:00', line: 'FAA', standard: 100 },
    { startTime: '23:00', finishTime: '00:00', line: 'FAA', standard: 100 },
  ];

  public stages: ITapSwitcher[] = [{ label: 'FA' }, { label: 'FT' }, { label: 'PA' }];

  public stageSelectedIndex = 0;

  public hourlyStandards: IStandard[] = [];

  ngOnInit(): void {
    // apartir de hourlyStandardsData, crear un nuevo arreglo con un campo adicional para un formcontrol de standard editable y obtener la suma total de los estándares horarios
    this.hourlyStandards = this.hourlyStandardsData.map((hs) => ({
      ...hs,
      standardControl: new FormControl(hs.standard, { nonNullable: true }),
    }));
  }

  public saveStandardHourly() {}
}
