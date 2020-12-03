import React, { Component } from 'react';
import Modal from "react-modal";

Modal.setAppElement("#root")
class UserPanel extends Component {
    state = {
        addCarModal: false,
        addCarPaymentModal: false,
        editCarPaymentModal: false,
    }

    componentDidMount = () => {
        var { id } = this.props.location.state;
        fetch(`/users/${id}`, {
            method: "GET",
        }).then((res) => {
            return res.json();
        }).then((json) => {
            this.setState({
                user: json[0],
            }, () => {
                if (this.props.location.state.notificationCar) {
                    this.selectedFromNotification();
                }
            });
        });
    }

    componentDidUpdate = (prevProps, prevState) => {
        let { id } = this.props.location.state;
        if (prevState.user?._id !== id) {
            fetch(`/users/${id}`, {
                method: "GET",
            }).then((res) => {
                return res.json();
            }).then((json) => {
                this.setState({
                    user: json[0],
                }, () => {
                    if (this.props.location.state.notificationCar) {
                        this.selectedFromNotification();
                    } else {
                        let select = document.querySelector("select");
                        if (!select) return;
                        select[0].selectedIndex = 0;
                    }
                });
            });
        }
        if (prevProps.location.state.notificationCar !== this.props.location.state.notificationCar) {
            if (!this.props.location.state.notificationCar) return;
            this.selectedFromNotification();
        }
    }

    selectedFromNotification = () => {
        let select = document.querySelector("select");
        let notificationCar = this.props.location.state.notificationCar;
        Array.from(select.options).forEach((el) => {
            if (el.value === notificationCar) {
                select.value = notificationCar;
                this.setState({
                    ...this.state,
                    selectedCar: this.state.user.cars.filter((car) => car.registration_number === notificationCar)[0]
                });
            }
            return;
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
        });
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
            });
            this.saveUser();
            this.closeAddCar();
        });
    }

    selectCar = (event) => {
        var selectedCar = this.state.user?.cars.filter((el) => {
            return el.registration_number === event.target.value;
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

    createNewInsurance = (event) => {
        event.preventDefault();
        event.stopPropagation();
        let year = this.state.newInsurance.startingDate.slice(6, 10);
        let month = this.state.newInsurance.startingDate.slice(3, 5);
        let day = this.state.newInsurance.startingDate.slice(0, 2);
        let body = {
            paymentType: this.state.newInsurance.insuranceType,
            documentNumber: this.state.newInsurance.documentNumber,
            due_dates: {
                dates: [],
                paid: []
            }
        }
        for (let i = 0; i < this.state.newInsurance.payments; i++) {
            let newDate = new Date(`${year}-${month}-${day} 12:00:00.000Z`);
            newDate.setMonth(newDate.getMonth() + i * (12 / this.state.newInsurance.payments));
            body.due_dates.dates.push(newDate);
            body.due_dates.paid.push(false);
        }
        body.due_dates.dates.push(new Date(`${Number(year) + 1}-${month}-${day} 12:00:00.000Z`));
        body.due_dates.paid.push(false);
        let car;
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
            this.saveUser();
            this.closeAddCarPayment();
        });
    }

    saveUser = () => {
        fetch(`/users/:${this.state.user._id}`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.state.user)
        });
    }

    makePayment = (event) => {
        let paidIndex = event.target.parentElement.getAttribute("index");
        let payments = this.state.selectedCar.payments;
        let paymentId = event.target.parentElement.parentElement.parentElement.parentElement.getAttribute("payment");
        let payment = payments.find((pay) => {
            return pay._id === paymentId;
        });
        payment.due_dates.paid[paidIndex] = !payment.due_dates.paid[paidIndex];
        let car = {
            ...this.state.selectedCar,
            payments: [...payments]
        }
        this.setState({
            ...this.state,
            selectedCar: car
        }, () => {
            this.saveUser();
        });
    }

    handleEdit = (event) => {
        this.setState({
            ...this.state,
            editedPayment: {
                ...this.state.editedPayment,
                [event.target.name]: event.target.value
            }
        });
    }

    editPayment = (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (!window.confirm("Are you sure you want to edit this payment?")) {
            return;
        }
        if (!this.state.editedPayment?.startingDate || !this.state.editedPayment?.insuranceType || !this.state.editedPayment?.payments) {
            alert("One or more fields are not filled!")
            return;
        }
        let year = this.state.editedPayment.startingDate.slice(6, 10);
        let month = this.state.editedPayment.startingDate.slice(3, 5);
        let day = this.state.editedPayment.startingDate.slice(0, 2);
        let body = {
            paymentType: this.state.editedPayment.insuranceType,
            documentNumber: this.state.editedPayment.documentNumber,
            due_dates: {
                dates: [],
                paid: []
            }
        }
        for (let i = 0; i < this.state.editedPayment.payments; i++) {
            let newDate = new Date(`${year}-${month}-${day} 12:00:00.000Z`);
            newDate.setMonth(newDate.getMonth() + i * (12 / this.state.editedPayment.payments));
            body.due_dates.dates.push(newDate);
            body.due_dates.paid.push(false);
        }
        body.due_dates.dates.push(new Date(`${Number(year) + 1}-${month}-${day} 12:00:00.000Z`));
        let car;
        this.state.user.cars.filter((el) => {
            if (el.registration_number !== this.state.selectedCar.registration_number) {
                return el;
            } else {
                car = el;
                return false;
            }
        });
        car.payments = car.payments.map((payment) => {
            if (payment._id === this.state.editing) {
                return body;
            }
            return payment;
        });
        this.setState({
            ...this.state,
            editedPayment: {},
            user: {
                ...this.state.user,
                cars: [...this.state.user.cars]
            }
        }, () => {
            this.saveUser();
            this.closeEditCarPayment();
        });
    }

    deletePayment = (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (!window.confirm("Are you sure you want to DELETE this payment?")) {
            return;
        }
        let cars = this.state.user.cars;
        let car = cars.filter((car) => car.registration_number === this.state.selectedCar.registration_number)[0];
        car.payments = car.payments.filter((payment) => payment._id !== event.target.getAttribute("payment"));
        this.setState({
            ...this.state,
            user: {
                ...this.state.user,
                cars: [...this.state.user.cars]
            }
        }, () => {
            this.saveUser();
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

    openEditCarPayment = (event) => {
        this.setState({
            ...this.state,
            editing: event.target.getAttribute("payment"),
            editCarPaymentModal: true
        });
    }

    closeEditCarPayment = () => {
        this.setState({ editCarPaymentModal: false });
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
                    <textarea name="comments" onChange={this.handleComment} placeholder="Comments" cols="50" rows="10" value={this.state.user?.comments} />
                </div>
                <div>
                    <select onChange={this.selectCar}>
                            <option>Select Car</option>
                            {this.state.user?.cars.map((car, i) => {
                                return (
                                    <option key={i} value={car.registration_number}>{car.registration_number}</option>
                                )
                            })}
                    </select>
                    <button onClick={this.openAddCar}>Add</button>
                    <Modal
                        isOpen={this.state.addCarModal}
                        className="modal"
                    >   
                        <form action={`/user/${this.state.user?._id}`} method="PUT">
                            <h3>Add new car</h3>
                            <div>
                                <input type="text" name="registration_number" onChange={this.handleAddCarChange} placeholder="Registration Number" />
                            </div>
                            <div>
                                <input type="text" name="vin" onChange={this.handleAddCarChange} placeholder="VIN" />
                            </div>
                            <input type="submit" value="Add" onClick={this.addCar}/>
                            <button onClick={this.closeAddCar}>X</button>
                        </form>
                    </Modal>
                    <Modal
                        isOpen={this.state.editCarPaymentModal}
                        className="modal"
                    >   
                        <form action={`/user/${this.state.user?._id}`} method="PUT">
                            <h3>Edit payment</h3>
                            <div>
                                <select name="insuranceType" onClick={this.handleEdit}>
                                    <option value="">Insurance Type</option>
                                    <option value="autocasco">Autocasco</option>
                                    <option value="tpli">TPLI</option>
                                </select>
                            </div>
                            <div>
                                <select name="payments" onClick={this.handleEdit}>
                                    <option value="">Number of payments</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="12">12</option>
                                </select>
                            </div>
                            <div>
                                <select name="payment" onClick={this.handleEdit}>
                                    <option value="">Number of payments</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="12">12</option>
                                </select>
                            </div>
                            <div>
                                <input type="text" name="documentNumber" placeholder="Document Number" onChange={this.handleAddNewInsuranceChange} />
                            </div>
                            <div>
                                <input type="text" onChange={this.handleEdit} placeholder="dd-mm-yyyy" name="startingDate" />
                            </div>
                            <input type="submit" value="Edit" onClick={this.editPayment}/>
                            <button onClick={this.closeEditCarPayment}>X</button>
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
                                <select name="payment" onClick={this.handleAddNewInsuranceChange}>
                                    <option value="">Next Payment</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="12">12</option>
                                </select>
                            </div>
                            <div>
                                <input type="text" name="documentNumber" placeholder="Document Number" onChange={this.handleAddNewInsuranceChange} />
                            </div>
                            <div>
                                <input type="text" onChange={this.handleAddNewInsuranceChange} placeholder="dd-mm-yyyy" name="startingDate" />
                            </div>
                            <input type="submit" value="Add" onClick={this.createNewInsurance}/>
                            <button onClick={this.closeAddCarPayment}>X</button>
                        </form>
                    </Modal>
                </div>
                <div>
                    {this.state.selectedCar?.payments?.map((el, i) => {
                        return (
                            <div key={i}>
                                <table className="payments" index={i} payment={el._id}>
                                    <thead>
                                        <tr>
                                            <th colSpan={el.due_dates.paid.length}>
                                                <span>{el.paymentType}</span>
                                                <span>{el.documentNumber}</span>
                                                <button onClick={this.openEditCarPayment} payment={el._id}>Edit</button>
                                                <button onClick={this.deletePayment} payment={el._id}>Delete</button>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            {el.due_dates?.dates.map((a, i) => {
                                                return (<td key={i}>
                                                        {i === el.due_dates.dates.length - 1 ? "Renewal on: " : null}
                                                        {`${new Date(a).getDate().toString().padStart(2,0)}-${(new Date(a).getMonth() + 1).toString().padStart(2,0)}-${new Date(a).getFullYear()}`}
                                                    </td>)
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
