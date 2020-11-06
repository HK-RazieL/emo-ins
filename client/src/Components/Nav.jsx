import React, { Component } from 'react';
import {BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import CreateNewUser from './CreateNewUser';


class Nav extends Component {
    render() {
        return (
            <Router>
                <div className="nav-bar">
                    <div className="main-menu">
                        <Link to="/">
                            <button>H</button>
                        </Link>
                        <Link to="/create-new-user">
                            <button>+</button>
                        </Link>
                        <Link to="/search-user">
                            <button>S</button>
                        </Link>
                        <button id="notification-button">N</button>
                    </div>
                </div>
                <Switch>
                    <Route exact path="/create-new-user">
                        <CreateNewUser />
                    </Route>
                </Switch>
            </Router>
        );
    }
};


export default Nav;