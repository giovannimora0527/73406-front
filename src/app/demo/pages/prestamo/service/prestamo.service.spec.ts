import { TestBed } from '@angular/core/testing';

import { prestamoService } from './prestamo.service';

describe('AutorService', () => {
  let service: prestamoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(prestamoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
