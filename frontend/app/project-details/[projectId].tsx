import { View, Text, StyleSheet } from 'react-native';

export default function ProjectDetailsScreen() {
  return (
    <View style={styles.container}>
      {/* Centered message */}
      <View style={styles.centerContent}>
        <Text style={styles.placeholder}>Team projects will be displayed here</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
}); 