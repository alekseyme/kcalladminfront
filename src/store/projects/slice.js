import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { ProjectApi } from 'api';
import { message } from 'antd';
import { setTableLoading, setTableData, setTablePaginationConfig } from 'store/table/slice';

export const fetchActiveProject = createAsyncThunk(
	'products/fetchActiveProjectStatus',
	async (params, { dispatch }) => {
		console.log('params', params);
		const data = await ProjectApi.search(params);
		console.log('data', data);

		const tableConfig = {
			total: data.paginate.total,
			current_page: data.paginate.current_page,
			per_page: data.paginate.per_page,
		};

		const statusObj = data.statuses.map((status) => {
			return { value: status };
		});

		dispatch(setTablePaginationConfig(tableConfig));
		dispatch(setTableData(data.paginate.data));
		dispatch(setProjectStatuses(statusObj));
		dispatch(setTableLoading(false));
		dispatch(setProjectLoading(false));

		return data;
	},
);

const initialState = {
	activeProject: null,
	projectLoading: false,
	projectList: null,
	projectStatuses: [],
	searchParams: null,
};

export const projectsSlice = createSlice({
	name: 'projects',
	initialState,
	reducers: {
		setActiveProject: (state, action) => {
			state.activeProject = action.payload;
		},
		setProjectLoading: (state, action) => {
			state.projectLoading = action.payload;
		},
		setProjectList: (state, action) => {
			state.projectList = action.payload;
		},
		setProjectStatuses: (state, action) => {
			state.projectStatuses = action.payload;
		},
		setSearchParams: (state, action) => {
			state.searchParams = action.payload;
		},
		resetStorage: () => {},
	},
	extraReducers: {
		[fetchActiveProject.pending]: (state) => {
			state.status = 'loading';
		},
		[fetchActiveProject.fulfilled]: (state, action) => {
			console.log(action.payload);
			// state.products = action.payload;
			state.status = 'completed';
		},
		[fetchActiveProject.rejected]: (state) => {
			state.status = 'error';
			message.error('Ошибка запроса');
		},
	},
});

// export const selectCart = ({ cart }) => cart;

export const {
	setActiveProject,
	setProjectLoading,
	setProjectList,
	setProjectStatuses,
	setSearchParams,
	resetStorage,
} = projectsSlice.actions;

export default projectsSlice.reducer;
