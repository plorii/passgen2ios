import { Feather } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { StatusBar } from "expo-status-bar";
import * as WebBrowser from "expo-web-browser";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Appearance,
  Image,
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import colors from "@/constants/colors";

const CHARS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!"§$%&()=?-_.,:;<+*#>@\u20ac{}[]|';

function generatePassword(length: number): string {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return result;
}

function getTheme(isDark: boolean) {
  return isDark ? colors.dark : colors.light;
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [isDark, setIsDark] = useState<boolean>(
    Appearance.getColorScheme() === "dark"
  );
  const theme = getTheme(isDark);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setIsDark(colorScheme === "dark");
    });
    return () => subscription.remove();
  }, []);

  const [length, setLength] = useState<string>("12");
  const [password, setPassword] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => !prev);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const handleGenerate = useCallback(() => {
    Keyboard.dismiss();
    const len = parseInt(length, 10);
    if (!length || isNaN(len) || len <= 0) {
      Alert.alert("PassGen2", "Please enter a valid positive number.");
      return;
    }
    const pwd = generatePassword(len);
    setPassword(pwd);
    setCopied(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, [length]);

  const handleCopy = useCallback(async () => {
    if (!password) {
      Alert.alert("PassGen2", "Generate a password first!");
      return;
    }
    await Clipboard.setStringAsync(password);
    setCopied(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(() => setCopied(false), 2000);
  }, [password]);

  const openGitHub = useCallback(async () => {
    await WebBrowser.openBrowserAsync("https://github.com/plorii/passgen2ios");
  }, []);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <Pressable
      style={[styles.root, { backgroundColor: theme.background }]}
      onPress={Keyboard.dismiss}
    >
      <StatusBar style={isDark ? "light" : "dark"} />
      <TouchableOpacity
        style={[
          styles.themeBtn,
          {
            top: topPad + 14,
            backgroundColor: isDark ? "#2A2A2A" : "#E4E4E4",
          },
        ]}
        onPress={toggleTheme}
        activeOpacity={0.7}
        testID="theme-toggle"
      >
        <Feather
          name={isDark ? "sun" : "moon"}
          size={17}
          color={isDark ? "#FFD700" : "#555555"}
        />
      </TouchableOpacity>

      <View
        style={[
          styles.container,
          {
            paddingTop: topPad + 56,
            paddingBottom: botPad + 16,
          },
        ]}
      >
        <View style={styles.logoShadow}>
          <Pressable
            onPress={openGitHub}
            style={({ pressed }) => [
              styles.logoClip,
              pressed && { opacity: 0.8 },
            ]}
          >
            <Image
              source={require("../assets/images/logo.png")}
              style={styles.logo}
              resizeMode="cover"
            />
          </Pressable>
        </View>

        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <Text style={[styles.label, { color: theme.foreground }]}>
            Total Password Characters:
          </Text>

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.muted,
                color: theme.foreground,
                borderColor: theme.border,
              },
            ]}
            value={length}
            onChangeText={(t) => setLength(t.replace(/[^0-9]/g, ""))}
            keyboardType="number-pad"
            placeholder="12"
            placeholderTextColor={theme.mutedForeground}
            maxLength={4}
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
            testID="length-input"
          />

          <TouchableOpacity
            style={styles.btnGenerate}
            onPress={handleGenerate}
            activeOpacity={0.8}
            testID="generate-btn"
          >
            <Text style={styles.btnText}>Generate Password</Text>
          </TouchableOpacity>

          <Text
            style={[styles.label, { color: theme.foreground, marginTop: 20 }]}
          >
            Generated Password:
          </Text>

          <View
            style={[
              styles.outputBox,
              {
                backgroundColor: theme.muted,
                borderColor: theme.border,
              },
            ]}
          >
            <Text
              style={[
                styles.outputText,
                {
                  color: password ? theme.foreground : theme.mutedForeground,
                },
              ]}
              numberOfLines={1}
            >
              {password || "Output"}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.btnCopy, copied && styles.btnCopied]}
            onPress={handleCopy}
            activeOpacity={0.8}
            testID="copy-btn"
          >
            <Feather
              name={copied ? "check" : "copy"}
              size={16}
              color="#FFFFFF"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.btnText}>
              {copied ? "Copied!" : "Copy Password"}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.footer, { color: theme.mutedForeground }]}>
          ©2026 plorii
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  themeBtn: {
    position: "absolute",
    right: 20,
    zIndex: 10,
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 24,
  },
  logoShadow: {
    marginBottom: 28,
    width: 148,
    height: 148,
    borderRadius: 74,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  logoClip: {
    width: 148,
    height: 148,
    borderRadius: 74,
    overflow: "hidden",
  },
  logo: {
    width: 148,
    height: 148,
  },
  card: {
    width: "100%",
    borderRadius: 16,
    borderWidth: 1,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 4,
  },
  label: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 10,
  },
  input: {
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 20,
    fontFamily: "Inter_500Medium",
    textAlign: "center",
    marginBottom: 14,
  },
  btnGenerate: {
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  outputBox: {
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    justifyContent: "center",
    marginBottom: 4,
  },
  outputText: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    letterSpacing: 0.4,
  },
  btnCopy: {
    backgroundColor: "#2196F3",
    borderRadius: 10,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 12,
  },
  btnCopied: {
    backgroundColor: "#4CAF50",
  },
  btnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Inter_700Bold",
  },
  footer: {
    marginTop: 24,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    opacity: 0.7,
  },
});
