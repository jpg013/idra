import './styles/index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import createStore from './store/createStore';
import SignIn from './containers/signIn/signIn';
import App from './containers/app/app';
import UnauthorizedRoute from './routes/unauthorizedRoute';
import AuthorizedRoute from './routes/authorizedRoute';
import { hydrateAuthToken } from './store/actions/auth';
import './polyfills/requestIdleCallback';

// ======================================================
// Create Redux Store
// ======================================================
const store = createStore();

// ======================================================
// Hydrate the application
// ======================================================
store.dispatch(hydrateAuthToken());

// ======================================================
// Root Component
// ======================================================

const Root = () => {
  return (
    <BrowserRouter>
      <div className="router">
        <UnauthorizedRoute path="/signin" component={SignIn} />
        <AuthorizedRoute component={App} />
      </div>
    </BrowserRouter>
  );
};

// ======================================================
// Render Root To DOM
// ======================================================

ReactDOM.render(
  <Provider store={store}>
    <Root />
  </Provider>,
  document.getElementById('root')
);
