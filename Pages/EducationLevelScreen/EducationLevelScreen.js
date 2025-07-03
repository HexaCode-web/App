import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import TopBar from "../../components/TopBar";
import { theme } from "../../components/Theme";
import SideMenu from "../../components/Menu";
import { useFocusEffect } from "@react-navigation/native";

const EducationLevelScreen = ({ route, navigation }) => {
  const initialEducationLevel = route.params?.educationLevel || null;
  const initialSelectedClass = route.params?.initialSelectedClass || "";
  const [selectedClass, setSelectedClass] = useState(initialSelectedClass);
  const [educationLevel, setEducationLevel] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);

  const [currentView, setCurrentView] = useState(
    initialEducationLevel ? "classes" : "levels"
  );
  useEffect(() => {
    if (initialEducationLevel?.id == 4) {
      navigation.navigate("TeachersListing", {
        educationLevel: initialEducationLevel,
        selectedClass: {
          id: 6,
          title: "تحفيظ القرآن",
          grade: 6,
        },
        subject: "تحفيظ القرآن",
      });
    }
    setCurrentView(initialEducationLevel ? "classes" : "levels");

    setEducationLevel(initialEducationLevel);
  }, [route]);
  // Default education levels when no specific level is passed
  const defaultEducationLevels = [
    { id: 1, title: "المرحلة الابتدائية", icon: "🎒" },
    { id: 2, title: "المرحلة الإعدادية", icon: "📚" },
    { id: 3, title: "المرحلة الثانوية", icon: "🎓" },
    { id: 4, title: "تحفيظ القرآن", icon: "📖" },
  ];

  const getClassesForLevel = (levelTitle) => {
    switch (levelTitle) {
      case "المرحلة الابتدائية":
        return [
          { id: 1, title: "الصف الأول", grade: 1 },
          { id: 2, title: "الصف الثاني", grade: 2 },
          { id: 3, title: "الصف الثالث", grade: 3 },
          { id: 4, title: "الصف الرابع", grade: 4 },
          { id: 5, title: "الصف الخامس", grade: 5 },
          { id: 6, title: "الصف السادس", grade: 6 },
        ];
      case "المرحلة الإعدادية":
      case "المرحلة الثانوية":
        return [
          { id: 1, title: "الصف الأول", grade: 1 },
          { id: 2, title: "الصف الثاني", grade: 2 },
          { id: 3, title: "الصف الثالث", grade: 3 },
        ];
      default:
        return [];
    }
  };

  // Define subjects for each education level
  const getSubjectsForLevel = (levelTitle) => {
    switch (levelTitle) {
      case "المرحلة الابتدائية":
        return [
          { id: 1, title: "عربى", icon: "📚" },
          { id: 2, title: "انجليزى", icon: "🇬🇧" },
          { id: 3, title: "حساب", icon: "🔢" },
          { id: 4, title: "علوم", icon: "🔬" },
          { id: 5, title: "دراسات اجتماعيه", icon: "🌍" },
          { id: 6, title: "دين", icon: "☪️" },
          { id: 7, title: "تكنولوجيا", icon: "💻" },
          { id: 8, title: "فرنساوى", icon: "🇫🇷" },
          { id: 9, title: "Math", icon: "➕" },
          { id: 10, title: "Science", icon: "⚗️" },
        ];
      case "المرحلة الإعدادية":
        return [
          { id: 1, title: "عربى", icon: "📚" },
          { id: 2, title: "انجليزى", icon: "🇬🇧" },
          { id: 3, title: "رياضيات بحته", icon: "📊" },
          { id: 4, title: "علوم", icon: "🔬" },
          { id: 5, title: "دراسات اجتماعيه", icon: "🌍" },
          { id: 6, title: "دين", icon: "☪️" },
          { id: 7, title: "الحاسب الآلى", icon: "💻" },
          { id: 8, title: "فرنساوى", icon: "🇫🇷" },
          { id: 9, title: "مواد شرعية", icon: "📖" },
          { id: 10, title: "مواد عربية", icon: "📝" },
          { id: 11, title: "Math", icon: "➕" },
          { id: 12, title: "Science", icon: "⚗️" },
        ];
      case "المرحلة الثانوية":
        return [
          { id: 1, title: "عربى", icon: "📚" },
          { id: 2, title: "انجليزى", icon: "🇬🇧" },
          { id: 3, title: "رياضيات بحته", icon: "📊" },
          { id: 4, title: "فيزياء", icon: "⚛️" },
          { id: 5, title: "كيمياء", icon: "🧪" },
          { id: 6, title: "أحياء", icon: "🧬" },
          { id: 7, title: "رياضيات تطبيقية", icon: "📈" },
          { id: 8, title: "جيولوجيا", icon: "🪨" },
          { id: 9, title: "تاريخ", icon: "🏛️" },
          { id: 10, title: "جغرافيا", icon: "🗺️" },
          { id: 11, title: "فلسفه ومنطق", icon: "🤔" },
          { id: 12, title: "علم نفس واجتماع", icon: "🧠" },
          { id: 13, title: "دين", icon: "☪️" },
          { id: 14, title: "فرنساوى", icon: "🇫🇷" },
          { id: 15, title: "المانى", icon: "🇩🇪" },
          { id: 16, title: "اسبانى", icon: "🇪🇸" },
          { id: 17, title: "ايطالى", icon: "🇮🇹" },
          { id: 18, title: "مواد شرعية", icon: "📖" },
          { id: 19, title: "مواد عربية", icon: "📝" },
          { id: 20, title: "Pure Mathematics", icon: "∑" },
          { id: 21, title: "Physics", icon: "🔬" },
          { id: 22, title: "Chemistry", icon: "⚗️" },
          { id: 23, title: "Biology", icon: "🌱" },
          { id: 24, title: "Applied Mathematics", icon: "📊" },
        ];
      default:
        return [];
    }
  };

  const classes = educationLevel
    ? getClassesForLevel(educationLevel.title)
    : [];
  const subjects =
    selectedClass && educationLevel
      ? getSubjectsForLevel(educationLevel.title)
      : [];

  const handleEducationLevelPress = (level) => {
    if (level?.id == 4) {
      navigation.navigate("TeachersListing", {
        educationLevel: level,
        selectedClass: {
          id: 6,
          title: "تحفيظ القرآن",
          grade: 6,
        },
        subject: "تحفيظ القرآن",
      });
      return;
    }
    setEducationLevel(level);
    setCurrentView("classes");
  };

  const handleClassPress = (classItem) => {
    setSelectedClass(classItem);
    setCurrentView("subjects");
  };

  const handleSubjectPress = (subject) => {
    const currentEducationLevel =
      educationLevel ||
      defaultEducationLevels.find((level) =>
        getClassesForLevel(level.title).some(
          (cls) => cls.id === selectedClass.id
        )
      );

    navigation.navigate("TeachersListing", {
      educationLevel: currentEducationLevel,
      selectedClass,
      subject,
    });
  };

  const handleBackPress = () => {
    if (currentView === "subjects") {
      setCurrentView("classes");
      setSelectedClass(null);
    } else if (currentView === "classes") {
      setCurrentView("levels");
    } else {
      navigation.goBack();
    }
  };

  const getScreenTitle = () => {
    if (currentView === "levels") {
      return "المراحل التعليمية";
    } else if (currentView === "classes") {
      return educationLevel?.title || "اختر المرحلة التعليمية";
    } else {
      return `${selectedClass?.title} - ${educationLevel?.title}`;
    }
  };

  const renderEducationLevelCard = (level) => (
    <TouchableOpacity
      key={level.id}
      style={styles.card}
      onPress={() => handleEducationLevelPress(level)}
      activeOpacity={0.8}
    >
      <View style={styles.cardContent}>
        <View style={styles.cardIcon}>
          <Text style={styles.cardIconText}>{level.icon}</Text>
        </View>
        <Text style={styles.cardTitle}>{level.title}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderClassCard = (classItem) => (
    <TouchableOpacity
      key={classItem.id}
      style={styles.card}
      onPress={() => handleClassPress(classItem)}
      activeOpacity={0.8}
    >
      <View style={styles.cardContent}>
        <View style={styles.cardIcon}>
          <Text style={styles.cardIconText}>📚</Text>
        </View>
        <Text style={styles.cardTitle}>{classItem.title}</Text>
        <Text style={styles.cardSubtitle}>{educationLevel?.title}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderSubjectCard = (subject) => (
    <TouchableOpacity
      key={subject.id}
      style={styles.subjectCard}
      onPress={() => handleSubjectPress(subject)}
      activeOpacity={0.8}
    >
      <View style={styles.subjectCardContent}>
        <View style={styles.subjectIcon}>
          <Text style={styles.subjectIconText}>{subject.icon}</Text>
        </View>
        <Text style={styles.subjectTitle}>{subject.title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TopBar
        title={getScreenTitle()}
        handleReturn={handleBackPress}
        toggleMenu={setMenuVisible}
      />
      <SideMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        activeRoute="home"
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {currentView === "levels" ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>اختر المرحلة التعليمية</Text>
            <View style={styles.gridContainer}>
              {defaultEducationLevels.map((level) =>
                renderEducationLevelCard(level)
              )}
            </View>
          </View>
        ) : currentView === "classes" ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>اختر الصف الدراسي</Text>
            <View style={styles.gridContainer}>
              {classes.map((classItem) => renderClassCard(classItem))}
            </View>
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>اختر المادة الدراسية</Text>
            <View style={styles.subjectsContainer}>
              {subjects.map((subject) => renderSubjectCard(subject))}
            </View>
          </View>
        )}
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xl,
  },
  section: {
    padding: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
    textAlign: "right",
    marginBottom: theme.spacing.lg,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "100%",
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    alignItems: "center",
    ...theme.shadows.sm,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  cardContent: {
    alignItems: "center",
  },
  cardIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.background,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.sm,
  },
  cardIconText: {
    fontSize: 30,
  },
  cardTitle: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
    textAlign: "center",
    marginBottom: theme.spacing.xs,
  },
  cardSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.secondary,
    textAlign: "center",
  },
  subjectsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  subjectCard: {
    width: "48%",
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    alignItems: "center",
    ...theme.shadows.sm,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  subjectCardContent: {
    alignItems: "center",
  },
  subjectIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.sm,
  },
  subjectIconText: {
    fontSize: 24,
  },
  subjectTitle: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.primary,
    textAlign: "center",
    lineHeight: 18,
  },
});

export default EducationLevelScreen;
