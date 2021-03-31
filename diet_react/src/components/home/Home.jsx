import React, {Component, Fragment} from 'react';
import DatePicker from "react-datepicker";
import Moment from 'moment';
import './home.css';
import { Link } from 'react-router-dom';
import "react-datepicker/dist/react-datepicker.css";
import AuthenticationService from '../../Services/AuthenticationService';
import HttpService from '../../Services/HttpService';

import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const customStyles = {
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)',
      width                 : '800px'
    }
};

toast.configure()
// Modal.setAppElement('#yourAppElement')

class HomeComponent extends Component{
    
    constructor(){
        super()
        this.state = {
            date : new Date(),
            designation : '',
            appointmentList : [],
            tmpAppointmentList : [],
            total_patients : 0,
            today_appointments : 0,
            completed_appointments : 0,
            pending_appointments : 0,
            isOpenModal : false,
            receiptDetails : {},
            search : ''
        }
        this.dateOnChange = this.dateOnChange.bind(this);
        this.cancelAppointment = this.cancelAppointment.bind(this);
        this.getAppointmentList = this.getAppointmentList.bind(this);
        this.openModal = this.openModal.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.onChangeState = this.onChangeState.bind(this);
    }

    onSearch(){
        if(this.state.search != ''){
            let dt = this.state.appointmentList.filter((appointment)=>{
                if(appointment.patient.name.toLocaleLowerCase().includes(this.state.search.toLocaleLowerCase())){
                    return appointment;
                }
            });

            this.setState({ tmpAppointmentList : dt });
        }else{
            this.setState({ tmpAppointmentList : this.state.appointmentList });
        }
    }

    dateOnChange(e){
        this.setState({date : e});
        this.getAppointmentList(e);
    }

    componentDidMount(){
        // this.setState({designation : AuthenticationService.getDesignation()})
        this.getAppointmentList(new Date());
    }

    getAppointmentList(date){
        HttpService.get('patient/list').then((patientResult) =>{
            this.setState({ total_patients : patientResult.data.length });
        })
        HttpService.get('appointment/list/'+ Moment(date).format('YYYY-MM-DD')).then((result) =>{
            const appointments =  result.data.filter(appointment => appointment.status !== 'CANCELLED').length//;result.data.length;
            const pending      =  result.data.filter(appointment => appointment.status === 'PENDING').length;
            const completed    =  result.data.filter(appointment => appointment.status === 'CONSULTED').length;
            this.setState(
                { 
                    appointmentList : result.data,
                    tmpAppointmentList : result.data,
                    today_appointments : appointments,
                    pending_appointments : pending,
                    completed_appointments : completed
                }
            );
        }).catch(err =>{
            if(err.response !== undefined && err.response.status === 404){
                this.setState({ appointmentList : [] });
            }
            console.log(err);
        });
    }

    cancelAppointment(appointmentId){
        HttpService.get(`appointment/${appointmentId}/status/CANCELLED`).then((result) =>{
            toast.warning("Appointment has been cancelled!", { autoClose : 2000 });
            this.getAppointmentList(new Date());
        })
    }

    openModal(details){
        let dt = { ...details };
        this.setState({ isOpenModal: true, receiptDetails : dt });
    };

    closeModal = () => {
        this.setState({ isOpenModal: false });
    };

    onChangeState(event){
        this.setState({[event.target.name] : event.target.value});
    }
    
    render(){
        // const [modalIsOpen,setIsOpen] = React.useState(false);
        return (
            <section className="content" style={{marginTop : '20px'}} >
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 col-6">
                            <div className="small-box bg-info">
                                <div className="inner">
                                    <h3>{ this.state.total_patients }</h3>
                                    <p>Total Patients</p>
                                </div>
                                <div className="icon">
                                    <i className="ion ion-bag"></i>
                                </div>
                                {/* <a href="#" className="small-box-footer"></a> */}
                            </div>
                        </div>
                        <div className="col-lg-3 col-6">
                            <div className="small-box bg-success">
                                <div className="inner">
                                    <h3>{ this.state.today_appointments }</h3>
                                    <p>Todays Appointments</p>
                                </div>
                            <div className="icon">
                                <i className="ion ion-bag"></i>
                            </div>
                                {/* <a href="#" className="small-box-footer">More info <i className="fas fa-arrow-circle-right"></i></a> */}
                            </div>
                        </div>
                        <div className="col-lg-3 col-6">
                            <div className="small-box bg-warning">
                                <div className="inner">
                                    <h3>{ this.state.completed_appointments }</h3>
                                    <p>Completed Appointments</p>
                                </div>
                            <div className="icon">
                                <i className="ion ion-bag"></i>
                            </div>
                                {/* <a href="#" className="small-box-footer">More info <i className="fas fa-arrow-circle-right"></i></a> */}
                            </div>
                        </div>
                        <div className="col-lg-3 col-6">
                            <div className="small-box bg-danger">
                                <div className="inner">
                                    <h3>{ this.state.pending_appointments }</h3>
                                    <p>Pending Appointments</p>
                                </div>
                            <div className="icon">
                                <i className="ion ion-bag"></i>
                            </div>
                                {/* <a href="#" className="small-box-footer">More info <i className="fas fa-arrow-circle-right"></i></a> */}
                            </div>
                        </div>
                    </div>
                    <div className="row" style={{marginTop : '20px'}}>
                        <div className="col-3">
                            <div className="form-group" style={{'display':'flex','gap':'8px','alignItems':'center'}}>
                                <label style={{ 'marginBottom':'0px' }}>Date:</label>
                                <div className="input-group date" id="reservationdate" data-target-input="nearest">
                                    <DatePicker  className="form-control datetimepicker-input" selected={this.state.date} dateFormat="dd/MM/yyyy" onChange={this.dateOnChange} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row" style={{marginTop : '20px'}}>
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">Appointment List</h3>
                                    <div className="card-tools">
                                        <div className="input-group input-group-sm" style={{width: '150px'}}>
                                            <input type="text" name="search" className="form-control float-right" placeholder="Search" onChange={this.onChangeState}/>
                                            <div className="input-group-append">
                                                <button type="submit" className="btn btn-default" onClick={this.onSearch}><i className="fas fa-search"></i></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
            
                                <div className="card-body table-responsive p-0" style={{position: 'sticky'}}>
                                    <table className="table table-head-fixed text-nowrap">
                                        <thead>
                                            <tr>
                                                <th style={{ width:'5%' }}>#</th>
                                                <th style={{ width:'10%' }}>Appointment No.</th>
                                                <th style={{ width:'10%' }}>Case Paper No. </th>
                                                <th style={{ width:'65%' }}>Patient Name</th>
                                                <th style={{ width:'10%' }}>Status</th>
                                                <th style={{ width:'10%' }}>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.tmpAppointmentList.map((appointment,index) =>(
                                                    <Fragment key={index}>
                                                        { (AuthenticationService.getDesignation() === 'ADMIN' && appointment.status  === 'PENDING') && 
                                                            (
                                                                <tr key={index}>
                                                                    <td>{index+1}</td>
                                                                    <td>{appointment.appointmentNo}</td>
                                                                    <td>{appointment.casePaperNo}</td>
                                                                    <td>{appointment.patient.name}</td>
                                                                    <td><span className="badge bg-danger">{appointment.status}</span></td>
                                                                    <td style={{ width:'10%' }}><Link type="button" to={`/add-consulation/${appointment.appointmentId}`} className="btn btn-xs btn-info">Consultation</Link></td>
                                                                </tr>
                                                            )
                                                        }

                                                        { (AuthenticationService.getDesignation() === 'RECEPTIONIST') && 
                                                            (
                                                                <tr key={index}>
                                                                    <td>{index+1}</td>
                                                                    <td>{appointment.appointmentNo}</td>
                                                                    <td>{appointment.casePaperNo}</td>
                                                                    <td>{appointment.patient.name}</td>
                                                                    { appointment.status     === 'PENDING'      && (<td><span className="badge bg-danger">{appointment.status}</span></td>)}
                                                                    { appointment.status     === 'CANCELLED'    && (<td><span className="badge bg-warning">{appointment.status}</span></td>)}
                                                                    { appointment.status     === 'CONSULTED'    && (<td><span className="badge bg-success">{appointment.status}</span></td>)}
                                                                    { appointment.status     === 'CANCELLED'    && (<td style={{ width:'10%' }}><button type="button" className="btn btn-xs btn-danger" disabled={true}>Cancel Appointment</button></td>)}
                                                                    { appointment.status     !== 'CANCELLED'    && (<td style={{ width:'10%' }}><button type="button" className="btn btn-xs btn-danger" disabled={appointment.status === 'CONSULTED'} onClick={()=>this.cancelAppointment(appointment.appointmentId)}>Cancel Appointment</button></td>)}
                                                                    { appointment.status     !== 'CANCELLED'    && (<td style={{ width:'10%' }}><button type="button" className="btn btn-xs btn-primary" onClick={()=>this.openModal(appointment)}>Receipt</button></td>)}
                                                                </tr>
                                                            )
                                                        }
                                                    </Fragment>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Modal
                        isOpen={this.state.isOpenModal} 
                        onRequestClose={this.closeModal}
                        ariaHideApp={false}
                        // onAfterOpen={afterOpenModal}
                        // onRequestClose={closeModal}
                        style={customStyles}
                        contentLabel="Example Modal">
                            <div className="card">
                                <div className="card-header" style={{'textAlign':'center'}}>
                                    <h3 className="card-title" style={{'width':'90%'}}>DMS</h3>
                                    <div className="card-tools">
                                        <i className="fas fa-times-circle" style={{'color':'#ff0000','cursor':'pointer'}} onClick={this.closeModal}></i>
                                    </div>
                                </div>
            
                                <div className="card-body table-responsive p-0">
                                    <div className="row">
                                        <div className="col-lg-4 col-4">
                                            <div className="diet_card">
                                                <span className="span_title">Appointment No</span>
                                                <span className="span_value">{ this.state.receiptDetails.appointmentNo }</span>
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-4">
                                            <div className="diet_card">
                                                <span className="span_title">Casepaper No</span>
                                                <span className="span_value">{ this.state.receiptDetails.casePaper !=undefined ? this.state.receiptDetails.casePaper.casePaperNo : '' }</span>
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-4">
                                            <div className="diet_card">
                                                <span className="span_title">Casepaper Date</span>
                                                <span className="span_value">{ this.state.receiptDetails.casePaper !=undefined ? this.state.receiptDetails.casePaper.startDate : '' }</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-6 col-6">
                                            <div className="diet_card">
                                                <span className="span_title">Consultant Name</span>
                                                <span className="span_value">Dr. Patil</span>
                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-6">
                                            <div className="diet_card">
                                                <span className="span_title">Patient Name</span>
                                                <span className="span_value">{ this.state.receiptDetails.patient != undefined ? this.state.receiptDetails.patient.name : ''}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                    <div className="col-lg-6 col-6">
                                            <div className="diet_card">
                                                <span className="span_title">Amount</span>
                                                <span className="span_value">{  this.state.receiptDetails.casePaper !=undefined ? this.state.receiptDetails.casePaper.amount : '' }</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                    </Modal>
                
                </div>
        </section>
            
        )
    }
}

export default HomeComponent;
