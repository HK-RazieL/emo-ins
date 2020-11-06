import React, { Component } from 'react';

class CreateNewUser extends Component {
    state = {
        date: `${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}`
    }

    createNewUser = (event) => {
        event.preventDefault();
        event.stopPropagation();
        fetch("/create-new-user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state.data)
        });
    }

    handleChange = (event) => {
        this.setState({
            ...this.state,
            [event.target.name]: event.target.value
        });
    }

    render() {
        return (
            <div className="create-new-user-form">
                <form action="/create-new-user" onSubmit={this.createNewUser}>
                    <input type="text" placeholder="Full Name" autoComplete="foo" onChange={this.handleChange} name="fullName" />
                    <input type="text" placeholder="EGN" autoComplete="foo" onChange={this.handleChange} name="egn" />
                    <input type="text" placeholder="Phone" autoComplete="foo" onChange={this.handleChange} name="phone" />
                    <input type="text" placeholder="Address" autoComplete="foo" onChange={this.handleChange} name="address" />
                    <input type="submit" value="Create" />
                </form>
            </div>
        );
    }
}

export default CreateNewUser;
