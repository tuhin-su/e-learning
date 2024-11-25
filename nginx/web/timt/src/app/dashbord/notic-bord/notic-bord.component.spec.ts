import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticBordComponent } from './notic-bord.component';

describe('NoticBordComponent', () => {
  let component: NoticBordComponent;
  let fixture: ComponentFixture<NoticBordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoticBordComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoticBordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
