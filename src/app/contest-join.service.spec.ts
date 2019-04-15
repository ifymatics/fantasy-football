import { TestBed } from '@angular/core/testing';

import { ContestJoinService } from './contest-join.service';

describe('ContestJoinService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ContestJoinService = TestBed.get(ContestJoinService);
    expect(service).toBeTruthy();
  });
});
