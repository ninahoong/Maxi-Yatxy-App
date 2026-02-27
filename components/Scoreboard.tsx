import { useThemeColor } from '@/hooks/use-theme-color';
import { ScoreCategory, Scores } from '@/types/yatzy';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { ThemedText } from './themed-text';

interface ScoreboardProps {
    scores: Scores;
    rollsLeft: number;
    onScoreSelect: (category: ScoreCategory) => void;
}

const UPPER_SECTION: { id: ScoreCategory; label: string }[] = [
    { id: 'ones', label: 'Ones' },
    { id: 'twos', label: 'Twos' },
    { id: 'threes', label: 'Threes' },
    { id: 'fours', label: 'Fours' },
    { id: 'fives', label: 'Fives' },
    { id: 'sixes', label: 'Sixes' },
];

const LOWER_SECTION: { id: ScoreCategory; label: string }[] = [
    { id: 'onePair', label: '1 Pair' },
    { id: 'twoPairs', label: '2 Pairs' },
    { id: 'threePairs', label: '3 Pairs' },
    { id: 'threeOfAKind', label: '3 of a Kind' },
    { id: 'fourOfAKind', label: '4 of a Kind' },
    { id: 'fiveOfAKind', label: '5 of a Kind' },
    { id: 'smallStraight', label: 'Small Straight' },
    { id: 'largeStraight', label: 'Large Straight' },
    { id: 'fullHouse', label: 'Full House' },
    { id: 'chance', label: 'Chance' },
    { id: 'maxiYatzy', label: 'Maxi Yatzy' },
];

export function Scoreboard({ scores, rollsLeft, onScoreSelect }: ScoreboardProps) {
    const borderColor = useThemeColor({ light: '#E0E0E0', dark: '#333333' }, 'border');
    const availableBg = useThemeColor({ light: '#F5F5F5', dark: '#1A1A1A' }, 'background');
    const scoredBg = useThemeColor({ light: '#E3F2FD', dark: '#0D47A1' }, 'background');

    const upperTotal = UPPER_SECTION.reduce((sum, item) => sum + (scores[item.id] || 0), 0);
    const bonus = upperTotal >= 84 ? 100 : 0; // Standard 5 dice is 63 for 35. 6 dice usually 84 for 100 bonus
    const lowerTotal = LOWER_SECTION.reduce((sum, item) => sum + (scores[item.id] || 0), 0);
    const grandTotal = upperTotal + bonus + lowerTotal;

    const renderRow = (item: { id: ScoreCategory; label: string }, isBold = false) => {
        const isScored = scores[item.id] !== null;
        const canScore = !isScored && rollsLeft < 3; // Must have rolled at least once

        return (
            <Pressable
                key={item.id}
                disabled={!canScore}
                onPress={() => onScoreSelect(item.id)}
                style={({ pressed }) => [
                    styles.row,
                    { borderBottomColor: borderColor },
                    isScored ? { backgroundColor: scoredBg } : canScore ? { backgroundColor: pressed ? '#E0E0E0' : availableBg } : {},
                ]}>
                <ThemedText style={[styles.label, isBold && styles.boldText]}>{item.label}</ThemedText>
                <ThemedText style={[styles.score, isBold && styles.boldText]}>
                    {isScored ? scores[item.id] : canScore ? '?' : '-'}
                </ThemedText>
            </Pressable>
        );
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={[styles.section, { borderColor }]}>
                <ThemedText style={styles.sectionTitle}>Upper Section</ThemedText>
                {UPPER_SECTION.map(item => renderRow(item))}

                <View style={[styles.row, styles.totalRow, { borderBottomColor: borderColor }]}>
                    <ThemedText style={styles.boldText}>Sum</ThemedText>
                    <ThemedText style={styles.boldText}>{upperTotal}</ThemedText>
                </View>
                <View style={[styles.row, { borderBottomColor: borderColor }]}>
                    <ThemedText style={styles.label}>Bonus (84+)</ThemedText>
                    <ThemedText style={styles.score}>{bonus > 0 ? bonus : '-'}</ThemedText>
                </View>
            </View>

            <View style={[styles.section, { borderColor }]}>
                <ThemedText style={styles.sectionTitle}>Lower Section</ThemedText>
                {LOWER_SECTION.map(item => renderRow(item))}

                <View style={[styles.row, styles.grandTotalRow, { borderBottomColor: borderColor }]}>
                    <ThemedText style={styles.grandTotalText}>Total</ThemedText>
                    <ThemedText style={styles.grandTotalText}>{grandTotal}</ThemedText>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
    },
    section: {
        marginBottom: 20,
        borderWidth: 1,
        borderRadius: 12,
        overflow: 'hidden',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        padding: 12,
        backgroundColor: 'rgba(0,0,0,0.05)',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
    },
    label: {
        fontSize: 16,
    },
    score: {
        fontSize: 16,
        fontWeight: '500',
        minWidth: 30,
        textAlign: 'right',
    },
    boldText: {
        fontWeight: 'bold',
    },
    totalRow: {
        backgroundColor: 'rgba(0,0,0,0.02)',
    },
    grandTotalRow: {
        backgroundColor: 'rgba(0,0,0,0.1)',
        paddingVertical: 16,
        borderBottomWidth: 0,
    },
    grandTotalText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});
