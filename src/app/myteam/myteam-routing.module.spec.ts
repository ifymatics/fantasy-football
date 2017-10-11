import { MyteamRoutingModule } from './myteam-routing.module';

describe('MyteamRoutingModule', () => {
  let myteamRoutingModule: MyteamRoutingModule;

  beforeEach(() => {
    myteamRoutingModule = new MyteamRoutingModule();
  });

  it('should create an instance', () => {
    expect(myteamRoutingModule).toBeTruthy();
  });
});
