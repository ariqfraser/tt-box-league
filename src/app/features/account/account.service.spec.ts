import { TestBed } from '@angular/core/testing';
import { AccountService } from './account.service';
import { FirebaseAuth } from '@core/services/firebase/auth/firebase-auth';
import { of } from 'rxjs';

describe('AccountService', () => {
    let service: AccountService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                AccountService,
                {
                    provide: FirebaseAuth,
                    useValue: {
                        logout: () => of(void 0),
                    },
                },
            ],
        });
        service = TestBed.inject(AccountService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
