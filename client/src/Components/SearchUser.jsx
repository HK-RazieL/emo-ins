/* eslint-disable no-loop-func */
import React, { Component } from 'react';
import { Link } from "react-router-dom";

class SearchUser extends Component {
    state = {
        data: [],
        filter: {}
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

    handleChange = (event) => {
        this.setState({
            ...this.state,
            filter: {
                ...this.state.filter,
                [event.target.name]: event.target.value
            }
        });
    }

    filterData = () => {
        var filter = this.state.filter;
        for (var fil in filter) {
            if (!filter[fil]) delete filter[fil];
        }
        var data = this.state.users;
        var filteredCars;
        var result = [];
        if (data && Object.entries(filter).length !== 0) {
            for (var obj of data) {
                var flag = false;
                for (var key in filter) {
                    switch (key) {
                        case "name":
                            if (obj[key].toLowerCase().includes(filter[key].toLowerCase())) {
                                flag = true;
                            }
                        case "phone":
                            if (new RegExp(this.escapeRegExp(filter[key].replace(/\s*/g, ""))).test(obj[key].replace(/\s*/g, ""))) {
                                flag = true;
                            }
                            break;
                        case "registrationNumber":
                            filteredCars = obj.cars.filter((car) => {
                                return car.registration_number.toLowerCase().includes(filter[key].toLowerCase());
                            });
                            if (filteredCars.length) {
                                flag = true;
                            }
                            break;
                        case "vin":
                            filteredCars = obj.cars.filter((car) => {
                                return car.vin?.toLowerCase().includes(filter[key].toLowerCase());
                            });
                            if (filteredCars.length) {
                                flag = true;
                            }
                            break;
                        case "documentNumber":
                            filteredCars = obj.cars.filter((car) => {
                                for (let i = 0; i < car.payments.length; i++) {
                                    if (car.payments[i].documentNumber?.toLowerCase().includes(filter[key].toLowerCase())) {
                                        return car;
                                    }
                                }
                                return "";
                            });
                            if (filteredCars.length) {
                                flag = true;
                            }
                            break;
                        default:
                            break;
                    }
                }
                if (flag) {
                    result.push(obj)
                }
            }
        }
        let sum = 0;
        for (let key in filter) {
            sum += filter[key].length;
        }
        this.setState({
            ...this.state,
            filtered: sum === 0 ? [] : result
        });
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (JSON.stringify(prevState.filter) !== JSON.stringify(this.state.filter)){
            this.filterData();
        }
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
                        {this.state.filtered?.length > 0 && (<h4>
                            <div>#</div>
                            <div>Name</div>
                            <div>Cars</div>
                            <div>Phone</div>
                        </h4>)}
                        {this.state.filtered?.map((user, index) => {
                            return (
                                <Link to={{ pathname: `/users/${user._id}`, state: { id: user._id}}} key={index} id={user._id} className="filtered-user">
                                    <div onClick={this.openUser}>{index + 1}</div>
                                    <div>{user.name}</div>
                                    <div>{user.cars.map(el => el.registration_number).join(" / ")}</div>
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
