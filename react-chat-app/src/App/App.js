import React, { Fragment } from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { history } from '../_helpers';
import { alertActions } from '../_actions';
import { PrivateRoute } from '../_components';
import { HomePage } from '../HomePage';
import { LoginPage } from '../LoginPage';
import { RegisterPage } from '../RegisterPage';
import Header from '../common/Header'
import Footer from '../common/Footer'
import afterRegistration from '../common/afterRegistration'
import createPassword from '../common/createPassword'
import userList from '../users/userList'
import { profile } from '../profilePage/profile';
import requestlist from '../Requestlist/requestlist';
import friendlist from '../FriendList/friendlist';
import messagebox from '../messageBox/messagebox';
import usersProfile from '../profilePage/usersprofile'
require('dotenv').config()

class App extends React.Component {
    constructor(props) {
        super(props);

        history.listen((location, action) => {
            // clear alert on location change
            this.props.clearAlerts();
        });
    }
    render() {
        const { alert } = this.props;
        return (
            <Fragment>
                <Router history={history}>
                    <Fragment>
                        <Header alert={alert}/>
                        <div className="jumbotron">
                            <Switch>
                                <PrivateRoute exact path="/" component={userList} />
                                <Route path="/login" component={LoginPage} />
                                <Route path="/afterregistration" component={afterRegistration} />
                                <Route path="/createpassword/:id" component={createPassword} />
                                <Route path="/register" component={RegisterPage} />
                                <Route path="/profile" component={profile} />
                                <Route path="/usersprofile/:id" component={usersProfile} />
                                <Route path="/requestlist" component={requestlist} />
                                <Route path="/friendlist" component={friendlist} />
                                <Route path="/userlist" component={userList} />
                                <Route path="/messagebox" component={messagebox} />
                                <Redirect from="*" to="/login" />
                            </Switch>
                        </div>
                        <Footer />
                    </Fragment>
                </Router>
            </Fragment>
        );
    }
}

function mapState(state) {
    const { alert } = state;
    return { alert };
}

const actionCreators = {
    clearAlerts: alertActions.clear
};

const connectedApp = connect(mapState, actionCreators)(App);
export { connectedApp as App };