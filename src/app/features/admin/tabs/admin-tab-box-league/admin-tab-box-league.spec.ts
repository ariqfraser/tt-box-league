import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTabBoxLeague } from './admin-tab-box-league';

describe('AdminTabBoxLeague', () => {
  let component: AdminTabBoxLeague;
  let fixture: ComponentFixture<AdminTabBoxLeague>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminTabBoxLeague]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminTabBoxLeague);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
