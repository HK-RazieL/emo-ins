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
            });
        });
   }
    render() {
        return (
            <div id="notifications">
                {this.state.users.map((el,i) => {
                    return (<div key={i}>
                        <span>
                            {el.name}
                        </span>
                        <span>
                            {el.car}
                        </span>
                        <span>
                            {el.date}
                        </span>
                    </div>)
                })}
            </div>
        );
    }
}

export default Notifications;
