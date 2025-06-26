import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import styles from "./SignUpStyles";
import { theme } from "../../../../components/Theme";

const Step4TeachingMethod = ({ formData, toggleArrayValue, errors }) => {
  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>أسلوبك في تقديم الدروس *</Text>

      <View style={styles.checkboxGroup}>
        {["عبر الإنترنت", "عند الطالب", "عند المدرس"].map((method) => {
          const isSelected = formData.teachingMethod.includes(method);

          return (
            <TouchableOpacity
              key={method}
              style={[
                styles.checkboxOption,
                isSelected && styles.checkboxOptionSelected,
              ]}
              onPress={() => toggleArrayValue("teachingMethod", method)}
              activeOpacity={0.8}
            >
              <View
                style={[styles.checkbox, isSelected && styles.checkboxSelected]}
              >
                {isSelected && (
                  <Feather name="check" size={16} style={styles.checkboxIcon} />
                )}
              </View>
              <Text
                style={[
                  styles.checkboxText,
                  isSelected && styles.checkboxTextSelected,
                ]}
              >
                {method}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {errors.teachingMethod && (
        <Text style={styles.errorText}>{errors.teachingMethod}</Text>
      )}
    </View>
  );
};

export default Step4TeachingMethod;
