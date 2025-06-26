import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Linking,
  Clipboard,
} from "react-native";

import { GETDOC } from "../../server";
import { theme, componentStyles } from "../../components/Theme";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import TopBar from "../../components/TopBar";
import SideMenu from "../../components/Menu";

const ViewProfile = ({ route }) => {
  const teacherId = route?.params?.id;
  const [menuVisible, setMenuVisible] = React.useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const [teacherData, setTeacherData] = useState({
    id: teacherId,
    name: "",
    email: "",
    phone: "",
    gender: "",
    birthDate: "",
    nationality: "",
    residenceCountry: "",
    residenceCity: "",
    address: "",
    bio: "",
    educationLevels: [],
    subjects: [],
    teachingMethod: [],
    sessionPrice: "",
    whatsapp: "",
    facebookLink: "",
    trialSessionLink: "",
    profileImage: "",
    isActive: null,
    pendingApproval: null,
    boosted: null,
  });

  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadTeacherData();
    }, [])
  );

  const loadTeacherData = async () => {
    setLoading(true);
    try {
      const data = await GETDOC("teachers", teacherId);

      if (data !== "Error") {
        setTeacherData(data);
      } else {
        Alert.alert("خطأ", "لم يتم العثور على بيانات المعلم");
      }
    } catch (error) {
      console.error("Error loading teacher data:", error);
      Alert.alert("خطأ", "حدث خطأ أثناء تحميل البيانات");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, label) => {
    if (text) {
      Clipboard.setString(text);
      Alert.alert("تم النسخ", `تم نسخ ${label} بنجاح`);
    }
  };

  const openLink = async (url, type) => {
    if (!url) return;

    let formattedUrl = url;

    // Format WhatsApp link
    if (type === "whatsapp") {
      if (
        !url.startsWith("https://wa.me/") &&
        !url.startsWith("https://api.whatsapp.com/")
      ) {
        // Remove any non-numeric characters except +
        const cleanNumber = url.replace(/[^\d+]/g, "");
        formattedUrl = `https://wa.me/${cleanNumber}`;
      }
    }

    // Format Facebook link
    else if (type === "facebook") {
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        formattedUrl = `https://${url}`;
      }
    }

    // Format trial session link
    else if (type === "trial") {
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        formattedUrl = `https://${url}`;
      }
    }

    try {
      const supported = await Linking.canOpenURL(formattedUrl);
      if (supported) {
        await Linking.openURL(formattedUrl);
      } else {
        Alert.alert("خطأ", "لا يمكن فتح هذا الرابط");
      }
    } catch (error) {
      console.error("Error opening link:", error);
      Alert.alert("خطأ", "حدث خطأ أثناء فتح الرابط");
    }
  };

  const renderField = (label, value, type = "text") => {
    const displayValue = Array.isArray(value)
      ? value.join(", ")
      : value || "غير محدد";

    return (
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.valueContainer}>
          <Text style={styles.value}>{displayValue}</Text>

          {/* Show action buttons only if there's a value */}
          {value && (
            <View style={styles.actionButtons}>
              {/* Copy button for all fields */}
              <TouchableOpacity
                style={styles.copy}
                onPress={() => copyToClipboard(displayValue, label)}
              >
                <Ionicons
                  name="copy-outline"
                  size={18}
                  color={theme.colors.primary}
                />{" "}
              </TouchableOpacity>

              {/* Link button for specific types */}
              {(type === "whatsapp" ||
                type === "facebook" ||
                type === "trial" ||
                type === "email") && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.linkButton]}
                  onPress={() => {
                    if (type === "email") {
                      openLink(`mailto:${value}`, type);
                    } else {
                      openLink(value, type);
                    }
                  }}
                >
                  <Text
                    style={[styles.actionButtonText, styles.linkButtonText]}
                  >
                    {type === "whatsapp"
                      ? "واتساب"
                      : type === "facebook"
                      ? "فتح"
                      : type === "trial"
                      ? "فتح"
                      : "إرسال"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>جاري تحميل البيانات...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <SideMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        activeRoute="PrivacyPolicy"
      />
      <TopBar title="ملف المدرس" toggleMenu={toggleMenu} />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Account Status */}
          {teacherData.isActive === false && (
            <View style={[componentStyles.card.container, styles.statusCard]}>
              <View style={styles.statusHeader}>
                <Text style={styles.statusIcon}>
                  {teacherData.pendingApproval ? "⏳" : "⚠️"}
                </Text>
                <Text style={[componentStyles.card.title, styles.statusTitle]}>
                  {teacherData.pendingApproval
                    ? "في انتظار المراجعة"
                    : "حساب غير مفعل"}
                </Text>
              </View>
              <Text style={styles.statusText}>
                {teacherData.pendingApproval
                  ? "هذا الحساب في انتظار مراجعة الإدارة"
                  : "هذا الحساب غير مفعل حالياً"}
              </Text>
            </View>
          )}

          {/* Profile Image */}
          <View style={componentStyles.card.container}>
            <Text style={componentStyles.card.title}>الصورة الشخصية</Text>
            <View style={styles.imageContainer}>
              {teacherData.profileImage ? (
                <Image
                  source={{ uri: teacherData.profileImage }}
                  style={styles.profileImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.placeholderImage}>
                  <Text style={styles.placeholderText}>لا توجد صورة</Text>
                </View>
              )}
            </View>
          </View>

          {/* Basic Information */}
          <View style={componentStyles.card.container}>
            <Text style={componentStyles.card.title}>المعلومات الأساسية</Text>
            {renderField("الاسم", teacherData.name)}
            {renderField("البريد الإلكتروني", teacherData.email, "email")}
            {renderField("الجنس", teacherData.gender)}
            {renderField("تاريخ الميلاد", teacherData.birthDate)}
            {renderField("الجنسية", teacherData.nationality)}
          </View>

          {/* Location Information */}
          <View style={componentStyles.card.container}>
            <Text style={componentStyles.card.title}>معلومات السكن</Text>
            {renderField("البلد", teacherData.residenceCountry)}
            {renderField("المدينة", teacherData.residenceCity)}
            {renderField("العنوان", teacherData.address)}
          </View>

          {/* Professional Information */}
          <View style={componentStyles.card.container}>
            <Text style={componentStyles.card.title}>المعلومات المهنية</Text>
            {renderField("المستويات التعليمية", teacherData.educationLevels)}
            {renderField("المواد", teacherData.subjects)}
            {renderField("طريقة التدريس", teacherData.teachingMethod)}
            {renderField("سعر الجلسة", teacherData.sessionPrice)}
            {renderField("نبذة عني", teacherData.bio)}
          </View>

          {/* Contact Information */}
          <View style={componentStyles.card.container}>
            <Text style={componentStyles.card.title}>وسائل التواصل</Text>
            {renderField("واتساب", teacherData.whatsapp, "whatsapp")}
            {renderField("فيسبوك", teacherData.facebookLink, "facebook")}
            {renderField(
              "رابط الجلسة التجريبية",
              teacherData.trialSessionLink,
              "trial"
            )}
          </View>
        </View>
      </ScrollView>
    </View>
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
  // Status Card Styles
  statusCard: {
    backgroundColor: "#FFF3CD",
    borderColor: "#FFD60A",
    borderWidth: 1,
    marginBottom: theme.spacing.md,
  },
  statusHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  statusIcon: {
    fontSize: 24,
    marginRight: theme.spacing.xs,
  },
  statusTitle: {
    color: "#B45309",
    flex: 1,
  },
  statusText: {
    fontSize: theme.typography.fontSize.sm,
    color: "#B45309",
    textAlign: "right",
    lineHeight: 20,
  },
  fieldContainer: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
    fontFamily: theme.typography.fontFamily.medium,
    textAlign: "right",
  },
  valueContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  value: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    fontFamily: theme.typography.fontFamily.regular,
    textAlign: "right",
    paddingVertical: theme.spacing.sm,
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  actionButton: {
    backgroundColor: theme.colors.border.light,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    marginLeft: theme.spacing.xs,
  },
  copy: { margin: "auto" },
  linkButton: {
    backgroundColor: theme.colors.primary,
  },
  actionButtonText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.primary,
    fontFamily: theme.typography.fontFamily.medium,
  },
  linkButtonText: {
    color: theme.colors.white,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: theme.colors.primary,
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.border.light,
    borderWidth: 2,
    borderColor: theme.colors.border.medium,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    textAlign: "center",
    paddingHorizontal: theme.spacing.sm,
  },
});

export default ViewProfile;
