import React, { Component } from 'react';
import Modal from "react-modal";

Modal.setAppElement("#root")
class UserPanel extends Component {
    state = {
        addCarModal: false,
        addCarPaymentModal: false
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
        console.log(selectedCar[0].payments)
        return (<div>{selectedCar[0].payments.map((el) => {
            return el
        })}</div>)
    }

    addCarPayment = () => {
        event.preventDefault();
        event.stopPropagation();
        let startingDate = this.state.newStartDate;
        let date = new Date(`${startingDate.slice(6, 10)}-${startingDate.slice(3, 5)}-${startingDate.slice(0, 2)}`);
        console.log(date)
        // fetch(`/users/${this.state._id}`, {
        //     method: "PUT",
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({ addingNewCarPayment: {
        //         paymentId: this.state.payments.length++ || 0,
        //         paymentType: this.state.newInsuranceType,
        //         due_dates: {
        //             dates: [],
        //             paid: []
        //         }
        //     }})
        // }).then((res) => {
        //     return res.json();
        // }).then((json) => {
        //     this.setState({
        //         ...this.state,
        //         cars: [...this.state.cars, json]
        //     }, () => {
        //         window.location.reload();
        //     });
        // });
        // this.closeAddCarPayment();
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

    render() {
        return (
            <div className="user-panel-personal-data">
                <div>Client: {this.state.name}</div>
                <div>Phone: {this.state.phone}</div>
                <div>EGN: {this.state.egn}</div>
                <div>Address: {this.state.address}</div>
                <div>Created: {this.state.account_creation_date?.slice(0, 10)}</div>
                <div>
                    <select onChange={this.selectCar}>
                            <option>Select Car</option>
                            {this.state.cars?.map((car, i) => {
                                return (
                                    <option key={this.state.cars[i]?._id}>{car.registration_number}</option>
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
                    
                    <div>Add Payment</div>
                    <button onClick={this.openAddCarPayment}>Add</button>
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
            </div>
        );
    }
}

export default UserPanel;
