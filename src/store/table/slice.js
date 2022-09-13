import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	tableLoading: false,
	tableColumns: [],
	tableData: null,
	tablePaginationConfig: null,
};

export const tableSlice = createSlice({
	name: 'table',
	initialState,
	reducers: {
		setTableLoading: (state, action) => {
			state.tableLoading = action.payload;
		},
		setTableColumns: (state, action) => {
			state.tableColumns = action.payload;
		},
		setTableData: (state, action) => {
			state.tableData = action.payload;
		},
		setTablePaginationConfig: (state, action) => {
			state.tablePaginationConfig = action.payload;
		},
		resetTableData: (state) => {
			state.tableData = null;
		},
	},
});

// export const selectCart = ({ cart }) => cart;

export const {
	setTableLoading,
	setTableColumns,
	setTableData,
	setTablePaginationConfig,
	resetTableData,
} = tableSlice.actions;

export default tableSlice.reducer;
