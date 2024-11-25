import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent {
  @Input() message?: string;
  @Input() variant: 'default' | 'gradient' | 'outlined' | 'ghost' = 'default';

  getAlertClasses(): string {
    switch (this.variant) {
      case 'gradient':
        return 'bg-gradient-to-r from-blue-500 to-blue-700 text-white';
      case 'outlined':
        return 'border border-blue-500 text-blue-500';
      case 'ghost':
        return 'bg-transparent text-blue-500';
      default:
        return 'bg-blue-500 text-white';
    }
  }
}
