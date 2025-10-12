import React, { useState } from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import ScoreRow from '../components/ScoreRow';

const scoreKeys = ['enere', 'toere', 'treere', 'firere', 'femmere', 'seksere'] as const;
type ScoreKey = typeof scoreKeys[number];

const PLAYER_COUNT = 4;

export default function GameScreen() {
    // NY STATE: Nå er `scores` et objekt der hver nøkkel (f.eks. 'enere')
    // holder en liste (Array) med poeng, én for hver spiller.
    const [scores, setScores] = useState<Record<ScoreKey, string[]>>({
        enere: Array(PLAYER_COUNT).fill(''),
        toere: Array(PLAYER_COUNT).fill(''),
        treere: Array(PLAYER_COUNT).fill(''),
        firere: Array(PLAYER_COUNT).fill(''),
        femmere: Array(PLAYER_COUNT).fill(''),
        seksere: Array(PLAYER_COUNT).fill(''),
    });

    // NY FUNKSJON: Denne funksjonen oppdaterer poengsummen for
    // en spesifikk rad OG en spesifikk spiller (playerIndex).
    const handleScoreChange = (rowKey: ScoreKey, playerIndex: number, value: string) => {
        // Vi lager alltid kopier av state for å unngå feil.
        const newScores = { ...scores };
        const newRowScores = [...newScores[rowKey]];
        newRowScores[playerIndex] = value;
        newScores[rowKey] = newRowScores;
        setScores(newScores);
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Maxi Yatzy</Text>

            {/* Spiller-overskrifter */}
            <View style={styles.headerRow}>
                <Text style={styles.headerLabel}>Poeng</Text>
                {Array.from({ length: PLAYER_COUNT }).map((_, index) => (
                    <Text key={index} style={styles.headerPlayer}>
                        {`P${index + 1}`}
                    </Text>
                ))}
            </View>

            <View style={styles.section}>
                {/* Vi bruker .map() for å lage radene dynamisk. */}
                <ScoreRow
                    label="Enere"
                    scores={scores.enere}
                    onScoreChange={(playerIndex, value) => handleScoreChange('enere', playerIndex, value)}
                />
                <ScoreRow
                    label="Toere"
                    scores={scores.toere}
                    onScoreChange={(playerIndex, value) => handleScoreChange('toere', playerIndex, value)}
                />
                <ScoreRow
                    label="Treere"
                    scores={scores.treere}
                    onScoreChange={(playerIndex, value) => handleScoreChange('treere', playerIndex, value)}
                />
                <ScoreRow
                    label="Firere"
                    scores={scores.firere}
                    onScoreChange={(playerIndex, value) => handleScoreChange('firere', playerIndex, value)}
                />
                <ScoreRow
                    label="Femmere"
                    scores={scores.femmere}
                    onScoreChange={(playerIndex, value) => handleScoreChange('femmere', playerIndex, value)}
                />
                <ScoreRow
                    label="Seksere"
                    scores={scores.seksere}
                    onScoreChange={(playerIndex, value) => handleScoreChange('seksere', playerIndex, value)}
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
    },
    section: {
        marginBottom: 20,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 5,
        borderBottomWidth: 2,
        borderBottomColor: '#333',
    },
    headerLabel: {
        flex: 1.5, // Gir mer plass til etikettene
        fontSize: 16,
        fontWeight: 'bold',
    },
    headerPlayer: {
        flex: 1,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },
});