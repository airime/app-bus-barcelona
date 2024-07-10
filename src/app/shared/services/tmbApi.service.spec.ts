import { TestBed } from '@angular/core/testing';

import { TmbApiService } from './tmbApi.service';

describe('TmbApiService', () => {
  let service: TmbApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TmbApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
