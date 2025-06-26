import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TextInput,
  Clipboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import styles from "./SignUpStyles";
import { theme, componentStyles } from "../../../../components/Theme";
import { GETDOC, SETDOC } from "../../../../server";
import { v4 as uuidv4 } from "uuid";

const Step8Payment = ({ formData, updateFormData, errors, handleSubmit }) => {
  const User = formData;

  const [activatingAccount, setActivatingAccount] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  // Payment form states
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [showDetails, setShowDetails] = useState({});
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Subscription details
  const subscriptionPrice = 79; // جنيه شهرياً

  useEffect(() => {
    if (showPaymentForm) {
      fetchPaymentMethods();
    }
  }, [showPaymentForm]);

  const fetchPaymentMethods = async () => {
    try {
      const data = await GETDOC("Settings", "paymentMethods");
      if (data) {
        setPaymentMethods(data.methods);
      }
    } catch (error) {
      console.error("Error fetching payment methods:", error);
      Alert.alert("خطأ", "فشل في جلب طرق الدفع");
    }
  };

  const handleActivateAccount = async () => {
    Alert.alert(
      "تفعيل الاشتراك",
      `هل تريد المتابعة لدفع اشتراك شهري بقيمة ${subscriptionPrice} جنيه؟\n\nسيظهر ملفك الشخصي في نتائج البحث للطلاب ويمكنك إجراء التعديلات على البروفايل.`,
      [
        {
          text: "إلغاء",
          style: "cancel",
        },
        {
          text: "متابعة للدفع",
          onPress: () => setShowPaymentForm(true),
        },
      ]
    );
  };

  // Payment form functions
  const copyToClipboard = (text) => {
    Clipboard.setString(text);
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
    if (paymentLoading) return;
    setSelectedMethod(method);
    if (method.id === "bankTransfer") {
      toggleDetails("bankTransfer");
    }
  };

  const submitPayment = async () => {
    if (paymentLoading) return;

    if (!selectedMethod) {
      Alert.alert("تنبيه", "الرجاء اختيار طريقة الدفع");
      return;
    }

    if (!referenceNumber || referenceNumber.trim() === "") {
      Alert.alert("تنبيه", "الرجاء إدخال رقم مرجعي للتحويل");
      return;
    }

    setPaymentLoading(true);

    try {
      const transactionId = uuidv4();

      const transaction = {
        userID: User.id,
        date: new Date(),
        transactionId,
        paymentReason: "subscription",
        method: selectedMethod.id,
        requiredAmount: subscriptionPrice,
        referenceNumber,
        approved: false,
      };

      await SETDOC("receipts", transaction.transactionId, transaction, true);

      // Update form data with payment information
      updateFormData("paymentData", transaction);
      updateFormData("pendingApproval", true);
      updateFormData("subscriptionActive", true);
      updateFormData("subscriptionStartDate", new Date().toISOString());

      Alert.alert(
        "تم إرسال طلب التفعيل",
        "تم إرسال طلب تفعيل حسابك بنجاح. سيتم مراجعة طلبك وتفعيل الحساب خلال 24 ساعة.",
        [
          {
            text: "موافق",
            onPress: () => {
              handleSubmit();
              setShowPaymentForm(false);
              // Reset payment form
              setSelectedMethod(null);
              setReferenceNumber("");
              // Move to next step or finish registration
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error processing payment:", error);
      Alert.alert("خطأ", "حدث خطأ أثناء معالجة الدفع");
    } finally {
      setPaymentLoading(false);
    }
  };

  const renderValueWithCopyButton = (value) => (
    <View style={localStyles.valueCopyContainer}>
      <Text style={localStyles.paymentMethodValue}>{value}</Text>
      <TouchableOpacity
        style={localStyles.copyButton}
        onPress={() => copyToClipboard(value)}
      >
        <Ionicons name="copy-outline" size={18} color={theme.colors.primary} />
      </TouchableOpacity>
    </View>
  );

  if (showPaymentForm) {
    return (
      <View style={styles.stepContent}>
        <View style={localStyles.paymentHeader}>
          <TouchableOpacity
            onPress={() => setShowPaymentForm(false)}
            style={localStyles.backButton}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={theme.colors.text.primary}
            />
          </TouchableOpacity>
          <Text style={styles.stepTitle}>الدفع والتحويل</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={localStyles.paymentMethodCard}>
            <Text style={localStyles.paymentMethodTitle}>المبلغ المطلوب</Text>
            <Text style={localStyles.amountText}>{subscriptionPrice} جنيه</Text>
          </View>

          <Text style={localStyles.sectionTitle}>اختر طريقة الدفع</Text>

          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method?.id}
              style={[
                localStyles.paymentMethodCard,
                selectedMethod?.id === method.id && localStyles.selectedMethod,
              ]}
              onPress={() => selectPaymentMethod(method)}
            >
              <View style={localStyles.paymentMethodHeader}>
                <View style={localStyles.paymentMethodInfo}>
                  <Text style={localStyles.paymentMethodTitle}>
                    {method.title}
                  </Text>
                  {method.value &&
                    (method.id !== "bankTransfer" ? (
                      renderValueWithCopyButton(method.value)
                    ) : (
                      <Text style={localStyles.paymentMethodValue}>
                        {method.value}
                      </Text>
                    ))}
                </View>
                <View style={localStyles.methodIconContainer}>
                  <Ionicons
                    name={method.icon}
                    size={24}
                    color={theme.colors.primary}
                  />
                </View>
              </View>

              {method.id === "bankTransfer" && showDetails[method.id] && (
                <View style={localStyles.bankDetails}>
                  {method.details.map((detail, index) => (
                    <View key={index} style={localStyles.bankDetailRow}>
                      <View style={localStyles.valueCopyContainer}>
                        <Text style={localStyles.bankDetailValue}>
                          {detail.value}
                        </Text>
                        <TouchableOpacity
                          style={localStyles.copyButton}
                          onPress={() => copyToClipboard(detail.value)}
                        >
                          <Ionicons
                            name="copy-outline"
                            size={18}
                            color={theme.colors.primary}
                          />
                        </TouchableOpacity>
                      </View>
                      <Text style={localStyles.bankDetailLabel}>
                        {detail.label}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </TouchableOpacity>
          ))}

          <View style={localStyles.divider} />

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
            style={[componentStyles.button.primary, localStyles.submitButton]}
            onPress={submitPayment}
            disabled={paymentLoading}
          >
            {paymentLoading ? (
              <ActivityIndicator color={theme.colors.white} />
            ) : (
              <Text style={componentStyles.button.text.primary}>
                تأكيد الدفع
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  // Original subscription overview screen
  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>الاشتراك والدفع</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Subscription Info Card */}
        <View
          style={[componentStyles.card.container, localStyles.subscriptionCard]}
        >
          <Text style={componentStyles.card.title}>تفاصيل الاشتراك</Text>

          <View style={localStyles.priceContainer}>
            <View style={localStyles.originalPriceRow}>
              <Text style={localStyles.originalPriceLabel}>السعر الأصلي</Text>
              <Text style={localStyles.originalPrice}>
                {subscriptionPrice} جنيه
              </Text>
            </View>

            <View style={localStyles.durationRow}>
              <Text style={localStyles.durationLabel}>مدة الاشتراك</Text>
              <Text style={localStyles.duration}>شهرياً</Text>
            </View>
          </View>
        </View>

        {/* Features Card */}
        <View style={componentStyles.card.container}>
          <Text style={componentStyles.card.title}>مميزات الاشتراك</Text>

          <View style={localStyles.featuresList}>
            <View style={localStyles.featureItem}>
              <Text style={localStyles.featureIcon}>✅</Text>
              <Text style={localStyles.featureText}>
                ظهور ملفك الشخصي في نتائج البحث
              </Text>
            </View>

            <View style={localStyles.featureItem}>
              <Text style={localStyles.featureIcon}>✅</Text>
              <Text style={localStyles.featureText}>
                إمكانية تعديل البروفايل في أي وقت
              </Text>
            </View>

            <View style={localStyles.featureItem}>
              <Text style={localStyles.featureIcon}>✅</Text>
              <Text style={localStyles.featureText}>
                وصول أكبر للطلاب المهتمين
              </Text>
            </View>

            <View style={localStyles.featureItem}>
              <Text style={localStyles.featureIcon}>✅</Text>
              <Text style={localStyles.featureText}>
                لا توجد رسوم خفية أو مصاريف إضافية
              </Text>
            </View>

            <View style={localStyles.featureItem}>
              <Text style={localStyles.featureIcon}>✅</Text>
              <Text style={localStyles.featureText}>
                لا نحصل على أي نسبة من حصصك
              </Text>
            </View>
          </View>
        </View>

        {/* Important Notes Card */}
        <View style={[componentStyles.card.container, localStyles.notesCard]}>
          <Text style={[componentStyles.card.title, localStyles.notesTitle]}>
            ملاحظات مهمة
          </Text>

          <View style={localStyles.notesList}>
            <View style={localStyles.noteItem}>
              <Text style={localStyles.noteIcon}>💡</Text>
              <Text style={localStyles.noteText}>
                التطبيق لا يتدخل في عمليات الدفع بينك وبين الطلاب
              </Text>
            </View>

            <View style={localStyles.noteItem}>
              <Text style={localStyles.noteIcon}>💡</Text>
              <Text style={localStyles.noteText}>
                الاشتراك مقابل عرض ملفك الشخصي فقط
              </Text>
            </View>

            <View style={localStyles.noteItem}>
              <Text style={localStyles.noteIcon}>💡</Text>
              <Text style={localStyles.noteText}>
                يمكنك إلغاء الاشتراك في أي وقت
              </Text>
            </View>
          </View>
        </View>

        {/* Payment Button */}
        <TouchableOpacity
          style={[componentStyles.button.primary, localStyles.paymentButton]}
          onPress={handleActivateAccount}
          disabled={activatingAccount}
        >
          {activatingAccount ? (
            <View style={localStyles.loadingContainer}>
              <ActivityIndicator size="small" color={theme.colors.white} />
              <Text
                style={[
                  componentStyles.button.text.primary,
                  localStyles.loadingText,
                ]}
              >
                جاري المعالجة...
              </Text>
            </View>
          ) : (
            <Text style={componentStyles.button.text.primary}>
              ادفع {subscriptionPrice} جنيه واشترك الآن
            </Text>
          )}
        </TouchableOpacity>

        {/* Skip Option */}
        <TouchableOpacity
          style={[componentStyles.button.secondary, localStyles.skipButton]}
          onPress={() => {
            Alert.alert(
              "تخطي الاشتراك",
              "يمكنك الاشتراك لاحقاً من خلال الملف الشخصي. لن يظهر ملفك للطلاب حتى تقوم بالاشتراك.",
              [
                {
                  text: "إلغاء",
                  style: "cancel",
                },
                {
                  text: "تخطي",
                  onPress: () => {
                    handleSubmit();
                  },
                },
              ]
            );
          }}
          disabled={activatingAccount}
        >
          <Text style={componentStyles.button.text.secondary}>
            تخطي الآن (يمكن الاشتراك لاحقاً)
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const localStyles = StyleSheet.create({
  subscriptionCard: {
    backgroundColor: theme.colors.primary + "10",
    borderColor: theme.colors.primary,
    borderWidth: 1,
  },

  priceContainer: {
    marginTop: theme.spacing.sm,
  },

  originalPriceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },

  originalPriceLabel: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.secondary,
  },

  originalPrice: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.secondary,
  },

  durationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  durationLabel: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.primary,
  },

  duration: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.primary,
  },

  featuresList: {
    marginTop: theme.spacing.sm,
  },

  featureItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: theme.spacing.sm,
  },

  featureIcon: {
    fontSize: 16,
    marginRight: theme.spacing.sm,
    marginTop: 2,
  },

  featureText: {
    flex: 1,
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.primary,
    textAlign: "right",
    lineHeight: 22,
  },

  notesCard: {
    backgroundColor: theme.colors.status.info + "10",
    borderColor: theme.colors.status.info,
    borderWidth: 1,
  },

  notesTitle: {
    color: theme.colors.status.info,
  },

  notesList: {
    marginTop: theme.spacing.sm,
  },

  noteItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: theme.spacing.sm,
  },

  noteIcon: {
    fontSize: 16,
    marginRight: theme.spacing.sm,
    marginTop: 2,
  },

  noteText: {
    flex: 1,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.status.info,
    textAlign: "right",
    lineHeight: 20,
  },

  paymentButton: {
    marginTop: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },

  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginLeft: theme.spacing.sm,
  },

  skipButton: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },

  // Payment form styles
  paymentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },

  backButton: {
    padding: theme.spacing.sm,
    marginRight: theme.spacing.sm,
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
    color: theme.colors.primary,
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
    marginTop: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
});

export default Step8Payment;
