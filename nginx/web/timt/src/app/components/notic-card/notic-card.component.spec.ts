import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticCardComponent } from './notic-card.component';

describe('NoticCardComponent', () => {
  let component: NoticCardComponent;
  let fixture: ComponentFixture<NoticCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoticCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoticCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
