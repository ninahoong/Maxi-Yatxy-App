import { useCallback, useState } from 'react';
import { DiceValue, DieState, GameState, ScoreCategory, Scores } from '../types/yatzy';

const NUM_DICE = 6;
const MAX_ROLLS = 3;

const INITIAL_SCORES: Scores = {
    ones: null,
    twos: null,
    threes: null,
    fours: null,
    fives: null,
    sixes: null,
    onePair: null,
    twoPairs: null,
    threePairs: null,
    threeOfAKind: null,
    fourOfAKind: null,
    fiveOfAKind: null,
    smallStraight: null,
    largeStraight: null,
    fullHouse: null,
    chance: null,
    maxiYatzy: null,
};

const INITIAL_DICE: DieState[] = Array(NUM_DICE).fill({ value: 1, isHeld: false });

export const useYatzyGame = () => {
    const [gameState, setGameState] = useState<GameState>({
        dice: INITIAL_DICE,
        rollsLeft: MAX_ROLLS,
        scores: { ...INITIAL_SCORES },
        gameOver: false,
    });

    const rollDice = useCallback(() => {
        if (gameState.rollsLeft <= 0) return;

        setGameState((prevState) => ({
            ...prevState,
            rollsLeft: prevState.rollsLeft - 1,
            dice: prevState.dice.map((die) =>
                die.isHeld
                    ? die
                    : { ...die, value: (Math.floor(Math.random() * 6) + 1) as DiceValue }
            ),
        }));
    }, [gameState.rollsLeft]);

    const toggleDieHold = useCallback((index: number) => {
        // Can only hold if we've rolled at least once
        if (gameState.rollsLeft === MAX_ROLLS) return;

        setGameState((prevState) => {
            const newDice = [...prevState.dice];
            newDice[index] = { ...newDice[index], isHeld: !newDice[index].isHeld };
            return { ...prevState, dice: newDice };
        });
    }, [gameState.rollsLeft]);

    const recordScore = useCallback((category: ScoreCategory) => {
        // Require at least one roll to score
        if (gameState.scores[category] !== null || gameState.rollsLeft === MAX_ROLLS) return;

        setGameState((prevState) => {
            const score = calculateScore(prevState.dice, category);
            const newScores = { ...prevState.scores, [category]: score };
            const isGameOver = Object.values(newScores).every((s) => s !== null);

            return {
                ...prevState,
                scores: newScores,
                rollsLeft: MAX_ROLLS,
                dice: INITIAL_DICE,
                gameOver: isGameOver,
            };
        });
    }, [gameState.scores, gameState.rollsLeft]);

    const resetGame = useCallback(() => {
        setGameState({
            dice: INITIAL_DICE,
            rollsLeft: MAX_ROLLS,
            scores: { ...INITIAL_SCORES },
            gameOver: false,
        });
    }, []);

    return {
        ...gameState,
        rollDice,
        toggleDieHold,
        recordScore,
        resetGame,
    };
};

function calculateScore(diceState: DieState[], category: ScoreCategory): number {
    const dice = diceState.map((d) => d.value);
    const counts = new Map<number, number>();
    dice.forEach((val) => counts.set(val, (counts.get(val) || 0) + 1));

    const sumOf = (targetValue: number) =>
        dice.filter((v) => v === targetValue).reduce((sum, val) => sum + val, 0);

    const getPairs = (): number[] => {
        const pairs: number[] = [];
        counts.forEach((count, val) => {
            if (count >= 2) pairs.push(val);
            // If we have 4 or more, count it as two separate pairs for threePairs logic
            if (count >= 4) pairs.push(val);
            if (count >= 6) pairs.push(val);
        });
        return pairs.sort((a, b) => b - a);
    };

    const getOfAKind = (n: number): number => {
        for (const [val, count] of counts.entries()) {
            if (count >= n) return val * n;
        }
        return 0;
    };

    const hasStraight = (requiredValues: number[]): boolean => {
        return requiredValues.every((val) => counts.has(val));
    };

    switch (category) {
        case 'ones': return sumOf(1);
        case 'twos': return sumOf(2);
        case 'threes': return sumOf(3);
        case 'fours': return sumOf(4);
        case 'fives': return sumOf(5);
        case 'sixes': return sumOf(6);

        case 'onePair': {
            const pairs = getPairs();
            return pairs.length > 0 ? pairs[0] * 2 : 0;
        }
        case 'twoPairs': {
            const pairs = getPairs();
            // Need 2 distinct pairs (or four of a kind which acts as two pairs)
            return pairs.length >= 2 ? (pairs[0] * 2) + (pairs[1] * 2) : 0;
        }
        case 'threePairs': {
            const pairs = getPairs();
            return pairs.length >= 3 ? (pairs[0] * 2) + (pairs[1] * 2) + (pairs[2] * 2) : 0;
        }

        case 'threeOfAKind': return getOfAKind(3);
        case 'fourOfAKind': return getOfAKind(4);
        case 'fiveOfAKind': return getOfAKind(5);

        case 'smallStraight':
            // 1-2-3-4-5
            return hasStraight([1, 2, 3, 4, 5]) ? 15 : 0;

        case 'largeStraight':
            // 2-3-4-5-6
            return hasStraight([2, 3, 4, 5, 6]) ? 20 : 0;

        case 'fullHouse': {
            // Small variation in Maxi Yatzy: usually 3 of a kind + 2 of a kind.
            // E.g., Five dice used. Or in Maxi Yatzy, 3 of a kind + a pair.
            let threeKind = 0;
            let pair = 0;

            for (const [val, count] of counts.entries()) {
                if (count >= 3 && threeKind === 0) {
                    threeKind = val;
                } else if (count >= 2) {
                    pair = val;
                }
            }

            // Handle the case where someone rolls five of a kind (5 counts as 3 of a kind and a pair)
            if (threeKind > 0 && counts.get(threeKind)! >= 5) {
                return (threeKind * 3) + (threeKind * 2);
            }

            return (threeKind > 0 && pair > 0) ? (threeKind * 3) + (pair * 2) : 0;
        }

        case 'chance':
            return dice.reduce((sum, val) => sum + val, 0);

        case 'maxiYatzy':
            // 6 of a kind
            for (const count of counts.values()) {
                if (count >= 6) return 100; // Maxi Yatzy standard points
            }
            return 0;

        default:
            return 0;
    }
}
