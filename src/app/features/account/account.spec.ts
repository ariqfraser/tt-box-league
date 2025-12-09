import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Account } from './account';
import { AccountService } from './account.service';
import { of } from 'rxjs';

describe('Account', () => {
    let component: Account;
    let fixture: ComponentFixture<Account>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Account],
            providers: [
                {
                    provide: AccountService,
                    useValue: {
                        logout: () => of(void 0),
                    },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(Account);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
