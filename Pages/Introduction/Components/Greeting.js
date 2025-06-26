// IntroductionScreen.js
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { theme } from "../../../components/Theme";
import { PrimaryButton, SecondaryButton } from "../../../components/Buttons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { login } from "../../../redux/slices/authSlice";

const { width } = Dimensions.get("window");

// Sample data for the slider cards
const introCards = [
  {
    id: "1",
    image: require("../../../assets/Icon.png"),
    title: "أهلاً بك في تطبيق In One",
    description: `أول منصة مصرية احترافية لعرض بروفايلات المدرسين الأونلاين، للظهور أمام آلاف الطلاب بتقييمات حقيقية وتواصل مباشر.
انطلق الآن وكن ضمن النخبة في أكبر تجمع تعليمي رقمي في مصر.`,
  },
  {
    id: "2",
    image: require("../../../assets/Icon.png"),
    title: "أهلاً بك في تطبيق In One",
    description: `اختر مدرسك من بين آلاف البروفايلات الحقيقية، وشاهد التقييمات والتفاصيل بدقة، وتواصل مباشرة بدون وسطاء.
منصة تعليمية ذكية هي الأولى من نوعها في مصر، مصممة خصيصًا لك`,
  },
];

const Greeting = ({ setActivePage }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [reachedEnd, setReachedEnd] = useState(false);
  const flatListRef = useRef(null);
  const timerRef = useRef(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const userScrollTimeoutRef = useRef(null);
  const viewabilityConfigRef = useRef({
    itemVisiblePercentThreshold: 50,
  });
  const dispatch = useDispatch();
  useEffect(() => {
    if (activeIndex === 1) setReachedEnd(true);
  }, [activeIndex]);
  // Function to handle auto scrolling
  const goToNextSlide = () => {
    // Don't auto-scroll if user is interacting
    if (isUserScrolling) return;

    // Calculate next index (loop back to start if at the end)
    const nextIndex = (activeIndex + 1) % introCards.length;

    // Only proceed if we have a valid FlatList reference
    if (flatListRef.current && nextIndex < introCards.length) {
      try {
        flatListRef.current.scrollToIndex({
          animated: true,
          index: nextIndex,
          viewPosition: 0,
        });
      } catch (error) {
        // Fallback if scrollToIndex fails
        console.log("Error scrolling to index: ", error);
      }
    }
  };

  // Handle actual scroll events from user or programmatic scrolling
  const handleScroll = (event) => {
    if (!event || !event.nativeEvent) return;

    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);

    if (index >= 0 && index < introCards.length && index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  // Auto-scroll timer management
  const startAutoScrollTimer = () => {
    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Set up new timer
    timerRef.current = setTimeout(() => {
      goToNextSlide();
    }, 3000);
  };

  // Set up auto-scrolling when component mounts or activeIndex changes
  useEffect(() => {
    // Only start auto-scroll if user isn't interacting
    if (!isUserScrolling) {
      startAutoScrollTimer();
    }

    // Clean up timer when component unmounts or dependencies change
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [activeIndex, isUserScrolling]);

  // Handle user interaction with slider
  const handleScrollBeginDrag = () => {
    // Clear timer when user starts scrolling
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setIsUserScrolling(true);

    // Clear any existing user scroll timeout
    if (userScrollTimeoutRef.current) {
      clearTimeout(userScrollTimeoutRef.current);
    }
  };

  const handleMomentumScrollEnd = (event) => {
    // Update active index based on where the scroll ended
    handleScroll(event);

    // Set a delay before resuming auto-scroll
    if (userScrollTimeoutRef.current) {
      clearTimeout(userScrollTimeoutRef.current);
    }

    userScrollTimeoutRef.current = setTimeout(() => {
      setIsUserScrolling(false);
    }, 1000); // Wait 1 second after user stops interacting before resuming
  };

  const renderCard = ({ item }) => {
    return (
      <View style={styles.cardContainer}>
        <Image
          source={item.image}
          style={styles.cardImage}
          resizeMode="contain"
        />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardDescription}>{item.description}</Text>
        </View>
      </View>
    );
  };

  const renderDotIndicator = () => {
    return (
      <View style={styles.dotContainer}>
        {introCards.map((_, index) => (
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
  const guestLogin = async () => {
    dispatch(login("Guest"));

    await AsyncStorage.setItem("userSession", "Guest");
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.sliderSection}>
        <FlatList
          ref={flatListRef}
          data={introCards}
          renderItem={renderCard}
          keyExtractor={(item) => item.id}
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
          maintainVisibleContentPosition={{
            minIndexForVisible: 0,
          }}
        />
        guestLogin
        {renderDotIndicator()}
      </View>

      {reachedEnd ? (
        <View style={styles.authSection}>
          <PrimaryButton
            title="تسجيل دخول"
            onPress={() => setActivePage("Login")}
            style={styles.loginButton}
            textStyle={styles.loginButtonText}
          />
          <SecondaryButton
            title="دخول كطالب"
            onPress={guestLogin}
            style={styles.loginButton}
          />

          <View style={styles.signupContainer}>
            <TouchableOpacity onPress={() => setActivePage("Signup")}>
              <Text style={styles.signupLink}>سجل الان</Text>
            </TouchableOpacity>
            <Text style={styles.signupText}>ليس لديك حساب؟ </Text>
          </View>
        </View>
      ) : (
        <View style={styles.authSection}>
          <PrimaryButton
            title="التالي"
            onPress={goToNextSlide}
            style={styles.loginButton}
            textStyle={styles.loginButtonText}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: theme.spacing.xxl,
  },
  sliderSection: {
    flex: 0.8, // 80% of the screen
    justifyContent: "center",
  },
  cardContainer: {
    width,
    padding: theme.spacing.md,
  },
  cardImage: {
    width: "50%",
    height: 150,
    marginHorizontal: "auto",

    marginVertical: theme.spacing.xl,
  },
  cardContent: {
    padding: theme.spacing.sm,
  },
  cardTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
    textAlign: "center",
  },
  cardDescription: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.secondary,
    textAlign: "center",
    lineHeight: theme.typography.lineHeight.md,
  },
  dotContainer: {
    flex: 1,

    flexDirection: "row",
    justifyContent: "center",
    marginTop: theme.spacing.md,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: theme.borderRadius.round,
    marginHorizontal: theme.spacing.xs,
  },
  activeDot: {
    backgroundColor: theme.colors.primary,
  },
  inactiveDot: {
    backgroundColor: theme.colors.border.medium,
  },
  authSection: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
  },
  loginButton: {
    margin: theme.spacing.sm,
    width: "100%",
    padding: theme.spacing.md,
  },
  loginButtonText: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.medium,
  },
  signupContainer: {
    flexDirection: "row",
    marginTop: theme.spacing.md,
    justifyContent: "center",
  },
  signupText: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.secondary,
  },
  signupLink: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.primary,
  },
});

export default Greeting;
