import { useNavigation } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import { Alert, PermissionsAndroid, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import WebView from 'react-native-webview';

// estrutura para retorno das "capturas" se necessário
let NativeActionResponse = {
  success: false,
  response: ""
}

let ReturnValueActionFinish = {
  typeOfFinishing: "", // tipo de fechamento "CloseWindow" ou "RedirectToLink"
  linkForRedirect: "" // acompanha url caso haja redirecionamento configurado 
}

/**
 * @interface
 * {key} contém nome da função  
 * {callback} deve conter o nome da função acima para possíveis retorno de dados na webview, por equanto sem uso.  
 * {value} dados diversos recebido do Lite.
 */
let NativeAction = {
  key: "",
  callback: "",
  value: null
}

let WebviewProps = {
  navigation: undefined,
  route: undefined,
  uri: ""
}

const AppWebView = ({ route, navigation, uri }) => {
  let webRef = useRef(null);
  let url = useRef(route.params.url)

  // é necessário injetar essa variável de forma global para identificação dentro da webview
  const runBeforeFirst = `window.isReactNativeWebView = true`;

   // passar retorno das capturas entre outras coisas pelo callback
   const webViewCallback = (data) =>
   `(function() {
     window.reactWebViewCallback(${JSON.stringify(data)});
   })()`;

  
  function handlerNavigate(paramName) {
    navigation.navigate(paramName);
  }
  
  const requestCameraPermission = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: "App Permissão de Câmera",
        message: "O App precisa de acesso à câmera.",
        buttonNeutral: "Pergunte-me depois",
        buttonNegative: "Cancelar",
        buttonPositive: "OK"
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      // Alert.alert('Você pode usar a Câmera');
    } else {
      // Alert.alert('Permissão de Câmera negada');
    }
  };

  // função para finalizar atendimento. ()
  const actionToFinish = (params) => {
    return new Promise((resolve, reject) => {

      // Estou recebendo do params
    NativeAction = {
        key: params.key, // "actionToFinish",
        callback: params.callback, // " window.reactWebViewCallback"
        value: params.value
    }

      const resultado = NativeAction

      // simulando fechamento do atendimento (navegue para tela Home)
      handlerNavigate('Home')

      // caso necessite retorna algo para App do Onboarding Digital
      NativeActionResponse = {
        success: true,
        response: "Ok!!!"
      }

      const response = NativeActionResponse
      
      webViewCallback(JSON.stringify(response))

      // resolve('');
    });
  }

  // entrada para comunicação entre webview e o nativo
  const entryCaptures = async (data) => {
    const params = JSON.parse(data);
    NativeAction = {
        key: params.key, // "actionToFinish",
        callback: params.callback, // " window.reactWebViewCallback"
        value: params.value
    }
    const options = {
      actionToFinish
    };
  
    const option = options[nativeAction.key];
    
    if (!option) return false
    
    try {
      await option(nativeAction)

    } catch(e) {
      throw new Error('Error ' + e)
    }
  
  }

  return (
    <View style={{ flex: 1, zIndex: 0, position: 'relative' }}>
      <WebView 
        ref={f => webRef.current = f}
        onLoadEnd={() => { requestCameraPermission() }} 
        source={{uri: url.current }} 
        onMessage={(event) => {
          const { nativeEvent } = event;

          entryCaptures(nativeEvent.data);
        }}
        injectedJavaScriptBeforeContentLoaded={runBeforeFirst}
        allowsInlineMediaPlayback={true}
      >
      </WebView>
   </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
});

export default AppWebView;
