import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { firstValueFrom, tap } from 'rxjs';
import { FunctionaltyService } from '../../../services/functionalty.service';
import { AlertService } from '../../../services/alert.service';

@Component({
    standalone: true,
    selector: 'app-stats-widget',
    imports: [CommonModule],
    templateUrl: 'pages/statswidget.html'
})
export class StatsWidget implements OnInit {

    attendence_total: any[] = []
    total: number | null = null;
    percentage: number | null = null;
    class: number | null = null;
    month: number | null = null;
    errorMessage: string | null = null;
    thismonth: number | null = null;
    year: number | null = null;
    
    constructor(
        private functionalityService: FunctionaltyService,
        private alertService : AlertService
    ) { }

    ngOnInit(): void {
        this.fetchAtendTodayTotal(),
        this.fetchClassTotal(),
        this.fetchNoticeTotal()
    }

    async fetchAtendTodayTotal() {
        await firstValueFrom(this.functionalityService.getTotalAttendence().pipe(
            tap(
                (response) => {
                    if (response) {
                        
                        this.total = response.total;
                        this.percentage = response.percentage;
                    }
                },
                (error) => {
                    this.alertService.showWarningAlert(error.error.message);
                }

            )
        ));
    }

    // Classes of today and month 

    async fetchClassTotal() {
        await firstValueFrom(this.functionalityService.getTotalClasses().pipe(
            tap(
                (response) => {
                    if (response) {
                        
                        this.class = response.total;
                        this.month = response.month;
                    }
                },
                (error) => {
                    this.alertService.showWarningAlert(error.error.message);
                }

            )
        ));
    }


    async fetchNoticeTotal() {
        await firstValueFrom(this.functionalityService.getTotalNotice().pipe(
            tap(
                (response) => {
                    if (response) {
                     
                        this.thismonth = response.month;
                        this.year = response.year;
                    }
                },
                (error) => {
                    this.alertService.showWarningAlert(error.error.message);
                }

            )
        ));
    }


    
}
