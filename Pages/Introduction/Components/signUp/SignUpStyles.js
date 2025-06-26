// components/SignUp/SignUpStyles.js
import { StyleSheet } from "react-native";
import { theme } from "../../../../components/Theme";

const styles = StyleSheet.create({
  // Common styles
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.text.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    paddingTop: theme.spacing.xxl,
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.inverse,
  },

  // Step indicator styles
  stepIndicatorContainer: {
    height: 60,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  stepIndicatorScroll: {
    paddingHorizontal: theme.spacing.md,
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
  },
  stepContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  activeStep: {
    backgroundColor: theme.colors.primary,
  },
  inactiveStep: {
    backgroundColor: theme.colors.border.medium,
  },
  stepNumber: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.medium,
  },
  activeStepText: {
    color: theme.colors.white,
  },
  inactiveStepText: {
    color: theme.colors.text.secondary,
  },
  stepLine: {
    width: 24,
    height: 2,
    marginHorizontal: 0,
  },
  activeStepLine: {
    backgroundColor: theme.colors.primary,
  },
  inactiveStepLine: {
    backgroundColor: theme.colors.border.light,
  },

  // Content styles
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
  },
  stepContent: {
    paddingVertical: theme.spacing.md,
  },
  stepTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
    textAlign: "right",
    marginBottom: theme.spacing.md,
  },
  stepSubtitle: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.secondary,
    textAlign: "right",
    marginBottom: theme.spacing.sm,
  },

  // Input styles
  // Add these to your existing styles
  inputWrapper: {
    position: "relative",
  },
  passwordInput: {
    paddingLeft: 50, // Make room for the eye icon
  },
  passwordToggle: {
    position: "absolute",
    left: 15,
    top: "50%",
    transform: [{ translateY: -10 }],
    zIndex: 1,
  },
  inputContainer: {
    marginBottom: theme.spacing.md,
    fontFamily: theme.typography.fontFamily.regular,
  },
  inputLabel: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.secondary,
    textAlign: "right",
    marginBottom: theme.spacing.xs,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: theme.colors.border.medium,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.white,
    fontFamily: theme.typography.fontFamily.regular,
  },
  textArea: {
    height: 100,
    paddingTop: theme.spacing.sm,
  },
  inputError: {
    borderColor: theme.colors.status.error,
  },
  errorText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.status.error,
    textAlign: "right",
    marginTop: theme.spacing.xs,
  },
  required: {
    color: theme.colors.status.error,
  },
  dateInput: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
  },
  dateText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  },

  // Stylish Full-Width Radio Button Cards
  radioGroup: {
    marginBottom: theme.spacing.sm,
  },
  radioOption: {
    flexDirection: "row-reverse", // RTL layout - radio on right, text on left
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    borderColor: theme.colors.border.light,
    minHeight: 64,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  radioOptionSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    transform: [{ scale: 1.02 }],
  },
  radioOptionPressed: {
    transform: [{ scale: 0.98 }],
    shadowOpacity: 0.1,
  },
  radioCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: theme.colors.border.medium,
    backgroundColor: theme.colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
  radioSelected: {
    borderColor: theme.colors.white,
    backgroundColor: theme.colors.white,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.primary,
  },
  radioText: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.primary,
    fontFamily: theme.typography.fontFamily.medium,
    textAlign: "right",
    flex: 1,
    marginRight: theme.spacing.md,
  },
  radioTextSelected: {
    color: theme.colors.white,
    fontFamily: theme.typography.fontFamily.bold,
  },

  // Stylish Full-Width Checkbox Cards
  checkboxGroup: {
    marginBottom: theme.spacing.sm,
  },
  checkboxOption: {
    flexDirection: "row-reverse", // RTL layout - checkbox on right, text on left
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    borderColor: theme.colors.border.light,
    minHeight: 64,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  checkboxOptionSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    transform: [{ scale: 1.02 }],
  },
  checkboxOptionPressed: {
    transform: [{ scale: 0.98 }],
    shadowOpacity: 0.1,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: theme.colors.border.medium,
    backgroundColor: theme.colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxSelected: {
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.white,
  },
  checkboxText: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.primary,
    fontFamily: theme.typography.fontFamily.medium,
    textAlign: "right",
    flex: 1,
    marginRight: theme.spacing.md,
  },
  checkboxTextSelected: {
    color: theme.colors.white,
    fontFamily: theme.typography.fontFamily.bold,
  },
  checkboxIcon: {
    color: theme.colors.primary,
    fontSize: 16,
  },

  // Dropdown/Picker Styles
  pickerContainer: {
    marginBottom: theme.spacing.md,
  },
  pickerButton: {
    height: 50,
    borderWidth: 1,
    borderColor: theme.colors.border.medium,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.white,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pickerButtonActive: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
  },
  pickerButtonText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    flex: 1,
  },
  pickerPlaceholder: {
    color: theme.colors.text.secondary,
  },
  pickerIcon: {
    marginLeft: theme.spacing.sm,
  },
  pickerModal: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  pickerContent: {
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
    maxHeight: "70%",
  },
  pickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  pickerHeaderTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.primary,
  },
  pickerHeaderButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  pickerHeaderButtonText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.primary,
    fontFamily: theme.typography.fontFamily.medium,
  },
  pickerList: {
    maxHeight: 300,
  },
  pickerItem: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pickerItemSelected: {
    backgroundColor: theme.colors.primary + "10",
  },
  pickerItemText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  },
  pickerItemTextSelected: {
    color: theme.colors.primary,
    fontFamily: theme.typography.fontFamily.medium,
  },

  // Multi-Select Styles
  multiSelectContainer: {
    marginBottom: theme.spacing.md,
  },
  multiSelectButton: {
    minHeight: 50,
    borderWidth: 1,
    borderColor: theme.colors.border.medium,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.white,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  multiSelectButtonActive: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
  },
  multiSelectContent: {
    flex: 1,
  },
  multiSelectPlaceholder: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
  },
  multiSelectTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.xs,
  },
  multiSelectTag: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    flexDirection: "row",
    alignItems: "center",
    marginRight: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  multiSelectTagText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.white,
    marginRight: theme.spacing.xs,
  },
  multiSelectTagRemove: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },

  // Toggle Switch Styles
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  toggleLabel: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    flex: 1,
  },
  toggleSwitch: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.border.medium,
    justifyContent: "center",
    paddingHorizontal: 2,
  },
  toggleSwitchActive: {
    backgroundColor: theme.colors.primary,
  },
  toggleSwitchThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleSwitchThumbActive: {
    alignSelf: "flex-end",
  },

  // Segmented Control Styles
  segmentedContainer: {
    marginBottom: theme.spacing.md,
  },
  segmentedControl: {
    flexDirection: "row",
    backgroundColor: theme.colors.border.light,
    borderRadius: theme.borderRadius.md,
    padding: 2,
  },
  segmentedOption: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  segmentedOptionActive: {
    backgroundColor: theme.colors.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  segmentedOptionText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    fontFamily: theme.typography.fontFamily.medium,
  },
  segmentedOptionTextActive: {
    color: theme.colors.primary,
  },

  // Subjects styles (enhanced)
  searchContainer: {
    marginBottom: theme.spacing.md,
  },
  searchInput: {
    height: 45,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.white,
  },
  searchIcon: {
    position: "absolute",
    left: 15,
    top: 12,
  },
  subjectsList: {
    marginTop: theme.spacing.sm,
    maxHeight: 200,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  subjectOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
    minHeight: 48,
  },
  subjectOptionLast: {
    borderBottomWidth: 0,
  },
  subjectText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    flex: 1,
    textAlign: "right",
  },
  subjectIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: theme.colors.border.medium,
    marginLeft: theme.spacing.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  subjectSelected: {
    backgroundColor: theme.colors.primary,
  },
  selectedSubjects: {
    marginTop: theme.spacing.md,
  },
  selectedSubjectsTitle: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
    textAlign: "right",
    fontFamily: theme.typography.fontFamily.medium,
  },
  selectedSubjectChip: {
    flexDirection: "row",
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    marginRight: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  selectedSubjectText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.medium,
  },
  removeSubjectButton: {
    marginLeft: theme.spacing.sm,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },

  // Success screen styles
  successContainer: {
    alignItems: "center",
    paddingVertical: theme.spacing.xxl,
  },
  successTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
    textAlign: "center",
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  successMessage: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: theme.spacing.sm,
  },
  successSubMessage: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    textAlign: "center",
  },

  // Navigation buttons
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.white,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  backButtonText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.primary,
    marginLeft: theme.spacing.xs,
  },
  nextButtonContainer: {
    flex: 0.2,
    width: "90%",
    marginHorizontal: "auto",
  },
  nextButton: {
    minWidth: 120,
  },
  loginButton: {
    flex: 1,
  },
});

export default styles;
