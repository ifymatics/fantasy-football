import { ReferFriendModule } from './refer-friend.module';

describe('ReferFriendModule', () => {
  let referFriendModule: ReferFriendModule;

  beforeEach(() => {
    referFriendModule = new ReferFriendModule();
  });

  it('should create an instance', () => {
    expect(referFriendModule).toBeTruthy();
  });
});
