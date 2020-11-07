import React, { Component } from 'react';

class UserPanel extends Component {
    componentDidMount = () => {
        var user = window.location.pathname.match(/.+\/(.*)/)[1] || "";
        fetch(`/users/${user}`, {
            method: "GET",
        }).then((res) => {
            return res.json();
        }).then((json) => {
            this.setState({
                ...this.state,
                data: json
            });
        })
    }

    render() {
        return (
            <div>
                <textarea rows="20" cols="20" value={JSON.stringify(this.state?.data)}></textarea>
            </div>
        );
    }
}

export default UserPanel;
