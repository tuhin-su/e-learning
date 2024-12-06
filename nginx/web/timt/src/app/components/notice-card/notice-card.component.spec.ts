import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticeCardComponent } from './notice-card.component';

describe('NoticeCardComponent', () => {
  let component: NoticeCardComponent;
  let fixture: ComponentFixture<NoticeCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoticeCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoticeCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
