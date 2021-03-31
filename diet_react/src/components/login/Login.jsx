import React, {Component} from 'react';
import './Login.css';
import AuthenticationService from '../../Services/AuthenticationService.js';
import HttpService from '../../Services/HttpService.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jwt_decode from "jwt-decode";
import { Link } from 'react-router-dom';

toast.configure()
class LoginComponent extends Component{
   
    constructor(){
        super();
        this.state = {
            username : '',
            password : '',
            isSuccess : false,
            isFailed : false
        }

        this.onChangeState = this.onChangeState.bind(this); 
        this.onLoginClick  = this.onLoginClick.bind(this); 
    }

    onChangeState(event){
        this.setState({[event.target.name] : event.target.value});
    }

    onLoginClick(){ 
        if(this.state.username !== '' && this.state.password !== ''){
            let params = {
                username : this.state.username,
                password : this.state.password
            }
            HttpService.post('token/generate-token',params)
            .then((response)=>{
                toast.success("Welcome!", { autoClose : 2000 });
                this.setState({isFailed : false,isSuccess:true});
                let tokenData = jwt_decode(response.data.token);
                AuthenticationService.setLoginData({'username' : this.state.username,'token':response.data.token,'designation': tokenData.scopes.split('_')[1]});
                this.props.history.push(`/home`);
            }).catch(() =>{
                this.setState({password : ''})
                toast.error("Please username or password!", { autoClose : 2000 });
                this.setState({isSuccess :  false, isFailed : true})
            });            
        }else{
            toast.error("Please enter username & password!", { autoClose : 2000 });
        }
    }


    render(){
        return (
            <div className="login">
                <div className="login-box">
                    <div className="login-logo">
                        <Link to="/home"><b>DMS</b></Link>
                    </div>
 
                    <div className="card">
                        <div className="card-body login-card-body">
                            <p className="login-box-msg">Sign in to start your session</p>
                            <div className="input-group mb-3">
                                <input type="email" className="form-control" placeholder="Username" name="username" value={this.state.username} onChange={this.onChangeState} />
                                <div className="input-group-append">
                                    <div className="input-group-text">
                                        <span className="fas fa-envelope"></span>
                                    </div>
                                </div>
                            </div>
                            <div className="input-group mb-3">
                                <input type="password" className="form-control" placeholder="Password" name="password" value={this.state.password} onChange={this.onChangeState}/>
                                <div className="input-group-append">
                                    <div className="input-group-text">
                                        <span className="fas fa-lock"></span>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-4">
                                    <button type="button" className="btn btn-primary btn-block" disabled={this.state.username === '' || this.state.password === ''} onClick={this.onLoginClick}>Sign In</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default LoginComponent;
