import React, { Component } from 'react';
import Modal from "react-modal";

Modal.setAppElement("#root")
class UserPanel extends Component {
    state = {
        addCarModal: false,
        addCarPaymentModal: false,
        selectedCar: ""
    }

    componentDidMount = () => {
        var { id } = this.props.location.state;
        fetch(`/users/${id}`, {
            method: "GET",
        }).then((res) => {
            return res.json();
        }).then((json) => {
            this.setState({
                user: json[0]
            });
        });
    }

    handleAddCarChange = (event) => {
        this.setState({
            ...this.state,
            addNewCar: {
                ...this.state.addNewCar,
                [event.target.name]: event.target.value,
                payments: []
            }
        });
    }

    handleComment = (event) => {
        this.setState({
            ...this.state,
            user: {
                ...this.state.user,
                [event.target.name]: event.target.value
            }
        })
    }

    addCar = (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.setState({
            ...this.state,
            user: {
                ...this.state.user,
                cars: [...this.state.user.cars, this.state.addNewCar]
            }
        }, () => {
            this.setState({
                addNewCar: {}
            })
            this.closeAddCar();
        });
    }

    selectCar = (event) => {
        var selectedCar = this.state.user?.cars.filter((el) => {
            return el.registration_number === event.target.value
        })
        this.setState({
            ...this.state,
            selectedCar: selectedCar[0]
        });
    }

    handleAddNewInsuranceChange = (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.setState({
            ...this.state,
            newInsurance: {
                ...this.state.newInsurance,
                [event.target.name]: event.target.value,
            }
        });
    }

    addNewInsurance = (event) => {
        event.preventDefault();
        event.stopPropagation();
        let year = this.state.newInsurance.startingDate.slice(6, 10);
        let month = this.state.newInsurance.startingDate.slice(3, 5);
        let day = this.state.newInsurance.startingDate.slice(0, 2);
        var body = {
            paymentType: this.state.newInsurance.insuranceType,
            paymentId: this.state.selectedCar.payments.length + 1,
            due_dates: {
                dates: [],
                paid: []
            }
        }
        for (let i = 0; i < this.state.newInsurance.payments; i++) {
            let newDate = new Date(year, month, day);
            newDate.setMonth(newDate.getMonth() + i * (12 / this.state.newInsurance.payments));
            body.due_dates.dates.push(`${("0" + String(newDate.getDate())).slice(-2)}-${("0" + String(newDate.getMonth() + 1)).slice(-2)}-${newDate.getFullYear()}`);
            body.due_dates.paid.push(false);
        }
        var car;
        this.state.user.cars.filter((el) => {
            if (el.registration_number !== this.state.selectedCar.registration_number) {
                return el;
            } else {
                car = el;
                return false;
            }
        });
        car.payments.push(body);
        this.setState({
            ...this.state,
            user: {
                ...this.state.user,
                cars : [...this.state.user.cars]
            }
        }, () => {
            this.closeAddCarPayment();
        })
    }

    saveUser = () => {
        fetch(`/users/:${this.state.user._id}`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.state.user)
        })
    }

    makePayment = (event) => {
        var paidIndex = event.target.parentElement.getAttribute("index");
        var payments = this.state.selectedCar.payments;
        var payment = payments.filter(el => {
            return el.paymentId == event.target.parentElement.parentElement.parentElement.parentElement.getAttribute("payment");
        });
        payment[0].due_dates.paid[paidIndex] = !payment[0].due_dates.paid[paidIndex];
        payments[payment[0].paymentId - 1] = payment[0];
        var car = {
            ...this.state.selectedCar,
            payments: [...payments]
        }
        this.setState({
            ...this.state,
            selectedCar: car
        }, () => {
            this.forceUpdate();
        })
    }

    openAddCar = () => {
        this.setState({ addCarModal: true, addNewCar: {} });
    }

    closeAddCar = () => {
        this.setState({ addCarModal: false, addNewCar: {} });
    }

    openAddCarPayment = () => {
        this.setState({ addCarPaymentModal: true});
    }

    closeAddCarPayment = () => {
        this.setState({ addCarPaymentModal: false });
    }

    render() {
        return (
            <div className="user-panel-personal-data">
                <div>Client: {this.state.user?.name}</div>
                <div>Phone: {this.state.user?.phone}</div>
                <div>EGN: {this.state.user?.egn}</div>
                <div>Address: {this.state.user?.address}</div>
                <div>Created: {this.state.user?.account_creation_date?.slice(0, 10)}</div>
                <button onClick={this.saveUser}>SAVE</button>
                <div>
                    <textarea name="comments" onChange={this.handleComment} placeholder="Comments" cols="50" rows="10">{this.state.user?.comments}</textarea>
                </div>
                <div>
                    <select onChange={this.selectCar}>
                            <option>Select Car</option>
                            {this.state.user?.cars.map((car, i) => {
                                return (
                                    <option key={i}>{car.registration_number}</option>
                                )
                            })}
                    </select>
                    <button onClick={this.openAddCar}>Add</button>
                    <Modal
                        isOpen={this.state.addCarModal}
                        className="modal"
                    >   
                        <form action={`/user/${this.state.user?._id}`} method="PUT">
                            <h3>Add a new car</h3>
                            <div>
                                <div>Registration:</div>
                                <input type="text" name="registration_number" onChange={this.handleAddCarChange} />
                            </div>
                            <div>
                                <div>VIN:</div>
                                <input type="text" name="vin" onChange={this.handleAddCarChange} />
                            </div>
                            <input type="submit" value="Add" onClick={this.addCar}/>
                            <button onClick={this.closeAddCar}>X</button>
                        </form>
                    </Modal>
                    
                    {this.state.selectedCar ? ( 
                        <>
                            <div>Add Payment</div>
                            <button onClick={this.openAddCarPayment}>Add</button>
                        </>
                    ) : ""}
                    <Modal
                        isOpen={this.state.addCarPaymentModal}
                        className="modal"
                    >   
                        <form action={`/user/${this.state.user?._id}`} method="PUT">
                            <h3>Add a new car payment</h3>
                            <div>
                                <select name="insuranceType" onClick={this.handleAddNewInsuranceChange}>
                                    <option value="">Insurance Type</option>
                                    <option value="autocasco">Autocasco</option>
                                    <option value="tpli">TPLI</option>
                                </select>
                            </div>
                            <div>
                                <select name="payments" onClick={this.handleAddNewInsuranceChange}>
                                    <option value="">Number of payments</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="12">12</option>
                                </select>
                            </div>
                            <div>
                                <input type="text" onChange={this.handleAddNewInsuranceChange} placeholder="dd-mm-yyyy" name="startingDate" />
                            </div>
                            <input type="submit" value="Add" onClick={this.addNewInsurance}/>
                            <button onClick={this.closeAddCarPayment}>X</button>
                        </form>
                    </Modal>
                </div>
                <div>
                    {this.state.selectedCar?.payments?.map((el, i) => {
                        return (
                            <div key={i}>
                                <table className="payments" index={i + 1} payment={el.paymentId}>
                                    <thead>
                                        <tr>
                                            <th>
                                                {el.paymentType}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            {el.due_dates?.dates.map((a, i) => {
                                                return <td key={i}>{a.toString().slice(0, 10)}</td>
                                            })}
                                        </tr>
                                        <tr>
                                            {el.due_dates?.paid.map((b, i) => {
                                                return (
                                                    <td key={i} index={i}>{b ? <button onClick={this.makePayment}>&#9989;</button> : <button onClick={this.makePayment}>&#10060;</button>}</td>
                                                )
                                            })}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        )
                    }).reverse()}
                </div>
            </div>
        );
    }
}

export default UserPanel;
