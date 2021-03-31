import React,{Component} from 'react';
import { Route,Redirect } from 'react-router-dom';
import AuthenticationService from '../Services/AuthenticationService.js';
class AuthenticatedRoutes extends Component{
    render(){
        if(AuthenticationService.isUserLoggedIn()){
            return <Route {...this.props} />
        }else{
            return <Redirect to="/login" />
        }
    }
}

export default AuthenticatedRoutes