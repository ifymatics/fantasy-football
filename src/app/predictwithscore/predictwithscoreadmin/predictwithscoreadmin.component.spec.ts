import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PredictwithscoreadminComponent } from './predictwithscoreadmin.component';

describe('PredictwithscoreadminComponent', () => {
  let component: PredictwithscoreadminComponent;
  let fixture: ComponentFixture<PredictwithscoreadminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PredictwithscoreadminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PredictwithscoreadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
