import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { theme } from "../../components/Theme";
import TopBar from "../../components/TopBar";
import { useNavigation } from "@react-navigation/native";
import SideMenu from "../../components/Menu";
import HeroSection from "./HeroSection";
const HomeScreen = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const navigation = useNavigation();
  const educationLevels = [
    {
      id: 1,
      title: "المرحلة الابتدائية",
      image: require("../../assets/primary.png"),
    },
    {
      id: 2,
      title: "المرحلة الإعدادية",
      image: require("../../assets/middle.png"),
    },
    {
      id: 3,
      title: "المرحلة الثانوية",
      image: require("../../assets/secondary.png"),
    },
    {
      id: 4,
      title: "تحفيظ القرآن",
      image: require("../../assets/service4.jpg"),
    },
  ];

  const handleEducationLevelPress = (level) => {
    console.log(level.id);

    navigation.navigate("EducationLevel", { educationLevel: level });
  };

  return (
    <SafeAreaView style={styles.container}>
      <SideMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        activeRoute="home"
      />

      <TopBar title="In One" toggleMenu={setMenuVisible} hasReturn={false} />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <HeroSection />
        {/* Education Levels Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>المراحل التعليمية</Text>

          <View style={styles.gridContainer}>
            {educationLevels.map((level) => (
              <TouchableOpacity
                key={level.id}
                style={styles.educationCard}
                onPress={() => handleEducationLevelPress(level)}
                activeOpacity={0.8}
              >
                <View style={styles.cardImageContainer}>
                  <Image source={level.image} style={styles.image} />
                </View>
                <Text style={styles.cardTitle}>{level.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
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
    paddingTop: 50,

    justifyContent: "space-between",
    ...theme.shadows.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 150,
    borderRadius: theme.borderRadius.md,
    height: 150,
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
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
    flexDirection: "row",
    alignItems: "center",
  },
  heroContent: {
    flex: 1,
    paddingRight: theme.spacing.md,
  },
  heroText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.regular,
    textAlign: "right",
    lineHeight: 24,
    marginBottom: theme.spacing.lg,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.sm,
    minWidth: 100,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: theme.spacing.xs,
  },
  statNumber: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
  },
  statLabel: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.xs,
  },
  statIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  statIconText: {
    fontSize: 16,
  },
  heroImageContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  teacherAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.white,
    alignItems: "center",
    justifyContent: "center",
    ...theme.shadows.lg,
  },
  teacherEmoji: {
    fontSize: 60,
  },
  section: {
    padding: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
    textAlign: "right",
    marginBottom: theme.spacing.md,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  educationCard: {
    width: "48%",
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    alignItems: "center",
    ...theme.shadows.sm,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  cardImageContainer: {
    marginBottom: theme.spacing.sm,
  },
  studentAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  studentEmoji: {
    fontSize: 40,
  },
  cardTitle: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.primary,
    textAlign: "center",
  },
  serviceCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    flexDirection: "row",
    alignItems: "center",
    ...theme.shadows.sm,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  serviceContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  serviceTextContainer: {
    flex: 1,
    paddingRight: theme.spacing.sm,
  },
  serviceTitle: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
    textAlign: "right",
    marginBottom: theme.spacing.xs,
  },
  serviceSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.secondary,
    textAlign: "right",
    lineHeight: 20,
  },
  serviceIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  serviceEmoji: {
    fontSize: 24,
    color: theme.colors.white,
  },
  serviceArrow: {
    fontSize: 20,
    color: theme.colors.primary,
    marginLeft: theme.spacing.sm,
  },
});

export default HomeScreen;
