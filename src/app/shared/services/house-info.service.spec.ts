import { TestBed } from '@angular/core/testing';

import { HouseInfoService } from './house-info.service';

describe('HouseInfoService', () => {
  let service: HouseInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HouseInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
