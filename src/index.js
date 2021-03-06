import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import axios from 'axios';
import { ConfigProvider } from 'antd';
import ruRU from 'antd/lib/locale/ru_RU';

import App from './App';

axios.defaults.baseURL = 'http://localhost:8000/api';
// axios.defaults.baseURL = 'http://admin.kolocall.com/api';
axios.defaults.withCredentials = true;

ReactDOM.render(
	<React.StrictMode>
		<ConfigProvider locale={ruRU}>
			<Router>
				<Provider store={store}>
					<App />
				</Provider>
			</Router>
		</ConfigProvider>
	</React.StrictMode>,
	document.getElementById('root'),
);
