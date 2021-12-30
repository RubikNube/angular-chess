import { TestBed } from '@angular/core/testing';

import { MoveHistoryService } from './move-history.service';

describe('MoveHistoryService', () => {
  let service: MoveHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MoveHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
