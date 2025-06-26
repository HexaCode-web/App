import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { GETDOC, SETDOC } from "../../server";
import { theme, componentStyles } from "../../components/Theme";
import TopBar from "../../components/TopBar";
import SideMenu from "../../components/Menu";

const BoostProfile = () => {
  const navigation = useNavigation();
  const User = useSelector((state) => state.auth);
  const [teacherData, setTeacherData] = useState(null);
  const [boostDays, setBoostDays] = useState("5");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };
  const COST_PER_DAY = 3.5;
  const totalCost = parseInt(boostDays) * COST_PER_DAY || 0;

  useFocusEffect(
    useCallback(() => {
      loadTeacherData();
    }, [])
  );

  const loadTeacherData = async () => {
    setLoading(true);
    try {
      const data = await GETDOC("teachers", User.id);
      if (data !== "Error") {
        setTeacherData(data);
      } else {
        Alert.alert("خطأ", "لم يتم العثور على بيانات المعلم");
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error loading teacher data:", error);
      Alert.alert("خطأ", "حدث خطأ أثناء تحميل البيانات");
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const validateInput = () => {
    const days = parseInt(boostDays);

    if (isNaN(days) || days < 5) {
      Alert.alert("خطأ", "يرجى إدخال عدد أيام صحيح (أقل حد 5 يوم)");
      return false;
    }

    if (days > 365) {
      Alert.alert("خطأ", "لا يمكن تنشيط الملف الشخصي لأكثر من 365 يوم");
      return false;
    }

    if (!teacherData) {
      Alert.alert("خطأ", "لم يتم تحميل بيانات الملف الشخصي");
      return false;
    }

    // Check if teacher account is active
    if (teacherData.isActive === false) {
      Alert.alert("تنبيه", "يجب تفعيل حسابك أولاً قبل تنشيط الملف الشخصي");
      return false;
    }

    return true;
  };

  const handleBoostRequest = () => {
    if (!validateInput()) {
      return;
    }

    const days = parseInt(boostDays);

    Alert.alert(
      "تأكيد طلب التنشيط",
      `هل تريد تنشيط ملفك الشخصي لمدة ${days} ${
        days === 5 ? "يوم" : "أيام"
      } بتكلفة ${totalCost} جنيه؟\n\nسيظهر ملفك الشخصي في المقدمة في نتائج البحث خلال هذه الفترة.`,
      [
        {
          text: "إلغاء",
          style: "cancel",
        },
        {
          text: "متابعة للدفع",
          onPress: proceedToPayment,
        },
      ]
    );
  };

  const proceedToPayment = () => {
    const days = parseInt(boostDays);

    navigation.navigate("PaymentScreen", {
      onPaymentComplete: handlePaymentComplete,
      paymentReason: "profile_boost",
      requiredAmount: totalCost,
      boostDetails: {
        days: days,
        costPerDay: COST_PER_DAY,
        totalCost: totalCost,
      },
    });
  };

  const handlePaymentComplete = async (paymentData) => {
    setSubmitting(true);
    try {
      const days = parseInt(boostDays);
      const currentDate = new Date();
      const endDate = new Date(
        currentDate.getTime() + days * 24 * 60 * 60 * 1000
      );

      // Calculate boost end date
      let boostedUntil = endDate;

      // If teacher already has an active boost, extend it
      if (teacherData.boostedUntil) {
        const existingBoostEnd = new Date(teacherData.boostedUntil);
        if (existingBoostEnd > currentDate) {
          // Extend from existing end date
          boostedUntil = new Date(
            existingBoostEnd.getTime() + days * 24 * 60 * 60 * 1000
          );
        }
      }

      const updatedTeacherData = {
        ...teacherData,
        boosted: false,
        pendingBoost: true,
        lastBoostPayment: {
          amount: totalCost,
          days: days,
          date: currentDate.toISOString(),
          paymentData: paymentData,
        },
      };

      const result = await SETDOC(
        "teachers",
        User.id,
        updatedTeacherData,
        false
      );

      if (result.success) {
        Alert.alert(
          "تم إرسال طلب التنشيط بنجاح!",
          "سيتم مراجعة طلبك من قبل الإدارة", // ✅ Correct message (string)
          [
            {
              text: "حسناً",
              onPress: () => navigation.navigate("Profile"),
            },
          ]
        );
      } else {
        throw new Error("Failed to update teacher data");
      }
    } catch (error) {
      console.error("Error updating boost status:", error);
      Alert.alert(
        "خطأ",
        "حدث خطأ أثناء تحديث حالة التنشيط. يرجى المحاولة مرة أخرى."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDaysChange = (text) => {
    // Only allow numeric input
    const numericText = text.replace(/[^0-9]/g, "");
    setBoostDays(numericText);
  };

  const formatBoostStatus = () => {
    if (!teacherData || !teacherData.boostedUntil) {
      return "غير منشط حالياً";
    }

    const boostEndDate = new Date(teacherData.boostedUntil);
    const currentDate = new Date();

    if (boostEndDate > currentDate) {
      const remainingDays = Math.ceil(
        (boostEndDate - currentDate) / (1000 * 60 * 60 * 24)
      );
      return `منشط حتى ${boostEndDate.toLocaleDateString(
        "ar-EG"
      )} (${remainingDays} ${remainingDays === 5 ? "يوم" : "أيام"} متبقية)`;
    } else {
      return "انتهت فترة التنشيط";
    }
  };

  const renderCurrentBoostStatus = () => {
    if (!teacherData) return null;

    const isCurrentlyBoosted =
      teacherData.boosted &&
      teacherData.boostedUntil &&
      new Date(teacherData.boostedUntil) > new Date();

    return (
      <View style={componentStyles.card.container}>
        <Text style={componentStyles.card.title}>حالة التنشيط الحالية</Text>

        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusIndicator,
              {
                backgroundColor: isCurrentlyBoosted
                  ? theme.colors.status.success
                  : theme.colors.status.warning,
              },
            ]}
          />
          <Text style={styles.statusText}>{formatBoostStatus()}</Text>
        </View>

        {isCurrentlyBoosted && (
          <Text style={styles.statusNote}>
            يمكنك إضافة المزيد من الأيام لتمديد فترة التنشيط
          </Text>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>جاري التحميل...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TopBar
        title="تنشيط الملف الشخصي"
        handleReturn={() => navigation.goBack()}
        toggleMenu={toggleMenu}
      />
      <SideMenu visible={menuVisible} onClose={() => setMenuVisible(false)} />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Information Card */}
          <View style={componentStyles.card.container}>
            <Text style={componentStyles.card.title}>
              ما هو تنشيط الملف الشخصي؟
            </Text>

            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>🚀</Text>
              <Text style={styles.infoText}>
                يظهر ملفك الشخصي في المقدمة البرنامج
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>👁️</Text>
              <Text style={styles.infoText}>
                زيادة فرص مشاهدة ملفك الشخصي من قبل الطلاب
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>💰</Text>
              <Text style={styles.infoText}>
                تكلفة التنشيط: {COST_PER_DAY} جنيه لكل يوم
              </Text>
            </View>
          </View>

          {/* Current Boost Status */}
          {renderCurrentBoostStatus()}

          {/* Boost Request Form */}
          <View style={componentStyles.card.container}>
            <Text style={componentStyles.card.title}>
              طلب تنشيط الملف الشخصي
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>عدد الأيام</Text>
              <TextInput
                style={styles.daysInput}
                value={boostDays}
                onChangeText={handleDaysChange}
                placeholder="أدخل عدد الأيام"
                placeholderTextColor={theme.colors.text.secondary}
                keyboardType="numeric"
                maxLength={3}
                textAlign="center"
              />
              <Text style={styles.inputHelper}>
                (الحد الأدنى: 5 يوم، الحد الأقصى: 365 يوم)
              </Text>
            </View>

            {/* Cost Calculation */}
            {boostDays && parseInt(boostDays) > 0 && (
              <View style={styles.costContainer}>
                <View style={styles.costRow}>
                  <Text style={styles.costValue}>
                    {parseInt(boostDays)}{" "}
                    {parseInt(boostDays) === 5 ? "يوم" : "أيام"}
                  </Text>
                  <Text style={styles.costLabel}>عدد الأيام:</Text>
                </View>

                <View style={styles.costRow}>
                  <Text style={styles.costValue}>{COST_PER_DAY} جنيه</Text>
                  <Text style={styles.costLabel}>التكلفة لكل يوم:</Text>
                </View>

                <View style={[styles.costRow, styles.totalCostRow]}>
                  <Text style={styles.totalCostValue}>{totalCost} جنيه</Text>
                  <Text style={styles.totalCostLabel}>إجمالي التكلفة:</Text>
                </View>
              </View>
            )}

            {/* Submit Button */}
            <TouchableOpacity
              style={[
                componentStyles.button.primary,
                styles.submitButton,
                (!boostDays || parseInt(boostDays) < 5 || submitting) &&
                  styles.disabledButton,
              ]}
              onPress={handleBoostRequest}
              disabled={!boostDays || parseInt(boostDays) < 5 || submitting}
            >
              <Text style={componentStyles.button.text.primary}>
                {submitting ? "جاري المعالجة..." : "متابعة للدفع"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Terms and Conditions */}
          <View style={componentStyles.card.container}>
            <Text style={componentStyles.card.title}>الشروط والأحكام</Text>

            <Text style={styles.termText}>• سيبدأ التنشيط فور تأكيد الدفع</Text>
            <Text style={styles.termText}>
              • في حالة وجود تنشيط نشط، ستتم إضافة الأيام الجديدة إلى نهاية
              الفترة الحالية
            </Text>
            <Text style={styles.termText}>
              • لا يتم استرداد المبلغ بعد تأكيد الدفع
            </Text>
            <Text style={styles.termText}>
              • يجب أن يكون حسابك مفعلاً لاستخدام خدمة التنشيط
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    fontFamily: theme.typography.fontFamily.regular,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.md,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  infoIcon: {
    fontSize: 20,
    marginRight: theme.spacing.sm,
  },
  infoText: {
    flex: 1,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    fontFamily: theme.typography.fontFamily.regular,
    textAlign: "right",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: theme.spacing.sm,
  },
  statusText: {
    flex: 1,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    fontFamily: theme.typography.fontFamily.medium,
    textAlign: "right",
  },
  statusNote: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    fontFamily: theme.typography.fontFamily.regular,
    textAlign: "right",
    fontStyle: "italic",
  },
  inputContainer: {
    marginBottom: theme.spacing.lg,
  },
  inputLabel: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    fontFamily: theme.typography.fontFamily.medium,
    textAlign: "right",
    marginBottom: theme.spacing.sm,
  },
  daysInput: {
    ...componentStyles.input.field,
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.bold,
    textAlign: "center",
    marginBottom: theme.spacing.xs,
  },
  inputHelper: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    textAlign: "center",
    fontFamily: theme.typography.fontFamily.regular,
  },
  costContainer: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
  },
  costRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  costLabel: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    fontFamily: theme.typography.fontFamily.regular,
  },
  costValue: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    fontFamily: theme.typography.fontFamily.medium,
  },
  totalCostRow: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
    paddingTop: theme.spacing.sm,
    marginTop: theme.spacing.sm,
    marginBottom: 0,
  },
  totalCostLabel: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.primary,
    fontFamily: theme.typography.fontFamily.bold,
  },
  totalCostValue: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.primary,
    fontFamily: theme.typography.fontFamily.bold,
  },
  submitButton: {
    marginTop: theme.spacing.md,
  },
  disabledButton: {
    backgroundColor: theme.colors.border.medium,
  },
  termText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    fontFamily: theme.typography.fontFamily.regular,
    textAlign: "right",
    marginBottom: theme.spacing.xs,
    lineHeight: 20,
  },
});

export default BoostProfile;
