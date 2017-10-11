import { LineupRoutingModule } from './lineup-routing.module';

describe('LineupRoutingModule', () => {
  let lineupRoutingModule: LineupRoutingModule;

  beforeEach(() => {
    lineupRoutingModule = new LineupRoutingModule();
  });

  it('should create an instance', () => {
    expect(lineupRoutingModule).toBeTruthy();
  });
});
