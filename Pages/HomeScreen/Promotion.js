import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  SafeAreaView,
  Text,
  Linking,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
const { width } = Dimensions.get("window");

import { useNavigation } from "@react-navigation/native";
import { theme } from "../../components/Theme";

const Promotion = ({ offers }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);
  const timerRef = useRef(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const userScrollTimeoutRef = useRef(null);
  const viewabilityConfigRef = useRef({
    itemVisiblePercentThreshold: 50,
  });
  const navigation = useNavigation();
  const componentMountedRef = useRef(false);
  const isProgrammaticScrollRef = useRef(false);

  // Function to handle auto scrolling
  const goToNextSlide = () => {
    if (!offers || offers.length <= 1) return;
    if (isUserScrolling) return;

    const nextIndex = (activeIndex + 1) % offers.length;
    isProgrammaticScrollRef.current = true;
    setActiveIndex(nextIndex);

    if (flatListRef.current && nextIndex < offers.length) {
      try {
        flatListRef.current.scrollToIndex({
          animated: true,
          index: nextIndex,
          viewPosition: 0,
        });
      } catch (error) {
        console.log("Error scrolling to index: ", error);
        isProgrammaticScrollRef.current = false;
      }
    }
  };

  const handleScroll = (event) => {
    if (isProgrammaticScrollRef.current) return;
    if (!event || !event.nativeEvent) return;

    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);

    if (index >= 0 && index < offers.length && index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  const startAutoScrollTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (offers && offers.length > 1) {
      timerRef.current = setTimeout(() => {
        goToNextSlide();
      }, 3000);
    }
  };

  useEffect(() => {
    if (!offers || offers.length <= 1 || isUserScrolling) return;

    if (!componentMountedRef.current) {
      componentMountedRef.current = true;

      const initialTimer = setTimeout(() => {
        if (flatListRef.current) {
          goToNextSlide();
        }
      }, 3000);

      return () => clearTimeout(initialTimer);
    } else {
      startAutoScrollTimer();

      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    }
  }, [activeIndex, isUserScrolling, offers]);

  const handleScrollBeginDrag = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setIsUserScrolling(true);

    if (userScrollTimeoutRef.current) {
      clearTimeout(userScrollTimeoutRef.current);
    }
  };

  const handleMomentumScrollEnd = (event) => {
    if (isProgrammaticScrollRef.current) {
      isProgrammaticScrollRef.current = false;
      return;
    }

    handleScroll(event);

    if (userScrollTimeoutRef.current) {
      clearTimeout(userScrollTimeoutRef.current);
    }

    userScrollTimeoutRef.current = setTimeout(() => {
      setIsUserScrolling(false);
    }, 1000);
  };

  const handleTeacherPress = (teacher) => {
    navigation.navigate("ViewProfile", {
      id: teacher.id,
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
  const renderCard = ({ item: teacher }) => {
    return (
      <View style={styles.cardContainer}>
        <View style={styles.teacherCard}>
          {/* Teacher Header Section */}
          <View style={styles.teacherHeader}>
            <View style={styles.teacherImageContainer}>
              {teacher.profileImage ? (
                <Image
                  source={{ uri: teacher.profileImage }}
                  style={styles.teacherImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.teacherImagePlaceholder}>
                  <Text style={styles.teacherImagePlaceholderText}>
                    {teacher.name?.charAt(0)?.toUpperCase() || "👨‍🏫"}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.teacherBasicInfo}>
              <Text style={styles.teacherName} numberOfLines={2}>
                {teacher.name}
              </Text>
              {teacher.bio && (
                <Text style={styles.teacherBio} numberOfLines={3}>
                  {teacher.bio}
                </Text>
              )}
            </View>
          </View>

          {/* Teacher Details Section */}
          <View style={styles.teacherDetails}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>التخصصات:</Text>
              <Text style={styles.metaValue} numberOfLines={2}>
                {teacher.subjects?.join("، ") || "غير محدد"}
              </Text>
            </View>

            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>المراحل:</Text>
              <Text style={styles.metaValue} numberOfLines={1}>
                {teacher.educationLevels?.join("، ") || "غير محدد"}
              </Text>
            </View>

            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>طريقة التدريس:</Text>
              <Text style={styles.metaValue} numberOfLines={1}>
                {teacher.teachingMethod?.join("، ") || "غير محدد"}
              </Text>
            </View>

            {teacher.sessionPrice && (
              <View style={styles.priceItem}>
                <Text style={styles.metaLabel}>سعر الحصة:</Text>
                <Text style={styles.priceText}>
                  {teacher.sessionPrice} جنيه
                </Text>
              </View>
            )}
          </View>

          {/* Action Buttons */}
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
      </View>
    );
  };

  const renderDotIndicator = () => {
    return (
      <View style={styles.dotContainer}>
        {offers?.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === activeIndex ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    );
  };

  if (!offers || offers.length === 0) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.sliderSection}>
        <FlatList
          ref={flatListRef}
          data={offers}
          renderItem={renderCard}
          keyExtractor={(teacher) => teacher.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          onScrollBeginDrag={handleScrollBeginDrag}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          onScrollEndDrag={handleMomentumScrollEnd}
          initialScrollIndex={0}
          getItemLayout={(data, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          viewabilityConfig={viewabilityConfigRef.current}
          decelerationRate="fast"
          snapToInterval={width}
          snapToAlignment="center"
          contentContainerStyle={styles.flatListContent}
        />
        {offers.length > 1 && renderDotIndicator()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  sliderSection: {
    flex: 1,
    justifyContent: "center",
  },
  flatListContent: {
    alignItems: "center",
  },
  cardContainer: {
    width: width,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md || 16,
    paddingVertical: theme.spacing.sm || 8,
  },
  teacherCard: {
    backgroundColor: theme.colors.white || "#FFFFFF",
    width: width - (theme.spacing.md || 16) * 2,
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
  teacherHeader: {
    flexDirection: "column", // RTL layout
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    marginBottom: theme.spacing.md || 16,
  },
  teacherImageContainer: {
    marginLeft: theme.spacing.md || 16, // Changed from marginRight for RTL
  },
  teacherImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: theme.colors.primary || "#007AFF",
  },
  teacherImagePlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: theme.colors.primary || "#007AFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: theme.colors.primary || "#007AFF",
  },
  teacherImagePlaceholderText: {
    color: theme.colors.white || "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: theme.typography.fontFamily?.bold || "System",
  },
  teacherBasicInfo: {
    flex: 1,
    alignItems: "flex-start",
  },
  teacherName: {
    fontSize: theme.typography.fontSize?.lg || 18,
    fontWeight: "bold",
    fontFamily: theme.typography.fontFamily?.bold || "System",
    color: theme.colors.text?.primary || "#1A1A1A",
    marginBottom: theme.spacing.xs || 4,
    textAlign: "center",
    writingDirection: "rtl",
    lineHeight: 24,
    margin: "auto",
    numberOfLines: 0,
  },
  teacherBio: {
    fontSize: theme.typography.fontSize?.sm || 14,
    fontFamily: theme.typography.fontFamily?.regular || "System",
    color: theme.colors.text?.secondary || "#666666",
    textAlign: "center",
    writingDirection: "rtl",
    lineHeight: 20,
  },
  teacherDetails: {
    marginBottom: theme.spacing.lg || 20,
  },
  metaItem: {
    flexDirection: "row-reverse", // RTL layout
    alignItems: "flex-start",
    marginBottom: theme.spacing.sm || 8,
    paddingVertical: theme.spacing.xs || 4,
  },
  priceItem: {
    flexDirection: "row-reverse", // RTL layout
    alignItems: "center",
    marginBottom: theme.spacing.sm || 8,
    paddingVertical: theme.spacing.xs || 4,
    backgroundColor: theme.colors.background || "#F8F9FA",
    paddingHorizontal: theme.spacing.sm || 8,
    borderRadius: theme.borderRadius.sm || 6,
  },
  metaLabel: {
    fontSize: theme.typography.fontSize?.sm || 14,
    fontWeight: "600",
    fontFamily: theme.typography.fontFamily?.medium || "System",
    color: theme.colors.text?.primary || "#1A1A1A",
    marginLeft: theme.spacing.sm || 8, // Changed from marginRight for RTL
    minWidth: 85,
    textAlign: "right",
    writingDirection: "rtl",
  },
  metaValue: {
    fontSize: theme.typography.fontSize?.sm || 14,
    fontFamily: theme.typography.fontFamily?.regular || "System",
    color: theme.colors.text?.secondary || "#666666",
    flex: 1,
    textAlign: "right",
    writingDirection: "rtl",
    lineHeight: 18,
  },
  priceText: {
    fontSize: theme.typography.fontSize?.md || 16,
    fontWeight: "bold",
    fontFamily: theme.typography.fontFamily?.bold || "System",
    color: theme.colors.primary || "#007AFF",
    flex: 1,
    textAlign: "right",
    writingDirection: "rtl",
  },
  teacherActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: theme.spacing.md || 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border?.light || "#E8E8E8",
    gap: theme.spacing.sm || 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: theme.spacing.sm || 10,
    paddingHorizontal: theme.spacing.xs || 6,
    borderRadius: theme.borderRadius.md || 8,
    alignItems: "center",
    justifyContent: "center",
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
  dotContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: theme.spacing.md || 16,
    paddingVertical: theme.spacing.sm || 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: theme.spacing.xs || 4,
  },
  activeDot: {
    backgroundColor: theme.colors.primary || "#007AFF",
    width: 20,
    height: 8,
    borderRadius: 4,
  },
  inactiveDot: {
    backgroundColor: theme.colors.border?.medium || "#CCCCCC",
    opacity: 0.6,
  },
});

export default Promotion;
