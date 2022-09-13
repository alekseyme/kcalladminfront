export const setUserInfo = (payload) => ({
	type: 'SET_USER_INFO',
	payload,
});

export const setUserList = (payload) => ({
	type: 'SET_USER_LIST',
	payload,
});

export const logOut = (payload) => ({
	type: 'USER_LOGOUT',
	payload,
});
