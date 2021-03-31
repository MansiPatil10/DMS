import React, {Component} from 'react';
import HttpService from '../../../Services/HttpService';
import { Link, withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure()
class ListUserComponent extends Component{
    constructor(){
        super()
        this.state = {
            search : '',
            tmpUserList : [],
            userList : []
        }

        this.getUserList = this.getUserList.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.onChangeState = this.onChangeState.bind(this);
    }

    componentDidMount(){
        this.getUserList();
    }

    onSearch(){
        if(this.state.search != ''){
            let dt = this.state.userList.filter((user)=>{
                if(user.name.toLocaleLowerCase().includes(this.state.search.toLocaleLowerCase()) || user.username.toLocaleLowerCase().includes(this.state.search.toLocaleLowerCase()) || user.role.toLocaleLowerCase().includes(this.state.search.toLocaleLowerCase())){
                    return user;
                }
            });

            this.setState({ tmpUserList : dt });
        }else{
            this.setState({ tmpUserList : this.state.userList });
        }
    }

    getUserList(){
        HttpService.get('user/role/RECEPTIONIST').then((result)=>{
            this.setState({ userList : result.data, tmpUserList : result.data });
        }).catch((err) => { 
            console.log(err);
        })
    }

    deleteUser(userId){
        HttpService.put(`user/${userId}/status/DISABLED`).then((result)=>{
            toast.success("User deleted successfully!", { autoClose : 2000 });
            this.getUserList();
        }).catch((err)=>{
            console.log(err)
        })
    }

    enableUser(userId){
        HttpService.put(`user/${userId}/status/ACTIVE`).then((result)=>{
            toast.success("User activated successfully!", { autoClose : 2000 });
            this.getUserList();
        }).catch((err)=>{
            console.log(err)
        })
    }

    onChangeState(event){
        this.setState({[event.target.name] : event.target.value});
    }
    render(){
        return (
            <section className="content" style={{marginTop : '20px'}} >
                <div className="container">
                    <div className="row" style={{marginTop : '20px'}}>
                        <div className="col-12" style={{display:'flex',justifyContent : 'flex-end'}}>
                            <Link to="/add-user" type="button" className="btn btn-primary">Add New</Link>
                        </div>
                    </div>
                    <div className="row" style={{marginTop : '20px'}}>
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">User List</h3>
                                    <div className="card-tools">
                                        <div className="input-group input-group-sm" style={{width: '150px'}}>
                                            <input type="text" name="search" className="form-control float-right" placeholder="Search" onChange={this.onChangeState}/>
                                            <div className="input-group-append">
                                                <button type="submit" className="btn btn-default" onClick={this.onSearch}><i className="fas fa-search"></i></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body table-responsive p-0">
                                    <table className="table table-head-fixed text-nowrap">
                                        <thead>
                                            <tr>
                                                <th style={{ width:'5%' }}>#</th>
                                                <th style={{ width:'10%' }}>Name</th>
                                                <th style={{ width:'10%' }}>Username</th>
                                                <th style={{ width:'65%' }}>Role</th>
                                                <th style={{ width:'10%' }}>Status</th>
                                                <th style={{ width:'10%' }}>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.tmpUserList.map((user,index) =>(
                                                    <tr key={user.userId}>
                                                        <td>{index+1}</td>
                                                        <td>{user.name}</td>
                                                        <td>{user.username}</td>
                                                        <td>{user.role}</td>
                                                        <td>{user.status}</td>
                                                        <td style={{ width:'10%' }}>
                                                            <Link to={`/edit-user/${user.userId}`} type="button" className="btn btn-xs btn-primary" style={{ marginRight : '5px' }}>Edit</Link>
                                                            { user.status == 'ACTIVE'   && (<button type="button" className="btn btn-xs btn-danger" onClick={()=>this.deleteUser(user.userId)}>Delete</button>)}
                                                            { user.status == 'DISABLED' && (<button type="button" className="btn btn-xs btn-primary" onClick={()=>this.enableUser(user.userId)}>Make Active</button>)}
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}

export default ListUserComponent;