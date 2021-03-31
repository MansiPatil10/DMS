import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import HttpService from '../../../Services/HttpService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Moment from 'moment';
import DatePicker from "react-datepicker";
import Select from 'react-select';

const validNameRegex = RegExp(
    /^[a-zA-Z ]*$/i
);
const validEmailRegex = RegExp(
    /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
);
const validMobileRegex = RegExp(
    /^[0-9 ]{0,10}$/i
);

const validDecimalRegex = RegExp(
    /^\d+(\.\d{1,2})?$/i
);

toast.configure()
class AddConsulationComponent extends Component{
    constructor(){
        super()
        this.state = {
            consulationNo : '',
            patientId : 0,
            name : '',
            mobile : '',
            gender : 'Male',
            medicalHistory : '',
            appointmentNo : '',
            appointmentId : '',
            email:'',
            bmi : '',
            mobile : '',
            date : new Date(),
            dietPlanId : 0,
            height : 0,
            weight : 0,
            dietList : [],
            consulationHistoryList : [],
            errors: {}
        }
        this.onSubmitForm = this.onSubmitForm.bind(this);
        this.onChangeState = this.onChangeState.bind(this);
        this.genderOnChange = this.genderOnChange.bind(this);
        this.dateOnChange = this.dateOnChange.bind(this);
        this.getDietList = this.getDietList.bind(this);
        this.getAppointmentDetails = this.getAppointmentDetails.bind(this);
        this.onDietPlanSelect = this.onDietPlanSelect.bind(this);
    }

    componentDidMount(){
        const { match: { params } } = this.props;
        if(params.appointmentId != undefined){//edit
            this.setState({appointmentId : params.appointmentId})
            this.getAppointmentDetails(params.appointmentId);
            this.getDietList();
        }
    }

    getDietList(){
        HttpService.get('diet/list').then((result)=>{
            let temp = [];
            for (var key of Object.keys(result.data)) {
                temp.push({
                    label : result.data[key].name,
                    value : result.data[key].dietId
                })
            }
            this.setState({dietList : temp});
        }).catch((err) => { 
            if(err.response !==undefined && err.response.data.error_code === 404){
                this.setState({ dietList : [] });
            }
        })
    }

    getAppointmentDetails(appointmentId){
        HttpService.get(`appointment/${appointmentId}`).then((result)=>{
            this.setState({
                appointmentNo   : result.data.appointmentNo,
                patientId       : result.data.patient.patient_id,
                name            : result.data.patient.name,
                mobile          : result.data.patient.mobile,
                gender          : result.data.patient.gender,
                email           : result.data.patient.email,
                medicalHistory  : result.data.patient.medicalHistory
            })
           console.log(result);
        }).catch((err) => { 
            if(err.response !==undefined && err.response.data.error_code === 404){
                toast.warning("Appointment not found!", { autoClose : 2000 });
                this.props.history.push('/home');
            }
        })
    }

    getConsulationHistory(){
        HttpService.get('diet/list').then((result)=>{
            let temp = [];
            for (var key of Object.keys(result.data)) {
                temp.push({
                    label : result.data[key].name,
                    value : result.data[key].dietId
                })
            }
            this.setState({dietList : temp});
        }).catch((err) => { 
            if(err.response !==undefined && err.response.data.error_code === 404){
                this.setState({ dietList : [] });
            }
        })
    }

    onSubmitForm(e){
        if(this.isFormValid()){
            let params = {
                appointmentNo : this.state.appointmentNo,
                patientId     : this.state.patientId,
                bmi           : this.state.bmi,
                dietPlanId    : this.state.dietPlanId,
                height        : this.state.height,
                date          : Moment(this.state.date).format('YYYY-MM-DD'),
                weight        : this.state.weight
            }
            HttpService.post('consultation',params).then((result)=>{
                HttpService.get(`appointment/${this.state.appointmentId}/status/CONSULTED`).then((result)=>{
                    toast.success("Consulation added successfully!", { autoClose : 2000 });
                    this.props.history.push('/home');
                }).catch((error)=>{
                    console.log(error);
                }); 
            }).catch((error)=>{
                console.log(error);
            });    
        }
        e.preventDefault();
    }

    dateOnChange(e){
        this.setState({date : e});
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

    onDietPlanSelect(e){
        if(e !== null){
            this.setState({dietPlanId : e.value});
        }
    }

    isFormValid(){
        let isValid = true;
        if(this.state.bmi === 0 || this.state.bmi === '' || !validDecimalRegex.test(this.state.bmi)){
            if(this.state.bmi === 0 || this.state.bmi === ''){
                this.setState({
                    errors: {
                        bmi: "Please enter bmi!",
                    }
                });
            }else if(!validDecimalRegex.test(this.state.bmi)){
                this.setState({
                    errors: {
                        bmi: "Special character or space not allowed!",
                    }
                });
            }
            isValid = false;
        }else if(this.state.height === 0 || this.state.height === '' || !validDecimalRegex.test(this.state.height)){
            if(this.state.height === 0 || this.state.height === ''){
                this.setState({
                    errors: {
                        height: "Enter height!",
                    }
                });
                isValid = false;
            }else if(!validDecimalRegex.test(this.state.height)){
                this.setState({
                    errors: {
                        height: "Invalid height",
                    }
                });
                isValid = false;
            }
        }else if(this.state.weight === 0 || this.state.weight === '' || !validDecimalRegex.test(this.state.weight)){
            if(this.state.weight === 0 || this.state.weight === ''){
                this.setState({
                    errors: {
                        weight: "Enter weight!",
                    }
                });
                isValid = false;
            }else if(!validDecimalRegex.test(this.state.weight)){
                this.setState({
                    errors: {
                        weight: "Invalid weight",
                    }
                });
                isValid = false;
            }
        }else if(this.state.dietPlanId === '' || this.state.dietPlanId === 0){
            this.setState({
                errors: {
                    dietPlanId: "Choose diet plan",
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
                            <h3 className="card-title">Consulation</h3>
                            <div className="card-tools">
                           </div>
                        </div>
                        <form onSubmit={this.onSubmitForm}>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-6" style={{textAlign:'left'}}>
                                        <div className="form-group">
                                            <label htmlFor="appointmentNo">Appointment No<span className="span_compulary">*</span></label>
                                            <input type="text" className="form-control col-md-6" maxLength="100" name="appointmentNo" disabled={true} value={this.state.appointmentNo} placeholder="Appointment No" onChange={this.onChangeState}/>
                                            { this.state.errors.appointmentNo !== undefined && (<span className="error-span">{this.state.errors.appointmentNo}</span>)}
                                        </div>
                                    </div>
                                    <div className="col-md-6" style={{textAlign:'left'}}>
                                        <div className="form-group">
                                            <label htmlFor="date">Consulation Date<span className="span_compulary">*</span></label>
                                            <div className="input-group date" id="reservationdate" data-target-input="nearest">
                                                <DatePicker  className="form-control datetimepicker-input col-md-8" name="date" selected={this.state.date} dateFormat="dd/MM/yyyy" onChange={this.dateOnChange} />
                                                { this.state.errors.date !== undefined && (<span className="error-span">{this.state.errors.date}</span>)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                               <div className="row">
                                    <div className="col-md-6" style={{textAlign:'left'}}>
                                        <div className="form-group">
                                            <label htmlFor="name">Patient Name<span className="span_compulary">*</span></label>
                                            <input type="text" className="form-control" maxLength="100" name="name" value={this.state.name} disabled={true} placeholder="Name" onChange={this.onChangeState}/>
                                            { this.state.errors.name !== undefined && (<span className="error-span">{this.state.errors.name}</span>)}
                                        </div>
                                    </div>
                                    <div className="col-md-6" style={{textAlign:'left'}}>
                                        <div className="form-group">
                                            <label htmlFor="email">Email<span className="span_compulary">*</span></label>
                                            <input type="text" className="form-control" maxLength="100" name="email" value={this.state.email} disabled={true} placeholder="email" onChange={this.onChangeState}/>
                                            { this.state.errors.email !== undefined && (<span className="error-span">{this.state.errors.email}</span>)}
                                        </div>
                                    </div>
                                </div>
                                 <div className="row">
                                    <div className="col-md-6" style={{textAlign:'left'}}>
                                        <div className="form-group">
                                            <label htmlFor="mobile">Mobile<span className="span_compulary">*</span></label>
                                            <input type="mobile" className="form-control" maxLength="10" name="mobile" value={this.state.mobile} disabled={true} placeholder="mobile" onChange={this.onChangeState}/>
                                            { this.state.errors.mobile !== undefined && (<span className="error-span">{this.state.errors.mobile}</span>)}
                                        </div>
                                    </div>
                                    <div className="col-md-6 radio-with-label" style={{display:'flex'}}>
                                        <label htmlFor="gender">Gender<span className="span_compulary">*</span></label>
                                        <div className="form-group clearfix">
                                            <div className="icheck-primary d-inline" style={{marginRight:'15px'}}>
                                                <input type="radio" id="rbMale" name="gender" checked={this.state.gender === 'Male'} disabled={true} onChange={this.genderOnChange}/>
                                                <label className="custom-form-label" htmlFor="rbMale">
                                                    Male
                                                </label>
                                            </div>
                                            <div className="icheck-primary d-inline">
                                                <input type="radio" id="rbFemale" name="gender" checked={this.state.gender === 'Female'} disabled={true} onChange={this.genderOnChange}/>
                                                <label className="custom-form-label" htmlFor="rbFemale">
                                                    Female
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12" style={{textAlign:'left'}}>
                                        <div className="form-group">
                                            <label htmlFor="medicalHistory">Medical History</label>
                                            <textarea className="form-control" maxLength="150" placeholder="Medical/Diet history" disabled={true} name="medicalHistory" onChange={this.onChangeState} value={this.state.medicalHistory}></textarea>
                                            { this.state.errors.medicalHistory !== undefined && (<span className="error-span">{this.state.errors.medicalHistory}</span>)}
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-4" style={{textAlign:'left'}}>
                                        <div className="form-group">
                                            <label htmlFor="bmi">BMI<span className="span_compulary">*</span></label>
                                            <input type="text" className="form-control" maxLength="100" name="bmi" value={this.state.bmi} placeholder="Enter BMI" onChange={this.onChangeState}/>
                                            { this.state.errors.bmi !== undefined && (<span className="error-span">{this.state.errors.bmi}</span>)}
                                        </div>
                                    </div>
                                    <div className="col-md-4" style={{textAlign:'left'}}>
                                        <div className="form-group">
                                            <label htmlFor="height">Heigth<span className="span_compulary">*</span></label>
                                            <input type="text" className="form-control" maxLength="100" name="height" value={this.state.height} placeholder="height" onChange={this.onChangeState}/>
                                            { this.state.errors.height !== undefined && (<span className="error-span">{this.state.errors.height}</span>)}
                                        </div>
                                    </div>
                                    <div className="col-md-4" style={{textAlign:'left'}}>
                                        <div className="form-group">
                                            <label htmlFor="weight">Weight<span className="span_compulary">*</span></label>
                                            <input type="text" className="form-control" maxLength="100" name="weight" value={this.state.weight} placeholder="weight" onChange={this.onChangeState}/>
                                            { this.state.errors.weight !== undefined && (<span className="error-span">{this.state.errors.weight}</span>)}
                                        </div>
                                    </div>
                                </div>
                                 <div className="row">
                                    <div className="col-md-6" style={{textAlign:'left'}}>
                                        <div className="form-group">
                                            <label htmlFor="diet_plan">Choose Diet Plan</label>
                                            <Select
                                                className="basic-single"
                                                classNamePrefix="Select Patient"
                                                name="diet_select"
                                                onChange={this.onDietPlanSelect}
                                                isClearable="true"
                                                isSearchable="true"
                                                name="color"
                                                options={this.state.dietList}
                                            />
                                            { this.state.errors.dietPlanId !== undefined && (<span className="error-span">{this.state.errors.dietPlanId}</span>)}
                                        </div>
                                    </div>
                                    <div className="col-md-1" style={{display: 'flex',alignItems: 'center', cursor :'pointer'}}>
                                        <i style={{marginTop: '15px'}} className="fas fa-sync-alt" onClick={this.getDietList}></i>
                                    </div>
                                    <div className="col-md-2" style={{display: 'flex',alignItems: 'center', cursor :'pointer'}}>
                                        <Link to="/add-diet" target="_blank" style={{marginTop: '15px'}} type="button" className="btn btn-primary float-right">Create Diet Plan</Link>
                                    </div>
                                   
                                </div>
                            </div> 
                            <div className="card-footer">
                                <button type="submit" className="btn btn-info">Submit</button>
                                <Link to="/home" type="button" className="btn btn-default float-right">Cancel</Link>
                            </div>
                        </form>
                        
                    </div>
                </div>
            </section>
        )
    }
}

export default AddConsulationComponent;