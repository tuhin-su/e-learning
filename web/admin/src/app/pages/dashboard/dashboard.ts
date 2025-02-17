import { Component } from '@angular/core';
import { NotificationsWidget } from './components/notificationswidget';
import { StatsWidget } from './components/statswidget';
import { RecentSalesWidget } from './components/recentsaleswidget';
import { BestSellingWidget } from './components/bestsellingwidget';
import { AttendensStreamWidget } from './components/attendensStreamWidget';
import { SystemMonitor } from "./components/systemMonitor";

@Component({
    standalone: true,
    selector: 'app-dashboard',
    imports: [StatsWidget, RecentSalesWidget, BestSellingWidget, AttendensStreamWidget, NotificationsWidget, SystemMonitor],
    template: `
        <div class="grid grid-cols-12 gap-8">
            <app-stats-widget class="contents" />
            <app-system-monitor class="contents" />
            <div class="col-span-12">
                <app-attendens-stream-widget />
            </div>
            <!-- <div class="col-span-12 xl:col-span-6">
                <app-revenue-stream-widget />
                <app-notifications-widget />
            </div> -->
        </div>
    `
})
export class Dashboard {}
