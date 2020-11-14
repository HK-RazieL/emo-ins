import React, { Component } from 'react';

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
                users: [...json]
            })
        });
   }
    render() {
        return (
            <div>
                {this.state.users.map(el => {
                    return (<div>
                        <span>
                            {el.name}
                        </span>
                        <span>
                            {el.name}
                        </span>
                    </div>)
                })}
            </div>
        );
    }
}

export default Notifications;
