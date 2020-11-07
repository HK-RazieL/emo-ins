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
                <form action="/search-user" onSubmit={this.findUser} >
                    <input type="text" onChange={this.handleChange} name="fname" />
                    <input type="text" onChange={this.handleChange} name="lname" />
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
