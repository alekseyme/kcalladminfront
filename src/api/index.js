import axios from 'axios';

const api = () => {
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
};

export const ProjectApi = {
	async getAll() {
		const { data } = await api().get('/projects');
		return data;
	},
	async search(params) {
		const { data } = await api().post('/project/search', params);
		return data;
	},
	async create(newProject) {
		const { data } = await api().post('/projects', newProject);
		return data;
	},
	async delete(id) {
		const { data } = await api().delete(`/projects/` + id);
		return data;
	},
};

export const AuthApi = {
	async getCsrfCookie() {
		await api().get('/csrf-cookie');
	},
	async getMe() {
		const { data } = await api().post('/me');
		return data;
	},
	async logIn(userData) {
		const { data } = await api().post('/login', userData);
		return data;
	},
	async logOut() {
		await api().post('/logout');
	},
};

export const UserApi = {
	async getAll() {
		const { data } = await api().get('/users');
		return data;
	},
	async getUserProjects() {
		const { data } = await api().post('/userprojects');
		return data;
	},
	async delete(id) {
		const { data } = await api().delete('/users/' + id);
		return data;
	},
};

export const TableApi = {
	async exportData(params) {
		const { data } = await api().post('/project/export', params);
		return data;
	},
	async updateRow(row) {
		const id = row.id;
		const { data } = await api().patch('/project/editrow/' + id, row);
		return data;
	},
};

export const AudioApi = {
	async getOne(id) {
		const { data } = await api().post('/da/' + id, {}, { responseType: 'blob' });
		return data;
	},
};
