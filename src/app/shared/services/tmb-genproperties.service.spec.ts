import { TestBed } from '@angular/core/testing';

import { TmbGenpropertiesService } from './tmb-genproperties.service';

describe('TmbGenpropertiesService', () => {
  let service: TmbGenpropertiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TmbGenpropertiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
