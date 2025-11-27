import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeagueBox } from './league-box';

describe('LeagueBox', () => {
  let component: LeagueBox;
  let fixture: ComponentFixture<LeagueBox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeagueBox]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeagueBox);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
