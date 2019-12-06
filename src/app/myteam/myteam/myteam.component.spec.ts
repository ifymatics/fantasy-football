import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyteamComponent } from './myteam.component';

describe('MyteamComponent', () => {
  let component: MyteamComponent;
  let fixture: ComponentFixture<MyteamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyteamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyteamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
