import { combineReducers } from 'redux';

import projects from './projects';
import user from './user';
import table from './table';

// const rootReducer = combineReducers({
// 	projects,
// 	user,
// 	table,
// });

const appReducer = combineReducers({
	projects,
	user,
	table,
});

const rootReducer = (state, action) => {
	if (action.type === 'USER_LOGOUT') {
		return appReducer(undefined, action);
	}

	return appReducer(state, action);
};

export default rootReducer;
