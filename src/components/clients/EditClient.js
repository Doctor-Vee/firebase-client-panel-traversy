import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import Spinner from "../layout/Spinner";

class EditClient extends Component {

    constructor(props){
        super(props);
        this.firstNameUpdate = React.createRef();
        this.lastNameUpdate = React.createRef();
        this.emailUpdate = React.createRef();
        this.phoneUpdate = React.createRef();
        this.balanceUpdate = React.createRef();
    }

    onSubmit = e => {
        e.preventDefault();

        const { client, firestore, history } = this.props;

        const clientUpdate = {
            firstName: this.firstNameUpdate.current.value,
            lastName: this.lastNameUpdate.current.value,
            email: this.emailUpdate.current.value,
            phone: this.phoneUpdate.current.value,
            balance: this.balanceUpdate.current.value === "" ? 0 : this.balanceUpdate.current.value
        }

        firestore.update({collection: "clients", doc: client.id}, clientUpdate )
        .then(history.push("/"));
    }

  render() {
    const { client, settings: { disableBalanceOnEdit } } = this.props;
    if (client) {
      return (
        <>
          <div className="row">
            <div className="col-md-6">
              <Link to="/">
                <i className="fas fa-arrow-circle-left" /> Back to Dashboard
              </Link>
            </div>
          </div>
          <div className="card">
            <div className="card-header">Add Client</div>
            <div className="card-body">
              <form onSubmit={this.onSubmit}>
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="firstName"
                    minLength="2"
                    required
                    ref={this.firstNameUpdate}
                    defaultValue={client.firstName}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="lastName"
                    minLength="2"
                    required
                    ref={this.lastNameUpdate}
                    defaultValue={client.lastName}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    required
                    ref={this.emailUpdate}
                    defaultValue={client.email}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <input
                    type="text"
                    className="form-control"
                    name="phone"
                    minLength="10"
                    required
                    ref={this.phoneUpdate}
                    defaultValue={client.phone}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="balance">Balance</label>
                  <input
                    type="text"
                    className="form-control"
                    name="balance"
                    ref={this.balanceUpdate}
                    defaultValue={client.balance}
                    disabled={disableBalanceOnEdit}
                  />
                </div>
                <input
                  type="submit"
                  value="Submit"
                  className="btn btn-primary btn-block"
                />
              </form>
            </div>
          </div>
        </>
      );
    } else {
      return <Spinner />;
    }
  }
}

EditClient.propTypes = {
  firestore: PropTypes.object.isRequired,
};

export default compose(
  firestoreConnect((props) => [
    { collection: "clients", storeAs: "client", doc: props.match.params.id },
  ]),
  connect(({ firestore: { ordered }, settings }, props) => ({
    client: ordered.client && ordered.client[0],
    settings
  }))
)(EditClient);
