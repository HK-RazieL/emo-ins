import React, { Component } from 'react';
import {BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import CreateNewUser from './CreateNewUser';
import SearchUser from './SearchUser';
import UserPanel from "./UserPanel";
import Notifications from "./Notifications";

class Nav extends Component {
    showNotifications = () => {
        var notifications = document.querySelector("#notifications");
        if(!notifications) return;
        if (notifications.style.display === "none") {
            notifications.style.display = "block"
        } else {
            notifications.style.display = "none"
        }
    }

    render() {
        return (
            <>
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
                        <button onClick={this.showNotifications} id="notification-button">N</button>
                    </div>
                </div>
                <Switch>
                    <Route exact path="/create-new-user" component={CreateNewUser} />
                    <Route exact path="/search-user" component={SearchUser} />
                    <Route exact path="/users/:id" component={UserPanel} />
                </Switch>
            <Notifications />
            </Router>
            </>
        );
    }
};

export default Nav;
