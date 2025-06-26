import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import styles from "./SignUpStyles";
import { theme } from "../../../../components/Theme";

const Step5EducationLevels = ({ formData, toggleArrayValue, errors }) => {
  const educationLevels = ["ابتدائي", "إعدادي", "ثانوي"];
  const renderEducationLevels = educationLevels.map((level) => {
    const isSelected = formData.educationLevels.includes(level);

    return (
      <TouchableOpacity
        key={level}
        style={[
          styles.checkboxOption,
          isSelected && styles.checkboxOptionSelected,
        ]}
        onPress={() => toggleArrayValue("educationLevels", level)}
      >
        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
          {formData.educationLevels.includes(level) && (
            <Feather name="check" size={16} color={theme.colors.white} />
          )}
        </View>
        <Text
          style={[
            styles.checkboxText,
            isSelected && styles.checkboxTextSelected,
          ]}
        >
          {level}
        </Text>
      </TouchableOpacity>
    );
  });
  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>
        المراحل الدراسية التي تقدم لها دروس؟ *
      </Text>

      <View style={styles.checkboxGroup}>{renderEducationLevels}</View>
      {errors.educationLevels && (
        <Text style={styles.errorText}>{errors.educationLevels}</Text>
      )}
    </View>
  );
};

export default Step5EducationLevels;
