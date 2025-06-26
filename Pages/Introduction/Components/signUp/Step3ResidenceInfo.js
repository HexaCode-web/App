import React from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";
import CustomInput from "./CustomInput";
import styles from "./SignUpStyles";
import { theme } from "../../../../components/Theme";
import DateTimePicker from "@react-native-community/datetimepicker";

const Step3ResidenceInfo = ({
  formData,
  updateFormData,
  errors,
  showDatePicker,
  setShowDatePicker,
  formatDate,
  onDateChange,
}) => {
  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>معلومات الإقامة والميلاد</Text>

      <CustomInput
        label="دولة الإقامة"
        value={formData.residenceCountry}
        onChangeText={(value) => updateFormData("residenceCountry", value)}
        error={errors.residenceCountry}
        required
        placeholder="أدخل دولة إقامتك"
      />

      <CustomInput
        label="مدينة الإقامة"
        value={formData.residenceCity}
        onChangeText={(value) => updateFormData("residenceCity", value)}
        placeholder="أدخل مدينة إقامتك"
      />

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>
          تاريخ الميلاد <Text style={styles.required}>*</Text>
        </Text>
        <TouchableOpacity
          style={[
            styles.input,
            styles.dateInput,
            errors.birthDate && styles.inputError,
          ]}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateText}>{formatDate(formData.birthDate)}</Text>
          <Feather
            name="calendar"
            size={20}
            color={theme.colors.text.secondary}
          />
        </TouchableOpacity>
        {errors.birthDate && (
          <Text style={styles.errorText}>{errors.birthDate}</Text>
        )}
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={formData.birthDate}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onDateChange}
          maximumDate={new Date()}
          minimumDate={new Date(1950, 0, 1)}
        />
      )}
    </View>
  );
};

export default Step3ResidenceInfo;
