import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Pressable,
  Animated,
  Linking,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import TopBar from "../../components/TopBar";
import SideMenu from "../../components/Menu";
import { theme } from "../../components/Theme";
import { useNavigation } from "@react-navigation/native";

const PrivacyPolicy = () => {
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

  const policiesArabic = [
    {
      title: "المعلومات التي نقوم بجمعها",
      items: [
        "أ) معلومات يقدمها المستخدم طوعًا:",
        "• الاسم الكامل",
        "• البريد الإلكتروني (في حال توفره)",
        "• رقم الهاتف",
        "• صورة شخصية",
        "• المواد والمراحل التعليمية",
        "• المنصة التعليمية التي يستخدمها المدرس",
        "• فيديو تعريفي",
        "• نبذة تعريفية",
        "• سعر الحصة",
        "• وسيلة التواصل (واتساب / اتصال)",
        "",
        "ب) معلومات يتم جمعها تلقائيًا:",
        "• نوع الجهاز",
        "• نظام التشغيل",
        "• عنوان الـ IP",
        "• بيانات الاستخدام مثل عدد مرات الدخول والصفحات التي تم تصفحها",
      ],
      icon: "person-circle-outline",
    },
    {
      title: "كيفية استخدام المعلومات",
      items: [
        "نقوم باستخدام المعلومات التي يتم جمعها للأغراض التالية:",
        "• إنشاء وتفعيل ملف المستخدم",
        "• عرض البروفايلات للطلاب بشكل منظم",
        "• تسهيل التواصل المباشر بين الطالب والمدرس",
        "• تحسين جودة التطبيق وتجربة المستخدم",
        "• إرسال تنبيهات أو إشعارات تتعلق بالخدمة",
        "• الرد على الاستفسارات والدعم الفني",
        "• الالتزام بالمتطلبات القانونية والتنظيمية",
      ],
      icon: "information-circle-outline",
    },
    {
      title: "مشاركة البيانات",
      items: [
        "نحن لا نشارك بيانات المستخدمين مع أي جهة خارجية لأغراض تجارية أو تسويقية. قد يتم مشاركة بعض البيانات فقط في الحالات التالية:",
        "• مع مزودي خدمات التقنية (مثل Firebase أو خدمات الاستضافة) لتشغيل التطبيق بكفاءة",
        "• في حال طلب قانوني رسمي من الجهات المختصة",
      ],
      icon: "share-social-outline",
    },
    {
      title: "الكوكيز وتقنيات التتبع",
      items: [
        "قد نستخدم تقنيات مثل الكوكيز أو ملفات التتبع لجمع بيانات تحليلية بهدف تحسين تجربة الاستخدام، ويمكن للمستخدم تعطيل هذه التقنية من إعدادات الجهاز.",
      ],
      icon: "analytics-outline",
    },
    {
      title: "أمان المعلومات",
      items: [
        "نحرص على حماية بياناتك باستخدام إجراءات تقنية وتنظيمية مناسبة، تشمل:",
        "• التشفير الجزئي للبيانات",
        "• استخدام خوادم آمنة",
        "• مراقبة الاستخدام غير المصرّح به",
      ],
      icon: "shield-checkmark-outline",
    },
    {
      title: "حقوق المستخدم",
      items: [
        "يحق لكل مستخدم أن:",
        "• يطّلع على بياناته الشخصية",
        "• يطلب تعديل أو حذف بياناته",
        "• يطلب حذف حسابه بالكامل",
        "للتواصل بخصوص أي من هذه النقاط: inone123.2025@gmail.com",
      ],
      icon: "finger-print-outline",
    },
    {
      title: "التحديثات على سياسة الخصوصية",
      items: [
        "قد نقوم بتحديث سياسة الخصوصية من وقت لآخر، وسنقوم بإخطار المستخدمين بالتغييرات الجوهرية داخل التطبيق أو عبر البريد الإلكتروني.",
      ],
      icon: "refresh-outline",
    },
    {
      title: "الموافقة على السياسة",
      items: [
        "باستخدامك لتطبيق In One، فأنت تقر وتوافق على سياسة الخصوصية هذه، وتسمح لنا بمعالجة بياناتك بالطريقة الموضحة أعلاه.",
      ],
      icon: "checkmark-circle-outline",
    },
  ];

  const policiesEnglish = [
    {
      title: "Information We Collect",
      items: [
        "a) Information voluntarily provided by users:",
        "• Full name",
        "• Email address (if available)",
        "• Phone number",
        "• Profile picture",
        "• Educational subjects and levels",
        "• Educational platform used by teacher",
        "• Introduction video",
        "• Profile description",
        "• Lesson price",
        "• Contact method (WhatsApp / Call)",
        "",
        "b) Information collected automatically:",
        "• Device type",
        "• Operating system",
        "• IP address",
        "• Usage data such as login frequency and browsed pages",
      ],
      icon: "person-circle-outline",
    },
    {
      title: "How We Use Information",
      items: [
        "We use the collected information for the following purposes:",
        "• Create and activate user profiles",
        "• Display profiles to students in an organized manner",
        "• Facilitate direct communication between student and teacher",
        "• Improve app quality and user experience",
        "• Send notifications or alerts related to the service",
        "• Respond to inquiries and provide technical support",
        "• Comply with legal and regulatory requirements",
      ],
      icon: "information-circle-outline",
    },
    {
      title: "Data Sharing",
      items: [
        "We do not share user data with any external parties for commercial or marketing purposes. Some data may only be shared in the following cases:",
        "• With technical service providers (such as Firebase or hosting services) to operate the app efficiently",
        "• In case of an official legal request from competent authorities",
      ],
      icon: "share-social-outline",
    },
    {
      title: "Cookies and Tracking Technologies",
      items: [
        "We may use technologies such as cookies or tracking files to collect analytical data to improve user experience. Users can disable this technology from device settings.",
      ],
      icon: "analytics-outline",
    },
    {
      title: "Information Security",
      items: [
        "We ensure the protection of your data using appropriate technical and organizational procedures, including:",
        "• Partial data encryption",
        "• Use of secure servers",
        "• Monitoring unauthorized usage",
      ],
      icon: "shield-checkmark-outline",
    },
    {
      title: "User Rights",
      items: [
        "Every user has the right to:",
        "• Access their personal data",
        "• Request modification or deletion of their data",
        "• Request complete account deletion",
        "For communication regarding any of these points: inone123.2025@gmail.com",
      ],
      icon: "finger-print-outline",
    },
    {
      title: "Privacy Policy Updates",
      items: [
        "We may update the privacy policy from time to time, and we will notify users of substantial changes within the app or via email.",
      ],
      icon: "refresh-outline",
    },
    {
      title: "Policy Consent",
      items: [
        "By using the In One app, you acknowledge and agree to this privacy policy, and allow us to process your data in the manner described above.",
      ],
      icon: "checkmark-circle-outline",
    },
  ];

  const policies = isEnglish ? policiesEnglish : policiesArabic;

  const openEmail = () => {
    Linking.openURL("mailto:inone123.2025@gmail.com");
  };

  return (
    <SafeAreaView style={styles.container}>
      <SideMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        activeRoute="PrivacyPolicy"
      />
      <TopBar
        title={isEnglish ? "Privacy Policy" : "سياسة الخصوصية"}
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
            <Icon
              name="shield-checkmark"
              size={36}
              color={theme.colors.white}
            />
          </View>
          <Text style={styles.heroTitle}>
            {isEnglish ? "Privacy Policy" : "سياسة الخصوصية"}
          </Text>
          <Text style={styles.heroSubtitle}>
            {isEnglish
              ? "At In One, we respect your privacy and are committed to protecting your personal data"
              : "نحن في In One نحترم خصوصيتك وملتزمون بحماية بياناتك الشخصية"}
          </Text>
        </View>

        {/* Introduction Section */}
        <View style={styles.section}>
          <Text style={[styles.paragraph, isEnglish && styles.englishText]}>
            {isEnglish
              ? "This policy aims to explain how we collect information, how we use it, with whom we share it, and how we maintain its confidentiality."
              : "تهدف هذه السياسة إلى شرح كيفية جمعنا للمعلومات، وكيفية استخدامها، ومع من نشاركها، وكيف نحافظ على سريتها."}
          </Text>
        </View>

        {/* Policy Sections */}
        {policies.map((policy, index) => (
          <View key={index} style={styles.policySection}>
            <View style={styles.policyHeader}>
              <View style={styles.policyIconContainer}>
                <Icon name={policy.icon} size={24} color={theme.colors.white} />
              </View>
              <Text
                style={[styles.policyTitle, isEnglish && styles.englishText]}
              >
                {policy.title}
              </Text>
            </View>
            <View style={styles.policyContent}>
              {policy.items.map((item, itemIndex) => (
                <Text
                  key={itemIndex}
                  style={[styles.policyItem, isEnglish && styles.englishText]}
                >
                  {item}
                </Text>
              ))}
            </View>
          </View>
        ))}

        {/* Contact Section */}
        <View style={[styles.section, styles.contactSection]}>
          <Text style={[styles.contactTitle, isEnglish && styles.englishText]}>
            {isEnglish ? "Contact Us" : "التواصل معنا"}
          </Text>
          <Text style={[styles.contactText, isEnglish && styles.englishText]}>
            {isEnglish
              ? "If you have any questions regarding this Privacy Policy, please contact us via our official email:"
              : "في حال وجود أي استفسارات بخصوص سياسة الخصوصية، يرجى التواصل معنا عبر البريد الإلكتروني الرسمي:"}
          </Text>
          <View style={styles.emailContainer}>
            <Icon name="mail" size={18} color={theme.colors.primary} />
            <Text style={styles.emailText}>inone123.2025@gmail.com</Text>
          </View>

          <TouchableOpacity style={styles.contactButton} onPress={openEmail}>
            <Text style={styles.contactButtonText}>
              {isEnglish ? "Send Email" : "إرسال بريد إلكتروني"}
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
    fontSize: 28,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.secondary,
    textAlign: "center",
    paddingHorizontal: theme.spacing.md,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  paragraph: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.primary,
    lineHeight: 24,
    textAlign: "right",
    marginBottom: theme.spacing.md,
  },
  policySection: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    overflow: "hidden",
    ...theme.shadows.sm,
  },
  policyHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  policyIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: theme.spacing.md,
  },
  policyTitle: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
    textAlign: "right",
    flex: 1,
  },
  policyContent: {
    padding: theme.spacing.md,
  },
  policyItem: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.primary,
    lineHeight: 22,
    textAlign: "right",
    marginBottom: theme.spacing.sm,
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

export default PrivacyPolicy;
