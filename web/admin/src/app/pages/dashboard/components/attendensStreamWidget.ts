import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { debounceTime, firstValueFrom, Subscription, tap } from 'rxjs';
import { LayoutService } from '../../../layout/service/layout.service';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FunctionaltyService } from '../../../services/functionalty.service';
import { AlertService } from '../../../services/alert.service';

@Component({
    standalone: true,
    selector: 'app-attendens-stream-widget',
    imports: [ChartModule, SelectButtonModule],
    template: `<div class="card !mb-8">
        <div class="font-semibold text-xl mb-4 w-full relative">
            <span>This Month Attendens</span>
        </div>
        <p-chart type="line" [data]="chartData" [options]="chartOptions" class="h-80" />
    </div>`
})
export class AttendensStreamWidget implements OnInit, OnDestroy {
    chartData: any;
    chartOptions: any;
    subscription!: Subscription;

    constructor(
        private functionality: FunctionaltyService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        this.fetchAttendentChart();
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe(); // Cleanup the subscription when the component is destroyed
        }
    }

    // Generate labels from startDate to currentDate
    generateLabels(startDate: Date, endDate: Date): string[] {
        const labels = [];
        const currentDate = new Date(startDate);

        while (currentDate <= endDate) {
            labels.push(currentDate.getDate().toString()); // Adds only the day of the month as a label
            currentDate.setDate(currentDate.getDate() + 1);  // Increment the date by one day
        }

        return labels;
    }

    // Function to generate a random color in hex format
    generateRandomColor(): string {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    // Fetch attendance chart data
    async fetchAttendentChart() {
        await firstValueFrom(this.functionality.getAttendenceChart({ "month": 1 }).pipe(
            tap(
                (response) => {
                    if (response) {
                        console.log(response.BBA);

                        // Get document styles for text and border colors
                        const documentStyle = getComputedStyle(document.documentElement);
                        const textColor = documentStyle.getPropertyValue('--text-color');
                        const borderColor = documentStyle.getPropertyValue('--surface-border');
                        const textMutedColor = documentStyle.getPropertyValue('--text-color-secondary');

                        // Define the current date and the first date of the current month
                        const today = new Date();
                        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                        const labels = this.generateLabels(firstDayOfMonth, today);

                        // Get course names from the response object
                        const courseNames = Object.keys(response);

                        // Initialize the chart data object
                        this.chartData = {
                            labels: labels,
                            datasets: []
                        };

                        // Loop through each course to add datasets with random colors
                        for (let i = 0; i < courseNames.length; i++) {
                            this.chartData.datasets.push({
                                label: courseNames[i],
                                data: response[courseNames[i]], // Fixed data reference
                                fill: false,
                                backgroundColor: this.generateRandomColor(),  // Random background color
                                  // Random border color
                                tension: 0.4
                            });
                        }

                        // Chart options
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
