import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchScoreForm } from './match-score-form';

describe('MatchScoreForm', () => {
    let component: MatchScoreForm;
    let fixture: ComponentFixture<MatchScoreForm>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MatchScoreForm],
        }).compileComponents();

        fixture = TestBed.createComponent(MatchScoreForm);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
