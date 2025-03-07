// notificationHandler.js
import * as Notifications from "expo-notifications";

export const useHandleNotifications = (navigation: any) => {
  // Configura el handler de notificaciones
  Notifications.setNotificationHandler({
    handleNotification: async (notification) => {
      // Obtiene el valor de `shouldShowAlert` enviado desde el backend
      const shouldShowAlert = notification.request.content.data.shouldShowAlert;

      return {
        shouldShowAlert: shouldShowAlert !== undefined ? shouldShowAlert : true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      };
    },
  });

  // Listener para recibir notificaciones
  const notificationListener = Notifications.addNotificationReceivedListener(
    (notification) => {
      console.log("Notification received!", notification);
    }
  );

  // Listener para manejar el clic en la notificación
  const responseListener =
    Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      if (data.screen) {
        console.log(data.rate)
        navigation.navigate(data.screen, { rate: data.rate });
      }
    });

  // Retorna función para limpiar listeners
  return () => {
    Notifications.removeNotificationSubscription(notificationListener);
    Notifications.removeNotificationSubscription(responseListener);
  };
};
