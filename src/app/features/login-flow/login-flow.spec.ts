import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginFlow } from './login-flow';
import { LoginFlowService } from './login-flow.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

describe('LoginFlow', () => {
    let component: LoginFlow;
    let fixture: ComponentFixture<LoginFlow>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LoginFlow],
            providers: [
                {
                    provide: LoginFlowService,
                    useValue: {
                        signUp: () => of(void 0),
                        login: () => of(void 0),
                    },
                },
                {
                    provide: Router,
                    useValue: {
                        navigate: () => Promise.resolve(true),
                    },
                },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        queryParams: of({}),
                    },
                },
                FormBuilder,
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(LoginFlow);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
