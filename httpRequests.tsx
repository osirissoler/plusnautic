import axios from 'axios';

const baseUrl = 'http://localhost:3005/api'
//  'https://plus-nautic-prod-yqmvk.ondigitalocean.app/api';

const fetchData = async (url: string) => {
	try {
		const configuration: any = {
			method: 'get',
			url: `${baseUrl}` + url
		};
		const response = await axios(configuration);
		return response.data;
	} catch (error: any) {
		return error.response.data;
	}
};

const sendData = async (url: string, data: {}) => {
	
	try {
		const configuration: any = {
			method: 'post',
			url: `${baseUrl}` + url,
			data: data
		};

		
		const response = await axios(configuration);
		return response.data;
	} catch (error: any) {
		console.log(error.response.data);
		return error.response.data;
	}
};

const sendDataPut = async (url: string, data: {}) => {
	try {
		const configuration: any = {
			method: 'put',
			url: `${baseUrl}` + url,
			data: data
		};

		const response = await axios(configuration);
		return response.data;
	} catch (error: any) {
		console.log(error.response.data);
		return error.response.data;
	}
};


const deleteData = async (url: string) => {
	try {
		const configuration: any = {
			method: 'delete',
			url: `${baseUrl}` + url
		};
		const response = await axios(configuration);
		return response.data;
	} catch (error: any) {
		return error.response.data;
	}
};

export { fetchData, sendData, sendDataPut, deleteData };
