import { Component, inject, signal, ViewChild } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { Input } from '@app/shared/ui/input/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { FormBuilder, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { mustMatchValidator } from '@app/shared/validators/must-match.validator';
import { Log } from '@app/shared/utils/logger/logger.util';
import { MatDialogRef } from '@angular/material/dialog';
import {
    RegistrationService,
    RegisterError,
} from '@app/core/services/firebase/functions/registration.service';
import { CommonModule } from '@angular/common';

/**
 * Registration component
 * Handles user registration form submission via Cloud Functions
 */
@Component({
    selector: 'app-register',
    imports: [
        CommonModule,
        MatDividerModule,
        MatInputModule,
        Input,
        MatButtonModule,
        MatStepperModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    templateUrl: './register.html',
    styleUrl: './register.scss',
})
export class Register {
    private readonly dialogRef = inject(MatDialogRef<Register>);
    private readonly formBuilder = inject(FormBuilder);
    private readonly registrationService = inject(RegistrationService);

    protected readonly forceDisableSubmit = signal(false);
    protected readonly errorMessage = signal<string | null>(null);
    protected readonly isSubmitting = signal(false);

    protected form = this.formBuilder.group(
        {
            fullName: ['', [Validators.required, Validators.minLength(2)]],
            accountDetails: this.formBuilder.group({
                username: [
                    '',
                    [Validators.required, Validators.minLength(3), Validators.maxLength(30)],
                ],
                password: ['', [Validators.required, Validators.minLength(6)]],
                confirmPassword: ['', [Validators.required]],
            }),
            verificationCode: ['', [Validators.required]],
        },
        {
            validators: mustMatchValidator(
                'accountDetails.password',
                'accountDetails.confirmPassword',
            ),
        },
    );

    @ViewChild('Stepper') stepper?: MatStepper;

    /** Handles the registration form submission */
    handleRegister(): void {
        if (!this.form.valid) {
            Log.warn('Form is invalid', this.form.errors);
            return;
        }

        const { accountDetails, verificationCode } = this.form.value;
        if (!accountDetails?.username || !accountDetails?.password) {
            Log.warn('Missing required fields');
            this.errorMessage.set('Please fill in all required fields.');
            return;
        }

        this.errorMessage.set(null);
        this.isSubmitting.set(true);
        this.forceDisableSubmit.set(true);

        const { fullName } = this.form.value;
        this.registrationService
            .register({
                username: accountDetails.username,
                password: accountDetails.password,
                verificationCode: verificationCode || '',
                fullName: fullName || '',
            })
            .subscribe({
                next: (response) => {
                    Log.info('Registration successful', {
                        uid: response.uid,
                        username: response.username,
                    });
                    this.dialogRef.close(response);
                },
                error: (error: RegisterError) => {
                    Log.warn('Registration failed', { code: error.code, message: error.message });
                    this.errorMessage.set(error.message);
                    this.isSubmitting.set(false);
                    this.forceDisableSubmit.set(false);
                },
            });
    }

    /** Closes the registration dialog */
    close(): void {
        this.dialogRef.close();
    }

    /**
     *
     */
    haveAnAccount(): void {
        this.dialogRef.close({ goto: 'login' });
    }
}
