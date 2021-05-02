import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import './friendlist.css';
import { userActions } from '../_actions';
import $ from 'jquery';
import { constant } from '../constant';





class friendlist extends React.Component {
    componentDidMount() {
        this.props.getFriends(sessionStorage.getItem('userID'));
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

        this.friendAction = this.friendAction.bind(this);

    }

    friendAction(e) {
        if (e.target.value) {
            this.props.friendAction(sessionStorage.getItem('userID'), e.target.value);
        }
    }

    render() {
        if (!sessionStorage.getItem('user')) {
            return <Redirect from="*" to="/login" />
        }
        const { user, users, checkbutton } = this.props;
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div id="content" className="content content-full-width">
                            <div className="profile">
                                <div className="profile-header">
                                    <div className="profile-header-cover"></div>
                                    <div className="profile-header-content">
                                        <div className="profile-header-img">
                                            <img src={constant.ENV_PORT2 + `/static/` + user.image} alt="user" />
                                        </div>
                                        <div className="profile-header-info">
                                            <h4 className="m-t-10 m-b-5">{user.firstName + ' ' + user.lastName}</h4>
                                            <p className="m-b-10">{user.about}</p>
                                            <a href="/profile" className="btn btn-xs btn-yellow">Edit Profile</a>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div className="profile-content">
                                <div className="tab-content p-0">
                                    <div className="tab-pane fade in active show" id="profile-friends">
                                        {users.items != '' &&
                                            <h4 className="m-t-0 m-b-20">Friend List</h4>
                                        }
                                        {users.items == '' &&
                                            <h4 className="m-t-0 m-b-20">No Friend Found</h4>
                                        }
                                        {users.loading && <em>Loading users...</em>}
                                        {users.error && <span className="text-danger">ERROR: {users.error}</span>}
                                        {users.items &&
                                            <div className="row row-space-2">
                                                {users.items.map((user, index) =>
                                                    <div className="col-md-6 m-b-2">
                                                        <div className="p-10 bg-white">
                                                            <div className="media media-xs overflow-visible">
                                                                <a className="media-left" href="javascript:;">
                                                                    <img src={constant.ENV_PORT2 + `/static/` + user.image} alt="User" className="media-object img-circle" />
                                                                </a>
                                                                <div className="media-body valign-middle">
                                                                    <b className="text-inverse">{user.firstName + ' ' + user.lastName}</b>
                                                                </div>
                                                                <div className="media-body valign-middle text-right overflow-visible">
                                                                    {/* <a href="javascript:;" className="btn btn-default">Friends</a> */}

                                                                    <select id="friendAction" onChange={this.friendAction} className='theme-construction'>
                                                                        <option>Friends</option>
                                                                        <option value={user.main_id}>UnFriend</option>
                                                                    </select>
                                                                    {/* <div className="btn-group dropdown">
                                                                        <a href="javascript:;" className="btn btn-default">Friends</a>
                                                                        <a href="javascript:;" data-toggle="dropdown" className="btn btn-default dropdown-toggle" aria-expanded="false"></a>
                                                                        <ul className="dropdown-menu dropdown-menu-right" x-placement="bottom-end">
                                                                            <li><a href="javascript:;">UnFriend</a></li>
                                                                            <li><a href="javascript:;">Block</a></li>
                                                                        </ul>
                                                                    </div> */}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapState(state) {
    const { users, authentication } = state;
    const { user } = authentication;
    const { checkbutton } = 0;
    return { user, users, checkbutton };
}

const actionCreators = {
    friendAction: userActions._friendAction,
    getFriends: userActions.getFriends

}

export default friendlist = connect(mapState, actionCreators)(friendlist);
