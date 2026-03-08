import { TestBed } from '@angular/core/testing';

import { SpotifyToastService } from './spotify-toast.service';

describe('SpotifyToastService', () => {
  let service: SpotifyToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpotifyToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
