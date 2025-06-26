import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import styles from "./SignUpStyles";

const CustomInput = ({
  label,
  value,
  onChangeText,
  error,
  required = false,
  keyboardType = "default",
  multiline = false,
  numberOfLines = 1,
  placeholder,
  password = false,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={[
            styles.input,
            multiline && styles.textArea,
            error && styles.inputError,
            password && styles.passwordInput, // Additional styling for password inputs
          ]}
          placeholder={placeholder}
          value={value}
          secureTextEntry={password && !showPassword}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          textAlign="right"
          textAlignVertical={multiline ? "top" : "center"}
          {...props}
        />
        {password && (
          <TouchableOpacity
            style={styles.passwordToggle}
            onPress={togglePasswordVisibility}
            activeOpacity={0.7}
          >
            <Feather
              name={showPassword ? "eye-off" : "eye"}
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default CustomInput;
