import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props{
    totalTime: number;
}

const GrillTime: React.FC<Props> = ({ totalTime }) => {
  const minutes = Math.floor(totalTime / 60);
  const seconds = totalTime % 60;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{`Grill Time: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default GrillTime;
