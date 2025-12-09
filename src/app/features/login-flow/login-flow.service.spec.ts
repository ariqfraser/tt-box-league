import { TestBed } from '@angular/core/testing';
import { LoginFlowService } from './login-flow.service';
import { FirebaseAuth } from '@core/services/firebase/auth/firebase-auth';
import { FirebaseFunctions } from '@core/services/firebase/functions/firebase-functions';
import { StorageService } from '@core/services/storage/storage.service';
import { of } from 'rxjs';

describe('LoginFlowService', () => {
    let service: LoginFlowService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                LoginFlowService,
                {
                    provide: FirebaseAuth,
                    useValue: {
                        signUp: () => of({ uid: 'test-uid' }),
                        login: () => of({ uid: 'test-uid' }),
                    },
                },
                {
                    provide: FirebaseFunctions,
                    useValue: {
                        call: () => of({ success: true }),
                    },
                },
                {
                    provide: StorageService,
                    useValue: {
                        get: () => null,
                    },
                },
            ],
        });
        service = TestBed.inject(LoginFlowService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
