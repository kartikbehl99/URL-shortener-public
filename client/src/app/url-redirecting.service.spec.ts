import { TestBed } from '@angular/core/testing';

import { UrlRedirectingService } from './url-redirecting.service';

describe('UrlRedirectingService', () => {
  let service: UrlRedirectingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UrlRedirectingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
