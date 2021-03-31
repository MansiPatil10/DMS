import React, {Component} from 'react';
import DatePicker from "react-datepicker";
import './appointment.css';
import Select from 'react-select';
import "react-datepicker/dist/react-datepicker.css";
import { Link } from 'react-router-dom';
import HttpService from '../../Services/HttpService';
import Moment from 'moment';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const validEmailRegex = RegExp(
    /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
);

const validNameRegex = RegExp(
    /^[a-zA-Z ]*$/i
);

const validMobileRegex = RegExp(
    /^[0-9 ]{0,10}$/i
);

toast.configure()

class AppointmentComponent extends Component{
    constructor(){
        super()
        this.state = {
            isNewPatient : true,
            appointment_no : '',
            patient_id : 0,
            isCasePaperExpired : true,
            casePaperNo : 0,
            name : '',
            email : '',
            mobile : '',
            gender : 'Male',
            address : '',
            medicalHistory:'',
            patientList : [],
            date : new Date(),
            dob  : new Date(),
            amount: 0,
            errors: {}
        }

        this.dateOnChange = this.dateOnChange.bind(this);
        this.dobOnChange = this.dobOnChange.bind(this);
        this.patientOnChange = this.patientOnChange.bind(this);
        this.onChangeState = this.onChangeState.bind(this);
        this.onPatientSelect = this.onPatientSelect.bind(this);
        this.onSubmitForm = this.onSubmitForm.bind(this);
        this.genderOnChange = this.genderOnChange.bind(this);
        this.resetForm = this.resetForm.bind(this);
        
    }

    onChangeState(event){
        this.setState({[event.target.name] : event.target.value});
    }

    componentDidMount(){
        HttpService.get('patient/list').then((response)=>{
            let temp = [];
            for (var key of Object.keys(response.data)) {
                temp.push({
                    label : response.data[key].name+"("+ response.data[key].mobile +")",
                    value : response.data[key].patient_id
                })
            }
            this.setState({patientList : temp});
            
        }).catch((err) =>{
            console.log(err)
        })
    }

    onPatientSelect(e){
        if(e !== null){
            this.setState({patient_id : e.value});
            this.getPatientDetails(e.value);
        }
    }

    dateOnChange(e){
        this.setState({date : e});
    }
    dobOnChange(e){
        this.setState({dob : e});
    }

    patientOnChange(e){
        if(e.target.id === 'old-patient'){
            this.setState({isNewPatient : false});
        }else{
            this.setState({isNewPatient : true});
        }
        this.resetForm();
    }
    genderOnChange(e){
        if(e.target.id === 'rbMale'){
            this.setState({gender : 'Male'});
        }else{
            this.setState({gender : 'Female'});
        }
    }

    getPatientDetails(patient_id){
        HttpService.get('patient/'+patient_id).then((result)=>{
            this.setState({
                patient_id : result.data.patient_id,
                name : result.data.name,
                email : result.data.email,
                mobile : result.data.mobile,
                gender : result.data.gender,
                address : result.data.address,
                dob : new Date(result.data.dob),
                medicalHistory : result.data.medicalHistory,
                amount : 0
            });
            HttpService.get('casepaper/patient/'+this.state.patient_id).then((result)=>{
                let endDate = result.data.endDate;
                if(Moment(endDate).isAfter(new Date())){
                    this.setState({casePaperNo : result.data.casePaperNo});
                    this.setState({isCasePaperExpired : false});
                }else{
                    this.setState({isCasePaperExpired : true});
                }
            }).catch((err)=>{
                if(err.response !==undefined && err.response.data.error_code === 404){
                    this.setState({isCasePaperExpired : true});
                }
            });
        }).catch((err) =>{
            console.log(err);
        });
    }

    onSubmitForm(e){
        if(this.isFormValid()){
            if(this.state.isNewPatient){//NEW PATIENT
                //1. create patient 
                let params = {
                    name            : this.state.name,
                    email           : this.state.email,
                    mobile          : this.state.mobile,
                    dob             : Moment(this.state.dob).format('YYYY-MM-DD'),
                    gender          : this.state.gender,
                    address         : this.state.address,
                    medicalHistory  : this.state.medicalHistory
                }
                
                HttpService.post('patient',params).then((result)=>{
                    this.setState({patient_id : result.data.patient_id});
                    //2. create casepaper
                    let caseParams = {
                        patientId : this.state.patient_id,
                        startDate : Moment(this.state.date).format('YYYY-MM-DD'),
                        endDate : Moment(this.state.date,'YYYY-MM-DD').add(30, 'days'),
                        amount : this.state.amount
                    }
                    HttpService.post('casepaper',caseParams).then((result)=>{
                        this.setState({casePaperNo : result.data.casePaperNo});
                        this.addAppointment();
                    }).catch((err)=>{
                        console.log(err);
                    });
                    
                }).catch((error)=>{
                    if(error.response.status === 400){
                        this.setState({
                            errors: {
                                mobile: error.response.data.error_message,
                            }
                        });
                    }
                });
            }else{ // EXISTING PATIENT
                if(this.state.isCasePaperExpired){
                    let caseParams = {
                        patientId : this.state.patient_id,
                        startDate : Moment(this.state.date).format('YYYY-MM-DD'),
                        endDate : Moment(this.state.date,'YYYY-MM-DD').add(30, 'days'),
                        amount : this.state.amount                    }
                    HttpService.post('casepaper',caseParams).then((result)=>{
                        this.setState({casePaperNo : result.data.casePaperNo});
                        this.addAppointment();
                    }).catch((err)=>{
                        console.log(err);
                    });
                   
                }else{
                    this.addAppointment();
                }
            }
        }
        e.preventDefault();
    }

    resetForm(){
        this.setState({
            appointment_no : '',
            patient_id : 0,
            casePaperNo : 0,
            name : '',
            email : '',
            mobile : '',
            gender : 'Male',
            address : '',
            medicalHistory:'',
            amount : 0,
            errors: {}
        });
    }

    addAppointment(){
        let params = {
            appointmentDate : Moment(this.state.date).format('YYYY-MM-DD'),
            casePaperNo     : this.state.casePaperNo
        }
        
        HttpService.post('appointment',params).then((result)=>{
            toast.success("Appointment added successfully!", { autoClose : 2000 });
            this.props.history.push('/home');
            // console.log("appointment",result);
        }).catch((err)=>{
            console.log(err);
        });
    }

    isFormValid(){
        let isValid = true;
        if(this.state.date === ''){
            this.setState({
                errors: {
                    date: "Choose appointment date!",
                }
            });
            isValid = false;
        }else if(this.state.name === '' || !validNameRegex.test(this.state.name)){
            if(this.state.name === ''){
                this.setState({
                    errors: {
                        name: "Enter patient name!",
                    }
                });
                isValid = false;
            }else if(!validNameRegex.test(this.state.name)){
                this.setState({
                    errors: {
                        name: "Numeric or special character not allowed!",
                    }
                });
                isValid = false;
            }
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
        }else if(this.state.isCasePaperExpired && (this.state.amount === '' || this.state.amount === 0)){
            this.setState({
                errors: {
                    amount: "Enter casepaper amount",
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
                            <h3 className="card-title">Appointment Booking</h3>
                            <div className="card-tools">
                           </div>
                        </div>
                        <form onSubmit={this.onSubmitForm}>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-6" style={{textAlign:'left'}}>
                                        <div className="form-group">
                                            <label htmlFor="appointment_no">Appointment No.</label>
                                            <input type="text" className="form-control col-md-4" name="appointment_no" value={this.state.appointment_no} placeholder="Appointment No." disabled={true} onChange={this.onChangeState}/>
                                        </div>
                                    </div>
                                    <div className="col-md-6" style={{textAlign:'left'}}>
                                        <div className="form-group">
                                            <label htmlFor="appointment_date">Appointement Date</label>
                                            <div className="input-group date" id="reservationdate" data-target-input="nearest">
                                                <DatePicker  className="form-control datetimepicker-input col-md-8" id="appointment_date" selected={this.state.date} dateFormat="dd/MM/yyyy" onChange={this.dateOnChange} />
                                            </div>
                                            {/* { this.state.validation.date == true && (<span class="error-span">{this.state.validationMsg.date}</span>)} */}
                                            {/* <input type="text" className="form-control col-md-8" id="appointment_date" placeholder="Appointment Date"/> */}
                                        </div>
                                    </div>
                                </div>
                                <div className="row" style={{marginTop:'10px'}}>
                                    <div className="col-md-6" style={{display:'flex'}}>
                                        <div className="form-group clearfix">
                                            <div className="icheck-primary d-inline" style={{marginRight:'15px'}}>
                                                <input type="radio" id="new-patient" name="patient-status" onChange={this.patientOnChange} defaultChecked/>
                                                <label className="custom-form-label" htmlFor="new-patient">
                                                    New Patient
                                                </label>
                                            </div>
                                            <div className="icheck-primary d-inline">
                                                <input type="radio" id="old-patient" name="patient-status" onChange={this.patientOnChange} />
                                                <label className="custom-form-label" htmlFor="old-patient">
                                                    Old Patient
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6" style={{textAlign:'left'}}>
                                        {!this.state.isNewPatient && <div className="form-group">
                                            <label htmlFor="name">Name</label>
                                            <Select
                                                className="basic-single"
                                                classNamePrefix="Select Patient"
                                                // defaultValue={colourOptions[0]}
                                                // isDisabled="false"
                                                // isLoading={isLoading}
                                                name="patient_select"
                                                onChange={this.onPatientSelect}
                                                isClearable="true"
                                                isSearchable="true"
                                                name="color"
                                                options={this.state.patientList}
                                                />
                                        </div>
                                        }
                                        {this.state.isNewPatient && <div className="form-group">
                                            <label htmlFor="name">Name</label>
                                            <input type="text" className="form-control" maxLength="70" name="name" placeholder="Patient Name" value={this.state.patient_name} disabled={!this.state.isNewPatient} onChange={this.onChangeState}/>
                                            { this.state.errors.name !== undefined && (<span className="error-span">{this.state.errors.name}</span>)}
                                        </div>}
                                    </div>
                                    <div className="col-md-6" style={{textAlign:'left'}}>
                                        <div className="form-group">
                                            <label htmlFor="email">Email</label>
                                            <input type="text" className="form-control" maxLength="50" name="email" placeholder="Email" value={this.state.email} disabled={!this.state.isNewPatient} onChange={this.onChangeState}/>
                                            { this.state.errors.email !== undefined && (<span className="error-span">{this.state.errors.email}</span>)}
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6" style={{textAlign:'left'}}>
                                        <div className="form-group">
                                            <label htmlFor="mobile">Mobile No.</label>
                                            <input type="text" className="form-control" maxLength="10" name="mobile" placeholder="Mobile No." value={this.state.mobile} disabled={!this.state.isNewPatient} onChange={this.onChangeState}/>
                                            { this.state.errors.mobile !== undefined && (<span className="error-span">{this.state.errors.mobile}</span>)}
                                        </div>
                                    </div>
                                    <div className="col-md-6 radio-with-label" style={{display:'flex'}}>
                                        <label htmlFor="gender">Gender</label>
                                        <div className="form-group clearfix">
                                            <div className="icheck-primary d-inline" style={{marginRight:'15px'}}>
                                                <input type="radio" id="rbMale" name="gender" checked={this.state.gender === 'Male'} disabled={!this.state.isNewPatient} onChange={this.genderOnChange}/>
                                                <label className="custom-form-label" htmlFor="rbMale">
                                                    Male
                                                </label>
                                            </div>
                                            <div className="icheck-primary d-inline">
                                                <input type="radio" id="rbFemale" name="gender" checked={this.state.gender === 'Female'} disabled={!this.state.isNewPatient} onChange={this.genderOnChange}/>
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
                                            <label htmlFor="dob">DOB</label>
                                            <div className="input-group date" id="reservationdate" data-target-input="nearest">
                                                <DatePicker  className="form-control datetimepicker-input col-md-8" id="dob" selected={this.state.dob} dateFormat="dd/MM/yyyy" onChange={this.dobOnChange}  disabled={!this.state.isNewPatient}/>
                                            </div>
                                            {/* <input type="text" className="form-control col-md-6" id="dob" placeholder="Date of Birth" disabled={!this.state.isNewPatient}/> */}
                                        </div>
                                    </div>
                                    <div className="col-md-6" style={{textAlign:'left'}}>
                                        <div className="form-group">
                                            <label htmlFor="address">Address</label>
                                            <textarea className="form-control" maxLength="150" name="address" placeholder="Address" disabled={!this.state.isNewPatient}  onChange={this.onChangeState}></textarea>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12" style={{textAlign:'left'}}>
                                        <div className="form-group">
                                            <label htmlFor="history">Medical/Diet History</label>
                                            <textarea className="form-control" maxLength="150" name="medicalHistory" placeholder="Medical/Diet History" disabled={!this.state.isNewPatient}  onChange={this.onChangeState}></textarea>
                                        </div>
                                    </div>
                                </div>
                                { (this.state.isNewPatient || this.state.isCasePaperExpired ) && (
                                    <div className="row">
                                        <div className="col-md-6" style={{textAlign:'left'}}>
                                            <div className="form-group">
                                                <label htmlFor="amount">New Casepaper Amount</label>
                                                <input type="text" className="form-control col-md-4" name="amount" value={this.state.amount} placeholder="Amount" onChange={this.onChangeState}/>
                                                { this.state.errors.amount !== undefined && (<span className="error-span">{this.state.errors.amount}</span>)}
                                            </div>
                                        </div>
                                    </div>
                                 )}
                            </div>
                            
                            <div className="card-footer">
                                <button type="submit" className="btn btn-info">Book Appointment</button>
                                <Link to="/home" type="button" className="btn btn-default float-right">Cancel</Link>
                            </div>
                        </form>
                    </div>
                </div>
        </section>
            
        )
    }
}

export default AppointmentComponent;
