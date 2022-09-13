const initialState = {
	userInfo: null,
	userList: null,
};

const user = (state = initialState, action) => {
	switch (action.type) {
		case 'SET_USER_INFO':
			return { ...state, userInfo: action.payload };

		case 'SET_USER_LIST':
			return { ...state, userList: action.payload };

		default:
			return state;
	}
};

export default user;
