import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

const isTV = Platform.OS === 'android' && Platform.isTV;

export default function WeatherScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🌤️ Weather</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.emoji}>🌦️</Text>
        <Text style={styles.message}>Weather screen coming soon!</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    padding: isTV ? 20 : 15,
    paddingTop: isTV ? 30 : 20,
    backgroundColor: '#16213e',
    borderBottomWidth: 2,
    borderBottomColor: '#0f3460',
  },
  title: {
    fontSize: isTV ? 28 : 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: isTV ? 120 : 80,
    marginBottom: 20,
  },
  message: {
    fontSize: isTV ? 24 : 18,
    color: '#aaa',
  },
});
