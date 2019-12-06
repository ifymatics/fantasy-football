import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HowtoearnCoinsComponent } from './howtoearn-coins.component';

describe('HowtoearnCoinsComponent', () => {
  let component: HowtoearnCoinsComponent;
  let fixture: ComponentFixture<HowtoearnCoinsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HowtoearnCoinsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HowtoearnCoinsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
