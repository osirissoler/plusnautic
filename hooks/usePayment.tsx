import React, { useState, useEffect, useRef } from "react";
import {
  deleteData,
  fetchData,
  sendData,
  sendDataPut,
} from "../httpRequests";
import { showErrorToast, showGoodToast } from "../utils";
import { Alert, Linking } from "react-native";
import { useStripe } from "@stripe/stripe-react-native";

export default function usePayment(item: any) {
  const [showLoading, setShowLoading] = useState<boolean>(false);
  const [publishableKey, setPublishableKey] = useState<string>("");
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [paymentIntentId, setPaymentIntentId] = useState<string>("")

  useEffect(() => {
    // navigation.addListener("blur", () => {
    // setShowAgenda(false);
    // });

    // navigation.addListener("focus", () => {
    // checkStorage("USER_LOGGED", (_id: string) => {
    //   setPatient(_id);
    //   socket.on(`${_id}-reminderMobile`, handleReminderWithSocket);
    // });
    // });
    setShowLoading(true);
    getPublishableKey();
  }, []);

  const getPublishableKey = async () => {
    const url = `/payment/getPublishableKey`;
    const response = await fetchData(url);
    if (response.ok) {
      setPublishableKey(response.publishableKey);
    } else {
      showErrorToast(response.mensaje);
    }
  };

  const fetchPaymentSheetParams = async () => {
    const url = `/payment/getPaymentIntent`;
    const data = {
      metadata: {
        ...item,
        // name: userData.name,
        // email: userData.email,
        // phone: userData.phone,
      },
      description: `Pago de producto de tiendas`,
      price: item.total,
    };

    const response = await sendData(url, data);
    if (!response.ok) {
      // showErrorToast(response.mensaje);
      showErrorToast("Error al procesar el pago");
      return {};
    }

    const initialUrl = await Linking.getInitialURL();
    const { paymentIntent } = response;
    console.log(response.paymentIntentId);
    setPaymentIntentId(response.paymentIntentId);

    return {
      paymentIntent,
      initialUrl,
    };
  };

  const initializePaymentSheet = async (callback: () => void) => {
    // if (appointment) {
    //   takeAnotherAppoimentsByPatients(appointmentSelected, appointment._id);
    //   return;
    // }

    const { paymentIntent, initialUrl } = await fetchPaymentSheetParams();

    const { error } = await initPaymentSheet({
      merchantDisplayName: "Plusnautic",
      paymentIntentClientSecret: paymentIntent,
      returnURL: initialUrl ?? undefined,
      // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
      //methods that complete payment after a delay, like SEPA Debit and Sofort.
      allowsDelayedPaymentMethods: true,
      defaultBillingDetails: {
        // name: userData.name,
      },
    });

    if (!error) {
      openPaymentSheet(callback);
      return true;
    } else {
      setShowDialog(true);
      return false;
    }
  };

  const openPaymentSheet = async (callback: () => void) => {
    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
      setShowDialog(false);
    } else {
      //   takeAppoimentsByPatients(appointmentSelected);
      splitThePayment()
      // callback();
      console.log("Hecho");
    }
  };

   const splitThePayment = async () => {
     const url = `/payment/splitThePayment`;
     const data = {
       description: `Pago de producto de tiendas`,
       user_id: item.user_id,
       paymentIntentId,
     };

     const response = await sendData(url, data);
           console.log(response)

     if (!response.ok) {
       // showErrorToast(response.mensaje);
       showErrorToast("Error al procesar el pago");
       return
     }
   };

  return {
    showLoading,
    setShowLoading,
    publishableKey,
    initializePaymentSheet,
    showDialog,
    setShowDialog,
  };
}
