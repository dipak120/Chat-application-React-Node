import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { userActions } from '../_actions';
import { PropTypes } from 'react'

class createPassword extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            confirmpassword: '',
            error: '',
            _id: '',
            submitted: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    componentDidMount() {
        const { id } = this.props.match.params
        this.setState({ _id: id });
    }

    handleSubmit(e) {
        e.preventDefault();
        const { username, password, confirmpassword, submitted, _id } = this.state;
        this.setState({ submitted: true });
        if (password != confirmpassword) {
            this.setState({ submitted: false });
            this.setState({ error: 'password not match' })
        } else {
            this.setState({ submitted: true });
        }
        if (confirmpassword && password && submitted != false) {
            const password2 = { password, _id }
            this.props.addpassword(password2);
        }
    }

    render() {
        const { createpass } = this.props;
        const { username, password, submitted, confirmpassword, error } = this.state;
        return (
            <div className="form-main col-md-6 col-md-offset-3">
                <div class="form-heading">
                    <h3 class="form-title">Create Password</h3>
                </div>
                <form name="form" onSubmit={this.handleSubmit} >
                    <div className={'form-group' + (submitted && !password ? ' text-danger' : '')}>
                        <label htmlFor="password">New Password</label>
                        <input type="password" className="form-control" name="password" value={password} onChange={this.handleChange} />
                        {submitted && !password &&
                            <div className="help-block">Password is required</div>
                        }
                    </div>
                    <div className={'form-group' + (submitted && !confirmpassword ? ' text-danger' : '')}>
                        <label htmlFor="confirmpassword">Confirm Password</label>
                        <input type="password" className="form-control" name="confirmpassword" value={confirmpassword} onChange={this.handleChange} />
                        {submitted && !password &&
                            <div className="help-block">Confirm Password is required</div>
                        }
                        {!submitted && error &&
                            <div className="help-block">Passwords do not match.</div>
                        }
                    </div>
                    <div className="form-group">
                        <button className="btn col-md-6 offset-md-3 btn-dark">Submit</button>
                        {createpass &&
                            <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                        }
                        {/* <Link to="/register" className="btn btn-link">Register</Link> */}
                    </div>
                </form>
            </div>
        );
    }
}

function mapState(state) {
    const { createpass } = state.addedPassword;
    return { createpass };
}

const actionCreators = {
    addpassword: userActions.addpassword
}
export default createPassword = connect(mapState, actionCreators)(createPassword);
