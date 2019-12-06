import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinContestComponent } from './join-contest.component';

describe('JoinContestComponent', () => {
  let component: JoinContestComponent;
  let fixture: ComponentFixture<JoinContestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoinContestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinContestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
