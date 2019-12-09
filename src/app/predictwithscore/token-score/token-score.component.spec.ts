import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenScoreComponent } from './token-score.component';

describe('TokenScoreComponent', () => {
  let component: TokenScoreComponent;
  let fixture: ComponentFixture<TokenScoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TokenScoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TokenScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
