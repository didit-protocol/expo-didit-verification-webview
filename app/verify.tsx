import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import WebView, { WebViewMessageEvent } from 'react-native-webview';
import { useCallback, useState } from 'react';
import { Camera } from "expo-camera";


export default function VerifyScreen() {
  const { sessionUrl } = useLocalSearchParams();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useFocusEffect(useCallback(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []));


  if (hasPermission === null) {
    return <View>
      <Text>Loading...</Text>
    </View>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  console.log('sessionUrl', sessionUrl);



  return (
    <SafeAreaView style={styles.container}>
      <WebView
        source={{ uri: sessionUrl as string }}
        // Make sure to set the user agent to a generic mobile one
        userAgent="Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"

        // Media permissions - CRITICAL for camera/microphone access
        mediaCapturePermissionGrantType={'grant'}

        // Mandatory props for media
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}

        // Android-specific optimizations
        androidHardwareAccelerationDisabled={false}
        androidLayerType="hardware"

      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '90%',
  },
});
