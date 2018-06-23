import React from 'react';
import ReactDOM from 'react-dom';
import App from 'components/app';
import AppStore from 'stores/app';

// load stores into state
AppStore();

ReactDOM.render(<App />, document.getElementById('app'));
