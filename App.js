import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RegistroScreen from './src/screens/RegistroScreen';
import ListaScreen from './src/screens/ListaScreen';
import QueimaduraScreen from './src/screens/QueimaduraScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Registro" 
          component={RegistroScreen} 
          options={{ title: '📋 Registro' }} 
        />
        <Stack.Screen 
          name="Lista" 
          component={ListaScreen} 
          options={{ title: '📄 Registros' }} 
        />
       <Stack.Screen name="Queimadura" component={QueimaduraScreen} options={{ title: '🔥 Queimadura' }} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
}