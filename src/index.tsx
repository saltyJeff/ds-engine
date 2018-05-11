import "babel-polyfill";
import React from 'react'
import ReactDOM from 'react-dom';

let mount;
const root = document.getElementById('root');
const load = async () => {
	const { default: App } = await import('./App');

	mount = ReactDOM.render(<App />, root, mount);
};

// This is needed for Hot Module Replacement
if (module.hot) {
	module.hot.accept('./App', () => requestAnimationFrame(load));
}

load();
