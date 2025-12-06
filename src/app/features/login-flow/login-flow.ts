import {
    Component,
    computed,
    inject,
    signal,
    ViewChild,
    OnInit,
    AfterViewInit,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { ActivatedRoute } from '@angular/router';
import { Scanner } from '@app/shared/ui/scanner/scanner';
import { LoginFlowService } from './login-flow.service';
import { Input } from '@shared/ui/input/input';

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
        Input,
    ],
    templateUrl: './login-flow.html',
    styleUrl: './login-flow.scss',
})
export class LoginFlow implements OnInit, AfterViewInit {
    @ViewChild('stepper') stepper?: MatStepper;
    @ViewChild('scanner') scanner?: Scanner;

    private readonly login = inject(LoginFlowService);
    private readonly formBuilder = inject(FormBuilder);
    private readonly route = inject(ActivatedRoute);

    protected readonly form = this.formBuilder.group({
        authCode: ['', Validators.required],
        email: ['', [Validators.required, Validators.email, Validators.pattern(/\.(com|co\.uk)$/)]],
    });

    protected readonly isConnecting = signal(true);
    protected readonly isSubmitting = signal(false);
    protected readonly errorMessage = signal('');
    protected readonly qrErrorMessage = signal('');
    protected readonly submitErrorMessage = signal('');
    protected readonly formValues = toSignal(this.form.valueChanges);
    protected readonly authCodeDisplay = computed(() => {
        const code = this.formValues()?.authCode || '';
        if (code.length <= 4) return code;
        return code.slice(0, 2) + '********' + code.slice(-2);
    });

    ngOnInit(): void {
        this.connectToFirebase();
    }

    ngAfterViewInit(): void {
        this.populateAuthCodeFromQuery();
        this.populateEmailFromStorage();
    }

    private populateEmailFromStorage(): void {
        this.form.get('email')?.setValue(this.login.getStoredEmail());
    }

    private populateAuthCodeFromQuery(): void {
        const authCode = this.route.snapshot.queryParamMap.get('authCode');
        if (authCode) {
            this.form.get('authCode')?.setValue(authCode);
            this.stepper?.next();
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
     * Handles QR code scan result from the scanner
     * @param buffer - The scanned auth code
     */
    onQrScanned(buffer: string): void {
        const match = buffer.match(/authCode=(\w+)$/);
        if (!match) {
            this.qrErrorMessage.set('Scanned QR code is invalid');
            return;
        }
        this.form.get('authCode')?.setValue(match[1]);
        this.stepper?.next();
    }

    /**
     */
    submitForm(): void {
        if (this.form.invalid) return;

        this.isSubmitting.set(true);

        const { authCode, email } = this.form.value;
        this.login.submitLogin(authCode!, email!).subscribe({
            next: () => {
                this.isSubmitting.set(false);
            },
            error: (e) => {
                this.submitErrorMessage.set(e);
                this.isSubmitting.set(false);
            },
        });
    }

    /**
     *
     */
    retryConnection(): void {
        this.errorMessage.set('');
        this.connectToFirebase();
    }

    /**
     * Retries the QR code scan by resetting the scanner and clearing any error messages
     */
    retryScan(): void {
        this.qrErrorMessage.set('');
        this.scanner?.reset();
    }
}
