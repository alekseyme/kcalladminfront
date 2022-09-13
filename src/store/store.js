import { configureStore } from '@reduxjs/toolkit';
import userReducer from 'store/user/slice';
import tableReducer from 'store/table/slice';
import projectsReducer from 'store/projects/slice';
import usersReducer from 'store/users/slice';

export const store = configureStore({
	reducer: {
		user: userReducer,
		table: tableReducer,
		projects: projectsReducer,
		users: usersReducer,
	},
});
