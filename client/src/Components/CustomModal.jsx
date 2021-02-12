import React, { Component } from 'react';

class CustomModal extends Component {
    state = {
        obj: {
            insuranceType: this.props.data.insuranceType || "autocasco",
            payments: this.props.data.payments || 1,
            payment: this.props.data.payment || 1,
            documentNumber: this.props.data.documentNumber || "",
            startingDate: this.props.data.startingDate || `${new Date().getDate()}-${(new Date().getMonth() + 1).toString().padStart(2, "0")}-${new Date().getFullYear()}`
        },
    }

    handleChange = (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.setState({
            obj: {
                ...this.state.obj,
                [event.target.name]: event.target.value,
            }
        });
    }

    create = (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.props.create(this.state.obj);
        this.props.close();
    }

    componentDidMount = () => {
        this.dateForPayment();
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (JSON.stringify(prevState.obj.payments) !== JSON.stringify(this.state.obj.payments)) {
            this.dateForPayment();
        }
    }

    dateForPayment = () => {
        let options = [];
        if (this.state.obj.payments) {
            for (let i = 1; i <= this.state.obj.payments; i ++) {
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
            case "editInsurance":
                return (
                    <form action={`/user/${this.props.user._id}`} method="PUT">
                        <h3>Add a new car payment</h3>
                        <div>
                            <label>Insurance Type: </label>
                            <select name="insuranceType" onChange={this.handleChange} required>
                                <option value="autocasco">Autocasco</option>
                                <option value="tpli">TPLI</option>
                            </select>
                        </div>
                        <div>
                            <label>Number Of Payments: </label>
                            <select name="payments" onChange={this.handleChange} required>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="12">12</option>
                            </select>
                        </div>
                        <div>
                            <label>Next payment: </label>
                            <select name="payment" onChange={this.handleChange}>
                                {this.state.options}
                            </select>
                        </div>
                        <div>
                            <label>Document Number: </label>
                            <input type="text" name="documentNumber" onChange={this.handleChange} />
                        </div>
                        <div>
                            <label>Starting Date: </label>
                            <input type="text" onChange={this.handleChange} placeholder="dd-mm-yyyy" name="startingDate" required />
                        </div>
                        <input type="submit" value="Add" onClick={this.create}/>
                        <button onClick={this.props.close}>X</button>
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
