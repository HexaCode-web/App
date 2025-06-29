import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

import { SETDOC, GETDOC, UPLOADPHOTO, DELETEDOC } from "../../server";
import { theme, componentStyles } from "../../components/Theme";
import TopBar from "../../components/TopBar";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import SideMenu from "../../components/Menu";
const TeacherProfileScreen = ({ route }) => {
  const User = useSelector((state) => state.auth);
  const teacherId = route?.params?.id ? route?.params.id : User.id;
  const [menuVisible, setMenuVisible] = React.useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };
  const authToChange = teacherId === User.id;
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

  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({ ...teacherData });
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [activatingAccount, setActivatingAccount] = useState(false);
  const [subjectOptions, setSubjectOptions] = useState([]);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  // Options for dropdowns
  const genderOptions = ["ذكر", "أنثى"];
  const [subscriptionPrice, setSubscriptionPrice] = useState(79);
  const fetchPrice = async () => {
    try {
      const PriceContainer = await GETDOC("Settings", "Price");
      setSubscriptionPrice(PriceContainer.Price);
    } catch (error) {
      console.error("Error fetching payment methods:", error);
      Alert.alert("خطأ", "فشل في جلب طرق الدفع");
    }
  };
  useFocusEffect(
    useCallback(() => {
      fetchPrice();
    }, [fetchPrice])
  );

  const educationLevelOptions = ["ابتدائي", "إعدادي", "ثانوي"];
  const handleSubjectsChange = (array) => {
    const newSubjects = [];

    array.forEach((level) => {
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

    setSubjectOptions(uniqueSubjects);
  };
  useEffect(() => {
    handleSubjectsChange(teacherData.educationLevels);
  }, [teacherData.educationLevels]);

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
  ];
  const primarySchool = [
    "عربى",
    "انجليزى",
    "حساب",
    "علوم",
    "دراسات اجتماعية",
    "دين",
    "تكنولوجيا",
    "فرنساوى",
    "Math",
    "Science",
  ];

  const teachingMethodOptions = ["عبر الإنترنت", "وجهاً لوجه", "مختلط"];
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
        setEditedData(data);
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

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const result = await SETDOC("teachers", teacherId, editedData, false);
      if (result.success) {
        setTeacherData({ ...editedData });
        setIsEditing(false);
        Alert.alert("نجح", "تم تحديث البيانات بنجاح");
      } else {
        Alert.alert("خطأ", "حدث خطأ أثناء حفظ البيانات");
      }
    } catch (error) {
      Alert.alert("خطأ", "حدث خطأ أثناء حفظ البيانات");
      console.error("Error saving data:", error);
    } finally {
      setLoading(false);
    }
  };

  // New function to handle account activation
  const handleActivateAccount = async () => {
    Alert.alert(
      "تفعيل الحساب",
      "هل تريد تفعيل حسابك؟ سيظهر ملفك الشخصي في نتائج البحث للطلاب.",
      [
        {
          text: "إلغاء",
          style: "cancel",
        },
        {
          text: "تفعيل",
          onPress: confirmActivateAccount,
        },
      ]
    );
  };

  const confirmActivateAccount = async () => {
    setActivatingAccount(true);
    try {
      navigation.navigate("PaymentScreen", {
        onPaymentComplete: async (paymentData) => {
          try {
            const updatedData = {
              ...teacherData,
              pendingApproval: true,
              paymentData,
            };
            await SETDOC("teachers", teacherId, updatedData, false);
            Alert.alert("تم اراسل طلب التفعيل", "تم اراسل طلب تفعيل حسابك.");
            navigation.navigate("Profile");
          } catch (error) {
            Alert.alert("خطأ", "حدث خطأ أثناء تفعيل الحساب");
          }
        },
        paymentReason: "subscription",
        requiredAmount: subscriptionPrice,
      });
    } catch (error) {
      console.error("Error activating account:", error);
      Alert.alert("خطأ", "حدث خطأ أثناء تفعيل الحساب");
    } finally {
      setActivatingAccount(false);
    }
  };

  const validateForm = () => {
    if (!editedData.name.trim()) {
      Alert.alert("خطأ", "الاسم مطلوب");
      return false;
    }
    if (!editedData.email.trim()) {
      Alert.alert("خطأ", "البريد الإلكتروني مطلوب");
      return false;
    }
    if (!editedData.phone.trim()) {
      Alert.alert("خطأ", "رقم الهاتف مطلوب");
      return false;
    }
    return true;
  };

  const handleCancel = () => {
    setEditedData({ ...teacherData });
    setIsEditing(false);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "تأكيد حذف الحساب",
      "هل أنت متأكد من رغبتك في حذف الحساب؟ هذا الإجراء لا يمكن التراجع عنه.",
      [
        {
          text: "إلغاء",
          style: "cancel",
        },
        {
          text: "حذف",
          style: "destructive",
          onPress: confirmDeleteAccount,
        },
      ]
    );
  };

  const confirmDeleteAccount = async () => {
    setLoading(true);
    try {
      await DELETEDOC("teachers", teacherId);
      Alert.alert("تم الحذف", "تم حذف الحساب بنجاح", [
        {
          text: "موافق",
          onPress: async () => {
            dispatch(logout());
            await AsyncStorage.removeItem("userSession");
          },
        },
      ]);
    } catch (error) {
      console.error("Error deleting account:", error);
      Alert.alert("خطأ", "حدث خطأ أثناء حذف الحساب");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  const handleArraySelection = (item, arrayKey) => {
    const currentArray = editedData[arrayKey] || [];
    const newArray = currentArray.includes(item)
      ? currentArray.filter((i) => i !== item)
      : [...currentArray, item];
    if (arrayKey === "educationLevels") {
      handleSubjectsChange(newArray);
    }
    setEditedData({ ...editedData, [arrayKey]: newArray });
  };

  const requestImagePermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("خطأ", "نحتاج إلى إذن للوصول إلى المعرض");
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestImagePermissions();
    if (!hasPermission) return;

    Alert.alert("اختر صورة", "من أين تريد اختيار الصورة؟", [
      { text: "إلغاء", style: "cancel" },
      { text: "المعرض", onPress: () => launchImagePicker("library") },
      { text: "الكاميرا", onPress: () => launchImagePicker("camera") },
    ]);
  };

  const launchImagePicker = async (source) => {
    try {
      let result;

      if (source === "camera") {
        const cameraPermission =
          await ImagePicker.requestCameraPermissionsAsync();
        if (cameraPermission.status !== "granted") {
          Alert.alert("خطأ", "نحتاج إلى إذن للوصول إلى الكاميرا");
          return;
        }

        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.7,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.7,
        });
      }

      if (!result.canceled && result.assets[0]) {
        await uploadProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("خطأ", "حدث خطأ أثناء اختيار الصورة");
    }
  };

  const uploadProfileImage = async (imageUri) => {
    setUploadingImage(true);
    try {
      const imagePath = `teachers/${teacherId}/profile.jpg`;
      const downloadUrl = await UPLOADPHOTO(imagePath, imageUri);

      setEditedData({ ...editedData, profileImage: downloadUrl });

      // Auto-save the profile image
      await SETDOC(
        "teachers",
        teacherId,
        { ...editedData, profileImage: downloadUrl },
        false
      );
      setTeacherData({ ...teacherData, profileImage: downloadUrl });

      Alert.alert("نجح", "تم رفع الصورة بنجاح");
    } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert("خطأ", "حدث خطأ أثناء رفع الصورة");
    } finally {
      setUploadingImage(false);
    }
  };

  const renderField = (
    label,
    value,
    key,
    multiline = false,
    editable = true
  ) => {
    if (!isEditing) {
      return (
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.value}>
            {Array.isArray(value) ? value.join(", ") : value || "غير محدد"}
          </Text>
        </View>
      );
    }

    if (key === "gender") {
      return (
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>{label}</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => openModal("gender")}
          >
            <Text style={styles.dropdownText}>
              {editedData.gender || "اختر الجنس"}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (["educationLevels", "subjects", "teachingMethod"].includes(key)) {
      return (
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>{label}</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => openModal(key)}
          >
            <Text style={styles.dropdownText}>
              {editedData[key]?.length > 0
                ? editedData[key].join(", ")
                : `اختر ${label}`}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
          style={[styles.input, multiline && styles.multilineInput]}
          value={editedData[key] || ""}
          onChangeText={(text) => setEditedData({ ...editedData, [key]: text })}
          multiline={multiline}
          numberOfLines={multiline ? 4 : 1}
          editable={editable}
          textAlign="right"
        />
      </View>
    );
  };

  const renderModal = () => {
    let options = [];
    let isMultiSelect = false;

    switch (modalType) {
      case "gender":
        options = genderOptions;
        break;
      case "educationLevels":
        options = educationLevelOptions;
        isMultiSelect = true;
        break;
      case "subjects":
        options = subjectOptions;
        isMultiSelect = true;
        break;
      case "teachingMethod":
        options = teachingMethodOptions;
        isMultiSelect = true;
        break;
    }

    return (
      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {modalType === "gender"
                ? "اختر الجنس"
                : modalType === "educationLevels"
                ? "اختر المستويات التعليمية"
                : modalType === "subjects"
                ? "اختر المواد"
                : "اختر طريقة التدريس"}
            </Text>

            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    isMultiSelect &&
                      editedData[modalType]?.includes(item) &&
                      styles.selectedItem,
                  ]}
                  onPress={() => {
                    if (isMultiSelect) {
                      handleArraySelection(item, modalType);
                    } else {
                      setEditedData({ ...editedData, [modalType]: item });
                      setShowModal(false);
                    }
                  }}
                >
                  <Text
                    style={[
                      styles.modalItemText,
                      isMultiSelect &&
                        editedData[modalType]?.includes(item) &&
                        styles.selectedItemText,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.cancelButtonText}>إلغاء</Text>
              </TouchableOpacity>
              {isMultiSelect && (
                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={() => setShowModal(false)}
                >
                  <Text style={styles.confirmButtonText}>تأكيد</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TopBar title="الملف الشخصي" toggleMenu={toggleMenu} />

      <SideMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        activeRoute="PrivacyPolicy"
      />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Account Activation Warning - Only show if user can edit and account is inactive */}
          {authToChange && teacherData.isActive === false && (
            <View style={[componentStyles.card.container, styles.warningCard]}>
              <View style={styles.warningHeader}>
                <Text style={styles.warningIcon}>⚠️</Text>
                <Text style={[componentStyles.card.title, styles.warningTitle]}>
                  حساب غير مفعل
                </Text>
              </View>
              {teacherData.pendingApproval ? (
                <>
                  <Text style={styles.warningText}>حسابك في المراجعة</Text>
                </>
              ) : (
                <>
                  <Text style={styles.warningText}>
                    حسابك غير مفعل حالياً ولن يظهر في نتائج البحث للطلاب. لجذب
                    المزيد من الطلاب، يرجى تفعيل حسابك.
                  </Text>
                  <Text style={styles.warningText}>
                    يمكنك الان تفعيل الحساب باشتراك {subscriptionPrice} جنية
                    شهريا
                  </Text>

                  <TouchableOpacity
                    style={[componentStyles.button.primary]}
                    onPress={handleActivateAccount}
                    disabled={activatingAccount}
                  >
                    <Text style={componentStyles.button.text.primary}>
                      {activatingAccount ? "جاري التفعيل..." : "تفعيل الحساب"}
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}

          {/* Profile Image */}
          <View style={componentStyles.card.container}>
            <Text style={componentStyles.card.title}>الصورة الشخصية</Text>

            <View style={styles.imageContainer}>
              <TouchableOpacity
                style={styles.imageWrapper}
                onPress={isEditing ? pickImage : null}
                disabled={uploadingImage}
              >
                {teacherData.profileImage ? (
                  <Image
                    source={{ uri: teacherData.profileImage }}
                    style={styles.profileImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.placeholderImage}>
                    <Text style={styles.placeholderText}>
                      {isEditing ? "اضغط لإضافة صورة" : "لا توجد صورة"}
                    </Text>
                  </View>
                )}

                {uploadingImage && (
                  <View style={styles.uploadingOverlay}>
                    <ActivityIndicator
                      size="large"
                      color={theme.colors.primary}
                    />
                    <Text style={styles.uploadingText}>جاري الرفع...</Text>
                  </View>
                )}
              </TouchableOpacity>

              {isEditing && teacherData.profileImage && (
                <TouchableOpacity
                  style={styles.changeImageButton}
                  onPress={pickImage}
                  disabled={uploadingImage}
                >
                  <Text style={styles.changeImageText}>تغيير الصورة</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Basic Information */}
          <View style={componentStyles.card.container}>
            <Text style={componentStyles.card.title}>المعلومات الأساسية</Text>

            {renderField("الاسم", teacherData.name, "name")}
            {renderField("البريد الإلكتروني", teacherData.email, "email")}
            {renderField("الجنس", teacherData.gender, "gender")}
            {renderField("تاريخ الميلاد", teacherData.birthDate, "birthDate")}
            {renderField("الجنسية", teacherData.nationality, "nationality")}
          </View>

          {/* Location Information */}
          <View style={componentStyles.card.container}>
            <Text style={componentStyles.card.title}>معلومات السكن</Text>

            {renderField(
              "البلد",
              teacherData.residenceCountry,
              "residenceCountry"
            )}
            {renderField("المدينة", teacherData.residenceCity, "residenceCity")}
            {renderField("العنوان", teacherData.address, "address", true)}
          </View>

          {/* Professional Information */}
          <View style={componentStyles.card.container}>
            <Text style={componentStyles.card.title}>المعلومات المهنية</Text>

            {renderField(
              "المستويات التعليمية",
              teacherData.educationLevels,
              "educationLevels"
            )}
            {renderField("المواد", teacherData.subjects, "subjects")}
            {renderField(
              "طريقة التدريس",
              teacherData.teachingMethod,
              "teachingMethod"
            )}
            {renderField(
              "سعر الجلسة",
              teacherData.sessionPrice,
              "sessionPrice"
            )}
            {renderField("نبذة عني", teacherData.bio, "bio", true)}
          </View>

          {/* Contact Information */}
          <View style={componentStyles.card.container}>
            <Text style={componentStyles.card.title}>وسائل التواصل</Text>

            {renderField("واتساب", teacherData.whatsapp, "whatsapp")}
            {renderField("فيسبوك", teacherData.facebookLink, "facebookLink")}
            {renderField(
              "رابط الجلسة التجريبية",
              teacherData.trialSessionLink,
              "trialSessionLink"
            )}
          </View>
          {authToChange && isEditing && (
            <View style={componentStyles.card.container}>
              <Text style={componentStyles.card.title}>ادارة الحساب</Text>

              {renderField("رقم الهاتف", teacherData.phone, "phone")}
              <TouchableOpacity
                style={[componentStyles.button.primary, styles.Danger]}
                onPress={handleDeleteAccount}
                disabled={loading}
              >
                <Text style={styles.confirmButtonText}>
                  {loading ? "جاري الحذف..." : "حذف الحساب"}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Save Button */}
          {isEditing && (
            <TouchableOpacity
              style={[componentStyles.button.primary, styles.saveButton]}
              onPress={handleSave}
              disabled={loading}
            >
              <Text style={componentStyles.button.text.primary}>
                {loading ? "جاري الحفظ..." : "حفظ التغييرات"}
              </Text>
            </TouchableOpacity>
          )}
          {authToChange && (
            <TouchableOpacity
              onPress={isEditing ? handleCancel : () => setIsEditing(true)}
              style={[
                componentStyles.button.primary,
                isEditing ? styles.Danger : styles.saveButton,
              ]}
            >
              <Text style={componentStyles.button.text.primary}>
                {isEditing ? "إلغاء" : "تعديل"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {renderModal()}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerButton: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  headerButtonText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.medium,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.md,
  },
  // Warning Card Styles
  warningCard: {
    backgroundColor: "#FFF3CD",
    borderColor: "#FFD60A",
    borderWidth: 1,
    marginBottom: theme.spacing.md,
  },
  warningHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  warningIcon: {
    fontSize: 24,
    marginRight: theme.spacing.xs,
  },
  warningTitle: {
    color: "#B45309",
    flex: 1,
  },
  warningText: {
    fontSize: theme.typography.fontSize.sm,
    color: "#B45309",
    textAlign: "right",
    lineHeight: 20,
    marginBottom: theme.spacing.md,
  },
  activateButton: {
    backgroundColor: "#28A745",
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
  value: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    fontFamily: theme.typography.fontFamily.regular,
    textAlign: "right",
    paddingVertical: theme.spacing.sm,
  },
  input: {
    ...componentStyles.input.field,
    textAlign: "right",
  },
  multilineInput: {
    height: 80,
    textAlignVertical: "top",
    paddingTop: theme.spacing.sm,
  },
  dropdown: {
    ...componentStyles.input.field,
    justifyContent: "center",
  },
  Danger: {
    backgroundColor: "red",
  },
  dropdownText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    textAlign: "right",
  },
  saveButton: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    width: "90%",
    maxHeight: "70%",
  },
  modalTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
    textAlign: "right",

    marginBottom: theme.spacing.lg,
  },
  modalItem: {
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  selectedItem: {
    backgroundColor: theme.colors.primaryLight + "20",
  },
  modalItemText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    textAlign: "right",
  },
  selectedItemText: {
    color: theme.colors.primary,
    fontFamily: theme.typography.fontFamily.medium,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: theme.spacing.lg,
  },
  modalButton: {
    flex: 1,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    marginHorizontal: theme.spacing.xs,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: theme.colors.border.light,
  },
  confirmButton: {
    backgroundColor: theme.colors.primary,
  },
  cancelButtonText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.medium,
  },
  confirmButtonText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.medium,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  imageWrapper: {
    position: "relative",
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
  uploadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  uploadingText: {
    marginTop: theme.spacing.xs,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
    fontFamily: theme.typography.fontFamily.medium,
  },
  changeImageButton: {
    marginTop: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.sm,
  },
  changeImageText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.medium,
  },
});

export default TeacherProfileScreen;
