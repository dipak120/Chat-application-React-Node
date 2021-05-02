import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import './userList.css';
import { userActions } from '../_actions';
import { constant } from '../constant';
import $ from 'jquery';

class userList extends React.Component {

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

        this.sendRequest = this.sendRequest.bind(this);

    }

    sendRequest(id) {
        return (e) => this.props.sendRequest(id);
    }

    render() {
        const { user, users } = this.props;
        const { getAllFriend } = this.state;

        if (!sessionStorage.getItem('user')) {
            return <Redirect from="*" to="/login" />
        }

        return (
            
            <div className="container">
                <div className="card card-default" id="card_contacts">
                    <div id="contacts" className="panel-collapse collapse show" aria-expanded="true">
                        <ul className="list-group pull-down" id="contact-list">
                            <li href="#" className="list-group-item title">
                                Users List

                        </li>
                            {users.loading && <em>Loading users...</em>}
                            {users.error && <span className="text-danger">ERROR: {users.error}</span>}
                            {users.items &&
                                <div>
                                    {users.items.map((user, index) =>
                                        <div key={user.id}>
                                            {user._id !== sessionStorage.getItem('userID') && user.receiverId == '' &&
                                                <li className="list-group-item">
                                                    <div className="row w-100">
                                                        <div className=" col-6 col-sm-3 col-md-2 px-0">
                                                            <img src={constant.ENV_PORT2 + `/static/` + user.image} alt="Mike Anamendolla" className="rounded-circle mt-3 ml-5 d-block img-fluid" />
                                                        </div>
                                                        <div className="col-12 col-sm-6 col-md-9 text-center text-sm-left ml-8">
                                                            <Link className="name lead" to={`/usersprofile/` + user._id}>{user.firstName + ' ' + user.lastName}</Link>
                                                            <br />
                                                            {user.friend &&
                                                                <div>
                                                                    {user.friend.map((getFriend, index) =>
                                                                        <div key={getFriend._id}>
                                                                            {getFriend.receiverid == user._id && getFriend.senderid == sessionStorage.getItem('userID') && getFriend.status == true &&
                                                                                <div>
                                                                                    <button className="btn pull-right friend">Friends</button>
                                                                                </div>
                                                                            }
                                                                            {getFriend.senderid == user._id && getFriend.receiverid == sessionStorage.getItem('userID') && getFriend.status == true &&
                                                                                <div>
                                                                                    <button className="btn pull-right friend">Friends</button>
                                                                                </div>
                                                                            }
                                                                            {getFriend.receiverid == user._id && getFriend.senderid == sessionStorage.getItem('userID') && getFriend.status == false &&
                                                                                <div>
                                                                                    <button disabled className="btn pull-right requestsend">Request Sent</button>
                                                                                </div>
                                                                            }
                                                                            {getFriend.senderid == user._id && getFriend.receiverid !== sessionStorage.getItem('userID') && getFriend.status == false &&
                                                                                <div>
                                                                                    <button disabled className="btn pull-right requestsend">Request Sent</button>
                                                                                </div>
                                                                            }
                                                                            {getFriend.receiverid != user._id && getFriend.senderid != sessionStorage.getItem('userID') && getFriend.senderid != user._id && getFriend.receiverid != sessionStorage.getItem('userID') &&
                                                                                <div>
                                                                                    <button onClick={this.sendRequest(user._id)} className="btn pull-right addfriend">Add Friend</button>
                                                                                </div>
                                                                            }
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            }
                                                            {user.friend == '' &&
                                                                <div>
                                                                    <button onClick={this.sendRequest(user._id)} className="btn pull-right addfriend">Add Friend</button>
                                                                </div>
                                                            }
                                                            <span className="fas fa-bars fa-fw text-muted" data-toggle="tooltip" title="" data-original-title="5842 Hillcrest Rd"></span>
                                                            <span className="text-muted">{user.about}</span>
                                                            <br />
                                                            <span className="fa fa-phone fa-fw text-muted" data-toggle="tooltip" title="" data-original-title="(870) 288-4149"></span>
                                                            <span className="text-muted small">{user.phone}</span>
                                                            <br />
                                                            <span className="fa fa-envelope fa-fw text-muted" data-toggle="tooltip" data-original-title="" title=""></span>
                                                            <span className="text-muted small text-truncate">{user.email}</span>
                                                        </div>
                                                    </div>
                                                </li>
                                            }
                                        </div>
                                    )}
                                </div>
                            }
                        </ul>
                    </div>
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
    getUsers: userActions.getAll,
    sendRequest: userActions.sendrequest
}

export default userList = connect(mapState, actionCreators)(userList);
