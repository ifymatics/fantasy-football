import { TestBed } from '@angular/core/testing';

import { PredictwinService } from './predictwin.service';

describe('PredictwinService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PredictwinService = TestBed.get(PredictwinService);
    expect(service).toBeTruthy();
  });
});
