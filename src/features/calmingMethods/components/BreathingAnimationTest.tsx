import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";

const owlBreathingLoop = require(
  "../../../../assets/calmingMethodsMedia/breathing/animations/owl-breathing-loop.gif",
);

export function BreathingAnimationTest() {
  return (
    <View style={styles.container}>
      <Image
        source={owlBreathingLoop}
        style={styles.animation}
        contentFit="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eaf4f0",
  },
  animation: {
    width: 300,
    height: 450,
  },
});