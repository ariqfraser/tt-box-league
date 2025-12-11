import { Component, HostListener, input, output, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Icon } from '../icon/icon';

type SwipeDirection = 'left' | 'right' | null;

/**
 *
 */
@Component({
    selector: 'app-match-score-form',
    imports: [FormsModule, ReactiveFormsModule, Icon],
    templateUrl: './match-score-form.html',
    styleUrl: './match-score-form.scss',
})
export class MatchScoreForm {
    readonly playerOneName = input.required<string>();
    readonly playerOneId = input.required<string>();
    readonly playerTwoName = input.required<string>();
    readonly playerTwoId = input.required<string>();
    readonly matchId = input.required<string>();

    protected readonly dragOffset = signal(0);
    protected readonly isSubmitted = signal(false);
    protected readonly submittedDirection = signal<SwipeDirection>(null);
    protected readonly winnerSelected = output<{
        name: string;
        matchId: string;
        winnerId: string;
    }>();

    private touchStartX = 0;
    private touchStartY = 0;
    private readonly swipeThreshold = 100;
    private readonly maxDragDistance = 150;

    /**
     *
     * @param event
     */
    @HostListener('touchstart', ['$event'])
    onTouchStart(event: TouchEvent): void {
        if (this.isSubmitted()) return;
        this.touchStartX = event.touches[0].clientX;
        this.touchStartY = event.touches[0].clientY;
    }

    /**
     *
     * @param event
     */
    @HostListener('touchmove', ['$event'])
    onTouchMove(event: TouchEvent): void {
        if (this.isSubmitted()) return;
        const currentX = event.touches[0].clientX;
        const currentY = event.touches[0].clientY;

        const deltaX = currentX - this.touchStartX;
        const deltaY = currentY - this.touchStartY;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            event.preventDefault();
            const clampedDelta = Math.max(
                -this.maxDragDistance,
                Math.min(this.maxDragDistance, deltaX),
            );
            this.dragOffset.set(clampedDelta);
        }
    }

    /**
     *
     */
    @HostListener('touchend')
    onTouchEnd(): void {
        if (this.isSubmitted()) return;
        const currentOffset = this.dragOffset();

        if (Math.abs(currentOffset) >= this.swipeThreshold) {
            const direction = currentOffset > 0 ? 'right' : 'left';
            this.submitSwipe(direction as SwipeDirection);
        } else {
            this.resetDrag();
        }
    }

    private submitSwipe(direction: SwipeDirection): void {
        if (!direction) return;

        this.isSubmitted.set(true);
        this.submittedDirection.set(direction);

        const winnerId = direction === 'left' ? this.playerTwoId() : this.playerOneId();
        const winnerName = direction === 'left' ? this.playerTwoName() : this.playerOneName();
        if (winnerId) {
            this.winnerSelected.emit({
                matchId: this.matchId(),
                name: winnerName,
                winnerId: winnerId,
            });
        } else {
            console.warn('No winner ID found for direction:', direction);
        }

        setTimeout(() => {
            this.resetDrag();
            this.isSubmitted.set(false);
            this.submittedDirection.set(null);
        }, 1000);
    }

    private resetDrag(): void {
        this.dragOffset.set(0);
    }
}
