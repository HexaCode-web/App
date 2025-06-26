import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import CustomInput from "./CustomInput";
import styles from "./SignUpStyles";

const Step2AdditionalInfo = ({ formData, updateFormData, errors }) => {
  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>المعلومات الشخصية</Text>

      <CustomInput
        label="الاسم"
        value={formData.name}
        onChangeText={(value) => updateFormData("name", value)}
        error={errors.name}
        required
        placeholder="أدخل اسمك الكامل"
      />

      <CustomInput
        label="البريد الإلكتروني"
        value={formData.email}
        onChangeText={(value) => updateFormData("email", value)}
        error={errors.email}
        required
        keyboardType="email-address"
        placeholder="أدخل بريدك الإلكتروني"
        autoCapitalize="none"
      />
      <CustomInput
        label="رقم واتساب"
        value={formData.whatsapp}
        onChangeText={(value) => updateFormData("whatsapp", value)}
        error={errors.whatsapp}
        keyboardType="phone-pad"
        placeholder="أدخل رقم واتساب"
      />
      <CustomInput
        label="الجنسية"
        value={formData.nationality}
        onChangeText={(value) => updateFormData("nationality", value)}
        error={errors.nationality}
        required
        placeholder="أدخل جنسيتك"
      />

      <CustomInput
        label="رابط فيس بوك (اختياري)"
        value={formData.facebookLink}
        onChangeText={(value) => updateFormData("facebookLink", value)}
        error={errors.facebookLink}
        placeholder="أدخل رابط صفحتك على فيس بوك"
        autoCapitalize="none"
      />
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>
          الجنس <Text style={styles.required}>*</Text>
        </Text>
        <View style={styles.radioGroup}>
          {["ذكر", "أنثى"].map((option) => {
            const isSelected = formData.gender === option;

            return (
              <TouchableOpacity
                key={option}
                style={[
                  styles.radioOption,
                  isSelected && styles.radioOptionSelected,
                ]}
                onPress={() => updateFormData("gender", option)}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.radioCircle,
                    isSelected && styles.radioSelected,
                  ]}
                >
                  {isSelected && <View style={styles.radioInner} />}
                </View>
                <Text
                  style={[
                    styles.radioText,
                    isSelected && styles.radioTextSelected,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}
      </View>
    </View>
  );
};

export default Step2AdditionalInfo;
