import { TestBed } from '@angular/core/testing';

import { HighlightingService } from './highlighting.service';

describe('HighlightingService', () => {
  let service: HighlightingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HighlightingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
