import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import Constants from "expo-constants";

const webAppUrl =
  (Constants.expoConfig?.extra?.webAppUrl as string | undefined) ||
  "https://your-vercel-domain.vercel.app";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <WebView source={{ uri: webAppUrl }} allowsInlineMediaPlayback />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050510",
  },
});
