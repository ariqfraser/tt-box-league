import { TestBed } from '@angular/core/testing';

import { LoginFlowService } from './login-flow.service';

describe('LoginFlowService', () => {
    let service: LoginFlowService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(LoginFlowService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
