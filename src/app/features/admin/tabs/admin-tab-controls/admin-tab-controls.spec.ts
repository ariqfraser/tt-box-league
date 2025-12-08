import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTabControls } from './admin-tab-controls';

describe('AdminTabControls', () => {
    let component: AdminTabControls;
    let fixture: ComponentFixture<AdminTabControls>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AdminTabControls],
        }).compileComponents();

        fixture = TestBed.createComponent(AdminTabControls);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
