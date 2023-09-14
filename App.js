import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './src/views/Home.jsx'
import AppWebView from './src/views/app_webview.jsx';

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='Home' component={Home} />
        {/* <Stack.Screen name='AppWebView' component={AppWebView} /> */}
        <Stack.Screen name='AppWebView' >
          {(props) => <AppWebView {...props}></AppWebView>}
        </Stack.Screen>
        {/* <Stack.Screen name='Camera' component={Camera} /> */}
      </Stack.Navigator>
    </NavigationContainer>
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
