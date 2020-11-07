import React, { Component } from 'react';

class CreateNewUser extends Component {
    state = {
        account_creation_date: new Date().setUTCHours(3)
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
            <div className="create-new-user-form">
                <form action="/create-new-user" onSubmit={this.createNewUser}>
                    <input type="text" placeholder="Full Name" autoComplete="off" onChange={this.handleChange} name="name" required />
                    <input type="text" placeholder="EGN" autoComplete="off" onChange={this.handleChange} name="egn" required />
                    <input type="text" placeholder="Phone" autoComplete="off" onChange={this.handleChange} name="phone" required />
                    <input type="text" placeholder="Address" autoComplete="off" onChange={this.handleChange} name="address" required />
                    <textarea placeholder="Comments" onChange={this.handleChange} name="comments" />
                    <input type="submit" value="Create" />
                </form>
            </div>
        );
    }
}

export default CreateNewUser;
