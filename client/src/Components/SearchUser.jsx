import React, { Component } from 'react';
import { Link } from "react-router-dom";

class SearchUser extends Component {
    state = {
        data: []
    }

    escapeRegExp = (string) => {
        return string.replace(/[.*+?^${}()|[\]\\]/gi, '\\$&');
    }

    componentDidMount = () => {
        fetch("/search-user", {
            method: "GET",
        }).then((res) => {
            return res.json();
        }).then((json) => {
            this.setState({
                ...this.state,
                users: json
            })
        })
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (JSON.stringify(prevState) !== JSON.stringify(this.state)) {
            var result = [];
            if (this.state.users && Object.entries(this.state.data).length !== 0) {
                for (var obj of this.state.users) {
                    for (var key in this.state.data) {
                        console.log(this.state.data)
                        if (new RegExp(this.escapeRegExp(this.state.data[key].toLowerCase())).test(obj[key].toLowerCase())) {
                            result.push(obj)
                        }
                    }
                }
            }

            this.setState({
                ...this.state,
                filtered: [...result]
            });
        }
    }

    handleChange = (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.setState({
            ...this.state,
            data: {
                ...this.state.data,
                [event.target.name]: event.target.value
            }
        });
    }

    render() {
        return (
            <div>
                <h2>Search for User</h2>
                <form action="/search-user" className="search-user">
                    <input type="text" onChange={this.handleChange} name="name" placeholder="Name" />
                    <input type="text" onChange={this.handleChange} name="phone" placeholder="Phone" />
                    <input type="text" onChange={this.handleChange} name="registrationNumber" placeholder="Car Registration Number" />
                    <input type="text" onChange={this.handleChange} name="vin" placeholder="VIN" />
                    <input type="text" onChange={this.handleChange} name="documentNumber" placeholder="Document Number" />
                </form>
                <div>
                    <form action={`/users/${this.state.selected}`} className="filtered-users-list">
                        {this.state.filtered?.length && (<h4>
                            <div>#</div>
                            <div>Name</div>
                            <div>EGN</div>
                            <div>Phone</div>
                        </h4>)}
                        {this.state.filtered?.map((user, index) => {
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
