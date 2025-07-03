import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
  Animated,
  Dimensions,
} from "react-native";
import { theme } from "../../../../components/Theme";
import { PrimaryButton } from "../../../../components/Buttons";
import { Feather } from "@expo/vector-icons";
import styles from "./SignUpStyles";
import { hashPassword, QUERY, SETDOC } from "../../../../server";
import "react-native-get-random-values";

import { v4 as uuidv4 } from "uuid";
// Import step components
import Step1PersonalInfo from "./Step1PersonalInfo";
import Step2AdditionalInfo from "./Step2AdditionalInfo";
import Step3ResidenceInfo from "./Step3ResidenceInfo";
import Step4TeachingMethod from "./Step4TeachingMethod";
import Step5EducationLevels from "./Step5EducationLevels";
import Step6Subjects from "./Step6Subjects";
import Step7TeacherProfile from "./Step7TeacherProfile";
import Step9Success from "./Step9Success";
import StepIndicator from "./StepIndicator";
import Step8Payment from "./Step8Payment";

const { width: screenWidth } = Dimensions.get("window");

const Signup = ({ setActivePage }) => {
  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 9;

  // Animation values
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Form data state
  const [formData, setFormData] = useState({
    id: uuidv4(),
    // login Info
    phone: "",
    password: "",

    // Payments
    isActive: false,
    pendingApproval: false,
    boosted: false,

    // Personal Info
    name: "",
    email: "",
    whatsapp: "",
    gender: "",
    nationality: "",
    residenceCountry: "",
    residenceCity: "",
    birthDate: new Date(),
    facebookLink: "",

    // Teaching Info
    teachingMethod: [],
    educationLevels: [],
    subjects: [],
    bio: "",
    address: "",
    sessionPrice: "",
    trialSessionLink: "",
    profileImage: "",
  });
  const [allSubjects, setAllSubjects] = useState([]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Validation utilities
  const validators = {
    email: (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },
    phone: (phone) => {
      const phoneRegex = /^[\+]?[0-9]{8,15}$/;
      return phoneRegex.test(phone.replace(/\s/g, ""));
    },
    url: (url) => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    },
    name: (name) => {
      return name.trim().length >= 2;
    },
    price: (price) => {
      return /^\d+(\.\d{1,2})?$/.test(price) && parseFloat(price) > 0;
    },
    age: (birthDate) => {
      const today = new Date();
      const birth = new Date(birthDate);
      const age = today.getFullYear() - birth.getFullYear();
      return age >= 16 && age <= 80;
    },
  };

  useEffect(() => {
    const newSubjects = [];

    formData.educationLevels.forEach((level) => {
      if (level === "ابتدائي") {
        newSubjects.push(...primarySchool);
      }
      if (level === "إعدادي") {
        newSubjects.push(...preparatorySchool);
      }
      if (level === "ثانوي") {
        newSubjects.push(...secondarySchool);
      }
    });

    // Remove duplicates using Set
    const uniqueSubjects = [...new Set(newSubjects)];

    setAllSubjects(uniqueSubjects);
  }, [formData.educationLevels]);

  const secondarySchool = [
    "عربى",
    "انجليزى",
    "رياضيات بحته",
    "فيزياء",
    "كيمياء",
    "أحياء",
    "رياضيات تطبيقية",
    "جيولوجيا",
    "تاريخ",
    "جغرافيا",
    "فلسفه ومنطق",
    "علم نفس واجتماع",
    "دين",
    "فرنساوى",
    "المانى",
    "اسبانى",
    "ايطالى",
    "مواد شرعية",
    "مواد عربية",
    "Pure Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Applied Mathematics",
    "تحفيظ القرآن",
  ];
  const preparatorySchool = [
    "عربى",
    "انجليزى",
    "رياضيات بحته",
    "علوم",
    "دراسات اجتماعيه",
    "دين",
    "الحاسب الآلى",
    "فرنساوى",
    "مواد شرعية",
    "مواد عربية",
    "Math",
    "Science",
    "تحفيظ القرآن",
  ];
  const primarySchool = [
    "عربى",
    "انجليزى",
    "حساب",
    "علوم",
    "دراسات اجتماعيه",
    "دين",
    "تكنولوجيا",
    "فرنساوى",
    "Math",
    "Science",
    "تحفيظ القرآن",
  ];

  // Filter subjects based on search query
  const filteredSubjects = allSubjects.filter((subject) =>
    subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Update form data
  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  // Toggle array values (for checkboxes)
  const toggleArrayValue = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value],
    }));
    // Clear error when user makes selection
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const animateTransition = (direction = "forward") => {
    if (isTransitioning) return;

    setIsTransitioning(true);

    // First animate out the current content
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: direction === "forward" ? -screenWidth : screenWidth,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Prepare the animation for new content (reset slide from opposite side)
      slideAnim.setValue(direction === "forward" ? screenWidth : -screenWidth);
      fadeAnim.setValue(0);

      // Then animate in the new content
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 60,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsTransitioning(false);
      });
    });
  };

  // Navigation functions with animation
  const nextStep = async () => {
    if ((await validateCurrentStep()) && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);

      animateTransition("forward");
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);

      animateTransition("backward");
    }
  };

  const goBack = () => {
    if (currentStep === 1) {
      setActivePage("Login");
    } else if (currentStep === 9) {
      setActivePage("Greeting");
    } else {
      prevStep();
    }
  };

  // Date picker handlers
  const onDateChange = (event, selectedDate) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }

    if (selectedDate) {
      updateFormData("birthDate", selectedDate);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Enhanced validation
  const validateCurrentStep = async () => {
    let stepErrors = {};

    switch (currentStep) {
      case 1:
        const matches = await QUERY("teachers", "phone", "==", formData.phone);

        if (matches.length > 0) {
          stepErrors.phone = "يوجد حساب بالفعل برقم الهاتف هذا";
        }
        if (!formData.phone) {
          stepErrors.phone = "يرجى إدخال رقم الاتصال";
        } else if (!validators.phone(formData.phone)) {
          stepErrors.phone = "يرجى إدخال رقم هاتف صحيح";
        }
        if (!formData.password) {
          stepErrors.password = "يرجى إدخال كلمة المرور";
        }

        break;

      case 2:
        if (!formData.name) {
          stepErrors.name = "يرجى إدخال الاسم";
        } else if (!validators.name(formData.name)) {
          stepErrors.name = "الاسم يجب أن يحتوي على حروف فقط ولا يقل عن حرفين";
        }

        if (!validators.email(formData.email)) {
          stepErrors.email = "يرجى إدخال بريد إلكتروني صحيح";
        }
        if (formData.whatsapp && !validators.phone(formData.whatsapp)) {
          stepErrors.whatsapp = "يرجى إدخال رقم واتساب صحيح";
        }
        if (!formData.gender) {
          stepErrors.gender = "يرجى تحديد الجنس";
        }
        if (!formData.nationality) {
          stepErrors.nationality = "يرجى إدخال الجنسية";
        } else if (formData.nationality.length < 2) {
          stepErrors.nationality = "الجنسية يجب أن تكون على الأقل حرفين";
        }
        if (formData.facebookLink && !validators.url(formData.facebookLink)) {
          stepErrors.facebookLink = "يرجى إدخال رابط فيس بوك صحيح";
        }
        break;

      case 3:
        if (!formData.residenceCountry) {
          stepErrors.residenceCountry = "يرجى إدخال دولة الإقامة";
        }
        if (!validators.age(formData.birthDate)) {
          stepErrors.birthDate = "العمر يجب أن يكون بين 16 و 80 سنة";
        }
        break;

      case 4:
        if (formData.teachingMethod.length === 0) {
          stepErrors.teachingMethod = "يرجى اختيار أسلوب التدريس";
        }
        break;

      case 5:
        if (formData.educationLevels.length === 0) {
          stepErrors.educationLevels = "يرجى اختيار المراحل الدراسية";
        }
        break;

      case 6:
        if (formData.subjects.length === 0) {
          stepErrors.subjects = "يرجى اختيار المواد";
        }
        break;

      case 7:
        if (formData.sessionPrice && !validators.price(formData.sessionPrice)) {
          stepErrors.sessionPrice = "يرجى إدخال سعر صحيح";
        }
        if (
          formData.trialSessionLink &&
          !validators.url(formData.trialSessionLink)
        ) {
          stepErrors.trialSessionLink = "يرجى إدخال رابط صحيح";
        }
        if (formData.bio && formData.bio.length < 10) {
          stepErrors.bio = "النبذة التعريفية يجب أن تكون على الأقل 10 أحرف";
        }
        break;
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  // Handle final submission
  const handleSubmit = async () => {
    if (!(await validateCurrentStep())) return;

    setLoading(true);
    try {
      // Prepare data for submission
      const submissionData = {
        ...formData,
        password: hashPassword(formData.password),
        birthDate: formData.birthDate.toISOString().split("T")[0], // Format date
      };

      console.log("Submitting teacher registration:", submissionData);

      await SETDOC("teachers", formData.id, submissionData, true);

      // Animate to success step
      setCurrentStep(9);

      animateTransition(9, "forward");
    } catch (error) {
      console.error("Error submitting teacher registration:", error);
      Alert.alert("خطأ", "حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  // Auto-scroll step indicator
  const scrollViewRef = useRef(null);

  useEffect(() => {
    if (scrollViewRef.current) {
      const stepWidth = 56;
      const scrollPosition = Math.max(0, (currentStep - 1) * stepWidth - 100);

      scrollViewRef.current.scrollTo({
        x: scrollPosition,
        animated: true,
      });
    }
  }, [currentStep]);

  // Render step content based on step number
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1PersonalInfo
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
          />
        );
      case 2:
        return (
          <Step2AdditionalInfo
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
          />
        );
      case 3:
        return (
          <Step3ResidenceInfo
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
            showDatePicker={showDatePicker}
            setShowDatePicker={setShowDatePicker}
            formatDate={formatDate}
            onDateChange={onDateChange}
          />
        );
      case 4:
        return (
          <Step4TeachingMethod
            formData={formData}
            toggleArrayValue={toggleArrayValue}
            errors={errors}
          />
        );
      case 5:
        return (
          <Step5EducationLevels
            formData={formData}
            toggleArrayValue={toggleArrayValue}
            errors={errors}
          />
        );
      case 6:
        return (
          <Step6Subjects
            formData={formData}
            toggleArrayValue={toggleArrayValue}
            errors={errors}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filteredSubjects={filteredSubjects}
          />
        );
      case 7:
        return (
          <Step7TeacherProfile
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
          />
        );
      case 8:
        return (
          <Step8Payment
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
            handleSubmit={handleSubmit}
          />
        );
      case 9:
        return <Step9Success />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {currentStep === 9 ? "نجاح التسجيل" : "الملف الشخصي"}
        </Text>
        <TouchableOpacity onPress={() => goBack()} disabled={isTransitioning}>
          <Feather
            name="arrow-right"
            size={24}
            color={theme.colors.text.inverse}
          />
        </TouchableOpacity>
      </View>

      {currentStep < 9 && (
        <StepIndicator
          currentStep={currentStep}
          totalSteps={totalSteps}
          scrollViewRef={scrollViewRef}
        />
      )}

      {/* Animated container for step content */}
      <Animated.View
        style={[
          styles.content,
          {
            flex: 1,
            transform: [{ translateX: slideAnim }],
            opacity: fadeAnim,
          },
        ]}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          scrollEnabled={!isTransitioning}
        >
          {renderStepContent()}
        </ScrollView>
      </Animated.View>

      {currentStep < 9 && currentStep != 8 && (
        <View style={styles.nextButtonContainer}>
          {loading ? (
            <ActivityIndicator size="large" color={theme.colors.primary} />
          ) : (
            <PrimaryButton
              title={currentStep === 8 ? "إنشاء حساب" : "التالي"}
              onPress={currentStep === 8 ? handleSubmit : nextStep}
              style={[styles.nextButton, isTransitioning && { opacity: 0.6 }]}
              disabled={isTransitioning}
            />
          )}
        </View>
      )}

      {currentStep === 9 && (
        <Animated.View
          style={[
            styles.navigationButtons,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <PrimaryButton
            title="تسجيل الدخول"
            onPress={() => setActivePage("Login")}
            style={styles.loginButton}
          />
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

export default Signup;
