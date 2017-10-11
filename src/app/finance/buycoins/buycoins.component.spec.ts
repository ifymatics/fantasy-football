import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuycoinsComponent } from './buycoins.component';

describe('BuycoinsComponent', () => {
  let component: BuycoinsComponent;
  let fixture: ComponentFixture<BuycoinsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuycoinsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuycoinsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
