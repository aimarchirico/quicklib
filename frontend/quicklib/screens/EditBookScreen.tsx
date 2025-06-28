import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const EditBookScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Edit Book Screen</Text>
    </View>
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
