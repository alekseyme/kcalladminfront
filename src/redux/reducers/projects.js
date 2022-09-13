const initialState = {
	activeProject: null,
	projectLoading: false,
	// tableLoading: false,
	// tableColumns: [],
	projectStatuses: [],
	projectList: null,
	// tableData: null,
	// tablePaginationConfig: null,
	searchParams: null,
	// userInfo: null,
};

const projects = (state = initialState, action) => {
	switch (action.type) {
		case 'SET_ACTIVE_PROJECT':
			return { ...state, activeProject: action.payload };

		case 'SET_PROJECT_LOADING':
			return { ...state, projectLoading: action.payload };

		case 'SET_PROJECT_LIST':
			return { ...state, projectList: action.payload };

		case 'SET_PROJECT_STATUSES':
			return { ...state, projectStatuses: action.payload };

		case 'SET_SEARCH_PARAMS':
			return { ...state, searchParams: action.payload };

		// case 'SET_USER_INFO':
		// 	return { ...state, userInfo: action.payload };

		// case 'SET_TABLE_LOADING':
		// 	return { ...state, tableLoading: action.payload };

		// case 'SET_TABLE_COLUMNS':
		// 	return { ...state, tableColumns: action.payload };

		// case 'SET_TABLE_DATA':
		// 	return { ...state, tableData: action.payload };

		// case 'RESET_TABLE_DATA':
		// 	return { ...state, tableData: null };

		// case 'SET_TABLE_PAGINATIONCONFIG':
		// 	return { ...state, tablePaginationConfig: action.payload };

		default:
			return state;
	}
};

export default projects;
