import React from 'react';
import { Link } from 'react-router-dom';
import { constant } from '../constant';
import { userActions } from '../_actions';
import { connect } from 'react-redux';

class afterRegistration extends React.Component {
  constructor(props) {
    super(props);
    this.sendEmail = this.sendEmail.bind(this);
  }

  sendEmail() {
    const data = { sendEmail: 'ResendEmail' }
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      };
      return fetch(constant.ENV_PORT2 + `/users/register`, requestOptions).then();
  }

  render() {
    if (!sessionStorage.getItem('user')) {
      return (
        <div className='email-varification'>
          <h1>Please Confirm Your Email Address</h1>
          <h2>Email sent on your register Email id</h2>
          <button className="btn button-1" onClick={this.sendEmail}>Resend-Email</button>

        </div>
      )
    }
  }
}



function mapState(state) {
  const { registering } = state.registration;
  return { registering };
}

const actionCreators = {
  Register: userActions.register
}

export default afterRegistration = connect(mapState, actionCreators)(afterRegistration);


