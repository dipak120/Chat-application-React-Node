import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import './requestlist.css';
import { userActions } from '../_actions';
import $ from 'jquery';
import { constant } from '../constant';

class requestlist extends React.Component {

    componentDidMount() {
        this.props.getUsers(sessionStorage.getItem('userID'));
    }

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            // img: '',
            getAllFriend: '',
            submitted: false
        };

        this.acceptrequest = this.acceptrequest.bind(this);
        this.deleterequest = this.deleterequest.bind(this);

    }

    acceptrequest(senderid, friend_id) {
        if (senderid && friend_id) {
            return (e) => this.props.acceptRequest(senderid, friend_id);
        }
    }

    deleterequest(senderid, friend_id) {
        return (e) => this.props.deleteRequest(sessionStorage.getItem('userID'), friend_id);
    }

    render() {
        if (!sessionStorage.getItem('user')) {
            return <Redirect from="*" to="/login" />
        }


        const { user, users } = this.props;
        return (
            <div className="container bootstrap snippet">
                <div className="list-content">
                    <ul className="list-group">
                        <li href="#" className="list-group-item title">
                            Users Request List
                        </li>
                        {users.loading && <em>Loading users...</em>}
                        {users.error && <span className="text-danger">ERROR: {users.error}</span>}
                        {users.items &&
                            <div>
                                {users.items.map((user, index) =>
                                    <li href="#" className="list-group-item text-left">
                                        <img src={constant.ENV_PORT2 + `/static/` + user.image} alt="user" className="profile-photo-lg img-thumbnail" />&nbsp;
                                        <label className="name">
                                            {user.firstName + ' ' + user.lastName}<br />
                                        </label>
                                        <label className="float-right action">
                                            {user.status !== true &&
                                                <div>
                                                    <a className="btn accept btn-xs " onClick={this.acceptrequest(user.senderid, user.friend_id)} href="#" title="View">Accept</a>
                                                    <a className="btn delete btn-xs " onClick={this.deleterequest(user.senderid, user.friend_id)} href="#" title="Delete">Delete</a>
                                                </div>
                                            }

                                            {user.status == true &&
                                                <div>
                                                    <a className="btn btn-xs friend" href="#" title="View">Friends</a>
                                                </div>
                                            }
                                        </label>
                                        <div className="break"></div>
                                    </li>
                                )}
                            </div>
                        }
                        {users.items == '' &&
                            <li href="#" className="list-group-item text-left">
                                <h3>No Request Found</h3>
                            </li>
                        }
                    </ul>
                </div>
            </div>
        );
    }
}

function mapState(state) {
    const { users, authentication } = state;
    const { user } = authentication;
    return { user, users };
}

const actionCreators = {
    getUsers: userActions.getRequest,
    deleteRequest: userActions.deleteRequest,
    acceptRequest: userActions.acceptRequest
}

export default requestlist = connect(mapState, actionCreators)(requestlist);
