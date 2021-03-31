import React, {Component, Fragment} from 'react';
import { Link, withRouter } from 'react-router-dom';
import './Header.css';
// import history from 'history/browser';
import AuthenticationService from '../../../Services/AuthenticationService';
// import companyLogo from './../../../../';
class HeaderComponent extends Component{
    constructor(){
        super();
        this.logout = this.logout.bind(this);
    }

    logout(){
        AuthenticationService.logout(); 
        this.props.history.push(`/login`);  
    }

    render(){
        if(!AuthenticationService.isUserLoggedIn()){
            return <div></div>;
        } 
        return (
            <div style={{ width : '100%' }}>
                {/* Navbar */}
                <nav className="main-header navbar navbar-expand-md navbar-light navbar-white">
                        <div className="container">
                            <Link className="navbar-brand" to="/home">
                                <span className="brand-text font-weight-light">DMS</span>
                            </Link>
                            <button className="navbar-toggler order-1" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon"></span>
                            </button>
                            <div className="collapse navbar-collapse order-3" id="navbarCollapse">
                                <ul className="navbar-nav">
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/home">Dashboard</Link>
                                    </li>
                                    {AuthenticationService.getDesignation() === 'RECEPTIONIST' && (
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/appointment">Appointment Booking</Link>
                                        </li>
                                    )}

                                    {AuthenticationService.getDesignation() === 'ADMIN' && (
                                        <Fragment>
                                            <li className="nav-item">
                                                <Link className="nav-link" to="/list-user">User Master</Link>
                                            </li>
                                            <li className="nav-item">
                                                <Link className="nav-link" to="/list-diet">Diet Master</Link>
                                            </li>
                                            <li className="nav-item">
                                                <Link className="nav-link" to="/list-patient">Patient Master</Link>
                                            </li>
                                        </Fragment>
                                    )}
                                    
                                </ul>
                                {/* <!-- Right navbar links --> */}
                                <ul className="order-1 order-md-3 navbar-nav navbar-no-expand ml-auto">
                                    <li className="nav-item">
                                        <Link to="" onClick={this.logout} className="nav-link">Logout</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </nav>
            </div>
            
        )
    }

    
}

export default withRouter(HeaderComponent);
