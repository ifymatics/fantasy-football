import { AchievementModule } from './achievement.module';

describe('AchievementModule', () => {
  let achievementModule: AchievementModule;

  beforeEach(() => {
    achievementModule = new AchievementModule();
  });

  it('should create an instance', () => {
    expect(achievementModule).toBeTruthy();
  });
});
