// export const formatter = new Intl.NumberFormat('en-US', {
//     style: 'currency',
//     currency: 'USD',

import Toast from "react-native-root-toast";

//     // These options are needed to round to whole numbers if that's what you want.
//     //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
//     //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
// });

export const formatter = (money: any) => {
  return money
    ? " $" + money.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")
    : "0.00";
};

export const formatter2 = (money: any) => {
  return money ? +money.toFixed(1).replace(/\d(?=(\d{3})+\.)/g, "$&,") : "0.00";
};

export const hideLoadingModal = (
  callback: Function,
  setShowLoading: Function
) => {
  setShowLoading(false);
  callback();
};

export const showErrorToast = (message: string) => {
  Toast.show(message, {
    duration: Toast.durations.LONG,
    containerStyle: { backgroundColor: "red", width: "80%" },
  });
};

export const showGoodToast = (message: string) => {
  Toast.show(message, {
    duration: Toast.durations.LONG,
    containerStyle: { backgroundColor: "green", width: "80%" },
  });
};
