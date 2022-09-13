import axios from 'axios';

export default function api() {
	const api = axios.create({
		baseURL: 'http://localhost:8000/api',
		// baseURL: 'https://admin.kolocall.com/api',
		withCredentials: true,
	});

	api.interceptors.response.use(
		(response) => response,
		(error) => {
			if (error.response.status === 401 || error.response.status === 419) {
				if (localStorage.getItem('auth_name')) {
					localStorage.clear();
					window.location.reload();
				}

				return Promise.reject();
			}

			return Promise.reject(error);
		},
	);

	return api;
}
