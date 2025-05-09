import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  Animated,
  Easing,
} from "react-native";
import * as Location from "expo-location";
import { Accelerometer } from "expo-sensors";
import PlacePhoneMessage from "./components/PlacePhoneMessage";

const KAABA_LAT = 21.4225;
const KAABA_LON = 39.8262;

export default function QiblahCompass() {
  const [location, setLocation] = useState(null);
  const [heading, setHeading] = useState(0);
  const [qiblaDirection, setQiblaDirection] = useState(0);
  const [isAligned, setIsAligned] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [flatSurface, setFlatSurface] = useState(true);

  const borderAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("تم رفض إذن الوصول إلى الموقع");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);

      Location.watchHeadingAsync((headingData) => {
        const currentHeading =
          headingData.trueHeading ?? headingData.magHeading;
        setHeading(currentHeading);
      });
    })();
  }, []);

  useEffect(() => {
    if (!location) return;

    const lat1 = (location.latitude * Math.PI) / 180;
    const lon1 = (location.longitude * Math.PI) / 180;
    const lat2 = (KAABA_LAT * Math.PI) / 180;
    const lon2 = (KAABA_LON * Math.PI) / 180;

    const dLon = lon2 - lon1;
    const x = Math.sin(dLon);
    const y = Math.cos(lat1) * Math.tan(lat2) - Math.sin(lat1) * Math.cos(dLon);
    const angle = (Math.atan2(x, y) * 180) / Math.PI;

    const qibla = (angle + 360) % 360;
    setQiblaDirection(qibla);
  }, [location]);

  useEffect(() => {
    const diff = (qiblaDirection - heading + 360) % 360;
    const errorMargin = 5;
    setIsAligned(diff < errorMargin || diff > 360 - errorMargin);
  }, [heading, qiblaDirection]);

  useEffect(() => {
    const subscription = Accelerometer.addListener((data) => {
      const { z } = data;
      setFlatSurface(Math.abs(z) > 0.95);
    });

    Accelerometer.setUpdateInterval(500);
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (!isAligned || !flatSurface) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(borderAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
          Animated.timing(borderAnim, {
            toValue: 0,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
        ])
      ).start();
    } else {
      borderAnim.stopAnimation();
      borderAnim.setValue(0);
    }
  }, [isAligned, flatSurface]);

  const getInstruction = () => {
    if (!flatSurface) return "يرجى وضع الهاتف على سطح مستوٍ";
    if (isAligned) return "أنت الآن باتجاه القبلة";
    const diff = (qiblaDirection - heading + 360) % 360;
    return diff < 180
      ? "قم بتدوير الهاتف جهة اليمين "
      : "قم بتدوير الهاتف جهة اليسار ";
  };

  const interpolatedBorderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#F6A94A", "#FFD580"],
  });

  const interpolatedScale = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.05],
  });

  return (
    <View style={styles.container}>
      {!flatSurface ? (
        <PlacePhoneMessage />
      ) : (
        <Text
          style={[styles.title, isAligned && flatSurface && styles.aligned]}
        >
          {getInstruction()}
        </Text>
      )}

      {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}

      {!location ? (
        <ActivityIndicator size="large" color="#F6A94A" />
      ) : (
        flatSurface && (
          <Animated.View
            style={[
              styles.compassContainer,
              {
                borderColor:
                  isAligned && flatSurface
                    ? "#00C851"
                    : interpolatedBorderColor,
                transform: [{ scale: isAligned ? 1 : interpolatedScale }],
              },
            ]}
          >
            <Image
              source={require("../../assets/images/qibla-compass.png")}
              style={[
                styles.compass,
                {
                  tintColor: isAligned && flatSurface ? "#00C851" : "#F6A94A",
                },
              ]}
            />
          </Animated.View>
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0B0D",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "600",
    fontFamily: "UthmanicHafs",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 25,
  },
  aligned: {
    color: "#00C851",
  },
  error: {
    color: "#FF6B6B",
    marginBottom: 15,
    textAlign: "center",
  },
  compassContainer: {
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1C1C1E",
  },
  compass: {
    width: 240,
    height: 240,
    resizeMode: "contain",
  },
});
