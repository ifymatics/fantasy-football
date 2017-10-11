import { LineupModule } from './lineup.module';

describe('LineupModule', () => {
  let lineupModule: LineupModule;

  beforeEach(() => {
    lineupModule = new LineupModule();
  });

  it('should create an instance', () => {
    expect(lineupModule).toBeTruthy();
  });
});
