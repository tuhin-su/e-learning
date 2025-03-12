import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { debounceTime, firstValueFrom, Subscription, tap } from 'rxjs';
import { LayoutService } from '../../../layout/service/layout.service';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FunctionaltyService } from '../../../services/functionalty.service';
import { AlertService } from '../../../services/alert.service';
@Component({
    standalone: true,
    selector: 'app-attendens-stream-widget',
    imports: [ChartModule,SelectButtonModule],
    template: `<div class="card !mb-8">
        <div class="font-semibold text-xl mb-4 w-full relative">
            <span>This Month Attendens</span>
            <div class="flex flex-col md:flex-row gap-4">
                <!-- <p-selectbutton [(ngModel)]="selectButtonValue" [options]="selectButtonValues" optionLabel="name" />     -->
            </div>
        </div>
        <p-chart type="line" [data]="chartData" [options]="chartOptions" class="h-80" />
    </div>`
})
export class AttendensStreamWidget  implements OnInit{
    chartData: any;
    selectButtonValue: any = [{ name: 'Option 1' }, { name: 'Option 2' }, { name: 'Option 3' }];alertService: any;
    
;
    chartOptions: any;

    subscription!: Subscription;

    constructor(
        private functionality : FunctionaltyService,
        private alertservice : AlertService
    ) {
    }

    ngOnInit() {
        this.fetchAttendentChart()
    }


    ngOnDestroy() {
    
    }
    

//  generate 1st date to currentDate

generateLabels(startDate: Date, endDate: Date): string[] {
    const labels = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        labels.push(currentDate.getDate().toString()); // Adds only the day of the month as a label
        currentDate.setDate(currentDate.getDate() + 1);  // Increment the date by one day
    }

    return labels;
}

    

    //   fetch attendence charts value

    async fetchAttendentChart() {
        await firstValueFrom(this.functionality.getAttendenceChart({"month":1}).pipe(
            tap(
                (response) => {
                    if (response) {
                        console.log(response.BBA);
                        const documentStyle = getComputedStyle(document.documentElement);
                        const textColor = documentStyle.getPropertyValue('--text-color');
                        const borderColor = documentStyle.getPropertyValue('--surface-border');
                        const textMutedColor = documentStyle.getPropertyValue('--text-color-secondary');
                        const today = new Date();
                        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                        const labels = this.generateLabels(firstDayOfMonth, today); 
                        
                        const coursename = Object.keys(response);
                
                        this.chartData = {
                            labels: labels,
                            datasets: []
                        };
                
                        for (let i = 0; i < coursename.length; i++) {
                            this.chartData.datasets.push({
                                label: coursename[i],
                                data: response[coursename[i]], // Fixed data reference
                                fill: false,
                                backgroundColor: documentStyle.getPropertyValue('--p-primary-500'),
                                borderColor: documentStyle.getPropertyValue('--p-primary-500'),
                                tension: 0.4
                            });
                        }
                
                        this.chartOptions = {
                            maintainAspectRatio: false,
                            aspectRatio: 0.8,
                            plugins: {
                                legend: {
                                    labels: {
                                        color: textColor
                                    }
                                }
                            },
                            scales: {
                                x: {
                                    stacked: true,
                                    ticks: {
                                        color: textMutedColor
                                    },
                                    grid: {
                                        color: 'transparent',
                                        borderColor: 'transparent'
                                    }
                                },
                                y: {
                                    stacked: true,
                                    ticks: {
                                        color: textMutedColor
                                    },
                                    grid: {
                                        color: borderColor,
                                        borderColor: 'transparent',
                                        drawTicks: false
                                    }
                                }
                            }
                        };
                    }
                },
                (error) => {
                    this.alertService.showWarningAlert(error.error.message);
                }

            )
        ));
    }
}