import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurtyComponent } from './securty.component';

describe('SecurtyComponent', () => {
  let component: SecurtyComponent;
  let fixture: ComponentFixture<SecurtyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecurtyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecurtyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
