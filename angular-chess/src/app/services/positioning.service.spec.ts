import { TestBed } from '@angular/core/testing';

import { PositioningService } from './positioning.service';

describe('PositioningService', () => {
  let service: PositioningService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PositioningService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
