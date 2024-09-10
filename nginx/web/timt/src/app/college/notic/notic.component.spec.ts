import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticComponent } from './notic.component';

describe('NoticComponent', () => {
  let component: NoticComponent;
  let fixture: ComponentFixture<NoticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoticComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
