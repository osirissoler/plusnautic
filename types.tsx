/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  NotFound: undefined;
  Language: undefined;
  Step1: undefined;
  Step2: undefined;
  Step3: undefined;
  SignIn: undefined;
  SignUp: undefined;
  MyOrders: undefined;
  MyOrderDetails: undefined;
  Payments: undefined;
  Addresses: undefined;
  ForgotPassword: undefined;
  SelectLanguage: undefined;
  NewAddress: undefined;
  NewCard: undefined;
  ListPharmacies: undefined;
  ListProducts: undefined;
  ProductDetails: undefined;
  Checkout: undefined;
  Forms: undefined;
  ListScreen: undefined;
  Accept: undefined;
  RecordBoats: undefined;
  Marinas: undefined;
  Muelles: undefined;
  Solicitudes: undefined;
  MyBoats: undefined;
  Gestor: undefined;
  CreateInvitations: undefined;
  GuestDetailsScreen: undefined;
  GuestScreen: undefined;
  prueba: undefined;
  App: undefined;
  MarinasScreen: undefined;
  Request: undefined;
  Activities: undefined;
  MyGuestScreen: undefined;
  UpdateUser: undefined;
  Notification: undefined;
  PaymentScreen: undefined;
  ActivitisDetailScreen: undefined;
  BuyTicketsScreen: undefined;
  ShoppingCart: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
>;

export type RootTabParamList = {
  Home: undefined;
  Service: undefined;
  Shopper: undefined;
  Profile: undefined;
  Payments:undefined;
  Activities:undefined;
  Muelles:undefined;
  GuestScreen: undefined;
  Request:undefined;
  App:undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
>;
