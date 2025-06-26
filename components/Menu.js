// SideMenu.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Linking,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { theme } from "./Theme";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MenuItem = ({ icon, title, onPress, isActive = false }) => {
  return (
    <TouchableOpacity
      style={[styles.menuItem, isActive && styles.activeMenuItem]}
      onPress={onPress}
    >
      <Icon
        name={icon}
        size={24}
        color={isActive ? theme.colors.primary : theme.colors.text.secondary}
      />
      <Text
        style={[
          styles.menuItemText,
          isActive && { color: theme.colors.primary },
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const SideMenu = ({ visible, onClose, activeRoute = "Home" }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const navigateTo = (route) => {
    if (navigation) {
      navigation.navigate(route);
    }
    onClose();
  };

  if (!visible) return null;
  const handleLogOut = async () => {
    dispatch(logout());
    await AsyncStorage.removeItem("userSession");
  };
  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.dismissArea} onPress={onClose} />

      <View style={styles.menuContainer}>
        <View style={styles.closeButtonContainer}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Icon name="close" size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.menuItems}>
          <MenuItem
            icon="information-circle"
            title="من نحن"
            onPress={() => navigateTo("AboutUs")}
            isActive={activeRoute === "AboutUs"}
          />
          <MenuItem
            icon="help-circle-sharp"
            title="المساعدة"
            onPress={() => Linking.openURL(`https://wa.me/+201017150105`)}
            isActive={activeRoute === "Help"}
          />

          <MenuItem
            icon="lock-closed"
            title="سياسة الخصوصية "
            onPress={() => navigateTo("PrivacyPolicy")}
            isActive={activeRoute === "PrivacyPolicy"}
          />
          <MenuItem
            icon="log-out-outline"
            title="تسجيل الخروج"
            onPress={() => {
              handleLogOut();
            }}
          />
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    flexDirection: "row",
    zIndex: 1000,
  },
  dismissArea: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  menuContainer: {
    width: "75%",
    backgroundColor: theme.colors.white,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  closeButtonContainer: {
    alignItems: "flex-end",
    padding: theme.spacing.sm,
  },
  closeButton: {
    padding: theme.spacing.xs,
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: theme.spacing.sm,
  },
  profileImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  profileInitial: {
    color: theme.colors.white,
    fontSize: 32,
    fontFamily: theme.typography.fontFamily.bold,
  },
  userName: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  userRole: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.secondary,
  },
  menuItems: {
    flex: 1,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  activeMenuItem: {
    backgroundColor: "rgba(0, 132, 255, 0.1)",
  },
  menuItemText: {
    marginLeft: theme.spacing.md,
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.primary,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.md,
  },
});

export default SideMenu;
