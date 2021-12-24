import { TestBed } from '@angular/core/testing';

import { MoveExecutionService } from './move-execution.service';

describe('MoveExecutionService', () => {
  let service: MoveExecutionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MoveExecutionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
