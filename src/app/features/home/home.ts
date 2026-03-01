import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalStateService } from '../../core/application';
import {
  NgApexchartsModule,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexGrid,
  ApexLegend,
  ApexPlotOptions,
  ApexResponsive,
  ApexStroke,
  ApexXAxis,
  ApexYAxis,
  ApexTooltip,
  ApexAnnotations,
  ApexTheme,
} from 'ng-apexcharts';

const DARK_CHART = {
  background: 'transparent',
  foreColor: '#94a3b8',
};

@Component({
  selector: 'foxcode-home',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './home.html',
})
export class Home {
  private globalState = inject(GlobalStateService);

  // ─── Pareto Chart ────────────────────────────────────────────────────────────
  paretoOptions = {
    series: [
      { name: 'Duration (min)', type: 'bar', data: [252, 168, 90, 60, 30] },
      { name: 'Cumulative %',   type: 'line', data: [42, 70, 85, 95, 100] },
    ],
    chart: { type: 'bar', height: 260, toolbar: { show: false }, ...DARK_CHART } as ApexChart,
    plotOptions: { bar: { borderRadius: 4, columnWidth: '55%' } } as ApexPlotOptions,
    colors: ['#3a57e8', '#f97316'],
    dataLabels: {
      enabled: true,
      enabledOnSeries: [0],
      formatter: (val: number) => `${Math.round((val / 600) * 100)}%`,
      style: { fontSize: '11px', colors: ['#fff'] },
    } as ApexDataLabels,
    stroke: { width: [0, 2], curve: 'smooth' } as ApexStroke,
    xaxis: {
      categories: ['Mechanical\nFailure', 'Sensor\nError', 'Material\nShortage', 'Power\nTrip', 'Others'],
      labels: { style: { colors: '#94a3b8', fontSize: '11px' } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    } as ApexXAxis,
    yaxis: [
      { labels: { style: { colors: '#94a3b8', fontSize: '11px' }, formatter: (v: number) => v + ' min' }, axisBorder: { show: false } },
      { opposite: true, min: 0, max: 100, labels: { style: { colors: '#f97316', fontSize: '11px' }, formatter: (v: number) => v + '%' } },
    ] as ApexYAxis,
    grid: { borderColor: '#ffffff0f', strokeDashArray: 4 } as ApexGrid,
    legend: { show: false },
    fill: { opacity: [0.85, 1] } as ApexFill,
    tooltip: { theme: 'dark' } as ApexTooltip,
    theme: { mode: 'dark' } as ApexTheme,
  };

  // ─── Donut Chart ─────────────────────────────────────────────────────────────
  donutOptions = {
    series: [45, 25, 20, 10],
    chart: { type: 'donut', height: 200, ...DARK_CHART } as ApexChart,
    colors: ['#3a57e8', '#6366f1', '#f97316', '#a855f7'],
    labels: ['Production', 'Facilities', 'PMC', 'IT Systems'],
    plotOptions: {
      pie: {
        donut: {
          size: '68%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'TOTAL',
              color: '#94a3b8',
              fontSize: '11px',
              formatter: () => '14h',
            },
            value: { color: '#fff', fontSize: '22px', fontWeight: 700 },
          },
        },
      },
    } as ApexPlotOptions,
    dataLabels: { enabled: false } as ApexDataLabels,
    legend: { show: false },
    stroke: { width: 2, colors: ['#1e1e2e'] } as ApexStroke,
    tooltip: { theme: 'dark' } as ApexTooltip,
    theme: { mode: 'dark' } as ApexTheme,
  };

  // ─── Heatmap ─────────────────────────────────────────────────────────────────
  heatmapOptions = {
    series: this.buildHeatmapSeries(),
    chart: { type: 'heatmap', height: 160, toolbar: { show: false }, ...DARK_CHART } as ApexChart,
    dataLabels: { enabled: false } as ApexDataLabels,
    colors: ['#3a57e8'],
    xaxis: {
      categories: ['00:00','02:00','04:00','06:00','08:00','10:00','12:00','14:00','16:00','18:00','20:00','22:00'],
      labels: { style: { colors: '#94a3b8', fontSize: '10px' } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    } as ApexXAxis,
    yaxis: { labels: { style: { colors: '#94a3b8', fontSize: '10px' } } } as ApexYAxis,
    grid: { padding: { top: 0, right: 0, bottom: 0, left: 0 } } as ApexGrid,
    tooltip: { theme: 'dark' } as ApexTooltip,
    theme: { mode: 'dark' } as ApexTheme,
    plotOptions: { heatmap: { shadeIntensity: 0.6, radius: 3, colorScale: { ranges: [
      { from: 0, to: 2,  color: '#1e1e2e', name: 'None' },
      { from: 3, to: 5,  color: '#1e3a5f', name: 'Low' },
      { from: 6, to: 8,  color: '#2e5fa3', name: 'Medium' },
      { from: 9, to: 12, color: '#3a57e8', name: 'High' },
    ] } } } as ApexPlotOptions,
  };

  // ─── Area Chart (Weekly trend) ────────────────────────────────────────────────
  trendOptions = {
    series: [
      { name: 'Reported',   data: [40, 65, 55, 90, 80, 60, 85] },
      { name: 'Unreported', data: [15, 20, 18, 30, 25, 20, 28] },
    ],
    chart: { type: 'area', height: 200, toolbar: { show: false }, ...DARK_CHART } as ApexChart,
    colors: ['#3a57e8', '#475569'],
    fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05 } } as ApexFill,
    stroke: { curve: 'smooth', width: [3, 2], dashArray: [0, 5] } as ApexStroke,
    dataLabels: { enabled: false } as ApexDataLabels,
    xaxis: {
      categories: ['MON','TUE','WED','THU','FRI','SAT','SUN'],
      labels: { style: { colors: '#94a3b8', fontSize: '11px' } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    } as ApexXAxis,
    yaxis: { labels: { style: { colors: '#94a3b8', fontSize: '11px' }, formatter: (v: number) => v + 'min' }, axisBorder: { show: false } } as ApexYAxis,
    grid: { borderColor: '#ffffff0f', strokeDashArray: 4 } as ApexGrid,
    legend: { show: false },
    tooltip: { theme: 'dark' } as ApexTooltip,
    theme: { mode: 'dark' } as ApexTheme,
  };

  // ─── Departments list ─────────────────────────────────────────────────────────
  departments = [
    { name: 'Production',   pct: 45, color: '#3a57e8' },
    { name: 'Facilities',   pct: 25, color: '#6366f1' },
    { name: 'PMC',          pct: 20, color: '#f97316' },
    { name: 'IT Systems',   pct: 10, color: '#a855f7' },
  ];

  private buildHeatmapSeries() {
    const days = ['Sun', 'Sat', 'Fri', 'Thu', 'Wed', 'Tue', 'Mon'];
    return days.map(day => ({
      name: day,
      data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 12)),
    }));
  }
}

