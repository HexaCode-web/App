import Icon from "react-native-vector-icons/Ionicons";
import { componentStyles, theme } from "./Theme";
import { TouchableOpacity, View, StyleSheet, Text } from "react-native";

import AntDesign from "@expo/vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";

const TopBar = ({ toggleMenu, title, handleReturn, hasReturn = true }) => {
  const navigate = useNavigation();
  const handleLogOut = async () => {
    if (handleReturn) {
      handleReturn();
    } else {
      navigate.goBack();
    }
  };
  return (
    <View style={componentStyles.header.container}>
      <View style={styles.headerItem}>
        <TouchableOpacity onPress={toggleMenu}>
          <Icon name="menu" size={24} color={theme.colors.white} />
        </TouchableOpacity>
        <Text style={componentStyles.header.title}>{title}</Text>
      </View>
      {hasReturn && (
        <View style={styles.headerItem}>
          <AntDesign
            name="right"
            size={24}
            color="white"
            onPress={handleLogOut}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    marginTop: 50,
  },
  notificationsCountStyle: {
    backgroundColor: "red",
    width: 20,
    height: 20,
    borderRadius: 50,
    position: "absolute",
    left: -5,
    top: -5,
  },
  notificationsCountTextStyle: {
    color: "white",
    fontSize: theme.typography.fontSize.sm,
    textAlign: "center",
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 18,
    marginRight: 10,
    height: 36,
    paddingHorizontal: 8,
  },
  searchIcon: {
    paddingHorizontal: 8,
  },
  searchInput: {
    flex: 1,
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.md,
    paddingVertical: 8,
    paddingRight: 5,
  },
  clearButton: {
    padding: 5,
  },
  cancelButton: {
    marginLeft: 10,
  },
  cancelText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.sm,
  },
});

export default TopBar;
