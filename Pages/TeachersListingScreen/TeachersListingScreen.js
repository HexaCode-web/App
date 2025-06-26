import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ActivityIndicator,
  Alert,
  Linking,
  Dimensions,
} from "react-native";
import { QUERY, UPDATEDOC } from "../../server";
import { theme } from "../../components/Theme";
import TopBar from "../../components/TopBar";
import SideMenu from "../../components/Menu";
const { width } = Dimensions.get("window");

const TeachersListingScreen = ({ route, navigation }) => {
  const { educationLevel, selectedClass, subject } = route.params;
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);

  // Map education levels to match database format
  const mapEducationLevel = (levelTitle) => {
    switch (levelTitle) {
      case "المرحلة الابتدائية":
        return "ابتدائي";
      case "المرحلة الإعدادية":
        return "إعدادي";
      case "المرحلة الثانوية":
        return "ثانوي";
      default:
        return levelTitle;
    }
  };

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      setError(null);
      const currentDate = new Date();
      const mappedEducationLevel = mapEducationLevel(educationLevel.title);

      const allTeachers = await QUERY("teachers", "isActive", "==", true);
      console.log("All active teachers:", allTeachers);

      const updatePromises = allTeachers
        .filter((teacher) => {
          if (!teacher.ActiveTill || !teacher.ActiveTill.seconds) return false;
          const activeTillDate = new Date(teacher.ActiveTill.seconds * 1000);
          return activeTillDate <= currentDate;
        })
        .map(async (teacher) => {
          console.log(`Updating teacher ${teacher.name} to inactive`);
          return await UPDATEDOC("teachers", teacher.id, { isActive: false });
        });

      await Promise.all(updatePromises);

      const filteredTeachers = allTeachers.filter((teacher) => {
        // 1. Filter out expired teachers
        if (teacher.ActiveTill && teacher.ActiveTill.seconds) {
          const activeTillDate = new Date(teacher.ActiveTill.seconds * 1000);
          if (activeTillDate <= currentDate) {
            console.log(`Excluding expired teacher: ${teacher.name}`);
            return false;
          }
        }

        // 2. Filter by education level and subject
        if (subject !== "تحفيظ القرآن") {
          const hasEducationLevel =
            teacher.educationLevels?.includes(mappedEducationLevel);
          const hasSubject = teacher.subjects?.includes(subject.title);
          return hasEducationLevel && hasSubject;
        } else {
          return teacher.subjects?.includes(subject);
        }
      });

      console.log("Filtered teachers:", filteredTeachers);
      setTeachers(filteredTeachers);
    } catch (err) {
      console.error("Error fetching teachers:", err);
      setError("حدث خطأ في تحميل المدرسين. يرجى المحاولة مرة أخرى.");
      Alert.alert("خطأ", "حدث خطأ في تحميل المدرسين. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, [educationLevel, selectedClass, subject]);

  const handleTeacherPress = (teacher) => {
    navigation.navigate("ViewProfile", {
      id: teacher.id,
    });
  };

  const handleBackPress = () => {
    if (subject == "تحفيظ القرآن") {
      navigation.navigate("EducationLevel");
      return;
    }
    navigation.navigate("EducationLevel", {
      educationLevel: educationLevel,
      initialSelectedClass: selectedClass,
    });
  };
  const ContactTeacher = (teacher) => {
    let phoneNumber = teacher.whatsapp ? teacher.whatsapp : teacher.phone;

    // Remove all non-digit characters
    phoneNumber = phoneNumber.replace(/\D/g, "");

    // Handle Egyptian numbers:
    // If starts with 0, replace with +20
    if (phoneNumber.startsWith("0")) {
      phoneNumber = "+20" + phoneNumber.substring(1);
    }
    // If starts with 20 but doesn't have +, add +
    else if (phoneNumber.startsWith("20") && !phoneNumber.startsWith("+20")) {
      phoneNumber = "+" + phoneNumber;
    }
    // If doesn't start with + at all, assume it's Egyptian and add +20
    else if (!phoneNumber.startsWith("+")) {
      phoneNumber = "+20" + phoneNumber;
    }

    const message = encodeURIComponent(
      "مرحباً، انا طالب من تطبيق in one ارغب في حجز درس مع حضرتك"
    );
    Linking.openURL(`https://wa.me/${phoneNumber}?text=${message}`);
  };
  const renderTeacherCard = (teacher) => (
    <View key={teacher.id} style={styles.teacherCard} activeOpacity={0.8}>
      <View style={styles.teacherInfo}>
        <View style={styles.teacherImageContainer}>
          {teacher.profileImage ? (
            <View style={styles.teacherHeader}>
              <Image
                source={{ uri: teacher.profileImage }}
                style={styles.teacherImage}
                resizeMode="cover"
              />
              <View>
                <Text style={styles.teacherName}>{teacher.name}</Text>
                {teacher.bio && (
                  <Text style={styles.teacherBio} numberOfLines={2}>
                    {teacher.bio}
                  </Text>
                )}
              </View>
            </View>
          ) : (
            <View style={styles.teacherHeader}>
              <View style={styles.teacherImagePlaceholder}>
                <Text style={styles.teacherImagePlaceholderText}>
                  {teacher.name?.charAt(0)?.toUpperCase() || "👨‍🏫"}
                </Text>
              </View>
              <View>
                <Text style={styles.teacherName}>{teacher.name}</Text>
                {teacher.bio && (
                  <Text style={styles.teacherBio} numberOfLines={2}>
                    {teacher.bio}
                  </Text>
                )}
              </View>
            </View>
          )}
        </View>

        <View style={styles.teacherDetails}>
          <View style={styles.teacherMeta}>
            <View style={styles.metaItem}>
              <Text style={styles.metaValue} numberOfLines={1}>
                {teacher.subjects?.join(", ") || "غير محدد"}
              </Text>
              <Text style={styles.metaLabel}>التخصصات: </Text>
            </View>

            <View style={styles.metaItem}>
              <Text style={styles.metaValue} numberOfLines={1}>
                {teacher.educationLevels?.join(", ") || "غير محدد"}
              </Text>
              <Text style={styles.metaLabel}>المراحل: </Text>
            </View>

            {teacher.sessionPrice && (
              <View style={styles.metaItem}>
                <Text style={styles.priceText}>
                  {teacher.sessionPrice} جنيه
                </Text>
                <Text style={styles.metaLabel}>سعر الحصة:</Text>
              </View>
            )}

            <View style={styles.metaItem}>
              <Text style={styles.metaValue} numberOfLines={1}>
                {teacher.teachingMethod?.join(", ") || "غير محدد"}
              </Text>
              <Text style={styles.metaLabel}>طريقة التدريس:</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.teacherActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={() => handleTeacherPress(teacher)}
        >
          <Text style={styles.secondaryButtonText}>تفاصيل</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.primaryButton]}
          onPress={() => {
            ContactTeacher(teacher);
          }}
        >
          <Text style={styles.primaryButtonText}>تواصل</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={() => Linking.openURL(teacher.trialSessionLink)}
        >
          <Text style={styles.secondaryButtonText}>فيديو تجريبي</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateIcon}>🔍</Text>
      <Text style={styles.emptyStateTitle}>لا توجد نتائج</Text>
      <Text style={styles.emptyStateText}>
        لم نجد مدرسين متاحين لـ {subject.title} في {educationLevel.title} -{" "}
        {selectedClass.title}
      </Text>
      <TouchableOpacity style={styles.retryButton} onPress={fetchTeachers}>
        <Text style={styles.retryButtonText}>إعادة المحاولة</Text>
      </TouchableOpacity>
    </View>
  );

  const renderError = () => (
    <View style={styles.errorState}>
      <Text style={styles.errorIcon}>⚠️</Text>
      <Text style={styles.errorTitle}>حدث خطأ</Text>
      <Text style={styles.errorText}>{error}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={fetchTeachers}>
        <Text style={styles.retryButtonText}>إعادة المحاولة</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TopBar
        handleReturn={handleBackPress}
        title="المدرسين المتاحين"
        toggleMenu={setMenuVisible}
      />
      <SideMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        activeRoute="home"
      />
      <View style={styles.selectionSummary}>
        <Text style={styles.summaryText}>
          {subject?.title} • {selectedClass?.title} • {educationLevel?.title}
        </Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>جاري تحميل المدرسين...</Text>
        </View>
      ) : error ? (
        renderError()
      ) : teachers.length === 0 ? (
        renderEmptyState()
      ) : (
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsCount}>
              تم العثور على {teachers.length} مدرس
            </Text>
          </View>

          {teachers.map((teacher) => renderTeacherCard(teacher))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    ...theme.shadows.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: {
    color: theme.colors.white,
    fontSize: 20,
    fontWeight: "bold",
  },
  headerTitle: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.bold,
    textAlign: "center",
    flex: 1,
  },
  headerRight: {
    width: 40,
  },
  selectionSummary: {
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  summaryText: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.secondary,
    textAlign: "right",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
  },
  loadingText: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.md,
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xl,
  },
  resultsHeader: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  resultsCount: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.secondary,
    textAlign: "right",
  },
  teacherCard: {
    backgroundColor: theme.colors.white || "#FFFFFF",
    width: width - (theme.spacing.md || 16) * 2,
    marginHorizontal: "auto",
    marginVertical: 10,
    borderRadius: theme.borderRadius.lg || 12,
    padding: theme.spacing.lg || 20,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: theme.colors.border?.light || "#E8E8E8",
    minHeight: 280,
  },
  teacherInfo: {
    flexDirection: "column",
  },
  teacherHeader: {
    flexDirection: "row-reverse", // RTL layout
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 20,
    marginBottom: theme.spacing.md || 16,
  },
  teacherImageContainer: {
    marginRight: theme.spacing.md,
  },
  teacherImage: {
    width: 60,
    height: 60,
    borderRadius: 40,
  },
  teacherImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  teacherImagePlaceholderText: {
    color: theme.colors.white,
    fontSize: 24,
    fontFamily: theme.typography.fontFamily.bold,
  },
  teacherDetails: {
    flex: 1,
  },
  teacherName: {
    fontSize: theme.typography.fontSize?.lg || 18,
    fontWeight: "bold",
    fontFamily: theme.typography.fontFamily?.bold || "System",
    color: theme.colors.text?.primary || "#1A1A1A",
    marginBottom: theme.spacing.xs || 4,
    textAlign: "right",
    writingDirection: "rtl",
    lineHeight: 24,
  },
  teacherBio: {
    fontSize: theme.typography.fontSize?.sm || 14,
    fontFamily: theme.typography.fontFamily?.regular || "System",
    color: theme.colors.text?.secondary || "#666666",
    textAlign: "right",
    writingDirection: "rtl",
    lineHeight: 20,
    width: width - 80 * 2,
  },
  teacherDetails: {
    marginBottom: theme.spacing.lg || 20,
  },
  teacherMeta: {
    marginTop: theme.spacing.xs,
  },
  metaItem: {
    flexDirection: "row",
    width: "100%",
    marginBottom: theme.spacing.xs,
    justifyContent: "space-between",
  },
  metaLabel: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.primary,
    marginRight: theme.spacing.xs,
  },
  metaValue: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.secondary,
    flex: 1,
    textAlign: "left",
  },
  priceText: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.primary,
    flex: 1,
    textAlign: "left",
  },
  teacherActions: {
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    flexDirection: "row",
    borderTopColor: theme.colors.border.light,
    justifyContent: "space-between",
  },
  actionButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
    width: "30%",
    textAlign: "center",
  },
  actionButtonText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.medium,
    textAlign: "center",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: theme.spacing.md,
  },
  emptyStateTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
    textAlign: "center",
  },
  emptyStateText: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.secondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: theme.spacing.lg,
  },
  errorState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: theme.spacing.md,
  },
  errorTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.status.error,
    marginBottom: theme.spacing.sm,
    textAlign: "center",
  },
  errorText: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.secondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: theme.spacing.lg,
  },
  retryButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
  },
  retryButtonText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.medium,
  },
  actionButton: {
    flex: 1,
    paddingVertical: theme.spacing.sm || 10,
    paddingHorizontal: theme.spacing.xs || 6,
    borderRadius: theme.borderRadius.md || 8,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
    minHeight: 40,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary || "#007AFF",
    elevation: 2,
    shadowColor: theme.colors.primary || "#007AFF",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: theme.colors.primary || "#007AFF",
  },
  primaryButtonText: {
    color: theme.colors.white || "#FFFFFF",
    fontSize: theme.typography.fontSize?.sm || 14,
    fontWeight: "600",
    fontFamily: theme.typography.fontFamily?.medium || "System",
    textAlign: "center",
  },
  secondaryButtonText: {
    color: theme.colors.primary || "#007AFF",
    fontSize: theme.typography.fontSize?.sm || 14,
    fontWeight: "600",
    fontFamily: theme.typography.fontFamily?.medium || "System",
    textAlign: "center",
  },
});

export default TeachersListingScreen;
