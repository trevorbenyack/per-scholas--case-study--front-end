import { TestBed } from '@angular/core/testing';

import { ImageValidationService } from './image-validation.service';

describe('ImageValidationServiceService', () => {
  let service: ImageValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
