import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Pressable,
  Linking,
  Animated,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import TopBar from "../../components/TopBar";
import SideMenu from "../../components/Menu";
import { theme } from "../../components/Theme";
import { useNavigation } from "@react-navigation/native";

const AboutUs = () => {
  const [menuVisible, setMenuVisible] = React.useState(false);
  const [isEnglish, setIsEnglish] = React.useState(false);
  const navigation = useNavigation();
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const toggleLanguage = () => {
    setIsEnglish(!isEnglish);
  };

  // Animation reference for switch
  const switchAnimValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(switchAnimValue, {
      toValue: isEnglish ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [isEnglish]);

  const aboutSectionsArabic = [
    {
      title: "من نحن",
      content:
        "In One هو تطبيق تعليمي مبتكر، يُعد الأول من نوعه في مصر والوطن العربي، تم تطويره خصيصًا ليكون حلقة الوصل بين الطلاب والمدرسين الأونلاين بطريقة احترافية وآمنة، بعيدًا عن أي وسطاء أو عمولات.",
      icon: "information-circle-outline",
    },
    {
      title: "فلسفتنا التعليمية",
      content:
        "نحن نؤمن أن جودة التعليم تبدأ من الاختيار الصحيح للمدرس، ولذلك قمنا ببناء منصة متكاملة تمكّن الطالب من تصفح عشرات البروفايلات التعليمية المصممة بعناية، والتي تضم كافة التفاصيل التي يحتاجها لاتخاذ قراره بسهولة ووضوح.",
      icon: "school-outline",
    },
    {
      title: "ما نقدمه للطلاب",
      items: [
        "بيانات واضحة عن كل مدرس",
        "المواد والمراحل التي يدرّسها",
        "فيديو تعريفي بأسلوبه وطريقة شرحه",
        "تقييمات حقيقية من طلاب سابقين",
        "إمكانية التواصل المباشر معه عبر واتساب أو الاتصال",
      ],
      icon: "people-outline",
    },
    {
      title: "ما نقدمه للمدرسين",
      content:
        "كما نؤمن أيضًا أن لكل مدرس الحق في أن يظهر للعالم بأفضل صورة ممكنة، لذلك نتيح له عبر In One إنشاء بروفايل احترافي يشمل معلوماته، خبراته، سعر الحصة، ومنصة الشرح، مع دعم كامل من فريقنا لإعداد محتوى جذاب وتصميم بصري يعبر عنه.",
      icon: "person-outline",
    },
    {
      title: "رسالتنا",
      content:
        "نسعى إلى تقديم تجربة تعليمية مختلفة، تضع احتياجات الطالب في المقدمة، وتمنح المدرس أدوات العرض والتسويق الذاتي التي يستحقها، وكل ذلك في بيئة تقنية سهلة الاستخدام ومتوافقة مع احتياجات التعليم الحديث.",
      icon: "heart-outline",
    },
    {
      title: "استقلاليتنا",
      content:
        "نحن لا نتدخل في تفاصيل الحصص أو طرق الشرح أو الأسعار، فنحن لسنا مركزًا تعليميًا، بل منصة عرض مستقلة تمنح كل مدرس الحرية الكاملة في التواصل مع طلابه وتنظيم طريقته الخاصة.",
      icon: "shield-checkmark-outline",
    },
    {
      title: "أهدافنا",
      items: [
        "الارتقاء بالتعليم الأونلاين",
        "خلق مجتمع تعليمي مفتوح ومتوازن",
        "إتاحة فرص حقيقية لكل من يسعى للتعلّم أو التدريس عن بُعد",
      ],
      icon: "flag-outline",
    },
    {
      title: "رؤيتنا المستقبلية",
      content:
        "رؤيتنا تمتد لتشمل كافة أنحاء مصر والدول العربية، ونطمح أن نكون الاختيار الأول لكل طالب يبحث عن تعليم موثوق، ولكل مدرس يسعى للظهور بشكل احترافي.",
      icon: "telescope-outline",
    },
  ];

  const aboutSectionsEnglish = [
    {
      title: "Who We Are",
      content:
        "In One is an innovative educational app, the first of its kind in Egypt and the Arab world, specially developed to be the bridge between students and online teachers in a professional and secure way, away from any intermediaries or commissions.",
      icon: "information-circle-outline",
    },
    {
      title: "Our Educational Philosophy",
      content:
        "We believe that quality education starts with choosing the right teacher. That's why we built an integrated platform that enables students to browse dozens of carefully designed educational profiles with all the details they need to make their decision easily and clearly.",
      icon: "school-outline",
    },
    {
      title: "What We Offer Students",
      items: [
        "Clear information about each teacher",
        "Subjects and grades they teach",
        "Introductory video of their style and teaching method",
        "Real reviews from previous students",
        "Direct communication via WhatsApp or phone call",
      ],
      icon: "people-outline",
    },
    {
      title: "What We Offer Teachers",
      content:
        "We also believe that every teacher has the right to present themselves to the world in the best possible way. Through In One, we enable them to create a professional profile including their information, experience, session price, and teaching platform, with full support from our team to prepare engaging content and visual design.",
      icon: "person-outline",
    },
    {
      title: "Our Mission",
      content:
        "We strive to provide a different educational experience that puts student needs first and gives teachers the presentation and self-marketing tools they deserve, all in a user-friendly technical environment compatible with modern education needs.",
      icon: "heart-outline",
    },
    {
      title: "Our Independence",
      content:
        "We don't interfere in session details, teaching methods, or prices. We are not an educational center, but an independent display platform that gives each teacher complete freedom to communicate with their students and organize their own approach.",
      icon: "shield-checkmark-outline",
    },
    {
      title: "Our Goals",
      items: [
        "Elevating online education",
        "Creating an open and balanced educational community",
        "Providing real opportunities for anyone seeking to learn or teach remotely",
      ],
      icon: "flag-outline",
    },
    {
      title: "Our Vision",
      content:
        "Our vision extends to cover all of Egypt and Arab countries. We aspire to be the first choice for every student looking for reliable education and every teacher seeking to appear professionally.",
      icon: "telescope-outline",
    },
  ];

  const aboutSections = isEnglish ? aboutSectionsEnglish : aboutSectionsArabic;

  const openWhatsapp = () => {
    Linking.openURL(`https://wa.me/+201505803540`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <SideMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        activeRoute="AboutUs"
      />
      <TopBar
        title={isEnglish ? "About Us" : "من نحن"}
        toggleMenu={toggleMenu}
        handleReturn={() => {
          navigation.goBack();
        }}
      />

      <View style={styles.languageSwitchContainer}>
        <Text
          style={[styles.languageText, !isEnglish && styles.activeLanguageText]}
        >
          العربية
        </Text>

        <Pressable onPress={toggleLanguage} style={styles.customSwitch}>
          <Animated.View
            style={[
              styles.switchThumb,
              {
                transform: [
                  {
                    translateX: switchAnimValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [2, 24],
                    }),
                  },
                ],
              },
            ]}
          />
        </Pressable>

        <Text
          style={[styles.languageText, isEnglish && styles.activeLanguageText]}
        >
          English
        </Text>
      </View>

      <ScrollView style={styles.contentContainer}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroIconContainer}>
            <Icon name="rocket" size={36} color={theme.colors.white} />
          </View>
          <Text style={styles.heroTitle}>
            {isEnglish ? "In One" : "In One"}
          </Text>
          <Text style={styles.heroSubtitle}>
            {isEnglish
              ? "Where education begins with trust"
              : "حيث يبدأ التعليم من الثقة"}
          </Text>
        </View>

        {/* About Sections */}
        {aboutSections.map((section, index) => (
          <View key={index} style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconContainer}>
                <Icon
                  name={section.icon}
                  size={24}
                  color={theme.colors.white}
                />
              </View>
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
            <View style={styles.sectionContent}>
              {section.content && (
                <Text
                  style={[styles.sectionText, isEnglish && styles.englishText]}
                >
                  {section.content}
                </Text>
              )}
              {section.items &&
                section.items.map((item, itemIndex) => (
                  <View key={itemIndex} style={styles.listItem}>
                    <Icon
                      name="checkmark-circle"
                      size={16}
                      color={theme.colors.primary}
                      style={styles.listIcon}
                    />
                    <Text
                      style={[styles.listText, isEnglish && styles.englishText]}
                    >
                      {item}
                    </Text>
                  </View>
                ))}
            </View>
          </View>
        ))}

        {/* Closing Message */}
        <View style={styles.closingSection}>
          <View style={styles.closingIconContainer}>
            <Icon name="heart" size={28} color={theme.colors.primary} />
          </View>
          <Text style={[styles.closingText, isEnglish && styles.englishText]}>
            {isEnglish
              ? "Welcome to In One… where education begins with trust."
              : "مرحبًا بك في In One … حيث يبدأ التعليم من الثقة."}
          </Text>
        </View>

        {/* Contact Section */}
        <View style={[styles.section, styles.contactSection]}>
          <Text style={styles.contactTitle}>
            {isEnglish ? "Get in Touch" : "تواصل معنا"}
          </Text>
          <Text style={[styles.contactText, isEnglish && styles.englishText]}>
            {isEnglish
              ? "Have questions about In One? We're here to help!"
              : "لديك أسئلة حول In One؟ نحن هنا للمساعدة!"}
          </Text>
          <View style={styles.emailContainer}>
            <Icon name="mail" size={18} color={theme.colors.primary} />
            <Text style={styles.emailText}>webm850@gmail.com</Text>
          </View>

          <TouchableOpacity style={styles.contactButton} onPress={openWhatsapp}>
            <Text style={styles.contactButtonText}>
              {isEnglish ? "Contact Us" : "تواصل معنا"}
            </Text>
            {isEnglish ? (
              <AntDesign
                name="arrowright"
                size={18}
                color={theme.colors.white}
              />
            ) : (
              <AntDesign
                name="arrowleft"
                size={18}
                color={theme.colors.white}
              />
            )}
          </TouchableOpacity>
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
  contentContainer: {
    flex: 1,
    padding: theme.spacing.md,
  },
  heroSection: {
    alignItems: "center",
    marginVertical: theme.spacing.lg,
  },
  heroIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.md,
    elevation: 5,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  heroTitle: {
    fontSize: 32,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.secondary,
    textAlign: "center",
  },
  sectionContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    overflow: "hidden",
    ...theme.shadows.sm,
  },
  sectionHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  sectionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
    textAlign: "right",
    flex: 1,
  },
  sectionContent: {
    padding: theme.spacing.md,
  },
  sectionText: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.primary,
    lineHeight: 26,
    textAlign: "right",
  },
  listItem: {
    flexDirection: "row-reverse",
    alignItems: "flex-start",
    marginBottom: theme.spacing.sm,
  },
  listIcon: {
    marginLeft: theme.spacing.sm,
    marginTop: 2,
  },
  listText: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.primary,
    lineHeight: 24,
    textAlign: "right",
    flex: 1,
  },
  closingSection: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    alignItems: "center",
    marginBottom: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  closingIconContainer: {
    marginBottom: theme.spacing.md,
  },
  closingText: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.primary,
    textAlign: "right",
    lineHeight: 28,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  contactSection: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  contactTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.md,
    textAlign: "center",
  },
  contactText: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.primary,
    lineHeight: 24,
    textAlign: "right",
    marginBottom: theme.spacing.md,
  },
  emailContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.lg,
  },
  emailText: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.primary,
  },
  contactButton: {
    backgroundColor: theme.colors.primary,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.sm,
    alignSelf: "center",
  },
  contactButtonText: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.white,
  },
  languageSwitchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  languageText: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.secondary,
    marginHorizontal: theme.spacing.md,
  },
  activeLanguageText: {
    color: theme.colors.primary,
    fontFamily: theme.typography.fontFamily.bold,
  },
  customSwitch: {
    width: 48,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#e0e0e0",
    padding: 2,
    justifyContent: "center",
    position: "relative",
  },
  switchThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.primary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  englishText: {
    textAlign: "left",
  },
});

export default AboutUs;
