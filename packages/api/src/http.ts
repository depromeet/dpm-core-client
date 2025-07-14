import Axios, { type AxiosRequestConfig } from 'axios';

const axios = Axios.create({
	baseURL: 'https://dev.dpmcore.o-r.kr',
});

export const http = {
	get: async function get<Response = unknown>(url: string, config: AxiosRequestConfig = {}) {
		const res = await axios.get<Response>(url, config);
		return res.data;
	},
	post: async function post<Response = unknown>(url: string, config: AxiosRequestConfig = {}) {
		const res = await axios.post<Response>(url, config);
		return res.data;
	},
	put: async function put<Response = unknown>(url: string, config: AxiosRequestConfig = {}) {
		const res = await axios.put<Response>(url, config);
		return res.data;
	},
};
