import { TestBed } from '@angular/core/testing';

import { HouseListService } from './house-list.service';

describe('HouseListService', () => {
  let service: HouseListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HouseListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
