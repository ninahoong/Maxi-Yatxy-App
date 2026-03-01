import { DiceValue } from '@/types/yatzy';
import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';

interface DiceProps {
    value: DiceValue;
    isHeld: boolean;
    isRolling: boolean;
    onPress: () => void;
    disabled?: boolean;
}

export function Dice({ value, isHeld, isRolling, onPress, disabled = false }: DiceProps) {
    const rotation = useSharedValue(0);
    const scale = useSharedValue(1);

    const backgroundColor = isHeld ? '#4CAF50' : '#FFFFFF';
    const textColor = isHeld ? '#FFFFFF' : '#000000';
    const borderColor = isHeld ? '#388E3C' : '#E0E0E0';

    useEffect(() => {
        if (isRolling && !isHeld) {
            // Spin animation
            rotation.value = withSequence(
                withTiming(15, { duration: 50, easing: Easing.linear }),
                withRepeat(withTiming(-15, { duration: 100, easing: Easing.linear }), 3, true),
                withTiming(0, { duration: 50, easing: Easing.linear })
            );

            // Pop animation
            scale.value = withSequence(
                withTiming(1.2, { duration: 150 }),
                withTiming(1, { duration: 150 })
            );
        }
    }, [isRolling, isHeld, rotation, scale]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { rotateZ: `${rotation.value}deg` },
                { scale: isHeld ? 0.95 : scale.value },
            ],
        };
    });

    return (
        <Animated.View style={[animatedStyle, { zIndex: isHeld ? 1 : 10 }]}>
            <Pressable
                onPress={onPress}
                disabled={disabled || isRolling}
                style={[
                    styles.diceContainer,
                    { backgroundColor, borderColor },
                ]}>
                <View style={styles.center}>
                    <Text style={[styles.diceText, { color: textColor }]}>
                        {value}
                    </Text>
                </View>
            </Pressable>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    diceContainer: {
        width: 50,
        height: 50,
        borderRadius: 12,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3, // for Android
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    diceText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
});
