import React, { useCallback, useEffect, useState } from "react";
import { View, StyleSheet, Text, Alert } from "react-native";
import { theme } from "../../components/Theme";
import { QUERY, UPDATEDOC } from "../../server";
import { useFocusEffect } from "@react-navigation/native";
import Promotion from "./Promotion";

const HeroSection = () => {
  const [boostedProfiles, setBoostedProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBoostedProfiles = async () => {
    try {
      setLoading(true);
      const matches = await QUERY("teachers", "boosted", "==", true);
      const currentDate = new Date();

      const results = await Promise.all(
        matches.map(async (profile) => {
          if (!profile.boostedUntil) {
            return { profile, isActive: false };
          }

          const boostEndDate = new Date(profile.boostedUntil);
          const isActive = boostEndDate > currentDate;

          // Auto-update expired boosts
          if (!isActive) {
            await UPDATEDOC("teachers", profile.id, {
              boosted: false,
              pendingBoost: false,
            });
          }

          return { profile, isActive };
        })
      );

      const activeBoostedProfiles = results
        .filter((result) => result.isActive)
        .map((result) => result.profile);

      setBoostedProfiles(activeBoostedProfiles);
    } catch (error) {
      Alert.alert("Error", "حدث خطأ أثناء تحديث الملفات المعززة");
      console.error("Boost status update error:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchBoostedProfiles();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>جاري التحميل...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {boostedProfiles.length > 0 ? (
        <View style={styles.promotionSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>المدرسين المميزين</Text>
            <Text style={styles.sectionSubtitle}>
              اكتشف أفضل المدرسين لدينا
            </Text>
          </View>
          <Promotion offers={boostedProfiles} />
        </View>
      ) : (
        <View style={styles.heroSection}>
          <View style={styles.heroContent}>
            <Text style={styles.heroText}>
              معانا التعليم عن بعد أصبح أكثر متعة وسهولة مع نخبة أفضل المدرسين
              وأكثرهم خبرة وكفاءة
            </Text>

            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <View style={styles.statInfo}>
                  <Text style={styles.statNumber}>2000</Text>
                  <Text style={styles.statLabel}>طالب</Text>
                </View>
                <View style={styles.statIcon}>
                  <Text style={styles.statIconText}>👨‍🎓</Text>
                </View>
              </View>

              <View style={styles.statCard}>
                <View style={styles.statInfo}>
                  <Text style={styles.statNumber}>100</Text>
                  <Text style={styles.statLabel}>مدرس</Text>
                </View>
                <View style={styles.statIcon}>
                  <Text style={styles.statIconText}>👨‍🏫</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xl,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 200,
  },
  loadingText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize?.md || 16,
    fontFamily: theme.typography.fontFamily?.regular || "System",
    textAlign: "center",
  },
  promotionSection: {
    backgroundColor: theme.colors.background,
    paddingTop: theme.spacing.lg,
  },
  sectionHeader: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize?.xl || 20,
    fontFamily: theme.typography.fontFamily?.bold || "System",
    color: theme.colors.text?.primary || "#000",
    textAlign: "center",
    marginBottom: theme.spacing.xs,
    writingDirection: "rtl",
  },
  sectionSubtitle: {
    fontSize: theme.typography.fontSize?.sm || 14,
    fontFamily: theme.typography.fontFamily?.regular || "System",
    color: theme.colors.text?.secondary || "#666",
    textAlign: "center",
    writingDirection: "rtl",
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
    paddingRight: theme.spacing.lg,
    zIndex: 2,
  },
  heroText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize?.lg || 18,
    fontFamily: theme.typography.fontFamily?.regular || "System",
    textAlign: "center",
    lineHeight: 28,
    marginBottom: theme.spacing.xl,
    writingDirection: "rtl",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  statCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.sm,
    minWidth: 120,
    flex: 0.5,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: theme.spacing.xs,
  },
  statInfo: {
    flex: 1,

    alignItems: "center",
  },
  statNumber: {
    fontSize: theme.typography.fontSize?.xl || 20,
    fontFamily: theme.typography.fontFamily?.bold || "System",
    color: theme.colors.text?.primary || "#000",
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: theme.typography.fontSize?.sm || 14,
    fontFamily: theme.typography.fontFamily?.regular || "System",
    color: theme.colors.text?.secondary || "#666",
    marginTop: 2,
    textAlign: "right",
    writingDirection: "rtl",
  },
  statIcon: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: theme.spacing.sm,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  statIconText: {
    fontSize: 18,
  },
  heroImageContainer: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    zIndex: 2,
  },
  teacherAvatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: theme.colors.white,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.3)",
  },
  teacherEmoji: {
    fontSize: 70,
  },
  decorativeElements: {
    position: "absolute",
    width: 200,
    height: 200,
    zIndex: 1,
  },
  decorativeCircle: {
    position: "absolute",
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  circle1: {
    width: 20,
    height: 20,
    top: -10,
    left: -20,
  },
  circle2: {
    width: 15,
    height: 15,
    bottom: -5,
    right: -15,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  circle3: {
    width: 25,
    height: 25,
    top: 30,
    right: -30,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
});

export default HeroSection;
