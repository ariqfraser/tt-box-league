import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Input } from './input';
import { ControlContainer } from '@angular/forms';

describe('Input', () => {
    let component: Input;
    let fixture: ComponentFixture<Input>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Input],
            providers: [{ provide: ControlContainer, useValue: {} }],
        }).compileComponents();

        fixture = TestBed.createComponent(Input);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
