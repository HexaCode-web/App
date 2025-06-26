import React from "react";
import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { theme } from "../../../../components/Theme";
import styles from "./SignUpStyles";

const Step9Success = () => {
  return (
    <View style={styles.stepContent}>
      <View style={styles.successContainer}>
        <Feather
          name="check-circle"
          size={80}
          color={theme.colors.status.success}
        />
        <Text style={styles.successTitle}>مبروك، تم تسجيلك بنجاح</Text>
      </View>
    </View>
  );
};

export default Step9Success;
