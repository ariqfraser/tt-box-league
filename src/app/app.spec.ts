import { TestBed, ComponentFixture } from '@angular/core/testing';
import { App } from './app';
import { resetLogMock } from '@testing';

describe('App', () => {
    let fixture: ComponentFixture<App>;
    let component: App;

    beforeEach(async () => {
        resetLogMock();
        await TestBed.configureTestingModule({
            imports: [App],
        }).compileComponents();

        fixture = TestBed.createComponent(App);
        component = fixture.componentInstance;
    });

    it('should create the app', () => {
        expect(component).toBeTruthy();
    });
});
