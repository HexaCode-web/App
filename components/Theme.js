const isDev = __DEV__; // true in development, false in production

// Primary Colors
const COLORS = {
  primary: "#1E5FB8", // The blue from the 1N logo
  primaryLight: "#3B7BD9", // Lighter shade of primary for hover states
  primaryDark: "#1A4F9E", // Darker shade of primary for pressed states
  white: "#FFFFFF", // The white from the logo
  background: "#F5F7FA", // Light background color
  surface: "#FFFFFF", // Surface color for cards, modals
  text: {
    primary: "#1A1A1A", // Primary text
    secondary: "#595959", // Secondary text
    disabled: "#BDBDBD", // Disabled text
    inverse: "#FFFFFF", // Text on dark backgrounds
  },
  border: {
    light: "#E0E0E0", // Light borders
    medium: "#BDBDBD", // Medium borders
    dark: "#757575", // Dark borders
  },
  status: {
    success: "#28A745", // Success messages
    error: "#DC3545", // Error messages
    warning: "#FFC107", // Warning messages
    info: "#17A2B8", // Info messages
  },
  transparent: "transparent",
};

// Typography Scale
const TYPOGRAPHY = {
  fontFamily: {
    regular: "Cairo-Regular",
    medium: "Cairo-Medium",
    bold: "Cairo-Bold",
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 28,
    display: 32,
  },
  lineHeight: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
    xxl: 36,
    xxxl: 40,
    display: 48,
  },
};

// Spacing Scale (in pixels)
const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

// Border Radii
const BORDER_RADIUS = {
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 9999,
};

// Shadows
const SHADOWS = {
  xs: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
};

// Export the theme object
export const theme = {
  colors: COLORS,
  typography: TYPOGRAPHY,
  spacing: SPACING,
  borderRadius: BORDER_RADIUS,
  shadows: SHADOWS,
};

// Component-specific styles based on the theme
export const componentStyles = {
  // Button styles
  button: {
    primary: {
      backgroundColor: COLORS.primary,
      paddingVertical: SPACING.sm,
      paddingHorizontal: SPACING.md,
      borderRadius: BORDER_RADIUS.md,
      alignItems: "center",
      justifyContent: "center",
      ...SHADOWS.sm,
    },
    secondary: {
      backgroundColor: "transparent",
      paddingVertical: SPACING.sm,
      paddingHorizontal: SPACING.md,
      borderRadius: BORDER_RADIUS.md,
      borderWidth: 1,
      borderColor: COLORS.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    text: {
      primary: {
        color: COLORS.white,
        fontSize: TYPOGRAPHY.fontSize.md,
        fontFamily: TYPOGRAPHY.fontFamily.medium,
      },
      secondary: {
        color: COLORS.primary,
        fontSize: TYPOGRAPHY.fontSize.md,
        fontFamily: TYPOGRAPHY.fontFamily.medium,
      },
    },
  },

  // Card styles
  card: {
    container: {
      backgroundColor: COLORS.surface,
      borderRadius: BORDER_RADIUS.md,
      padding: SPACING.md,
      marginBottom: SPACING.md,
      ...SHADOWS.sm,
    },
    title: {
      fontSize: TYPOGRAPHY.fontSize.lg,
      fontFamily: TYPOGRAPHY.fontFamily.bold,
      marginBottom: SPACING.sm,
      color: COLORS.text.primary,
      textAlign: "right",
    },
    content: {
      fontSize: TYPOGRAPHY.fontSize.md,
      fontFamily: TYPOGRAPHY.fontFamily.regular,
      color: COLORS.text.secondary,
    },
  },

  // Input styles
  input: {
    container: {
      marginBottom: SPACING.md,
    },
    label: {
      fontSize: TYPOGRAPHY.fontSize.sm,
      color: COLORS.text.secondary,
      marginBottom: SPACING.xs,
      fontFamily: TYPOGRAPHY.fontFamily.medium,
      textAlign: "right",
    },
    field: {
      height: 48,
      borderWidth: 1,
      borderColor: COLORS.border.medium,
      borderRadius: BORDER_RADIUS.md,
      paddingHorizontal: SPACING.sm,
      fontSize: TYPOGRAPHY.fontSize.md,
      color: COLORS.text.primary,
      backgroundColor: COLORS.white,
    },
    focused: {
      borderColor: COLORS.primary,
    },
    error: {
      borderColor: COLORS.status.error,
    },
    errorText: {
      fontSize: TYPOGRAPHY.fontSize.sm,
      color: COLORS.status.error,
      marginTop: SPACING.xs,
    },
  },

  // Header styles
  header: {
    container: {
      backgroundColor: COLORS.primary,
      paddingTop: isDev ? SPACING.xxl : 0, // adjust based on environment
      paddingBottom: SPACING.md,
      paddingHorizontal: SPACING.md,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      ...SHADOWS.md,
    },
    title: {
      fontSize: TYPOGRAPHY.fontSize.lg,
      fontFamily: TYPOGRAPHY.fontFamily.bold,
      color: COLORS.white,
    },
    icon: {
      color: COLORS.white,
      size: 24,
    },
  },

  // Navigation styles
  tabBar: {
    container: {
      backgroundColor: COLORS.white,
      borderTopWidth: 1,
      borderTopColor: COLORS.border.light,
      height: 60,
      ...SHADOWS.sm,
    },
    tab: {
      active: {
        color: COLORS.primary,
      },
      inactive: {
        color: COLORS.text.secondary,
      },
    },
  },

  // List item styles
  listItem: {
    container: {
      paddingVertical: SPACING.sm,
      paddingHorizontal: SPACING.md,
      backgroundColor: COLORS.surface,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.border.light,
      flexDirection: "row",
      alignItems: "center",
    },
    title: {
      fontSize: TYPOGRAPHY.fontSize.md,
      fontFamily: TYPOGRAPHY.fontFamily.medium,
      color: COLORS.text.primary,
    },
    subtitle: {
      fontSize: TYPOGRAPHY.fontSize.sm,
      fontFamily: TYPOGRAPHY.fontFamily.regular,
      color: COLORS.text.secondary,
      marginTop: SPACING.xs,
    },
  },
};
