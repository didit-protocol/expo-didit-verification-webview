import { StyleSheet, Text, View } from 'react-native';

import { Camera } from "expo-camera";
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import WebView from 'react-native-webview';


export default function VerifyScreen() {
  const { sessionUrl } = useLocalSearchParams();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useFocusEffect(useCallback(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      const { status: audioStatus } = await Camera.requestMicrophonePermissionsAsync();
      setHasPermission(status === "granted" && audioStatus === "granted");
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
    <View style={styles.container}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
});
