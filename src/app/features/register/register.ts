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

@Component({
    selector: 'app-register',
    imports: [
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

    protected readonly forceDisableSubmit = signal(false);
    protected form = this.formBuilder.group(
        {
            fullName: ['', [Validators.required, Validators.minLength(2)]],
            accountDetails: this.formBuilder.group({
                username: ['', [Validators.required, Validators.minLength(6)]],
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
        if (this.form.valid) {
            console.log('Registration data:', this.form.value);
            this.forceDisableSubmit.set(true);
        } else {
            Log.warn('Form is invalid', this.form.errors);
        }
    }

    /** Closes the registration dialog */
    close(): void {
        this.dialogRef.close();
    }
}
