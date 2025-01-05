import { StyleSheet, Text, View } from 'react-native';
import MainNavigator from './browsers/MainNavigator';

export default function App() {
  return (
  <MainNavigator/>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});