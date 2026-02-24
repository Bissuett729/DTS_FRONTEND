import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsDtsIcon } from "../../icons";

@Component({
  selector: 'dts-loader',
  standalone: true,
  imports: [CommonModule, SettingsDtsIcon],
  templateUrl: './loader-dts.html'
})
export class LoaderDts {}
