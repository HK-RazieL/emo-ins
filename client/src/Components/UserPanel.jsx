import React, { Component } from 'react';
import Modal from "react-modal";
/*
    nomer na polica
    registracionnen nomer

    policite dati i padeji
    kolko sa plateni
    kakvi sa
*/
Modal.setAppElement("#root")
class UserPanel extends Component {
    state = {
        addCarModal: false
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

    handleChange = (event) => {
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
        return <div>{selectedCar.payments}</div>
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
                                <input type="text" name="registration_number" onChange={this.handleChange} />
                            </div>
                            <div>
                                <div>VIN:</div>
                                <input type="text" name="vin" onChange={this.handleChange} required />
                            </div>
                            <input type="submit" value="Add" onClick={this.addCar}/>
                            <button onClick={this.closeAddCar}>X</button>
                        </form>
                    </Modal>
                </div>
            </div>
        );
    }
}

export default UserPanel;
