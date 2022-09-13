const initialState = {
	tableLoading: false,
	tableColumns: [],
	tableData: null,
	tablePaginationConfig: null,
};

const table = (state = initialState, action) => {
	switch (action.type) {
		case 'SET_TABLE_LOADING':
			return { ...state, tableLoading: action.payload };

		case 'SET_TABLE_COLUMNS':
			return { ...state, tableColumns: action.payload };

		case 'SET_TABLE_DATA':
			return { ...state, tableData: action.payload };

		case 'RESET_TABLE_DATA':
			return { ...state, tableData: null };

		case 'SET_TABLE_PAGINATIONCONFIG':
			return { ...state, tablePaginationConfig: action.payload };

		default:
			return state;
	}
};

export default table;
