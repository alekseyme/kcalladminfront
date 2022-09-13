import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { UserApi } from 'api';

export const fetchUsers = createAsyncThunk('users/fetchUsersStatus', async () => {
	const data = await UserApi.getAll();
	return data;
});

export const deleteUser = createAsyncThunk('users/deleteUserStatus', async (id) => {
	const data = await UserApi.delete(id);
	return data;
});

const initialState = {
	items: [],
	status: 'idle',
};

export const usersSlice = createSlice({
	name: 'users',
	initialState,
	extraReducers: {
		[fetchUsers.fulfilled]: (state, action) => {
			state.items = action.payload;
			state.status = 'completed';
		},
		[fetchUsers.rejected]: (state) => {
			state.status = 'error';
		},
		[deleteUser.fulfilled]: (state, action) => {
			state.items = state.items.filter((user) => user.id !== action.meta.arg);
			state.status = 'completed';
		},
		[deleteUser.rejected]: (state) => {
			state.status = 'error';
		},
	},
});

export const selectUsers = ({ users }) => users;

export default usersSlice.reducer;
