import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteFriendsFromCollectionComponent } from './invite-friends-from-collection.component';

describe('InviteFriendsFromCollectionComponent', () => {
  let component: InviteFriendsFromCollectionComponent;
  let fixture: ComponentFixture<InviteFriendsFromCollectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InviteFriendsFromCollectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteFriendsFromCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
