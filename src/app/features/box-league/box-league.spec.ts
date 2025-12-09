import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxLeague } from './box-league';

describe('BoxLeague', () => {
    let component: BoxLeague;
    let fixture: ComponentFixture<BoxLeague>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BoxLeague],
            providers: [],
        }).compileComponents();

        fixture = TestBed.createComponent(BoxLeague);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
