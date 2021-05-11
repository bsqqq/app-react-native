import * as React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import Routes from './routes/'

const App: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Routes/>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'space-between',
    marginBottom: 10
  }
})