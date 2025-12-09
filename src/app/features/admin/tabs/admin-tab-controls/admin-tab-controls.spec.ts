import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminTabControls } from './admin-tab-controls';
import { FirebaseFunctions } from '@core/services/firebase/functions/firebase-functions';
import { of } from 'rxjs';

describe('AdminTabControls', () => {
    let component: AdminTabControls;
    let fixture: ComponentFixture<AdminTabControls>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AdminTabControls],
            providers: [
                {
                    provide: FirebaseFunctions,
                    useValue: {
                        call: () => of({ success: true }),
                    },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(AdminTabControls);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
