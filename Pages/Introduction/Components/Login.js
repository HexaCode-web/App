// LoginScreen.js - Login screen for your app with country code picker
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native";

import { Feather } from "@expo/vector-icons";
import { theme } from "../../../components/Theme";
import {
  PrimaryButton,
  SecondaryButton,
  TextButton,
} from "../../../components/Buttons";
import { hashPassword, QUERY } from "../../../server";
import { useDispatch } from "react-redux";
import { login } from "../../../redux/slices/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = ({ navigation, setActivePage }) => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const validatePhone = (phone) => {
    // Check if empty
    if (!phone) {
      setPhoneError("رقم الهاتف مطلوب");
      return false;
    } else {
      return true;
    }
  };
  const validatePassword = (password) => {
    if (!password) {
      setPasswordError("Password is required");
      return false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return false;
    }
    setPasswordError("");
    return true;
  };
  const guestLogin = async () => {
    dispatch(login("Guest"));

    await AsyncStorage.setItem("userSession", "Guest");
  };
  const handleLogin = async () => {
    const isPhoneValid = validatePhone(phone);
    const isPasswordValid = validatePassword(password);

    if (isPhoneValid && isPasswordValid) {
      setIsLoading(true);
      try {
        const matches = await QUERY("teachers", "phone", "==", phone);
        if (matches.length === 0) {
          console.log("no matches");
          Alert.alert("Error", "خطا في تسجيل ");
          setIsLoading(false);
          return;
        }

        const hashedPassword = hashPassword(password);

        if (hashedPassword != matches[0].password) {
          Alert.alert("Error", "خطا في تسجيل ");
          setIsLoading(false);
          return;
        }
        await AsyncStorage.setItem(
          "userSession",
          JSON.stringify({
            userID: matches[0].id,
          })
        );

        dispatch(login(matches[0]));
      } catch (error) {
        console.log(error);
        Alert.alert("Error", "خطا في تسجيل الدخول");
      }
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.logoContainer}>
            <Image
              source={{ uri: "https://placehold.co/200x100" }}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.title}>تسجيل الدخول</Text>

          <View style={styles.formContainer}>
            {/* Phone Input with Country Code */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>رقم الهاتف</Text>
              <View style={[styles.inputWrapper]}>
                <Feather
                  name="phone"
                  size={20}
                  color={theme.colors.text.secondary}
                  style={styles.inputIcon}
                />

                {/* Country Code Picker */}

                <TextInput
                  style={styles.input}
                  placeholderTextColor={theme.colors.text.secondary}
                  autoCapitalize="none"
                  value={phone}
                  keyboardType="phone-pad"
                  onChangeText={setPhone}
                  onBlur={() => validatePhone(phone)}
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>كلمة المرور</Text>
              <View
                style={[
                  styles.inputWrapper,
                  passwordError ? styles.inputError : null,
                ]}
              >
                <Feather
                  name="lock"
                  size={20}
                  color={theme.colors.text.secondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholderTextColor={theme.colors.text.secondary}
                  placeholder="ادخل كلمة المرور"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  onBlur={() => validatePassword(password)}
                />
                <TouchableOpacity
                  onPress={togglePasswordVisibility}
                  style={styles.eyeIcon}
                >
                  <Feather
                    name={showPassword ? "eye-off" : "eye"}
                    size={20}
                    color={theme.colors.text.secondary}
                  />
                </TouchableOpacity>
              </View>
              {passwordError ? (
                <Text style={styles.errorText}>{passwordError}</Text>
              ) : null}
            </View>

            {/* Login Button */}
            <PrimaryButton
              title="تسجيل الدخول"
              onPress={handleLogin}
              loading={isLoading}
              style={styles.loginButton}
            />
            <SecondaryButton
              title="دخول كطالب"
              onPress={guestLogin}
              style={styles.loginButton}
            />
          </View>

          {/* Sign Up Link */}
          <View style={styles.signupContainer}>
            <TextButton
              title="تسجيل"
              onPress={() => setActivePage("Signup")}
              textStyle={styles.signupButtonText}
            />
            <Text style={styles.signupText}>ليس لديك حساب؟ </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.xxl,
    paddingBottom: theme.spacing.xl,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: theme.spacing.xxl,
  },
  logo: {
    width: 200,
    height: 100,
  },
  title: {
    fontSize: theme.typography.fontSize.xxl,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
    textAlign: "center",
  },
  subtitle: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xl,
    textAlign: "center",
  },
  formContainer: {
    marginBottom: theme.spacing.xl,
  },
  inputContainer: {
    marginBottom: theme.spacing.md,
  },
  inputLabel: {
    marginBottom: theme.spacing.xs,
    textAlign: "right",
    fontFamily: theme.typography.fontFamily.medium,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    borderWidth: 1,
    borderColor: theme.colors.border.medium,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing.sm,
  },
  inputIcon: {
    marginRight: theme.spacing.xs,
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    paddingVertical: theme.spacing.sm,
    textAlign: "right",
    fontFamily: theme.typography.fontFamily.medium,
  },
  inputError: {
    borderColor: theme.colors.status.error,
  },
  errorText: {
    textAlign: "right", // Right alignment for Arabic text
  },
  eyeIcon: {
    padding: theme.spacing.xs,
  },
  loginButton: {
    marginTop: theme.spacing.md,
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.xl,
  },
  signupText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.md,
  },
  signupButtonText: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.regular,
  },
});

export default Login;
