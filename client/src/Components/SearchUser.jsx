import React, { Component } from 'react';

class SearchUser extends Component {
    state = {}
    getUsers = () => {
        fetch("/search-user", {
            method: "GET",
        }).then((res) => {
            console.log(res);
            return res.json();
        })
    }

    findUser = (event) => {
        event.preventDefault();
        event.stopPropagation();
        fetch("/search-user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state)
        }).then((res) => {
            return res.json();
        }).then((json) => {
            this.setState({
                ...this.state,
                data: json
            });
        }) 
    }

    handleChange = (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.setState({
            ...this.state,
            [event.target.name]: event.target.value
        });
    }

    render() {
        return (
            <div>
                <form action="/search-user" onSubmit={this.findUser} className="search-user">
                    <input type="text" onChange={this.handleChange} name="name" placeholder="Name" />
                    <input type="text" onChange={this.handleChange} name="phone" placeholder="Phone" />
                    <input type="text" onChange={this.handleChange} name="car-reg-number" placeholder="Car Registration Number" />
                    <input type="text" onChange={this.handleChange} name="vin" placeholder="VIN" />
                    <input type="text" onChange={this.handleChange} name="doc-number" placeholder="Document Number" />
                    <input type="submit" value="Search" />
                </form>
                <div>
                    <form action={`/users/${this.state.selected}`}>
                        {this.state.data?.map((user) => {
                            return <a type="button" key={user._id} href={`/users/${user._id}`} name={user._id}>{user.fname + " " + user.lname}</a>
                        })}
                    </form>
                </div>
            </div>
        );
    }
}

export default SearchUser;
