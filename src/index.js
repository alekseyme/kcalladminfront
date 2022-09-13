import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'store/store';
import { ConfigProvider } from 'antd';
import ruRU from 'antd/lib/locale/ru_RU';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
	<React.StrictMode>
		<ConfigProvider locale={ruRU}>
			<Router>
				<Provider store={store}>
					<App />
				</Provider>
			</Router>
		</ConfigProvider>
	</React.StrictMode>,
);
