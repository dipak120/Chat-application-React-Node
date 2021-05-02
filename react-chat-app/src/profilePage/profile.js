import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import Dropzone from 'react-dropzone';
import $ from 'jquery';
import { constant } from '../constant';
import { userActions } from '../_actions';

class profile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            image2: '',
            user: {
                firstName: '',
                lastName: '',
                username: '',
                email: '',
                phone: '',
                image: '',
                lastImages: false,
                about: '',
                id: '',
                // password: ''
            },
            submitted: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const { name, value } = event.target;
        const { user } = this.state;
        if (name == 'image') {
            // const image = files[0];
            const users = {
                ...user,
                image: event.target.files[0].name,
                lastImages: true
            }
            this.setState({ user: users });
            this.setState({ image2: event.target.files[0] });

        } else {
            const users = {
                ...user,
                [name]: event.target.value
            }
            this.setState({ user: users });
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        this.setState({ submitted: true });
        const { user } = this.state;
        if (user.firstName && user.lastName && user.username && user.about && user.phone && user.about && user.image) {

            const formData = new FormData()
            formData.append('file', this.state.image2);
            this.props.updateProfile(user);

            const h = {}; //headers
            h.Accept = 'application/json'; //if you expect JSON response
            const requestOptions = {
                method: 'POST',
                headers: h,
                body: formData,
                mode: 'no-cors'
            };
            return fetch(constant.ENV_PORT2 + `/users/imgupload`, requestOptions)
        }
    }

    componentDidMount() {
        if (!sessionStorage.getItem('user')) {
            return <Redirect from="*" to="/login" />
        }

        const { loggedInUser } = this.props;
        const data = {
            firstName: loggedInUser.firstName,
            lastName: loggedInUser.lastName,
            username: loggedInUser.username,
            email: loggedInUser.email,
            phone: loggedInUser.phone,
            image: loggedInUser.image,
            lastImages: false,
            about: loggedInUser.about,
            id: loggedInUser._id,

        }
        this.setState({ user: data });
        $('.uploadimage input').change(function () {
            $('.uploadimage p').text("Profile Image Selected");
        });
    }

    render() {

        if (!sessionStorage.getItem('user')) {
            return <Redirect from="*" to="/login" />
        }

        const { registering, loggedInUser } = this.props;
        const { user, submitted } = this.state;

        return (
            <div className="form-main col-md-6 col-md-offset-3">
                <h2>
                    <img src={constant.ENV_PORT2 + `/static/` + loggedInUser.image} alt="user" className="profile-photo-lg img-thumbnail" />&nbsp;
                    {user.firstName + " " + user.lastName}
                </h2>
                <form name="form" action='post' encType='multipart/formdata' onSubmit={this.handleSubmit}>
                    <div className={'form-group' + (submitted && !user.firstName ? ' text-danger' : '')}>
                        <label htmlFor="firstName">First Name</label>
                        <input type="text" className="form-control" name="firstName" value={user.firstName} onChange={this.handleChange} />
                        {submitted && !user.firstName &&
                            <div className="help-block">First Name is required</div>
                        }
                    </div>
                    <div className={'form-group' + (submitted && !user.lastName ? ' text-danger' : '')}>
                        <label htmlFor="lastName">Last Name</label>
                        <input type="text" className="form-control" name="lastName" value={user.lastName} onChange={this.handleChange} />
                        {submitted && !user.lastName &&
                            <div className="help-block">Last Name is required</div>
                        }
                    </div>
                    <div className={'form-group' + (submitted && !user.username ? ' text-danger' : '')}>
                        <label htmlFor="username">Username</label>
                        <input type="text" className="form-control" name="username" value={user.username} onChange={this.handleChange} />
                        {submitted && !user.username &&
                            <div className="help-block">Username is required</div>
                        }
                    </div>

                    <div className={'form-group' + (submitted && !user.email ? ' text-danger' : '')}>
                        <label htmlFor="email">Email</label>
                        <input type="text" className="form-control" name="email" value={user.email} onChange={this.handleChange} />
                        {submitted && !user.email &&
                            <div className="help-block">Email is required</div>
                        }
                    </div>
                    <div className={'form-group' + (submitted && !user.phone ? ' text-danger' : '')}>
                        <label htmlFor="phone">Phone</label>
                        <input type="text" className="form-control" name="phone" value={user.phone} onChange={this.handleChange} />
                        {submitted && !user.phone &&
                            <div className="help-block">Phone is required</div>
                        }
                    </div>
                    <div className={'form-group' + (submitted && !user.about ? ' text-danger' : '')}>
                        <label htmlFor="about">About</label>
                        <input type="text" className="form-control" name="about" value={user.about} onChange={this.handleChange} />
                        <input type="hidden" className="form-control hidden" name="lastImage" value={user.image} onChange={this.handleChange} />
                        {submitted && !user.about &&
                            <div className="help-block">About is required</div>
                        }
                    </div>

                    <div className={'uploadimage' + (submitted && !user.image ? ' text-danger' : '')}>
                        <input type="file" className='width' name="image" onChange={this.handleChange} />
                        <p>Upload Profile Image</p>
                        {submitted && !user.image &&
                            <div className="help-block">Image is required</div>
                        }
                    </div>prof

                    <div className="form-group">
                        <button className="btn col-md-6 offset-md-3 btn-dark">Register</button>
                        {registering &&
                            <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                        }
                        {/* <Link to="/login" className="btn btn-link">Cancel</Link> */}
                    </div>
                </form>
            </div>
        );
    }
}

function mapState(state) {
    const { registering } = state.registration;
    const { authentication } = state;
    const { user } = authentication;
    const loggedInUser = user;
    return { registering, loggedInUser };
}

const actionCreators = {
    getUsers: userActions.getAll,
    updateProfile: userActions.updateProfile
}

const connectedRegisterPage = connect(mapState, actionCreators)(profile);
export { connectedRegisterPage as profile };