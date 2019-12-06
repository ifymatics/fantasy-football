import { ReferfriendRoutingModule } from './referfriend-routing.module';

describe('ReferfriendRoutingModule', () => {
  let referfriendRoutingModule: ReferfriendRoutingModule;

  beforeEach(() => {
    referfriendRoutingModule = new ReferfriendRoutingModule();
  });

  it('should create an instance', () => {
    expect(referfriendRoutingModule).toBeTruthy();
  });
});
