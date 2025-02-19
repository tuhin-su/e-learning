import { Component } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-footer',
    template: `<div class="layout-footer">
        Create by
        <a href="https://github.com/tuhin-su" target="_blank" rel="noopener noreferrer" class="text-primary font-bold hover:underline">tuhin-sg</a>
    </div>`
})
export class AppFooter {}
