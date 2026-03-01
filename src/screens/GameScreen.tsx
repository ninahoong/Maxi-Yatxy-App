import { ScoreCategory } from '@/types/yatzy';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Dice } from '../../components/Dice';
import { useYatzyGame } from '../../hooks/useYatzyGame';
import CalculationRow from '../components/CalculationRow';
import ScoreRow from '../components/ScoreRow';

const upperSectionKeys = ['enere', 'toere', 'treere', 'firere', 'femmere', 'seksere'] as const;
const lowerSectionKeys = [
    'ettPar', 'toPar', 'trePar', 'treLike', 'fireLike', 'femLike', 'litenStraight', 'storStraight', 'fullStraight', 'hytte', 'hus', 'tarn', 'sjanse', 'yatzy'
] as const;

// A mapping from Norwegian labels to our internal english enum logic
const categoryMap: Record<string, ScoreCategory> = {
    'enere': 'ones', 'toere': 'twos', 'treere': 'threes', 'firere': 'fours', 'femmere': 'fives', 'seksere': 'sixes',
    'ettPar': 'onePair', 'toPar': 'twoPairs', 'trePar': 'threePairs', 'treLike': 'threeOfAKind', 'fireLike': 'fourOfAKind', 'femLike': 'fiveOfAKind',
    'litenStraight': 'smallStraight', 'storStraight': 'largeStraight', 'fullStraight': 'fullHouse', // Map "full straight" to fullHouse logic for now
    'hytte': 'fullHouse', 'hus': 'fullHouse', 'tarn': 'fullHouse', // These are specific scandinavia rules, mapping to fullHouse logic as placeholder
    'sjanse': 'chance', 'yatzy': 'maxiYatzy'
};

export default function GameScreen() {
    const { players } = useLocalSearchParams();
    const playerCount = parseInt(players as string || '2', 10);

    const {
        dice, rollsLeft, currentPlayerIndex, scores, gameOver,
        rollDice, toggleDieHold, recordScore
    } = useYatzyGame(playerCount);

    const [isRolling, setIsRolling] = useState(false);

    const onRollDice = () => {
        if (rollsLeft > 0) {
            setIsRolling(true);
            setTimeout(() => {
                rollDice();
                setIsRolling(false);
            }, 300);
        }
    }

    // Convert our array of player Score sheets back into the array-of-strings format expected by the UI rows
    const formatScoreRow = (internalKey: ScoreCategory): string[] => {
        return scores.map(playerScores => {
            const val = playerScores[internalKey];
            return val !== null ? val.toString() : '';
        });
    };

    // Calculate sums
    const upperSums = scores.map(playerScores => {
        let sum = 0;
        upperSectionKeys.forEach(norskKey => {
            sum += playerScores[categoryMap[norskKey]] || 0;
        });
        return sum;
    });

    const bonuses = upperSums.map(sum => sum >= 84 ? 100 : 0);

    const lowerSums = scores.map(playerScores => {
        let sum = 0;
        lowerSectionKeys.forEach(norskKey => {
            sum += playerScores[categoryMap[norskKey]] || 0;
        });
        return sum;
    });

    const totalScores = upperSums.map((u, i) => u + bonuses[i] + lowerSums[i]);

    const handleScoreClick = (norskKey: string, playerIndex: number) => {
        if (playerIndex === currentPlayerIndex && rollsLeft < 3) {
            recordScore(categoryMap[norskKey], playerIndex);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Maxi Yatzy</Text>

            {/* --- DICE SECTION --- */}
            <View style={styles.diceBoard}>
                <View style={styles.diceContainer}>
                    {dice.map((die, index) => (
                        <Dice
                            key={index}
                            value={die.value}
                            isHeld={die.isHeld}
                            isRolling={isRolling}
                            onPress={() => toggleDieHold(index)}
                            disabled={rollsLeft === 3 || gameOver || isRolling}
                        />
                    ))}
                </View>

                <View style={styles.controlsContainer}>
                    <Text style={[styles.rollsText, { color: gameOver ? 'red' : 'black' }]}>
                        {gameOver ? "Spill over!" : `Spiller ${currentPlayerIndex + 1} sin tur (${rollsLeft} kast igjen)`}
                    </Text>
                    <Pressable
                        style={[
                            styles.rollButton,
                            { backgroundColor: (rollsLeft === 0 || gameOver || isRolling) ? '#999' : '#007AFF' }
                        ]}
                        onPress={onRollDice}
                        disabled={rollsLeft === 0 || gameOver || isRolling}
                    >
                        <Text style={styles.rollButtonText}>
                            {gameOver ? 'Ferdig' : rollsLeft === 3 ? 'Start Tur' : 'Kast Terninger'}
                        </Text>
                    </Pressable>
                </View>
            </View>

            <View style={styles.headerRow}>
                <Text style={styles.headerLabel}>Poeng</Text>
                {Array.from({ length: playerCount }).map((_, index) => (
                    <Text key={index} style={[styles.headerPlayer, index === currentPlayerIndex && styles.activePlayer]}>
                        {`P${index + 1}`}
                    </Text>
                ))}
            </View>

            {/*Toppseksjon*/}
            <View style={styles.section}>
                {upperSectionKeys.map(key => (
                    <ScoreRow
                        key={key}
                        label={key.charAt(0).toUpperCase() + key.slice(1)}
                        scores={formatScoreRow(categoryMap[key])}
                        onScoreChange={(i) => handleScoreClick(key, i)} // In the new UI, tapping the cell inputs the score based on the engine
                    />
                ))}

                <CalculationRow label="Sum" values={upperSums} isBold />
                <CalculationRow label="Bonus" values={bonuses} isBold />
            </View>

            {/*Bunnseksjon*/}
            <View style={styles.section}>
                {lowerSectionKeys.map(key => (
                    <ScoreRow
                        key={key}
                        label={key.charAt(0).toUpperCase() + key.slice(1)}
                        scores={formatScoreRow(categoryMap[key])}
                        onScoreChange={(i) => handleScoreClick(key, i)}
                    />
                ))}

                <CalculationRow label="Sum (nedre)" values={lowerSums} isBold />
                <View style={styles.totalSection}>
                    <CalculationRow label="TOTALT" values={totalScores} isBold />
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 8, },
    title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 20, },
    section: { marginBottom: 20, },
    headerRow: { flexDirection: 'row', alignItems: 'center', paddingBottom: 5, borderBottomWidth: 2, borderBottomColor: '#333', paddingLeft: 8, },
    headerLabel: { width: 100, fontSize: 16, fontWeight: 'bold', },
    headerPlayer: { flex: 1, textAlign: 'center', fontSize: 16, fontWeight: 'bold', },
    activePlayer: { color: '#007AFF', textDecorationLine: 'underline' },
    totalSection: { marginTop: 10, borderTopWidth: 2, borderTopColor: '#333', },

    // Dice styles
    diceBoard: {
        padding: 15,
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        marginBottom: 20,
    },
    diceContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 10,
        marginBottom: 15,
    },
    controlsContainer: {
        alignItems: 'center',
        gap: 10,
    },
    rollsText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    rollButton: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
        width: '80%',
        alignItems: 'center',
    },
    rollButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});