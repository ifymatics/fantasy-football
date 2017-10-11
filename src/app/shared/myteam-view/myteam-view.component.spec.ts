import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyteamViewComponent } from './myteam-view.component';

describe('MyteamViewComponent', () => {
  let component: MyteamViewComponent;
  let fixture: ComponentFixture<MyteamViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyteamViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyteamViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
