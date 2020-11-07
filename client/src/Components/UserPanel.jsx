import React, { Component } from 'react';

/*
    nomer na polica
    registracionnen nomer

    policite dati i padeji
    kolko sa plateni
    kakvi sa
*/


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
            <div classNa>
                <input placeholder={this.state?.data.name} />
                <input value={this.state?.data.egn || ""} />
                <input value={this.state?.data.phone || ""} />
                <input value={this.state?.data.address || ""} />
            </div>
        );
    }
}

export default UserPanel;
