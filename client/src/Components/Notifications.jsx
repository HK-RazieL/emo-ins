import React, { Component } from 'react';
import { Link } from "react-router-dom";

class Notifications extends Component {
    state = {
        users: []
    }
    componentDidMount = () => {
        fetch("/notifications", {
            method: "GET",
            headers: {
               'Content-Type': 'application/json',
           }
        }).then((res) => {
            return res.json();
        }).then((json) => {
            this.setState({
                ...this.state,
                users: json
            });
        });
   }
    render() {
        return (
            <>
                {this.state.users.length > 0 ? 
                <>
                    <div id="unread">{this.state.users.length}</div>
                    <div id="notifications" style={{"display": "none"}}>
                        {this.state.users.map((el,i) => {
                            return (<Link to={{ pathname: `/users/${el.id}`, state: { id: el.id, notificationCar: el.car}}} key={i}>
                                <div>
                                    {el.name}
                                </div>
                                <div>
                                    {el.car}
                                </div>
                                <div>
                                    {el.payment}
                                </div>
                                <div>
                                    {el.renewal ? "Renewal!" : null}
                                </div>
                                <div>
                                    {`${new Date(el.date).getDate().toString().padStart(2,0)}-${(new Date(el.date).getMonth() + 1).toString().padStart(2,0)}-${new Date(el.date).getFullYear()}`}
                                </div>
                            </Link>)
                        })}
                    </div>
                </>
                : null}
            </>
        );
    }
}

export default Notifications;
