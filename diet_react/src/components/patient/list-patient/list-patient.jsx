import React, {Component} from 'react';
import HttpService from '../../../Services/HttpService';
import { Link, withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure()
class ListPatientComponent extends Component{
    constructor(){
        super()
        this.state = {
            search : '',
            tmpPatientList : [],
            patientList : []
        }

        this.onSearch = this.onSearch.bind(this);
        this.onChangeState = this.onChangeState.bind(this);
    }

    componentDidMount(){
        this.getPatienList();
    }

    onSearch(){
        if(this.state.search !== ''){
            let dt = this.state.patientList.filter((patient)=>{
                if(patient.name.toLocaleLowerCase().includes(this.state.search.toLocaleLowerCase()) || patient.mobile.toLocaleLowerCase().includes(this.state.search.toLocaleLowerCase())){
                    return patient;
                }
            });
            this.setState({ tmpPatientList : dt });
        }else{
            this.setState({ tmpPatientList : this.state.patientList });
        }
    }

    getPatienList(){
        HttpService.get('patient/list').then((result)=>{
            this.setState({ patientList : result.data, tmpPatientList : result.data });
        }).catch((err) => { 
            console.log(err);
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
                            <Link to="/add-patient" type="button" className="btn btn-primary">Add New</Link>
                        </div>
                    </div>
                    <div className="row" style={{marginTop : '20px'}}>
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">Patient List</h3>
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
                                                <th style={{ width:'75%' }}>Name</th>
                                                <th style={{ width:'10%' }}>Mobile</th>
                                                <th style={{ width:'10%' }}>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.tmpPatientList.map((patient,index) =>(
                                                    <tr key={patient.patient_id}>
                                                        <td>{index+1}</td>
                                                        <td>{patient.name}</td>
                                                        <td>{patient.mobile}</td>
                                                        <td style={{ width:'10%' }}>
                                                            <Link to={`/edit-patient/${patient.patient_id}`} type="button" className="btn btn-xs btn-primary" style={{ marginRight : '5px' }}>Edit</Link>
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

export default ListPatientComponent;