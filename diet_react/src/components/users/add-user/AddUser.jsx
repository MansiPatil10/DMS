import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import HttpService from '../../../Services/HttpService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const validNameRegex = RegExp(
    /^[a-zA-Z ]*$/i
);

const validUserNameRegex = RegExp(
    /^[0-9a-zA-Z]*$/i
);

toast.configure()
class AddUserComponent extends Component{
    constructor(){
        super()

        this.state = {
            userId : '',
            name : '',
            username : '',
            password : '',
            role : 'RECEPTIONIST',
            status : 'ACTIVE',
            isNew : true,
            errors : {}
        }
        this.onSubmitForm = this.onSubmitForm.bind(this);
        this.onChangeState = this.onChangeState.bind(this);
        this.statusOnChange = this.statusOnChange.bind(this);
    }

    componentDidMount(){
        const { match: { params } } = this.props;
        if(params.userId != undefined){//edit
            this.setState({isNew : 0});
            HttpService.get(`user/${params.userId}`).then((result)=>{
                this.setState({
                    userId : result.data.userId,
                    name : result.data.name,
                    username : result.data.username,
                    role : result.data.role,
                    status : result.data.status
                })
            }).catch((err) =>{
                console.log(err);
            })

        }else{//add
            this.setState({isNew : 1});
        }
    }

    statusOnChange(e){
        if(e.target.id === 'rbActive'){
            this.setState({status : 'ACTIVE'});
        }else{
            this.setState({status : 'DISABLED'});
        }
    }
    onSubmitForm(e){
        if(this.isFormValid()){
            let data = {
                userId : this.state.userId,
                name   : this.state.name,
                username : this.state.username,
                password : this.state.password,
                role : this.state.role,
                status : this.state.status
            }

            if(this.state.isNew){//add
                HttpService.post('user/receptionist',data).then((result)=>{
                    toast.success("User added successfully!", { autoClose : 2000 });
                    this.props.history.push('/list-user');
                }).catch((err)=>{
                    console.log(err);
                })
            }else{//update
                HttpService.put('user',data).then((result)=>{
                    toast.success("User updated successfully!", { autoClose : 2000 });
                    this.props.history.push('/list-user');
                }).catch((err)=>{
                    console.log(err);
                })
            }
        }
        e.preventDefault();
    }

    onChangeState(event){
        this.setState({[event.target.name] : event.target.value});
    }

    isFormValid(){
        let isValid = true;
        if(this.state.name === '' || !validNameRegex.test(this.state.name)){
            if(this.state.name === ''){
                this.setState({
                    errors: {
                        name: "Please enter name!",
                    }
                });
            }else if(!validNameRegex.test(this.state.name)){
                this.setState({
                    errors: {
                        name: "Numeric,special character or space not allowed!",
                    }
                });
            }
            isValid = false;
        }else if(this.state.username === '' || !validUserNameRegex.test(this.state.username) || this.state.username === 'admin' || this.state.username === 'ADMIN'){
            if(this.state.username === ''){
                this.setState({
                    errors: {
                        username: "Enter username!",
                    }
                });
                isValid = false;
            }else if(!validNameRegex.test(this.state.username)){
                this.setState({
                    errors: {
                        username: "Special character or space not allowed!",
                    }
                });
                isValid = false;
            }else{
                this.setState({
                    errors: {
                        username: "Username should not be ADMIN/admin!",
                    }
                });
                isValid = false;
            }
        }else if(this.state.password === ''){
            this.setState({
                errors: {
                    password: "Enter Password!",
                }
            });
            isValid = false;
        }else{
            this.setState({
                errors: {}
            });
            isValid = true;
        }

        return isValid;
    }

    render(){
        return (
            <section className="content" style={{marginTop : '20px'}} >
                <div className="container">
                    <div className="card card-default">
                        <div className="card-header">
                            <h3 className="card-title">Add User</h3>
                            <div className="card-tools">
                           </div>
                        </div>
                        <form onSubmit={this.onSubmitForm}>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-6" style={{textAlign:'left'}}>
                                        <div className="form-group">
                                            <label htmlFor="name">Name</label>
                                            <input type="text" className="form-control" name="name" value={this.state.name} placeholder="Name" onChange={this.onChangeState}/>
                                            { this.state.errors.name !== undefined && (<span className="error-span">{this.state.errors.name}</span>)}
                                        </div>
                                    </div>
                                    <div className="col-md-6" style={{textAlign:'left'}}>
                                        <div className="form-group">
                                            <label htmlFor="username">Username</label>
                                            <input type="text" className="form-control" name="username" value={this.state.username} placeholder="Username" onChange={this.onChangeState}/>
                                            { this.state.errors.username !== undefined && (<span className="error-span">{this.state.errors.username}</span>)}
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6" style={{textAlign:'left'}}>
                                        <div className="form-group">
                                            <label htmlFor="password">Password</label>
                                            <input type="password" className="form-control" name="password" value={this.state.password} placeholder="password" onChange={this.onChangeState}/>
                                            { this.state.errors.password !== undefined && (<span className="error-span">{this.state.errors.password}</span>)}
                                        </div>
                                    </div>
                                    <div className="col-md-6" style={{textAlign:'left'}}>
                                        <div className="form-group">
                                            <label htmlFor="role">Role</label>
                                            <input type="text" className="form-control col-md-4" name="role" value={this.state.role} placeholder="Role" disabled={true} onChange={this.onChangeState}/>
                                        </div>
                                    </div>
                                </div>
                                {/* <div className="row">
                                    <div className="col-md-6 radio-with-label" style={{display:'flex'}}>
                                        <label htmlFor="status">Status</label>
                                        <div className="form-group clearfix">
                                            <div className="icheck-primary d-inline" style={{marginRight:'15px'}}>
                                                <input type="radio" id="rbActive" name="status" checked={this.state.status === 'ACTIVE'} onChange={this.statusOnChange}/>
                                                <label className="custom-form-label" htmlFor="rbActive">
                                                    ACTIVE
                                                </label>
                                            </div>
                                            <div className="icheck-primary d-inline">
                                                <input type="radio" id="rbDisabled" name="status" checked={this.state.status === 'DISABLED'} onChange={this.statusOnChange}/>
                                                <label className="custom-form-label" htmlFor="rbDisabled">
                                                    DISABLED
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div> */}

                            </div>
                            <div className="card-footer">
                                { this.state.isNew === 1 && (<button type="submit" className="btn btn-info">Create User</button>)}
                                { this.state.isNew === 0 && (<button type="submit" className="btn btn-info">Update User</button>)}
                                <Link to="/list-user" type="button" className="btn btn-default float-right">User List</Link>
                            </div>
                        </form>
                        
                    </div>
                </div>
            </section>
        )
    }
}

export default AddUserComponent;