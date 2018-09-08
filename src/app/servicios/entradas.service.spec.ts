import { TestBed, inject } from '@angular/core/testing';

import { EntradasService } from './entradas.service';

describe('EntradasService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EntradasService]
    });
  });

  it('should be created', inject([EntradasService], (service: EntradasService) => {
    expect(service).toBeTruthy();
  }));
});
