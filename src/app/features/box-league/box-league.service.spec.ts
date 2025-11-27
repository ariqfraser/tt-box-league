import { TestBed } from '@angular/core/testing';

import { BoxLeagueService } from './box-league.service';

describe('BoxLeagueService', () => {
  let service: BoxLeagueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BoxLeagueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
