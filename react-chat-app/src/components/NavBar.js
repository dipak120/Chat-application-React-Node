import React, { Component } from "react";
import Navbar from "react-bootstrap/lib/Navbar";
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

/**
 *
 * Renders top navbar and shows the current signed in user.
 */
export default class NavBar extends Component {
  state = {};
  render() {
    return (
      <Navbar inverse>
      

        <Navbar.Header>
         {/* <Navbar.Brand>Users</Navbar.Brand> */}
          <Navbar.Brand>Friends</Navbar.Brand>
          <Navbar.Brand>Requests</Navbar.Brand>
          <Navbar.Brand>Profile</Navbar.Brand>
          <Navbar.Brand>Messages</Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Navbar.Text pullRight>
            Signed in as:&nbsp;
            <span className="signed-in-user">{(this.props.signedInUser || {}).name}</span>
          </Navbar.Text>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}
