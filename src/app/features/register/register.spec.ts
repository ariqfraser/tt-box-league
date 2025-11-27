import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { Register } from './register';

describe('Register', () => {
    let component: Register;
    let fixture: ComponentFixture<Register>;

    beforeEach(async () => {
        const mockDialogRef = {
            close: jest.fn(),
        };

        await TestBed.configureTestingModule({
            imports: [
                Register,
                ReactiveFormsModule,
                MatStepperModule,
                MatDividerModule,
                MatButtonModule,
            ],
            providers: [{ provide: MatDialogRef, useValue: mockDialogRef }],
        }).compileComponents();

        fixture = TestBed.createComponent(Register);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
