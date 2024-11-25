import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenViwerComponent } from './token-viwer.component';

describe('TokenViwerComponent', () => {
  let component: TokenViwerComponent;
  let fixture: ComponentFixture<TokenViwerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TokenViwerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TokenViwerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
