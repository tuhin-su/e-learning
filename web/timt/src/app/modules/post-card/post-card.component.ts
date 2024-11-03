import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss']
})
export class PostCardComponent implements OnChanges {
  @Input() data?: {
    title: string,
    description: string,
    img: string,
    class_id: string,
    created_at: string,
  };
  host = {
    name: 'Tim',
  }
  liked = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      console.log('Updated data:', this.data);
    }
  }

  like(id: any): void {
    this.liked = !this.liked;
  }
}
