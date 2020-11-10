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
                ...json[0]
            });
        });
    }

    openAddCar = () => {
        this.setState({ addCarModal: true});
    }

    closeAddCar = () => {
        this.setState({ addCarModal: false });
    }

    openAddCarPayment = () => {
        this.setState({ addCarPaymentModal: true});
    }

    closeAddCarPayment = () => {
        this.setState({ addCarPaymentModal: false });
    }

    handleAddCarChange = (event) => {
        this.setState({
            ...this.state,
            addNewCar: {
                ...this.state.addNewCar,
                [event.target.name]: event.target.value
            }
        })
    }

    addCar = (event) => {
        event.preventDefault();
        event.stopPropagation();
        fetch(`/users/${this.state._id}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ addingNewCar: this.state.addNewCar})
        }).then((res) => {
            return res.json();
        }).then((json) => {
            this.setState({
                ...this.state,
                cars: [...this.state.cars, json]
            }, () => {
                window.location.reload();
            });
        });
        this.closeAddCar();
    }

    selectCar = (event) => {
        var selectedCar = this.state.cars.filter((el) => {
            return el.registration_number === event.target.value
        })
        this.setState({
            ...this.state,
            selectedCar: selectedCar[0]
        });
    }

    addCarPayment = (event) => {
        event.preventDefault();
        event.stopPropagation();
        let year = this.state.newStartDate.slice(6, 10);
        let month = this.state.newStartDate.slice(3, 5);
        let day = this.state.newStartDate.slice(0, 2);
        var body = {
            selectedCar: this.state.selectedCar.registration_number,
            newPayment: {
                paymentId: this.state.selectedCar.payments.length + 1,
                paymentType: this.state.newInsuranceType,
                due_dates: {
                    dates: [],
                    paid: []
                }
            }
        }
        for (let i = 0; i < this.state.newNumberOfPayments; i++) {
            let newDate = new Date(year, month - 1, day);
            newDate.setMonth(newDate.getMonth() + i * (12 / this.state.newNumberOfPayments));
            body.newPayment.due_dates.dates.push(newDate);
            body.newPayment.due_dates.paid.push(false);
        }
        fetch(`/users/${this.state._id}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        }).then((res) => {
            return res.json();
        }).then((json) => {
            this.setState({
                ...this.state,
                cars: [...this.state.cars, json]
            }, () => {
                window.location.reload();
            });
        });
        this.closeAddCarPayment();
    }

    addNewInsuranceType = (event) => {
        this.setState({
            newInsuranceType: event.target.value
        });
    }

    addNewNumberOfPayments = (event) => {
        this.setState({
            newNumberOfPayments: event.target.value
        });
    }

    addNewStartDate = (event) => {
        this.setState({
            newStartDate: event.target.value
        });
    }

    makePayment = (event) => {
        fetch(`/users/${this.state._id}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                makePayment: {
                    index: event.target.parentElement.getAttribute("index"),
                    selectedCar: this.state.selectedCar.registration_number,
                    paymentId: event.target.parentElement.parentElement.parentElement.parentElement.getAttribute("index")
                }
            })
        }).then((res) => {
            return res.json();
        }).then((json) => {
            this.setState({
                ...this.state,
                cars: [...this.state.cars, json]
            }, () => {
                // window.location.reload();
            });
        });
    }

    removePayment = () => {

    }

    saveComments = () => {
        
    }

    render() {
        return (
            <div className="user-panel-personal-data">
                <div>Client: {this.state.name}</div>
                <div>Phone: {this.state.phone}</div>
                <div>EGN: {this.state.egn}</div>
                <div>Address: {this.state.address}</div>
                <div>Created: {this.state.account_creation_date?.slice(0, 10)}</div>
                <div>
                    <textarea placeholder="Comments" cols="50" rows="10">{this.state.comments}</textarea>
                </div>
                <button onClick={this.saveComments}>Save Comments</button>
                <div>
                    <select onChange={this.selectCar}>
                            <option>Select Car</option>
                            {this.state.cars?.map((car, i) => {
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
                        <form action={`/user/${this.state._id}`} method="PUT">
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
                        <form action={`/user/${this.state._id}`} method="PUT">
                            <h3>Add a new car payment</h3>
                            <div>
                                <select name="insurance-type" onClick={this.addNewInsuranceType}>
                                    <option value="">Insurance Type</option>
                                    <option value="autocasco">Autocasco</option>
                                    <option value="tpli">TPLI</option>
                                </select>
                            </div>
                            <div>
                                <select name="payments" onClick={this.addNewNumberOfPayments}>
                                    <option value="">Number of payments</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="12">12</option>
                                </select>
                            </div>
                            <div>
                                <input type="text" onChange={this.addNewStartDate} placeholder="dd-mm-yyyy" />
                            </div>
                            <input type="submit" value="Add" onClick={this.addCarPayment}/>
                            <button onClick={this.closeAddCarPayment}>X</button>
                        </form>
                    </Modal>
                </div>
                <div>
                    {this.state.selectedCar?.payments?.map((el, i) => {
                        return (
                            <div key={el.paymentId}>
                                <table className="payments" index={i + 1}>
                                    <thead>
                                        <tr>
                                            <th>
                                                {el.paymentType}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            {el.due_dates.dates?.map((a, i) => {
                                                return <td key={i}>{a.toString().slice(0, 10)}</td>
                                            })}
                                        </tr>
                                        <tr>
                                            {el.due_dates.paid?.map((b, i) => {
                                                return (
                                                    <td key={i} index={i}>{b ? <button onClick={this.removePayment}>&#9989;</button> : <button onClick={this.makePayment}>&#10060;</button>}</td>
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
