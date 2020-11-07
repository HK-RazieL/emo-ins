import React, { Component } from 'react';

class CreateNewUser extends Component {
    state = {
        account_creation_date: new Date()
    }

    createNewUser = (event) => {
        event.preventDefault();
        event.stopPropagation();
        fetch("/create-new-user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state)
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
            <div>
                <h2>Create New User</h2>
                <form action="/create-new-user" onSubmit={this.createNewUser} className="create-new-user">
                    <input type="text" placeholder="Name" autoComplete="off" onChange={this.handleChange} name="name" required />
                    <input type="text" placeholder="EGN" autoComplete="off" onChange={this.handleChange} name="egn" />
                    <input type="text" placeholder="Phone" autoComplete="off" onChange={this.handleChange} name="phone" />
                    <input type="text" placeholder="Address" autoComplete="off" onChange={this.handleChange} name="address" />
                    <input type="submit" value="Create" />
                </form>
            </div>
        );
    }
}

export default CreateNewUser;
