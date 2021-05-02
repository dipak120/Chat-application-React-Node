import React, { Fragment } from 'react';
import { Link, BrowserRouter as Router } from 'react-router-dom';
import { connect } from 'react-redux';
import { userActions } from '../_actions';
import $ from 'jquery';
import { constant } from '../constant';

class Header extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {

    if (!this.props.user) {
      return (
        <Fragment>
          <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <Link className="navbar-brand h-100" to="/messagebox"><img width='40' src="https://img.icons8.com/cute-clipart/64/000000/weixing.png" />Chat App</Link >
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav mr-auto">
              </ul>
              <div className="form-inline my-2 my-lg-0 navbar-nav">
                <Link className="nav-link" to="/register">Sign-up</Link>
              </div>
              <div className="form-inline my-2 my-lg-0 navbar-nav">
                <Link className="nav-link" to="/login">Login</Link>
              </div>
            </div>
          </nav >
          {this.props.alert &&
            <div className="container message">
              <div className="col-sm-12 col-sm-offset-2">
                {this.props.alert.message &&
                  <div className={`alert ${this.props.alert.type}`}>{this.props.alert.message}</div>
                }
              </div>
            </div>
          }
        </Fragment>
      )
    }
    else {
      return (
        <Fragment>
          <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <Link className="navbar-brand h-100" to="/messagebox"><img width='40' src="https://img.icons8.com/cute-clipart/64/000000/weixing.png" />Chat App</Link >
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/userlist">
                    Users</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/friendlist">
                    Friends</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/requestlist">
                    Request</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/messagebox">
                    Messages</Link>
                </li>
              </ul>
              <div className="form-inline my-2 my-lg-0 navbar-nav">
                <Link className="nav-link" to="/profile">Login As: {this.props.user.username}</Link>
              </div>
              <div className="form-inline my-2 my-lg-0 navbar-nav">
                <Link className="nav-link" to="/profile">Profile</Link>
              </div>
              <div className="form-inline my-2 my-lg-0 navbar-nav">
                <Link className="nav-link" to="/login">Logout</Link>
              </div>
            </div>
          </nav >
          {this.props.alert &&
            <div className="container">
              <div className="col-sm-12 col-sm-offset-2">
                {this.props.alert.message &&
                  <div className={`alert ${this.props.alert.type}`}>{this.props.alert.message}</div>
                }
              </div>
            </div>
          }
        </Fragment>
      )
    }
  }
}

function mapState(state) {
  const { users, authentication } = state;
  const { user } = authentication;
  return { user, users };
}

const actionCreators = {
  getFriends: userActions.getFriends
}

export default Header = connect(mapState, actionCreators)(Header);

