import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Navigation } from './navigation';
import { ActivatedRoute } from '@angular/router';

describe('Navigation', () => {
    let component: Navigation;
    let fixture: ComponentFixture<Navigation>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Navigation],
            providers: [{ provide: ActivatedRoute, useValue: {} }],
        }).compileComponents();

        fixture = TestBed.createComponent(Navigation);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
