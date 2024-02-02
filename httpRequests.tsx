import axios from "axios";
import NetInfo from "@react-native-community/netinfo";

const baseUrl = "http://localhost:3005/api";
//'https://plus-nautic-prod-yqmvk.ondigitalocean.app/api';

const fetchData = async (url: string) => {
  const isConnected = await checkInternetConnection();

  if (!isConnected) {
    return { error: "No hay conexión a Internet" };
  }

  try {
    const configuration: any = {
      method: "get",
      url: `${baseUrl}` + url,
    };
    const response = await axios(configuration);
    return response.data;
  } catch (error: any) {
    return error.response
      ? error.response.data
      : { error: "Error desconocido" };
  }
};

const sendData = async (url: string, data: {}) => {
  try {
    const configuration: any = {
      method: "post",
      url: `${baseUrl}` + url,
      data: data,
    };

    const response = await axios(configuration);
    return response.data;
  } catch (error: any) {
    console.log(error, "aqui");
    return error.response
      ? error.response.data
      : { error: "Error desconocido" };
  }
};

const sendDataPut = async (url: string, data: {}) => {
  try {
    const configuration: any = {
      method: "put",
      url: `${baseUrl}` + url,
      data: data,
    };

    const response = await axios(configuration);
    return response.data;
  } catch (error: any) {
    console.log(error.response.data);
    return error.response
      ? error.response.data
      : { error: "Error desconocido" };
  }
};

const deleteData = async (url: string) => {
  try {
    const configuration: any = {
      method: "delete",
      url: `${baseUrl}` + url,
    };
    const response = await axios(configuration);
    return response.data;
  } catch (error: any) {
    return error.response
      ? error.response.data
      : { error: "Error desconocido" };
  }
};

const checkInternetConnection = async () => {
  const netInfoState = await NetInfo.fetch();
  return netInfoState.isConnected;
};

export { fetchData, sendData, sendDataPut, deleteData };
