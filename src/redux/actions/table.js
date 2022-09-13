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
