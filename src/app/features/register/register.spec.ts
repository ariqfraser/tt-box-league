import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { Register } from './register';
import { RegistrationService } from '@app/core/services/firebase/functions/registration.service';

describe('Register', () => {
    let component: Register;
    let fixture: ComponentFixture<Register>;
    let mockRegistrationService: jest.Mocked<RegistrationService>;

    beforeEach(async () => {
        const mockDialogRef = {
            close: jest.fn(),
        };

        mockRegistrationService = {
            register: jest.fn(),
        } as unknown as jest.Mocked<RegistrationService>;

        await TestBed.configureTestingModule({
            imports: [
                Register,
                ReactiveFormsModule,
                MatStepperModule,
                MatDividerModule,
                MatButtonModule,
            ],
            providers: [
                { provide: MatDialogRef, useValue: mockDialogRef },
                { provide: RegistrationService, useValue: mockRegistrationService },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(Register);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should close dialog when close is called', () => {
        const mockDialogRef = TestBed.inject(MatDialogRef);
        component.close();
        expect(mockDialogRef.close).toHaveBeenCalled();
    });
});
