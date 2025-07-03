// HomeScreen.js - Updated with WhatsApp link in tab bar
import { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { NavigationContainer } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Linking } from "react-native"; // Add this import

import { AntDesign, FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { firstLogin } from "./redux/slices/authSlice";
import { GETDOC } from "./server";
const Tab = createBottomTabNavigator();
import HomeScreen from "./Pages/HomeScreen/HomeScreen";
import Introduction from "./Pages/Introduction/Introduction";

import * as Font from "expo-font";
import Profile from "./Pages/Profile/Profile";
import { theme } from "./components/Theme";
import EducationLevelScreen from "./Pages/EducationLevelScreen/EducationLevelScreen";
import TeachersListingScreen from "./Pages/TeachersListingScreen/TeachersListingScreen";
import PrivacyPolicy from "./Pages/PrivacyPolicy/PrivcayPolicy";
import AboutUs from "./Pages/AboutUs/AboutUs";
import PaymentScreen from "./Pages/PaymentScreen/PaymentScreen";
import BoostProfile from "./Pages/BoostProfile/BoostProfile";
import CustomerServiceChat from "./Pages/customerServiceChat/customerServiceChat";
import ViewProfile from "./Pages/ViewProfile/ViewProfile";

const Home = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const isLoggedIn = useSelector((state) => state.auth);

  const loadFonts = async () => {
    await Font.loadAsync({
      "Cairo-Regular": require("./assets/fonts/Cairo-Regular.ttf"),
      "Cairo-Bold": require("./assets/fonts/Cairo-Bold.ttf"),
      "Cairo-Medium": require("./assets/fonts/Cairo-Medium.ttf"),
      "Cairo-Light": require("./assets/fonts/Cairo-Light.ttf"),
    });
    setFontsLoaded(true);
    setLoading(false);
  };

  useEffect(() => {
    loadFonts();
  }, []);

  useEffect(() => {
    const checkSession = async () => {
      const session = await AsyncStorage.getItem("userSession");

      if (session) {
        const { userID } = JSON.parse(session);

        const userDoc = await GETDOC("teachers", userID);

        if (userDoc) {
          dispatch(firstLogin(userDoc));
        }
      }
      setLoading(false);
    };

    checkSession();
  }, []);

  useEffect(() => {
    const hideSplashScreen = async () => {
      if (!loading && fontsLoaded) {
        await SplashScreen.hideAsync(); // Hide the splash screen
      }
    };

    hideSplashScreen();
  }, [loading]);

  // Function to handle WhatsApp link
  const openWhatsApp = () => {
    Linking.openURL(`https://wa.me/+201017150105`);
  };

  if (loading) {
    return null;
  }
  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <Tab.Navigator
          initialRouteName="home"
          screenOptions={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarActiveTintColor: "white",

            tabBarInactiveTintColor: "gray",
            tabBarStyle: {
              backgroundColor: "white",
              justifyContent: "center",
              alignItems: "center",
              paddingBottom: 0,
              paddingTop: 5,

              borderTopWidth: 1,
            },
          }}
        >
          <Tab.Screen
            name="home"
            options={{
              tabBarIcon: ({ focused }) => (
                <FontAwesome
                  name="home"
                  size={24}
                  color={focused ? theme.colors.primary : "#666666"}
                />
              ),
            }}
          >
            {(screenProps) => <HomeScreen {...screenProps} loading={loading} />}
          </Tab.Screen>
          <Tab.Screen
            name="EducationLevel"
            options={{ tabBarItemStyle: { display: "none" } }}
          >
            {(screenProps) => <EducationLevelScreen {...screenProps} />}
          </Tab.Screen>
          <Tab.Screen
            name="Boost"
            options={{
              headerShown: false,
              tabBarItemStyle: {
                display: isLoggedIn === "Guest" ? "none" : "block",
              },
              tabBarIcon: ({ focused }) => (
                <FontAwesome
                  name="bolt"
                  size={24}
                  color={focused ? theme.colors.primary : "#666666"}
                />
              ),
            }}
          >
            {(screenProps) => <BoostProfile {...screenProps} />}
          </Tab.Screen>
          <Tab.Screen
            name="chat"
            component={CustomerServiceChat}
            options={{
              tabBarIcon: ({ focused }) => (
                <AntDesign
                  name="customerservice"
                  size={24}
                  color={focused ? theme.colors.primary : "#666666"}
                />
              ),
            }}
            listeners={{
              tabPress: (e) => {
                e.preventDefault();
                openWhatsApp();
              },
            }}
          />
          <Tab.Screen
            name="AboutUs"
            component={AboutUs}
            options={{ tabBarItemStyle: { display: "none" } }}
          />
          <Tab.Screen
            name="ViewProfile"
            component={ViewProfile}
            options={{ tabBarItemStyle: { display: "none" } }}
          />
          <Tab.Screen
            name="PaymentScreen"
            component={PaymentScreen}
            options={{ tabBarItemStyle: { display: "none" } }} // Hide item from tabBar
          />
          <Tab.Screen
            name="PrivacyPolicy"
            component={PrivacyPolicy}
            options={{ tabBarItemStyle: { display: "none" } }}
          />
          <Tab.Screen
            name="TeachersListing"
            options={{
              tabBarItemStyle: {
                display: "none",
              },
            }}
          >
            {(screenProps) => <TeachersListingScreen {...screenProps} />}
          </Tab.Screen>
          <Tab.Screen
            name="Profile"
            initialParams={{ id: isLoggedIn.id }} // Add this line
            options={{
              tabBarItemStyle: {
                display: isLoggedIn === "Guest" ? "none" : "block",
              },
              tabBarIcon: ({ focused }) => (
                <FontAwesome
                  name="user"
                  size={24}
                  color={focused ? theme.colors.primary : "#666666"}
                />
              ),
            }}
          >
            {(screenProps) => (
              <Profile {...screenProps} params={{ id: "123" }} />
            )}
          </Tab.Screen>
        </Tab.Navigator>
      ) : (
        <Introduction />
      )}
    </NavigationContainer>
  );
};

export default Home;
