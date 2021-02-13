import React, { Component } from 'react';

class CustomModal extends Component {
    state = {
        [this.props.modal]: {
            paymentType: "autocasco",
            payments: 1,
            payment: 1,
            documentNumber: "",
            startingDate: `${new Date().getDate()}-${(new Date().getMonth() + 1).toString().padStart(2, "0")}-${new Date().getFullYear()}`
        }
    }

    handleChange = (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.setState({
            [this.props.modal]: {
                ...this.state[this.props.modal],
                [event.target.name]: event.target.value,
            }
        });
    }

    create = (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.props.create(this.state[this.props.modal]);
        this.props.close();
    }

    componentDidMount = () => {
        this.dateForPayment();
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (JSON.stringify(prevState[this.props.modal].payments) !== JSON.stringify(this.state[this.props.modal].payments)) {
            this.dateForPayment();
        }
    }

    dateForPayment = () => {
        let options = [];
        if (this.state[this.props.modal].payments) {
            for (let i = 1; i <= this.state[this.props.modal].payments; i ++) {
                options.push(<option value={i} key={i}>{i}</option>);
            }
            this.setState({
                options: options
            });
        }
    }

    selectModal = () => {
        switch(this.props.modal) {
            case "addInsurance":
                return (
                    <form action={`/user/${this.props.user._id}`} method="PUT">
                        <h3>Add a new car payment</h3>
                        <div>
                            <label>Insurance Type: </label>
                            <select name="insuranceType" onChange={this.handleChange} required>
                                <option value="autocasco">Autocasco</option>
                                <option value="tpli">TPLI</option>
                            </select>
                            <label>Number Of Payments: </label>
                            <select name="payments" onChange={this.handleChange} required>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="12">12</option>
                            </select>
                            <label>Next payment: </label>
                            <select name="payment" onChange={this.handleChange}>
                                {this.state.options}
                            </select>
                            <label>Document Number: </label>
                            <input type="text" name="documentNumber" onChange={this.handleChange} />
                            <label>Starting Date: </label>
                            <input type="text" onChange={this.handleChange} placeholder="dd-mm-yyyy" name="startingDate" required />
                        <input type="submit" value="Add" onClick={this.create}/>
                        <button onClick={this.props.close}>X</button>
                        </div>
                    </form>
                )
            case "editInsurance":
                return (
                    <form action={`/user/${this.props.user._id}`} method="PUT">
                        <h3>Edit Insurance</h3>
                        <div>
                            <label>Insurance Type: </label>
                            <select name="insuranceType" onChange={this.handleChange} required>
                                <option value="autocasco">Autocasco</option>
                                <option value="tpli">TPLI</option>
                            </select>
                            <label>Number Of Payments: </label>
                            <select name="payments" onChange={this.handleChange} required>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="12">12</option>
                            </select>
                            <label>Next payment: </label>
                            <select name="payment" onChange={this.handleChange}>
                                {this.state.options}
                            </select>
                            <label>Document Number: </label>
                            <input type="text" name="documentNumber" onChange={this.handleChange} />
                            <label>Starting Date: </label>
                            <input type="text" onChange={this.handleChange} placeholder="dd-mm-yyyy" name="startingDate" required />
                        <input type="submit" value="Apply" onClick={this.create}/>
                        <button onClick={this.props.close}>X</button>
                        </div>
                    </form>
                )
                default: return <></>;
        }
    }
    render() {
        return this.selectModal();
    }
}

export default CustomModal;