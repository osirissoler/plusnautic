/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import { ColorSchemeName, View, Linking, Alert } from "react-native";
import { checkStorage } from "../components/Shared";

import useColorScheme from "../hooks/useColorScheme";
import { LanguageContext } from "../LanguageContext";
import AddressesScreen from "../screens/AddressesScreen";
import CheckoutScreen from "../screens/CheckoutScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import FormsScreen from "../screens/FormsScreen";
import HomeScreen from "../screens/HomeScreen";
import LanguageScreen from "../screens/LanguageScreen";
import RecordBoats from "../screens/RecordBoats";
import ListPharmaciesScreen from "../screens/ListPharmaciesScreen";
import ListProductsScreen from "../screens/ListProductsScreen";
import MyOrderDetailsScreen from "../screens/MyOrderDetailsScreen";
import MyOrdersScreen from "../screens/MyOrdersScreen";

import NewCardScreen from "../screens/NewCardScreen";
import NotFoundScreen from "../screens/NotFoundScreen";
import ProductDetailsScreen from "../screens/ProductDetailsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import RentScreen from "../screens/RentScreen";
import PaymentsScreent1 from "../screens/PaymentsScreent1";
import SelectLanguageScreen from "../screens/SelectLanguageScreen";
import ServiceScreen from "../screens/ServiceScreen";
import ShopperScreen from "../screens/ShopperScreen";
import ShoppingCartScreen from "../screens/ShoppingCartScreen";
import SignInScreen from "../screens/SignInScreen";
import SignUpScreen from "../screens/SignUpScreen";
import Step1Screen from "../screens/Steps/Step1Screen";
import Step2Screen from "../screens/Steps/Step2Screen";
import Step3Screen from "../screens/Steps/Step3Screen";
import ActivityScreen from "../screens/ActivitisScreen";
import AcceptedScreen from "../screens/Maintenance/AcceptedScreen";
import ListScreen from "../screens/Maintenance/ListScreen";

import { RootStackParamList, RootTabParamList } from "../types";
import LinkingConfiguration from "./LinkingConfiguration";
import SelectMarinasScreen from "../screens/SelectMarinasScreen";
import MuellesScreen from "../screens/MuellesScreen";
import SendServicesScreen from "../screens/SendServicesScreen";
import MyBoats from "../screens/MyBoatsScreen";
import ProfilegestorScreen from "../screens/gestor/ProfilegestorScreen";
import InvitationScreen from "../screens/InvitationScreen";
import GuestScreen from "../screens/GuestScreen";
import GuestDetailsScreen from "../screens/GuestDetailsScreen";
import MarinasScreen from "../screens/MarinasScreen";
import { Image } from "react-native-elements";
import MyGuestScreen from "../screens/MyGuestScreen";
import UpdateUserDataScreen from "../screens/UpdateUserDataScreen";
import NotificationScreen from "../screens/NotificationScreen";

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator({ route }: any) {
  const { translation } = React.useContext(LanguageContext);
  let showBack;

  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitle: translation.t("headerButtonBackText"), // Back
      }}
    >
      <Stack.Screen
        name="Language"
        component={LanguageScreen}
        options={{ headerShown: false, animation: "fade" }}
      />
      <Stack.Screen
        name="Gestor"
        component={ProfilegestorScreen}
        initialParams={{ showBack } as any}
        options={{ headerShown: true, animation: "fade" }}
      />
      <Stack.Screen
        name="CreateInvitations"
        component={InvitationScreen}
        options={{
          headerTitle: translation.t("CreateInvitation"),
          headerStyle: { backgroundColor: "#fff" },
          headerTitleStyle: { color: "#000", fontWeight: "400" },
          animation: "fade",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="GuestScreen"
        component={GuestScreen}
        options={{
          headerTitle: translation.t("Guest"),
          headerStyle: { backgroundColor: "#fff" },
          headerTitleStyle: { color: "#000", fontWeight: "400" },
          animation: "slide_from_right",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="Marinas"
        component={SelectMarinasScreen}
        initialParams={{ showBack } as any}
        options={{
          headerTitle: translation.t("Marinas"),
          headerStyle: { backgroundColor: "#fff" },
          headerTitleStyle: { color: "#000", fontWeight: "400" },
          animation: "slide_from_right",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="RecordBoats"
        component={RecordBoats}
        options={{
          headerTitle: translation.t("RegisterBoat"),
          headerStyle: { backgroundColor: "#fff" },
          headerTitleStyle: { color: "#000", fontWeight: "400" },
          animation: "slide_from_right",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="Muelles"
        component={MuellesScreen}
        options={{ headerShown: true, animation: "fade" }}
      />
      <Stack.Screen
        name="Solicitudes"
        component={SendServicesScreen}
        options={{ headerShown: true, headerTitle: translation.t("Requests"),
          animation: "fade" }}
      />

      <Stack.Screen
        name="Step1"
        component={Step1Screen}
        options={{ headerShown: false, animation: "fade" }}
      />
      <Stack.Screen
        name="Step2"
        component={Step2Screen}
        options={{ headerShown: false, animation: "fade" }}
      />
      <Stack.Screen
        name="Step3"
        component={Step3Screen}
        options={{ headerShown: false, animation: "fade" }}
      />
      <Stack.Screen
        name="SignIn"
        component={SignInScreen}
        options={{ headerShown: false, animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{ headerShown: false, animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{
          headerTitle: translation.t(
            "headerTitleForgotPassword"
          ) /* Forgot Password */,
          headerStyle: { backgroundColor: "#fff" },
          headerTitleStyle: { color: "#000", fontWeight: "400" },
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen
        name="SelectLanguage"
        component={SelectLanguageScreen}
        options={{
          headerTitle: translation.t("languageTitle"),
          headerStyle: { backgroundColor: "#fff" },
          headerTitleStyle: { color: "#000", fontWeight: "400" },
          animation: "slide_from_right",
        }}
      />

      <Stack.Screen
        name="MyOrders"
        component={MyOrdersScreen}
        options={{
          headerTitle: translation.t("headerTitleMyOrders") /* My Orders */,
          headerStyle: { backgroundColor: "#fff" },
          headerTitleStyle: { color: "#000", fontWeight: "400" },
        }}
      />
      <Stack.Screen
        name="MyOrderDetails"
        component={MyOrderDetailsScreen}
        options={{
          headerStyle: { backgroundColor: "#fff" },
          headerTitleStyle: { color: "#000", fontWeight: "400" },
        }}
      />
      <Stack.Screen
        name="MyBoats"
        component={MyBoats}
        options={{
          headerTitle: translation.t("MyBoats") /* Payments */,
          headerStyle: { backgroundColor: "#fff" },
          headerTitleStyle: { color: "#000", fontWeight: "400" },
        }}
      />
      <Stack.Screen
        name="Addresses"
        component={AddressesScreen}
        options={{
          headerTitle: translation.t("headerTitleAddresses") /* Addresses */,
          headerStyle: { backgroundColor: "#fff" },
          headerTitleStyle: { color: "#000", fontWeight: "400" },
        }}
      />

      <Stack.Screen
        name="NewCard"
        component={NewCardScreen}
        options={{
          headerTitle: translation.t("headerTitleNewCard") /* New Card */,
          headerStyle: { backgroundColor: "#fff" },
          headerTitleStyle: { color: "#000", fontWeight: "400" },
        }}
      />
      {/* <Stack.Screen
				name='ListPharmacies'
				component={ListPharmaciesScreen}
				options={{
					headerTitle: translation.t('headerTitleSelectPharmacy') ,
					headerStyle: { backgroundColor: '#fff' },
					headerTitleStyle: { color: '#000', fontWeight: '400' },
					headerBackVisible: false,
					gestureEnabled: false
				}}
			/> */}
      <Stack.Screen
        name="ListProducts"
        component={ListProductsScreen}
        options={{
          headerTitle: translation.t(
            "headerTitleSearchProduct"
          ) /* Search Products */,
          headerStyle: { backgroundColor: "#fff" },
          headerTitleStyle: { color: "#000", fontWeight: "400" },
        }}
      />
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
        options={{
          headerTitle: translation.t(
            "headerTitleProductDetails"
          ) /* Product Details */,
          headerStyle: { backgroundColor: "#fff" },
          headerTitleStyle: { color: "#000", fontWeight: "400" },
        }}
      />
      <Stack.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={{
          headerTitle: translation.t("headerTitleCheckout") /* Checkout */,
          headerStyle: { backgroundColor: "#fff" },
          headerTitleStyle: { color: "#000", fontWeight: "400" },
        }}
      />
      <Stack.Screen
        name="Forms"
        component={FormsScreen}
        options={{
          headerTitle: translation.t("AplicationForOccunpacy") /* Checkout */,
          headerStyle: { backgroundColor: "#fff" },
          headerTitleStyle: { color: "#000", fontWeight: "400" },
        }}
      />
      <Stack.Screen
        name="ListScreen"
        component={ListScreen}
        options={{
          headerTitle: translation.t("listServices") /* Search Products */,
          headerStyle: { backgroundColor: "#fff" },
          headerTitleStyle: { color: "#000", fontWeight: "400" },
          animation: "slide_from_right",
        }}
      />
      {/* AcceptedScreen */}
      <Stack.Screen
        name="Accept"
        component={AcceptedScreen}
        options={{
          // headerTitle: translation.t('listServices') /* Search Products */,
          headerStyle: { backgroundColor: "#fff" },
          headerTitleStyle: { color: "#000", fontWeight: "400" },
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="GuestDetailsScreen"
        component={GuestDetailsScreen}
        options={{
          // headerTitle: translation.t('listServices') /* Search Products */,
          headerStyle: { backgroundColor: "#fff" },
          headerTitleStyle: { color: "#000", fontWeight: "400" },
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="MarinasScreen"
        component={MarinasScreen}
        options={{
          headerTitle: translation.t('Marinas') /* Search Products */,
          headerStyle: { backgroundColor: "#fff" },
          headerTitleStyle: { color: "#000", fontWeight: "400" },
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="Request"
        component={ServiceScreen}
        options={{
          headerTitle: translation.t('Request') /* Search Products */,
          headerStyle: { backgroundColor: "#fff" },
          headerTitleStyle: { color: "#000", fontWeight: "400" },
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="Activities"
        component={ActivityScreen}
        options={{
          headerTitle: translation.t('Activities') /* Search Products */,
          headerStyle: { backgroundColor: "#fff" },
          headerTitleStyle: { color: "#000", fontWeight: "400" },
          animation: "slide_from_right",
        }}
      />
       <Stack.Screen
        name="MyGuestScreen"
        component={MyGuestScreen}
        options={{
          headerTitle: translation.t("recivedInvitation"),
          headerStyle: { backgroundColor: "#fff" },
          headerTitleStyle: { color: "#000", fontWeight: "400" },
          animation: "slide_from_right",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="UpdateUser"
        component={UpdateUserDataScreen}
        options={{
          headerTitle: translation.t("MyInformation"),
          headerStyle: { backgroundColor: "#fff" },
          headerTitleStyle: { color: "#000", fontWeight: "400" },
          animation: "fade",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="Notification"
        component={NotificationScreen}
        options={{
          headerTitle: "Notification",
          headerStyle: { backgroundColor: "#fff" },
          headerTitleStyle: { color: "#000", fontWeight: "400" },
          animation: "fade",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="Root"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: "Oops!" }}
      />
    </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator({ navigation, route }: any) {
  const colorScheme = useColorScheme();
  const { translation } = React.useContext(LanguageContext);

  const goHome = () => {
    //	console.log('Dios')
    checkStorage("USER_PHARMACY", (response: any) => {
      const pharmacy = JSON.parse(response);
      navigation.reset({
        index: 0,
        routes: [
          {
            name: "Root",
            params: {
              phId: 536,
            },
            screen: "Home",
          },
        ],
      });
    });
  };

  const supportedURL = "https://tierrabuenaapp.page.link/tierra";
  const goAbordo = async() => {
    const supported = await Linking.canOpenURL(supportedURL);
    if (supported) {
      await Linking.openURL(supportedURL);
    } else {
      Alert.alert(`Don't know how to open this URL: ${supportedURL}`);
    }
  };

  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: "#5f7ceb",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopColor: "rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          title: translation.t("BottomTabHomeText"),
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="home" color={color} img={false} />
          ),
        }}
        initialParams={route.params}
        listeners={{
          tabPress: (e) => {
            console.log(e);
            goHome();
          },
        }}
      />
      {/* ListScreen component={ServiceScreen} */}
      {/* <BottomTab.Screen
        name="Request"
        component={ServiceScreen}
        options={{
          headerShown: false,
          title: translation.t("BottomTabServiceText"),
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="receipt" color={color} />
          ),
        }}
        initialParams={route.params}
      /> */}
      {/* <BottomTab.Screen
        name="Service"
        component={ListScreen}
        options={{
          headerShown: false,
          title: translation.t("Request"),
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="file-tray" color={color} />
          ),
        }}
        initialParams={route.params}
      /> */}
      {/* <BottomTab.Screen
				name='ShoppingCart'
				component={ShoppingCartScreen}
				options={{
					title: '',
					headerShown: false,
					tabBarIcon: ({ color }) => (
						<View
							style={{
								height: 60,
								width: 60,
								borderRadius: 100,
								backgroundColor: '#128780',
								marginBottom: 8,
								justifyContent: 'center',
								alignItems: 'center'
							}}
						>
							<TabBarIcon name='basket-outline' color={'#fff'} />
						</View>
					)
				}}
			/> */}
      {/* <BottomTab.Screen
				name='Shopper'
				component={ShopperScreen}
				options={{
					headerShown: false,
					tabBarIcon: ({ color }) => <TabBarIcon name='cart-outline' color={color} />
				}}
				initialParams={route.params}
			/> */}
      {/* <BottomTab.Screen
				name='Rent'
				component={RentScreen}
				options={{
					headerShown: false,
					title: 'Rent', 
					tabBarIcon: ({ color }) => <TabBarIcon name='cash-outline' color={color} />
				}}
				initialParams={route.params}
			/> */}
      {/* <BottomTab.Screen
				name='Payments'
				component={RentScreen}
				options={{
					headerShown: false,
					title: 'Payments',
					tabBarIcon: ({ color }) => <TabBarIcon name='cash-outline' color={color} />
				}}
				initialParams={route.params}
			/> */}

      {/* activities */}
      {/* <BottomTab.Screen
        name="Activities"
        component={ActivityScreen}
        options={{
          headerShown: false,
          title: translation.t("Activities"),
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="play-circle" color={color} />
          ),
        }}
        initialParams={route.params}
      /> */}
      <BottomTab.Screen
        name="App"
        component={HomeScreen}
        options={{
          headerShown: false,
          title: "",
          tabBarIcon: ({ color }) => (
            <View
              style={{
                height: 70,
                width: 70,
                borderRadius: 100,
                backgroundColor: "#5f7ceb",
                marginBottom: 8,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TabBarIcon name="apps-sharp" color={color} img={true} />
            </View>
          ),
        }}
        initialParams={route.params}
        listeners={{
          tabPress: (e:any) => {
            goAbordo();
          },
        }}
      />
      {/* <BottomTab.Screen
				name='Request'
				component={MyOrdersScreen}
				options={{
					headerShown: false,
					title: 'Requests', 
					tabBarIcon: ({ color }) => <TabBarIcon name="reader-outline" color={color} />
				}}
				initialParams={route.params}
			/> */}
      <BottomTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: false,
          title: translation.t("BottomTabProfileText"),
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="person" color={color} img={false} />
          ),
        }}
        initialParams={route.params}
      />
    </BottomTab.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
  img: boolean;
}) {
  if (props.img) {
    return (
      <Image
        style={{ height: 80, width: 80 }}
        source={require("../assets/images/abordo.png")}
      />
    );
  } else {
    return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
  }
}
