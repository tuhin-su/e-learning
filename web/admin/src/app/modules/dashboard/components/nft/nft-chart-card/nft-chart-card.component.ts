import { Component, OnDestroy, OnInit, effect } from '@angular/core';
import { ThemeService } from 'src/app/core/services/theme.service';
import { ChartOptions } from '../../../../../shared/models/chart-options';
import { NgApexchartsModule } from 'ng-apexcharts';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: '[nft-chart-card]',
  templateUrl: './nft-chart-card.component.html',
  standalone: true,
  imports: [AngularSvgIconModule, NgApexchartsModule, CommonModule,FormsModule],
})
export class NftChartCardComponent implements OnInit, OnDestroy {
  public chartOptions: Partial<ChartOptions>;

  months: string[]= ['January', 'February','March', 'April', 'May','June', 'July', 'August', 'September','October','November', 'December'];
  items: string[]= this.months;

  selectedOption = '';
  isYearlyActive: boolean = false;
  isMonthlyActive: boolean = false;
  

  activateYearly() {
    this.isYearlyActive = true;
    this.isMonthlyActive = false;
    this.items = ["2015","2016","2017","2018","2019","2020","2021","2022","2023","2024","2025","2026","2027","2014"]
    const currentdate = new Date();
    const currentyear = currentdate.getFullYear();
    this.selectedOption = currentyear.toString();

  }


  activateMonthly() {
    this.isMonthlyActive = true;
    this.isYearlyActive = false;
    this.items = this.months;
    const currentdate = new Date();
    const monthindex = currentdate.getMonth();
    this.selectedOption = this.months[monthindex];
  }
  days: number[] = Array.from({ length: 30 }, (_, i) => i + 1);
  constructor(private themeService: ThemeService) {
    const categories = Array.from({ length: 30 }, (_, i) => (i + 1).toString());

    // Example categories (dynamically you can fetch them)
    const categoryNames = ['BCA', 'BBA', 'BHM', 'MCA'];

    const generateStrongColor = () => {
      let color = '';
      while (true) {
        const letters = '0123456789ABCDEF';
        color = '#';
        for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        const rgb = this.hexToRgb(color);
        if (this.isBrightEnough(rgb)) {
          break;
        }
      }
      return color;
    };

    const categoryColors = categoryNames.map(() => generateStrongColor());

    // Generate random data for each category
    const generateRandomData = () => Array.from({ length: 30 }, () => Math.floor(Math.random() * 100) + 1);

    this.chartOptions = {
      series: categoryNames.map((name) => ({
        name,
        data: generateRandomData(),
      })),
      chart: {
        fontFamily: 'inherit',
        type: 'line',
        height: '350',
        toolbar: { show: false },
        sparkline: { enabled: true },
      },
      dataLabels: { enabled: false },
      fill:{
        type: 'solid',
        colors: ["#383838"],
      },
      stroke: {
        curve: 'smooth',
        show: true,
        width: 3,
        colors: categoryColors,
      },
      xaxis: {
        categories: categories,
        labels: { show: false },
        crosshairs: {
          position: 'front',
          stroke: { color: '#FFFFFF', width: 1, dashArray: 4 },
        },
        tooltip: { enabled: true },
      },
      tooltip: {
        theme: 'light',
        y: {
          formatter: (val) => `${val}$`,
        },
      },
      colors: categoryColors,
    };

    effect(() => {
      let primaryColor = this.themeService.theme().mode === 'light' ? '#FFD700' : '#0000FF';
      this.chartOptions.tooltip = { theme: this.themeService.theme().mode };
      this.chartOptions.colors = [primaryColor, ...categoryColors.slice(1)];
      this.chartOptions.stroke!.colors = [primaryColor, ...categoryColors.slice(1)];
    });
  }

  ngOnInit(): void {
    this.activateMonthly();
  }

  ngOnDestroy(): void {}

  // Convert hex to RGB
  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  }

  // Ensure the color is bright enough
  private isBrightEnough(rgb: { r: number; g: number; b: number }): boolean {
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    return brightness > 128;
  }
}
