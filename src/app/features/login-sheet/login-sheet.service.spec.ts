import { TestBed } from '@angular/core/testing';

import { LoginSheetService } from './login-sheet.service';

describe('LoginSheetService', () => {
    let service: LoginSheetService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(LoginSheetService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
