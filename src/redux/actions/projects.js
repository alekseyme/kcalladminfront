import axios from 'axios';

export const setActiveProject = (payload) => ({
	type: 'SET_ACTIVE_PROJECT',
	payload,
});

export const setProjectLoading = (payload) => ({
	type: 'SET_PROJECT_LOADING',
	payload,
});

export const setProjectStatuses = (payload) => ({
	type: 'SET_PROJECT_STATUSES',
	payload,
});

export const setTableLoading = (payload) => ({
	type: 'SET_TABLE_LOADING',
	payload,
});

export const setTableColumns = (payload) => ({
	type: 'SET_TABLE_COLUMNS',
	payload,
});

export const setTableData = (payload) => ({
	type: 'SET_TABLE_DATA',
	payload,
});

export const resetTableData = () => ({
	type: 'RESET_TABLE_DATA',
});

export const setTablePaginationConfig = (payload) => ({
	type: 'SET_TABLE_PAGINATIONCONFIG',
	payload,
});

export const setSearchParams = (payload) => ({
	type: 'SET_SEARCH_PARAMS',
	payload,
});

export const resetStorage = () => ({
	type: 'RESET_STORAGE',
});

export const fetchActiveProject = (parameters, activeProject) => (dispatch) => {
	const params = parameters || { project: activeProject };

	axios
		.post('api/project/search', params)
		.then(({ data }) => {
			const tableConfig = {
				total: data.paginate.total,
				current_page: data.paginate.current_page,
				per_page: data.paginate.per_page,
			};

			const statuses = data.statuses.map((status) => {
				return { value: status };
			});

			dispatch(setTablePaginationConfig(tableConfig));
			dispatch(setTableData(data.paginate.data));
			dispatch(setProjectStatuses(statuses));
		})
		.catch(() => alert('ошибка запроса'))
		.finally(() => {
			dispatch(setTableLoading(false));
			dispatch(setProjectLoading(false));
		});
};
