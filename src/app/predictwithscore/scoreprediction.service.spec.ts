import { TestBed } from '@angular/core/testing';

import { ScorepredictionService } from './scoreprediction.service';

describe('ScorepredictionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ScorepredictionService = TestBed.get(ScorepredictionService);
    expect(service).toBeTruthy();
  });
});
