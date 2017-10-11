import { MyteamModule } from './myteam.module';

describe('MyteamModule', () => {
  let myteamModule: MyteamModule;

  beforeEach(() => {
    myteamModule = new MyteamModule();
  });

  it('should create an instance', () => {
    expect(myteamModule).toBeTruthy();
  });
});
