import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom'
import Login_Register from './Login_Register.jsx';
import About from './About.jsx';
import Users from './Users.jsx';
import NoMatch from './ErrorPage.jsx'

export default class Main extends React.Component {
    render() {
        return (
            <Switch>
                <Route exact path='/'
                       component={() => <Login_Register
                           isRegistered={this.props.isRegistered}
                           isAuthorized={this.props.isAuthorized}
                           handleNotRegisteredClick = {this.props.handleNotRegisteredClick}
                           handleLogInClick = {this.props.handleLogInClick}
                       />}
                />
                <Route path='/about' component={About}/>
                <Route path="/users" render={() => (
                        !this.props.isAuthorized ? (
                            <Redirect to="/"/>
                        ) : (
                            <Users/>
                        )
                )}/>
                <Route component={() => <NoMatch
                        isRegistered={this.props.isRegistered}
                        isAuthorized={this.props.isAuthorized}
                    />}
                />
            </Switch>
        )
    }
}