import { Component, computed, inject, signal, ViewChild, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from '@app/core/services/storage/storage.service';
import { Scanner } from '@app/shared/ui/scanner/scanner';
import { LoginFlowService } from './login-flow.service';

/**
 *
 */
@Component({
    selector: 'app-login-flow',
    imports: [
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
        MatProgressBarModule,
        MatStepperModule,
        MatDividerModule,
        FormsModule,
        ReactiveFormsModule,
        Scanner,
    ],
    templateUrl: './login-flow.html',
    styleUrl: './login-flow.scss',
})
export class LoginFlow implements OnInit {
    @ViewChild('stepper') stepper?: MatStepper;
    private readonly login = inject(LoginFlowService);
    private readonly formBuilder = inject(FormBuilder);
    private readonly storage = inject(StorageService);
    private readonly route = inject(ActivatedRoute);

    protected readonly isConnecting = signal(true);
    protected readonly isSubmitting = signal(false);
    protected readonly errorMessage = signal('');

    protected readonly form = this.formBuilder.group({
        authCode: ['', Validators.required],
        email: ['', [Validators.required, Validators.email, Validators.pattern(/\.(com|co\.uk)$/)]],
    });

    protected readonly formValues = toSignal(this.form.valueChanges);
    protected readonly authCodeDisplay = computed(() => {
        const code = this.formValues()!.authCode || '';
        if (code.length <= 4) return code;
        return code.slice(0, 2) + '********' + code.slice(-2);
    });

    /**
     *
     */
    ngOnInit(): void {
        this.populateAuthCodeFromQuery();
        this.populateEmailFromStorage();
        this.connectToFirebase();
    }

    private populateEmailFromStorage(): void {
        this.form.get('email')?.setValue(this.storage.get('USER_EMAIL'));
    }

    private populateAuthCodeFromQuery(): void {
        const authCode = this.route.snapshot.queryParamMap.get('authCode');
        if (authCode) {
            this.form.get('authCode')?.setValue(authCode);
        }
    }

    private connectToFirebase(): void {
        this.isConnecting.set(true);
        this.login.signIn().subscribe({
            next: () => {
                this.isConnecting.set(false);
            },
            error: (err) => {
                this.isConnecting.set(false);
                this.errorMessage.set(err.message || 'Failed to connect to server');
            },
        });
    }

    /**
     *
     */
    skipAuthCode(): void {
        // TODO: Replace with actual auth code when QR scanner is implemented
        this.form.get('authCode')?.setValue('valid-auth-code');
        this.stepper?.next();
    }

    /**
     * Handles QR code scan result from the scanner
     * @param code - The scanned auth code
     */
    onQrScanned(code: string): void {
        this.form.get('authCode')?.setValue(code);
        this.stepper?.next();
    }

    /**
     *
     */
    submitForm(): void {
        if (this.form.invalid) return;

        this.isSubmitting.set(true);
        const email = this.form.get('email')?.value ?? '';
        this.login.submitEmail(email);
        this.isSubmitting.set(false);
        this.stepper?.next();
    }

    /**
     *
     */
    retryConnection(): void {
        this.errorMessage.set('');
        this.connectToFirebase();
    }
}
