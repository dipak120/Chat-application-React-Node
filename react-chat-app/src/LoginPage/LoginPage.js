import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import 'jquery';
import { userActions } from '../_actions';

class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        // reset login status
        this.props.logout();

        this.state = {
            username: '',
            password: '',
            submitted: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleSubmit(e) {
        e.preventDefault();
        this.setState({ submitted: true });
        const { username, password } = this.state;
        if (username && password) {
            this.props.login(username, password);
        }
    }

    render() {
        const { loggingIn } = this.props;
        const { username, password, submitted } = this.state;
        return (

            <div id="login">
                <div className="container">
                    <div id="login-row" className="row justify-content-center align-items-center">
                        <div id="login-column" className="col-md-6">
                            <div id="login-box" className="col-md-12">
                                <form id="login-form" className="form" onSubmit={this.handleSubmit}>
                                    <h3 className="text-center text-dark mr-md-3">Login</h3>
                                    <div className={'form-group' + (submitted && !username ? ' text-danger' : '')}>
                                        <label for="username" className="text-dark">Username:</label><br />
                                        <input type="text" name="username" id="username" className="form-control" value={username} onChange={this.handleChange}/>
                                        {submitted && !username &&
                                            <div className="help-block">Username is required</div>
                                        }
                                    </div>
                                    <div className={'form-group' + (submitted && !password ? ' text-danger' : '')}>
                                        <label for="password" className="text-dark">Password:</label><br />
                                        <input type="password" name="password" id="password" className="form-control"  value={password} onChange={this.handleChange}/>
                                        {submitted && !password &&
                                            <div className="help-block">Password is required</div>
                                        }
                                    </div>
                                    <div className='form-group'>
                                        <label for="remember-me" className="text-primary"><span>Remember me</span> <span><input id="remember-me" name="remember-me" type="checkbox" /></span></label><br />
                                        <input type="submit" name="submit" className="btn btn-dark btn-md" value="submit" />
                                        {loggingIn &&
                                            <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                                        }
                                    </div>
                                    <div id="register-link" className="text-right">
                                        <Link to='/register' className="text-primary">Register here</Link>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            // <div className="row">
            //     <div className="col-md-6 offset-md-3">
            //         <div className="">
            //             <h3 className="rounded-pill text-dark w-20">Please sign in</h3>
            //         </div>
            //         <form name="form" onSubmit={this.handleSubmit}>
            //             <div className={'form-group' + (submitted && !username ? ' text-danger' : '')}>
            //                 <label htmlFor="username">Username</label>
            //                 <input type="text" className="form-control" name="username" value={username} onChange={this.handleChange} />
            //                 {submitted && !username &&
            //                     <div className="help-block">Username is required</div>
            //                 }
            //             </div>
            //             <div className={'form-group' + (submitted && !password ? ' text-danger' : '')}>
            //                 <label htmlFor="password">Password</label>
            //                 <input type="password" className="form-control" name="password" value={password} onChange={this.handleChange} />
            //                 {submitted && !password &&
            //                     <div className="help-block">Password is required</div>
            //                 }
            //             </div>
            //             <div className="form-group">
            //                 <button className="btn button-1">Login</button>
            //                 {loggingIn &&
            //                     <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
            //                 }
            //                 {/* <Link to="/register" className="btn btn-link">Register</Link> */}
            //             </div>
            //         </form>
            //     </div>
            // </div>
        );
    }
}

function mapState(state) {
    const { loggingIn } = state.authentication;
    return { loggingIn };
}

const actionCreators = {
    login: userActions.login,
    logout: userActions.logout
};

const connectedLoginPage = connect(mapState, actionCreators)(LoginPage);
export { connectedLoginPage as LoginPage };