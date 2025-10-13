import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface CalculationRowProps {
    label: string;
    values: (number | null)[]; // Tar imot en liste med tall
    isBold?: boolean; // Valgfri prop for å gjøre teksten fet
}

export default function CalculationRow({ label, values, isBold = false }: CalculationRowProps) {
    return (
        <View style={styles.row}>
            <Text style={[styles.label, isBold && styles.boldText]}>{label}</Text>

            {values.map((value, index) => (
                <View key={index} style={styles.valueContainer}>
                    <Text style={[styles.value, isBold && styles.boldText]}>
                        {value ?? '-'}
                    </Text>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        backgroundColor: '#f9f9f9',
        paddingLeft: 8, // Matcher header
    },
    label: {
        width: 100, // Matcher header
        fontSize: 18,
        color: '#333',
    },
    valueContainer: {
        flex: 1, // Matcher header
        alignItems: 'center',
    },
    value: {
        fontSize: 18,
        color: '#000',
    },
    boldText: {
        fontWeight: 'bold',
    },
});