import SafeAreaWrapper from '@/components/SafeAreaWrapper';
import React from 'react';
import { StyleSheet, Text } from 'react-native';

const EditBookScreen = () => {
  return (
    <SafeAreaWrapper style={styles.container}>
      <Text style={styles.text}>Edit Book Screen</Text>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#151718',
  },
  text: {
    color: '#ECEDEE',
  },
});

export default EditBookScreen;
