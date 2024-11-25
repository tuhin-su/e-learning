import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeDataComponent } from './me-data.component';

describe('MeDataComponent', () => {
  let component: MeDataComponent;
  let fixture: ComponentFixture<MeDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
