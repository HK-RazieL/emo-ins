import React, { Component } from 'react';
import { Link } from "react-router-dom";

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
                <h2>Search for User</h2>
                <form action="/search-user" onSubmit={this.findUser} className="search-user">
                    <input type="text" onChange={this.handleChange} name="name" placeholder="Name" />
                    <input type="text" onChange={this.handleChange} name="phone" placeholder="Phone" />
                    <input type="text" onChange={this.handleChange} name="car-reg-number" placeholder="Car Registration Number" />
                    <input type="text" onChange={this.handleChange} name="vin" placeholder="VIN" />
                    <input type="text" onChange={this.handleChange} name="doc-number" placeholder="Document Number" />
                    <input type="submit" value="Search" />
                </form>
                <div>
                    <form action={`/users/${this.state.selected}`} className="filtered-users-list">
                        {this.state.data?.length && (<h4>
                            <div>#</div>
                            <div>Name</div>
                            <div>EGN</div>
                            <div>Phone</div>
                        </h4>)}
                        {this.state.data?.map((user, index) => {
                            return (
                                <Link to={{ pathname: `/users/${user._id}`, state: { id: user._id}}} key={index} id={user._id} className="filtered-user">
                                    <div onClick={this.openUser}>{index + 1}</div>
                                    <div>{user.name}</div>
                                    <div>{user.egn}</div>
                                    <div>{user.phone}</div>
                                </Link>
                            )
                        })}
                    </form>
                </div>
            </div>
        );
    }
}

export default SearchUser;
