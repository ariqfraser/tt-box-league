import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchConfirmationDialog } from './match-confirmation-dialog';

describe('MatchConfirmationDialog', () => {
    let component: MatchConfirmationDialog;
    let fixture: ComponentFixture<MatchConfirmationDialog>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MatchConfirmationDialog],
        }).compileComponents();

        fixture = TestBed.createComponent(MatchConfirmationDialog);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
