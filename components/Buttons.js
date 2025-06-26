// Buttons.js - Themed button components for your app
import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from "react-native";
import { theme } from "./Theme";

// Primary Button Component
export const PrimaryButton = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  icon = null,
  style,
  textStyle,
}) => {
  return (
    <TouchableOpacity
      style={[styles.buttonPrimary, disabled && styles.buttonDisabled, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={theme.colors.white} size="small" />
      ) : (
        <View style={styles.buttonContent}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text style={[styles.buttonTextPrimary, textStyle]}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

// Secondary Button (Outline) Component
export const SecondaryButton = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  icon = null,
  style,
  textStyle,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.buttonSecondary,
        disabled && styles.buttonOutlineDisabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={theme.colors.primary} size="small" />
      ) : (
        <View style={styles.buttonContent}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text style={[styles.buttonTextSecondary, textStyle]}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

// Text Button (No Background) Component
export const TextButton = ({
  title,
  onPress,
  disabled = false,
  icon = null,
  style,
  textStyle,
}) => {
  return (
    <TouchableOpacity
      style={[styles.buttonText, style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.6}
    >
      <View style={styles.buttonContent}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <Text
          style={[
            styles.buttonTextPlain,
            disabled && styles.buttonTextDisabled,
            textStyle,
          ]}
        >
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// Icon Button Component
export const IconButton = ({
  icon,
  onPress,
  disabled = false,
  color = theme.colors.primary,
  size = "medium",
  style,
}) => {
  const buttonSize = {
    small: 32,
    medium: 40,
    large: 48,
  };

  const actualSize = buttonSize[size] || buttonSize.medium;

  return (
    <TouchableOpacity
      style={[
        styles.iconButton,
        { width: actualSize, height: actualSize },
        disabled && styles.iconButtonDisabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      {icon}
    </TouchableOpacity>
  );
};

// Floating Action Button Component
export const FloatingActionButton = ({
  icon,
  onPress,
  color = theme.colors.primary,
  size = "large",
  style,
}) => {
  const fabSize = {
    small: 48,
    medium: 56,
    large: 64,
  };

  const actualSize = fabSize[size] || fabSize.medium;

  return (
    <TouchableOpacity
      style={[
        styles.fab,
        {
          width: actualSize,
          height: actualSize,
          backgroundColor: color,
        },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {icon}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonPrimary: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
    ...theme.shadows.sm,
  },
  buttonSecondary: {
    backgroundColor: "transparent",
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  buttonText: {
    backgroundColor: "transparent",
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    backgroundColor: theme.colors.text.disabled,
    ...theme.shadows.none,
  },
  buttonOutlineDisabled: {
    borderColor: theme.colors.text.disabled,
  },
  buttonTextPrimary: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.regular,
  },
  buttonTextSecondary: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.regular,
  },
  buttonTextPlain: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.regular,
  },
  buttonTextDisabled: {
    color: theme.colors.text.disabled,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    marginRight: theme.spacing.xs,
  },
  iconButton: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.borderRadius.round,
  },
  iconButtonDisabled: {
    opacity: 0.5,
  },
  logoButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  fab: {
    position: "absolute",
    bottom: theme.spacing.lg,
    right: theme.spacing.lg,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    ...theme.shadows.lg,
  },
});
