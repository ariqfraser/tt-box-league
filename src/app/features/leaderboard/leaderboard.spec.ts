import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Leaderboard } from './leaderboard';
import { LeaderboardService } from './leaderboard.service';
import { of } from 'rxjs';

describe('Leaderboard', () => {
    let component: Leaderboard;
    let fixture: ComponentFixture<Leaderboard>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Leaderboard],
            providers: [
                {
                    provide: LeaderboardService,
                    useValue: {
                        getLeaderboardData: () => of([]),
                    },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(Leaderboard);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
