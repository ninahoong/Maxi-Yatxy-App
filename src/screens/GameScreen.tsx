import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import ScoreRow from '../components/ScoreRow';
import CalculationRow from '../components/CalculationRow';
import ActionButtonRow from '../components/ActionButtonRow';

const upperSectionKeys = ['enere', 'toere', 'treere', 'firere', 'femmere', 'seksere'] as const;
const lowerSectionKeys = [
    'ettPar', 'toPar', 'trePar', 'treLike', 'fireLike', 'femLike', 'litenStraight', 'storStraight', 'fullStraight', 'hytte', 'hus', 'tarn', 'sjanse', 'yatzy'
] as const;
const scoreKeys = [...upperSectionKeys, ...lowerSectionKeys];
type ScoreKey = typeof scoreKeys[number];

export default function GameScreen() {
    const { players } = useLocalSearchParams();
    const playerCount = parseInt(players as string || '2', 10);

    const getInitialScores = () :Record<ScoreKey, string[]> => ({
        //Topseksjon
        enere: Array(playerCount).fill(''),
        toere: Array(playerCount).fill(''),
        treere: Array(playerCount).fill(''),
        firere: Array(playerCount).fill(''),
        femmere: Array(playerCount).fill(''),
        seksere: Array(playerCount).fill(''),

        //Bunnseksjon
        ettPar: Array(playerCount).fill(''),
        toPar: Array(playerCount).fill(''),
        trePar: Array(playerCount).fill(''),
        treLike: Array(playerCount).fill(''),
        fireLike: Array(playerCount).fill(''),
        femLike: Array(playerCount).fill(''),
        litenStraight: Array(playerCount).fill(''),
        storStraight: Array(playerCount).fill(''),
        fullStraight: Array(playerCount).fill(''),
        hus: Array(playerCount).fill(''),
        hytte: Array(playerCount).fill(''),
        tarn: Array(playerCount).fill(''),
        sjanse: Array(playerCount).fill(''),
        yatzy: Array(playerCount).fill(''),
    });

    const [scores, setScores] = useState<Record<ScoreKey, string[]>>(getInitialScores);

    const [upperSums, setUpperSums] = useState<(number | null)[]>(Array(playerCount).fill(null));
    const [bonuses, setBonuses] = useState<(number | null)[]>(Array(playerCount).fill(null));
    const [lowerSums, setLowerSums] = useState<(number | null)[]>(Array(playerCount).fill(null));
    const [totalScores, setTotalScores] = useState<(number | null)[]>(Array(playerCount).fill(null));

    const [isUpperSumCalculated, setIsUpperSumCalculated] = useState(false);

    useEffect(() => {
        const newTotalScores = Array(playerCount).fill(0);
        for (let i = 0; i < playerCount; i++) {
            const upperSum = upperSums[i] || 0;
            const bonus = bonuses[i] || 0;
            const lowerSum = lowerSums[i] || 0;
            newTotalScores[i] = upperSum + bonus + lowerSum;
        }
        setTotalScores(newTotalScores);
    }, [upperSums, bonuses, lowerSums, playerCount]); // Kjører når en av summene endres

    // --- 4. NY FUNKSJON som kalles av knappen ---
    const handleCalculateUpperSum = () => {
        const newSums = Array(playerCount).fill(0);
        const newBonuses = Array(playerCount).fill(0);

        for (let i = 0; i < playerCount; i++) {
            let currentSum = 0;
            upperSectionKeys.forEach(key => {
                currentSum += parseInt(scores[key][i] || '0', 10);
            });
            newSums[i] = currentSum;
            if (currentSum >= 84) {
                newBonuses[i] = 100;
            }
        }
        setUpperSums(newSums);
        setBonuses(newBonuses);
        setIsUpperSumCalculated(true); // Avslør resultatet!
    }; // Legg til playerCount som dependency

    const handleScoreChange = (rowKey: ScoreKey, playerIndex: number, value: string) => {
        const numericValue = value.replace(/[^0-9]/g, '');
        const newScores = { ...scores };
        const newRowScores = [...newScores[rowKey]];
        newRowScores[playerIndex] = numericValue;
        newScores[rowKey] = newRowScores;
        setScores(newScores);
    };


    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Maxi Yatzy</Text>

            <View style={styles.headerRow}>
                <Text style={styles.headerLabel}>Poeng</Text>
                {Array.from({ length: playerCount }).map((_, index) => (
                    <Text key={index} style={styles.headerPlayer}>
                        {`P${index + 1}`}
                    </Text>
                ))}
            </View>

            {/*Toppseksjon*/}
            <View style={styles.section}>
                <ScoreRow label="Enere" scores={scores.enere} onScoreChange={(i, v) => handleScoreChange('enere', i, v)} />
                <ScoreRow label="Toere" scores={scores.toere} onScoreChange={(i, v) => handleScoreChange('toere', i, v)} />
                <ScoreRow label="Treere" scores={scores.treere} onScoreChange={(i, v) => handleScoreChange('treere', i, v)} />
                <ScoreRow label="Firere" scores={scores.firere} onScoreChange={(i, v) => handleScoreChange('firere', i, v)} />
                <ScoreRow label="Femmere" scores={scores.femmere} onScoreChange={(i, v) => handleScoreChange('femmere', i, v)} />
                <ScoreRow label="Seksere" scores={scores.seksere} onScoreChange={(i, v) => handleScoreChange('seksere', i, v)} />

                {isUpperSumCalculated ? (
                    <>
                        <CalculationRow label="Sum" values={upperSums} isBold />
                        <CalculationRow label="Bonus" values={bonuses} isBold />
                    </>
                ) : (
                    <ActionButtonRow label="Beregn Sum (øvre)" onPress={handleCalculateUpperSum} />
                )}
            </View>

            {/*Bunnseksjon*/}
            <View style={styles.section}>
                <ScoreRow label="Ett par" scores={scores.ettPar} onScoreChange={(i, v) => handleScoreChange('ettPar', i, v)} />
                <ScoreRow label="To par" scores={scores.toPar} onScoreChange={(i, v) => handleScoreChange('toPar', i, v)} />
                <ScoreRow label="Tre par" scores={scores.trePar} onScoreChange={(i, v) => handleScoreChange('trePar', i, v)} />
                <ScoreRow label="Tre like" scores={scores.treLike} onScoreChange={(i, v) => handleScoreChange('treLike', i, v)} />
                <ScoreRow label="Fire like" scores={scores.fireLike} onScoreChange={(i, v) => handleScoreChange('fireLike', i, v)} />
                <ScoreRow label="Fem like" scores={scores.femLike} onScoreChange={(i, v) => handleScoreChange('femLike', i, v)} />
                <ScoreRow label="Liten straight" scores={scores.litenStraight} onScoreChange={(i, v) => handleScoreChange('litenStraight', i, v)} />
                <ScoreRow label="Stor straight" scores={scores.storStraight} onScoreChange={(i, v) => handleScoreChange('storStraight', i, v)} />
                <ScoreRow label="Full straight" scores={scores.fullStraight} onScoreChange={(i, v) => handleScoreChange('fullStraight', i, v)} />
                <ScoreRow label="Hytte" scores={scores.hytte} onScoreChange={(i, v) => handleScoreChange('hytte', i, v)} />
                <ScoreRow label="Hus" scores={scores.hus} onScoreChange={(i, v) => handleScoreChange('hus', i, v)} />
                <ScoreRow label="Tårn" scores={scores.tarn} onScoreChange={(i, v) => handleScoreChange('tarn', i, v)} />
                <ScoreRow label="Sjanse" scores={scores.sjanse} onScoreChange={(i, v) => handleScoreChange('sjanse', i, v)} />
                <ScoreRow label="Yatzy" scores={scores.yatzy} onScoreChange={(i, v) => handleScoreChange('yatzy', i, v)} />

                <CalculationRow label="Sum (nedre)" values={lowerSums} isBold />
                <View style={styles.totalSection}>
                    <CalculationRow label="TOTALT" values={totalScores} isBold />
                </View>
            </View>
        </ScrollView>
    );
}

// Stilene er de samme som i forrige svar, de er allerede dynamiske.
const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 8, },
    title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 20, },
    section: { marginBottom: 20, },
    headerRow: { flexDirection: 'row', alignItems: 'center', paddingBottom: 5, borderBottomWidth: 2, borderBottomColor: '#333', paddingLeft: 8, },
    headerLabel: { width: 100, fontSize: 16, fontWeight: 'bold', },
    headerPlayer: { flex: 1, textAlign: 'center', fontSize: 16, fontWeight: 'bold', },
    totalSection: { marginTop: 10, borderTopWidth: 2, borderTopColor: '#333',},
});