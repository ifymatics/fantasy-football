import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenPredictionComponent } from './token-prediction.component';

describe('TokenComponent', () => {
  let component: TokenPredictionComponent;
  let fixture: ComponentFixture<TokenPredictionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TokenPredictionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TokenPredictionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
