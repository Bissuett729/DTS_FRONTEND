import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ISupportReport } from '../../interfaces/support-report.interface';
import { Router, RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FoxcodeCard } from '../../../../../../../shared';

@Component({
  selector: 'foxcode-support-table',
  standalone: true,
  imports: [CommonModule, FoxcodeCard, MatTooltipModule, RouterModule],
  templateUrl: './support-table.html'
})
export class SupportTable {
  constructor(private router: Router) { }

  @Input() TableData!: ISupportReport[];

  getStatusClasses(statusValue: string): string {
    if (statusValue === null || statusValue === undefined) {
      return 'text-yellow-500 font-semibold';
    }

    const classMap: { [key: string]: string } = {
      'open': 'border rounded-md bg-[#FBC9E0] border-[#850081] text-[#ab21a7] dark:bg-[#54005a78] dark:text-[#ea00e1]',
      'review': 'border rounded-md bg-[#fff8e1] border-[#ffc107] text-[#f57f17] dark:bg-[#4a3f1f] dark:text-[#ffe082]',
      'in-progress': 'rounded-md bg-[#e3f2fd] border-[#2196f3] text-[#1565c0] dark:bg-[#1e3a5f] dark:text-[#90caf9]',
      'resolved': 'bg-[#e8f7e8] border rounded-md border-[#8bc34a] text-[#388e3c] dark:bg-[#2e402e] dark:text-[#a5d6a7]',
      'closed': 'border rounded-md border-[#9e9e9e] text-[#616161] bg-[#f5f5f5] dark:bg-[#2e2e2e] dark:text-[#bdbdbd]',
      'rejected': 'border rounded-md bg-[#fdecea] border-[#f44336] text-[#c62828] dark:bg-[#4b2e2e] dark:text-[#ef9a9a]',
    };

    return classMap[statusValue] || 'text-red-500 font-semibold';
  }
}
