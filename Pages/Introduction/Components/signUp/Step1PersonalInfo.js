import React from "react";
import { View, Text } from "react-native";
import CustomInput from "./CustomInput";
import styles from "./SignUpStyles";

const Step1PersonalInfo = ({ formData, updateFormData, errors }) => {
  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>بيانات الدخول</Text>

      <CustomInput
        label="رقم الهاتف (سوف تستعمل هذة الرقم للدخول لحسابك)"
        value={formData.phone}
        onChangeText={(value) => updateFormData("phone", value)}
        error={errors.phone}
        required
        keyboardType="phone-pad"
        placeholder="أدخل رقم هاتفك"
      />

      <CustomInput
        label="كلمة المرور"
        value={formData.password}
        onChangeText={(text) => updateFormData("password", text)}
        error={errors.password}
        password={true}
        required
      />
    </View>
  );
};

export default Step1PersonalInfo;
