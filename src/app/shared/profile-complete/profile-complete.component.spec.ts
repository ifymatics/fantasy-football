import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileCompleteComponent } from './profile-complete.component';

describe('ProfileCompleteComponent', () => {
  let component: ProfileCompleteComponent;
  let fixture: ComponentFixture<ProfileCompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileCompleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
