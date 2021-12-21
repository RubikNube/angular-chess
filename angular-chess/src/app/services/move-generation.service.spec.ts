import { TestBed } from '@angular/core/testing';

import { MoveGenerationService } from './move-generation.service';

describe('MoveGenerationService', () => {
  let service: MoveGenerationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MoveGenerationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
