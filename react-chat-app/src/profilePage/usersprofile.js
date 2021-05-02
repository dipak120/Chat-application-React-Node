import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import '../FriendList/friendlist.css';
import { userActions } from '../_actions';
import $ from 'jquery';
import { constant } from '../constant';

class friendlist extends React.Component {

    async componentDidMount() {
        const { id } = await this.props.match.params
        this.props.getUserProfile(id)
        this.props.getFriends(id)
    }

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            getAllFriend: '',
            submitted: false,
            StateId: ''

        };
    }

    render() {
        if (!sessionStorage.getItem('user')) {
            return <Redirect from="*" to="/login" />
        }
        const { user, users } = this.props;
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div id="content" className="content content-full-width">
                            <div className="profile">
                                <div className="profile-header">
                                    <div className="profile-header-cover"></div>
                                    {user.items &&
                                        <div className="profile-header-content">
                                            {user.items.map((user, index) =>
                                                <div>
                                                    <div className="profile-header-img">
                                                        <img src={constant.ENV_PORT2 + `/static/` + user.image} alt="user" />
                                                    </div>
                                                    <div className="profile-header-info">
                                                        <h4 className="m-t-10 m-b-5">{user.firstName + ' ' + user.lastName}</h4>
                                                        <p className="m-b-10">{user.about}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="profile-content">
                                <div className="tab-content p-0">
                                    <div className="tab-pane fade in active show" id="profile-friends">
                                        <h4 className="m-t-0 m-b-20">Friend List</h4>
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
                                                                <div class="media-body valign-middle text-right overflow-visible">
                                                                    <div class="btn-group dropdown">
                                                                        <a href="javascript:;" class="btn btn-default">Friends</a>
                                                                        {/* <a href="javascript:;" data-toggle="dropdown" class="btn btn-default dropdown-toggle" aria-expanded="false"></a> */}
                                                                        {/* <ul class="dropdown-menu dropdown-menu-right" x-placement="bottom-end">
                                                                            <li><a href="javascript:;">Action 1</a></li>
                                                                            <li><a href="javascript:;">Action 2</a></li>
                                                                            <li><a href="javascript:;">Action 3</a></li>
                                                                            <li class="divider"></li>
                                                                            <li><a href="javascript:;">Action 4</a></li>
                                                                        </ul> */}
                                                                    </div>
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
    const { users, authentication, getuserprofile } = state;
    const user = getuserprofile;
    return { user, users, getuserprofile };
}

const actionCreators = {
    getFriends: userActions.getFriends,
    getUserProfile: userActions.getUserProfile
}

export default friendlist = connect(mapState, actionCreators)(friendlist);