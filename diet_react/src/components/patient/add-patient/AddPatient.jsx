import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import HttpService from '../../../Services/HttpService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Moment from 'moment';
import DatePicker from "react-datepicker";

const validNameRegex = RegExp(
    /^[a-zA-Z ]*$/i
);
const validEmailRegex = RegExp(
    /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
);
const validMobileRegex = RegExp(
    /^[0-9 ]{0,10}$/i
);

toast.configure()
class AddPatientComponent extends Component{
    constructor(){
        super()

        this.state = {
            patient_id : '',
            name : '',
            email : '',
            mobile : '',
            gender : 'Male',
            address : '',
            medicalHistory:'',
            dob  : new Date(),
            isNew : 1,
            errors: {}
        }
        this.onSubmitForm = this.onSubmitForm.bind(this);
        this.onChangeState = this.onChangeState.bind(this);
        this.genderOnChange = this.genderOnChange.bind(this);
        this.dateOnChange = this.dateOnChange.bind(this);
        // this.statusOnChange = this.statusOnChange.bind(this);
    }

    componentDidMount(){
        const { match: { params } } = this.props;
        if(params.patientId != undefined){//edit
            this.setState({isNew : 0});
            HttpService.get(`patient/${params.patientId}`).then((result)=>{
                this.setState({
                    patient_id       : result.data.patient_id,
                    name            : result.data.name,
                    email           : result.data.email,
                    mobile          : result.data.mobile,
                    dob             : new Date(result.data.dob),
                    gender          : result.data.gender,
                    address         : result.data.address,
                    medicalHistory  : result.data.medicalHistory,
                    status          : result.data.status
                })
            }).catch((err) =>{
                console.log(err);
            })

        }else{//add
            this.setState({isNew : 1});
        }
    }
    onSubmitForm(e){
        if(this.isFormValid()){
            let params = {
                patient_id       : this.state.patient_id,
                name            : this.state.name,
                email           : this.state.email,
                mobile          : this.state.mobile,
                dob             : Moment(this.state.dob).format('YYYY-MM-DD'),
                gender          : this.state.gender,
                address         : this.state.address,
                medicalHistory  : this.state.medicalHistory
            }
            if(this.state.isNew == 1){
                HttpService.post('patient',params).then((result)=>{
                    toast.success("Patient added successfully!", { autoClose : 2000 });
                    this.props.history.push('/list-patient');
                }).catch((error)=>{
                    console.log(error);
                });
            }else{
                HttpService.put('patient',params).then((result)=>{
                    toast.success("Patient updated successfully!", { autoClose : 2000 });
                    this.props.history.push('/list-patient');
                }).catch((error)=>{
                    console.log(error);
                });
            }
            
        }
        e.preventDefault();
    }

    dateOnChange(e){
        this.setState({dob : e});
    }
    onChangeState(event){
        this.setState({[event.target.name] : event.target.value});
    }
    genderOnChange(e){
        if(e.target.id === 'rbMale'){
            this.setState({gender : 'Male'});
        }else{
            this.setState({gender : 'Female'});
        }
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
        }else if(this.state.mobile === '' || !validMobileRegex.test(this.state.mobile)){
            if(this.state.mobile === ''){
                this.setState({
                    errors: {
                        mobile: "Enter mobile no.!",
                    }
                });
                isValid = false;
            }else if(!validMobileRegex.test(this.state.mobile)){
                this.setState({
                    errors: {
                        mobile: "Invalid mobile no.",
                    }
                });
                isValid = false;
            }
        }else if(this.state.email === '' || !validEmailRegex.test(this.state.email)){
            if(this.state.email === ''){
                this.setState({
                    errors: {
                        email: "Enter email!",
                    }
                });
                isValid = false;
            }else if(!validEmailRegex.test(this.state.email)){
                this.setState({
                    errors: {
                        email: "Invalid email",
                    }
                });
                isValid = false;
            }
        }else if(this.state.dob === '' || this.state.dob === null){
            this.setState({
                errors: {
                    dob: "Choose DOB",
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
                            <h3 className="card-title">Add Patient</h3>
                            <div className="card-tools">
                           </div>
                        </div>
                        <form onSubmit={this.onSubmitForm}>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-6" style={{textAlign:'left'}}>
                                        <div className="form-group">
                                            <label htmlFor="name">Name<span className="span_compulary">*</span></label>
                                            <input type="text" className="form-control" maxLength="100" name="name" value={this.state.name} placeholder="Name" onChange={this.onChangeState}/>
                                            { this.state.errors.name !== undefined && (<span className="error-span">{this.state.errors.name}</span>)}
                                        </div>
                                    </div>
                                    <div className="col-md-6" style={{textAlign:'left'}}>
                                        <div className="form-group">
                                            <label htmlFor="email">Email<span className="span_compulary">*</span></label>
                                            <input type="text" className="form-control" maxLength="100" name="email" value={this.state.email} placeholder="email" onChange={this.onChangeState}/>
                                            { this.state.errors.email !== undefined && (<span className="error-span">{this.state.errors.email}</span>)}
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6" style={{textAlign:'left'}}>
                                        <div className="form-group">
                                            <label htmlFor="mobile">Mobile<span className="span_compulary">*</span></label>
                                            <input type="mobile" className="form-control" maxLength="10" name="mobile" value={this.state.mobile} placeholder="mobile" onChange={this.onChangeState}/>
                                            { this.state.errors.mobile !== undefined && (<span className="error-span">{this.state.errors.mobile}</span>)}
                                        </div>
                                    </div>
                                    <div className="col-md-6 radio-with-label" style={{display:'flex'}}>
                                        <label htmlFor="gender">Gender<span className="span_compulary">*</span></label>
                                        <div className="form-group clearfix">
                                            <div className="icheck-primary d-inline" style={{marginRight:'15px'}}>
                                                <input type="radio" id="rbMale" name="gender" checked={this.state.gender === 'Male'} onChange={this.genderOnChange}/>
                                                <label className="custom-form-label" htmlFor="rbMale">
                                                    Male
                                                </label>
                                            </div>
                                            <div className="icheck-primary d-inline">
                                                <input type="radio" id="rbFemale" name="gender" checked={this.state.gender === 'Female'} onChange={this.genderOnChange}/>
                                                <label className="custom-form-label" htmlFor="rbFemale">
                                                    Female
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6" style={{textAlign:'left'}}>
                                        <div className="form-group">
                                            <label htmlFor="dob">DOB<span className="span_compulary">*</span></label>
                                            <div className="input-group date" id="reservationdate" data-target-input="nearest">
                                                <DatePicker  className="form-control datetimepicker-input col-md-8" id="dob" selected={this.state.dob} dateFormat="dd/MM/yyyy" onChange={this.dateOnChange} />
                                                { this.state.errors.dob !== undefined && (<span className="error-span">{this.state.errors.dob}</span>)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12" style={{textAlign:'left'}}>
                                        <div className="form-group">
                                            <label htmlFor="address">Address</label>
                                            <textarea className="form-control" maxLength="150" id="dob" placeholder="Address" name="address" onChange={this.onChangeState}></textarea>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12" style={{textAlign:'left'}}>
                                        <div className="form-group">
                                            <label htmlFor="history">Medical History</label>
                                            <textarea className="form-control" maxLength="150" id="dob" placeholder="Medical/Diet history" name="medicalHistory" onChange={this.onChangeState}></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer">
                                { this.state.isNew === 1 && (<button type="submit" className="btn btn-info">Create Patient</button>)}
                                { this.state.isNew === 0 && (<button type="submit" className="btn btn-info">Update Patient</button>)}
                                <Link to="/list-patient" type="button" className="btn btn-default float-right">Patient List</Link>
                            </div>
                        </form>
                        
                    </div>
                </div>
            </section>
        )
    }
}

export default AddPatientComponent;