import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	userInfo: null,
	userList: null,
};

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUserInfo: (state, action) => {
			state.userInfo = action.payload;
		},
		setUserList: (state, action) => {
			state.userList = action.payload;
		},
		// logOut: (state, action) => {},
	},
});

// export const selectCart = ({ cart }) => cart;

export const { setUserInfo, setUserList, logOut } = userSlice.actions;

export default userSlice.reducer;
