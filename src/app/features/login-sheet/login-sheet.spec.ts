import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginSheet } from './login-sheet';

describe('LoginSheet', () => {
  let component: LoginSheet;
  let fixture: ComponentFixture<LoginSheet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginSheet]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginSheet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
