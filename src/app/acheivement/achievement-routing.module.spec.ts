import { AchievementRoutingModule } from './achievement-routing.module';

describe('AchievementRoutingModule', () => {
  let achievementRoutingModule: AchievementRoutingModule;

  beforeEach(() => {
    achievementRoutingModule = new AchievementRoutingModule();
  });

  it('should create an instance', () => {
    expect(achievementRoutingModule).toBeTruthy();
  });
});
