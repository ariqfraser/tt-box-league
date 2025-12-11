interface Player {
    id: string;
    rating: number;
    inPlacementPhase: boolean;
}

/**
 * Resulting ELO ratings after a match
 * Key - string = player ID
 */
type EloResult = Record<string, { oldRating: number; newRating: number }>;

/**
 * calculates the new ELO ratings for two players after a match
 * @param player1
 * @param player2
 * @param winner 0 or 1 - 0 being player1 and 1 being player2
 * @returns object containing new ratings for both players
 */
export const eloAdjustmentCalculator = (
    player1: Player,
    player2: Player,
    winner: 0 | 1,
): EloResult => {
    // Use higher K-factor during placement phase for more volatility
    const getKFactor = (inPlacement: boolean): number => (inPlacement ? 64 : 32);

    const K_FACTOR_1 = getKFactor(player1.inPlacementPhase);
    const K_FACTOR_2 = getKFactor(player2.inPlacementPhase);

    const expectedScore1 = 1 / (1 + Math.pow(10, (player2.rating - player1.rating) / 400));
    const expectedScore2 = 1 / (1 + Math.pow(10, (player1.rating - player2.rating) / 400));

    const actualScore1 = winner === 0 ? 1 : 0;
    const actualScore2 = winner === 1 ? 1 : 0;

    const player1NewRating = player1.rating + K_FACTOR_1 * (actualScore1 - expectedScore1);
    const player2NewRating = player2.rating + K_FACTOR_2 * (actualScore2 - expectedScore2);

    return {
        [player1.id]: { oldRating: player1.rating, newRating: Math.round(player1NewRating) },
        [player2.id]: { oldRating: player2.rating, newRating: Math.round(player2NewRating) },
    };
};
