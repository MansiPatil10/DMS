import React, {Component} from 'react';
import HttpService from '../../../Services/HttpService';
import { Link, withRouter } from 'react-router-dom';
class ListConsulationComponent extends Component{
    constructor(){
        super()
        this.state = {
            consultationList : []
        }
    }

    componentDidMount(){
        HttpService.get('user/role/RECEPTIONIST').then((result)=>{
            this.setState({ userList : result.data });
        }).catch((err) => { 
            console.log(err);

        })
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
                                            <input type="text" name="table_search" className="form-control float-right" placeholder="Search" />
                                            <div className="input-group-append">
                                                <button type="submit" className="btn btn-default"><i className="fas fa-search"></i></button>
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
                                                this.state.userList.map((user,index) =>(
                                                    <tr key={user.userId}>
                                                        <td>{index+1}</td>
                                                        <td>{user.name}</td>
                                                        <td>{user.username}</td>
                                                        <td>{user.role}</td>
                                                        <td>{user.status}</td>
                                                        <td style={{ width:'10%' }}>
                                                            <Link to={{
                                                                pathname: `/edit-user/${user.userId}`, 
                                                                query   : {
                                                                    userData : JSON.stringify(user)
                                                                }
                                                            }} type="button" className="btn btn-primary" style={{ marginRight : '5px' }}>Edit</Link>
                                                            <button type="button" className="btn btn-danger">Delete</button>
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

export default ListConsulationComponent;