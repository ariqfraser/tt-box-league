import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTabLogic } from './admin-tab-logic';

describe('AdminTabLogic', () => {
  let component: AdminTabLogic;
  let fixture: ComponentFixture<AdminTabLogic>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminTabLogic]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminTabLogic);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
