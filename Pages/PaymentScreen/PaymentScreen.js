import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  TextInput,
  Alert,
  ActivityIndicator,
  Clipboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme, componentStyles } from "../../components/Theme";
import { GETDOC, SETDOC, UPLOADPHOTO } from "../../server";

import { v4 as uuidv4 } from "uuid";
import { useSelector } from "react-redux";
import TopBar from "../../components/TopBar";
import { useNavigation } from "@react-navigation/native";

const PaymentScreen = ({ route }) => {
  const User = useSelector((state) => state.auth);
  const navigation = useNavigation();
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [showDetails, setShowDetails] = useState({});
  const [loading, setLoading] = useState(false);

  const { onPaymentComplete, paymentReason, requiredAmount } =
    route.params || {};

  const [paymentMethods, setPaymentMethods] = useState([]);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const data = await GETDOC("Settings", "paymentMethods");
        if (data) {
          setPaymentMethods(data.methods);
        }
      } catch (error) {
        console.error("Error fetching payment methods:", error);
        CreateToast("فشل في جلب طرق الدفع", "e");
      }
    };
    fetchPaymentMethods();
  }, []);

  // Copy to clipboard function
  const copyToClipboard = (text) => {
    Clipboard.setString(text);

    // Show feedback toast
    Alert.alert("تم النسخ", "تم نسخ النص إلى الحافظة", [{ text: "حسنًا" }], {
      cancelable: true,
    });
  };

  const toggleDetails = (id) => {
    setShowDetails((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const selectPaymentMethod = (method) => {
    if (loading) return;

    setSelectedMethod(method);
    if (method.id === "bankTransfer") {
      toggleDetails("bankTransfer");
    }
  };

  const submitPayment = async () => {
    if (loading) return;
    if (!selectedMethod) {
      Alert.alert("تنبيه", "الرجاء اختيار طريقة الدفع");
      return;
    }

    if (!referenceNumber || referenceNumber.trim() === "") {
      Alert.alert("تنبيه", "الرجاء إدخال رقم مرجعي للتحويل");
      return;
    }

    setLoading(true);

    const transactionId = uuidv4();

    const transaction = {
      userID: User.id,
      date: new Date(),
      transactionId,
      paymentReason,
      method: selectedMethod.id,
      requiredAmount,
      referenceNumber,
      approved: false,
    };

    await SETDOC("receipts", transaction.transactionId, transaction, true);

    if (onPaymentComplete) {
      await onPaymentComplete(transaction);
    }

    setSelectedMethod(null);
    setReferenceNumber("");

    setLoading(false);
  };

  // Render copy button next to text
  const renderValueWithCopyButton = (value) => (
    <View style={styles.valueCopyContainer}>
      <Text style={styles.paymentMethodValue}>{value}</Text>
      <TouchableOpacity
        style={styles.copyButton}
        onPress={() => copyToClipboard(value)}
      >
        <Ionicons name="copy-outline" size={18} color={theme.colors.primary} />
      </TouchableOpacity>
    </View>
  );
  const returnFunction = () => {
    navigation.navigate("Boost");
  };
  return (
    <ScrollView style={styles.container}>
      <TopBar title="الدفع و التحويل" handleReturn={returnFunction} />

      <View style={styles.content}>
        <View style={styles.paymentMethodCard}>
          <Text style={styles.paymentMethodTitle}>المبلغ المطلوب</Text>
          <Text style={styles.amountText}>{requiredAmount}</Text>
        </View>

        <Text style={styles.sectionTitle}>اختر طريقة الدفع</Text>

        {paymentMethods.map((method) => (
          <TouchableOpacity
            key={method?.id}
            style={[
              styles.paymentMethodCard,
              selectedMethod?.id === method.id && styles.selectedMethod,
            ]}
            onPress={() => selectPaymentMethod(method)}
          >
            <View style={styles.paymentMethodHeader}>
              <View style={styles.paymentMethodInfo}>
                <Text style={styles.paymentMethodTitle}>{method.title}</Text>
                {method.value &&
                  (method.id !== "bankTransfer" ? (
                    renderValueWithCopyButton(method.value)
                  ) : (
                    <Text style={styles.paymentMethodValue}>
                      {method.value}
                    </Text>
                  ))}
              </View>
              <View style={styles.methodIconContainer}>
                <Ionicons
                  name={method.icon}
                  size={24}
                  color={theme.colors.primary}
                />
              </View>
            </View>

            {method.id === "bankTransfer" && showDetails[method.id] && (
              <View style={styles.bankDetails}>
                {method.details.map((detail, index) => (
                  <View key={index} style={styles.bankDetailRow}>
                    <View style={styles.valueCopyContainer}>
                      <Text style={styles.bankDetailValue}>{detail.value}</Text>
                      <TouchableOpacity
                        style={styles.copyButton}
                        onPress={() => copyToClipboard(detail.value)}
                      >
                        <Ionicons
                          name="copy-outline"
                          size={18}
                          color={theme.colors.primary}
                        />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.bankDetailLabel}>{detail.label}</Text>
                  </View>
                ))}
              </View>
            )}
          </TouchableOpacity>
        ))}

        <View style={styles.divider} />

        {selectedMethod?.id === "bankTransfer" ? (
          <View style={componentStyles.input.container}>
            <Text style={componentStyles.input.label}>
              رقم الحساب المحول منه
            </Text>
            <TextInput
              style={componentStyles.input.field}
              placeholder="أدخل رقم الحساب"
              placeholderTextColor={theme.colors.text.disabled}
              value={referenceNumber}
              onChangeText={setReferenceNumber}
              textAlign="right"
            />
          </View>
        ) : (
          <View style={componentStyles.input.container}>
            <Text style={componentStyles.input.label}>رقم المحول منه</Text>
            <TextInput
              style={componentStyles.input.field}
              placeholder="أدخل الرقم المرجعي للتحويل"
              placeholderTextColor={theme.colors.text.disabled}
              value={referenceNumber}
              onChangeText={setReferenceNumber}
              textAlign="right"
            />
          </View>
        )}

        <TouchableOpacity
          style={styles.submitButton}
          onPress={submitPayment}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={theme.colors.white} />
          ) : (
            <Text style={styles.submitButtonText}>تأكيد الدفع</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    ...componentStyles.header.container,
    paddingTop: Platform.OS === "ios" ? 50 : 25,
    flexDirection: "row-reverse",
    justifyContent: "space-between",
  },
  headerTitle: {
    ...componentStyles.header.title,
  },
  content: {
    padding: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.bold,
    marginBottom: theme.spacing.md,
    color: theme.colors.text.primary,
    textAlign: "right",
  },
  paymentMethodCard: {
    ...componentStyles.card.container,
    marginBottom: theme.spacing.sm,
  },
  selectedMethod: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  paymentMethodHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  paymentMethodInfo: {
    flex: 1,
    alignItems: "flex-end",
  },
  methodIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: theme.spacing.sm,
  },
  paymentMethodTitle: {
    ...componentStyles.card.title,
    marginBottom: theme.spacing.xs,
    textAlign: "right",
  },
  paymentMethodValue: {
    ...componentStyles.card.content,
    textAlign: "right",
  },
  valueCopyContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  copyButton: {
    padding: theme.spacing.xs,
    marginRight: theme.spacing.xs,
  },
  amountText: {
    fontSize: theme.typography.fontSize.xxl,
    fontFamily: theme.typography.fontFamily.bold,
    textAlign: "center",
  },
  bankDetails: {
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  bankDetailRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: theme.spacing.xs,
  },
  bankDetailLabel: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.sm,
    textAlign: "right",
  },
  bankDetailValue: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.primary,
    flex: 1,
    textAlign: "right",
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border.light,
    marginVertical: theme.spacing.lg,
  },
  instructions: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
    textAlign: "right",
  },
  receiptContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border.medium,
    borderStyle: "dashed",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.md,
    overflow: "hidden",
  },
  uploadPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  uploadText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.sm,
    fontFamily: theme.typography.fontFamily.medium,
  },
  uploadedImageContainer: {
    width: "100%",
    height: "100%",
  },
  uploadedImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  removeImageButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 2,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing.lg,
  },
  uploadButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 0.48,
  },
  uploadButtonText: {
    color: theme.colors.white,
    marginRight: theme.spacing.xs,
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.medium,
  },
  submitButton: {
    ...componentStyles.button.primary,
    marginTop: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  submitButtonText: {
    ...componentStyles.button.text.primary,
    fontSize: theme.typography.fontSize.lg,
  },
});

export default PaymentScreen;
