import React from "react";
import { View, Text } from "react-native";
import CustomInput from "./CustomInput";
import styles from "./SignUpStyles";

const Step7TeacherProfile = ({ formData, updateFormData, errors }) => {
  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>عن المدرس</Text>

      <CustomInput
        label="نبذة تعريفية عن المدرس"
        value={formData.bio}
        onChangeText={(value) => updateFormData("bio", value)}
        error={errors.bio}
        multiline
        numberOfLines={4}
        placeholder="اكتب نبذة مختصرة عن خبراتك ومؤهلاتك..."
      />

      <CustomInput
        label="العنوان"
        value={formData.address}
        onChangeText={(value) => updateFormData("address", value)}
        placeholder="أدخل عنوانك"
      />

      <CustomInput
        label="سعر الحصة"
        value={formData.sessionPrice}
        onChangeText={(value) => updateFormData("sessionPrice", value)}
        error={errors.sessionPrice}
        keyboardType="numeric"
        placeholder="أدخل سعر الحصة"
      />

      <CustomInput
        label="لينك الحصة التجريبية (اختياري)"
        value={formData.trialSessionLink}
        onChangeText={(value) => updateFormData("trialSessionLink", value)}
        error={errors.trialSessionLink}
        placeholder="أدخل رابط الحصة التجريبية"
        autoCapitalize="none"
      />
    </View>
  );
};

export default Step7TeacherProfile;
