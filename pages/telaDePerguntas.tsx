import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// import { Container } from './styles';

const TelaDePerguntas: React.FC = () => {
  return(
      <View style={style.container}>
        <Text>TelaDePerguntas.tsx</Text>
      </View>
  ) 
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default TelaDePerguntas;