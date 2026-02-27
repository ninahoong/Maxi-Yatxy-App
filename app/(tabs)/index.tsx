import { Dice } from '@/components/Dice';
import { Scoreboard } from '@/components/Scoreboard';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useYatzyGame } from '@/hooks/useYatzyGame';
import React, { useState } from 'react';
import { Alert, Pressable, SafeAreaView, StyleSheet, View } from 'react-native';

export default function HomeScreen() {
  const { dice, rollsLeft, scores, gameOver, rollDice, toggleDieHold, recordScore, resetGame } = useYatzyGame();
  const [isRolling, setIsRolling] = useState(false);

  const backgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#151718' }, 'background');
  const buttonBgColor = useThemeColor({ light: '#0a7ea4', dark: '#2f95dc' }, 'tint');
  const disabledButtonBgColor = useThemeColor({ light: '#999999', dark: '#555555' }, 'background');

  const onRollDice = () => {
    if (rollsLeft > 0) {
      setIsRolling(true);
      setTimeout(() => {
        rollDice();
        setIsRolling(false);
      }, 300); // 300ms matches the animation duration roughly
    }
  }

  const handleReset = () => {
    Alert.alert(
      "Reset Game",
      "Are you sure you want to start a new game?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Yes", onPress: resetGame }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <ThemedText type="title">Maxi Yatzy</ThemedText>
        <Pressable onPress={handleReset} style={styles.resetButton}>
          <ThemedText style={styles.resetText}>Restart</ThemedText>
        </Pressable>
      </View>

      <View style={styles.scoreboardContainer}>
        <Scoreboard
          scores={scores}
          rollsLeft={rollsLeft}
          onScoreSelect={recordScore}
        />
      </View>

      <View style={styles.gameBoard}>
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
          <ThemedText style={styles.rollsText}>
            Rolls Left: {rollsLeft}
          </ThemedText>
          <Pressable
            style={[
              styles.rollButton,
              { backgroundColor: (rollsLeft === 0 || gameOver || isRolling) ? disabledButtonBgColor : buttonBgColor }
            ]}
            onPress={onRollDice}
            disabled={rollsLeft === 0 || gameOver || isRolling}
          >
            <ThemedText style={styles.rollButtonText}>
              {gameOver ? 'Game Over' : rollsLeft === 3 ? 'Start Round' : 'Roll Dice'}
            </ThemedText>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  resetButton: {
    padding: 8,
  },
  resetText: {
    color: '#D32F2F',
    fontWeight: 'bold',
  },
  scoreboardContainer: {
    flex: 1,
    padding: 16,
  },
  gameBoard: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  diceContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 20,
  },
  controlsContainer: {
    alignItems: 'center',
    gap: 15,
  },
  rollsText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  rollButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 24,
    width: '100%',
    alignItems: 'center',
  },
  rollButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
