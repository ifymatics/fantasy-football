import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContestDetailsComponent } from './contest-details.component';

describe('ContestDetailsComponent', () => {
  let component: ContestDetailsComponent;
  let fixture: ComponentFixture<ContestDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContestDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContestDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
