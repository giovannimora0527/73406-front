import { TestBed } from '@angular/core/testing';

import { libroService } from './libro.service';

describe('libroService', () => {
  let service: libroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(libroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
