import React, { Component } from 'react';
import {
  BrowserRouter,
  Switch,
  Route,
} from 'react-router-dom';
import Home from './components/home/Home.js';
import User from './components/user/User.js';

class Router extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path={'/user'} exact>
            <User />
          </Route>
          <Route>
            <Home />
          </Route>
        </Switch>
      </BrowserRouter>
    );
  }
}

export default Router;
