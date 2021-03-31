import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import HttpService from '../../../Services/HttpService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';
import './AddDiet.css'
const validNameRegex = RegExp(
    /^[0-9a-zA-Z ]*$/i
);

toast.configure()
class AddDietComponent extends Component{
    constructor(){
        super()
        this.state = {
            dietId: 0,
            name : '',
            type : 'MASTER',
            description : '',
            status : 'ACTIVE',
            dayList : [
                { label : 'Day 1', value : 1},
                { label : 'Day 2', value : 2},
                { label : 'Day 3', value : 3},
                { label : 'Day 4', value : 4},
                { label : 'Day 5', value : 5},
                { label : 'Day 6', value : 6},
                { label : 'Day 7', value : 7}
            ],
            dietTime:[
                { label : 'Morning',   value : 'Morning'},
                { label : 'Afternoon', value : 'Afternoon'},
                { label : 'Evening',   value : 'Evening'}
            ],
            dietDays : [],
            isNew : true,
            tempDay : 0,
            tempTiming : '',
            tempDiet : '',
            errors : {}
        }
        this.onSubmitForm   = this.onSubmitForm.bind(this);
        this.onChangeState  = this.onChangeState.bind(this);
        // this.statusOnChange = this.statusOnChange.bind(this);
        this.onDaySelect    = this.onDaySelect.bind(this);
        this.onTimingSelect = this.onTimingSelect.bind(this);
        this.addDay         = this.addDay.bind(this);
        this.deleteDietDay  = this.deleteDietDay.bind(this);
    }

    componentDidMount(){
        const { match: { params } } = this.props;
        if(params.dietId != undefined){//edit
            this.setState({isNew : 0});
            HttpService.get('diet/'+params.dietId).then((result) =>{
                this.setState({
                    dietId : result.data.dietId,
                    name : result.data.name,
                    description : result.data.description,
                    status : result.data.status,
                    type : result.data.type,
                    dietDays : result.data.dietDays,
                    isNew : 0
                })
            }).catch((err) =>{
                if(err.response !==undefined && err.response.data.error_code === 404){
                    toast.warning("No diet found!", { autoClose : 2000 });
                    this.props.history.push('/list-diet');
                }
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

    getUserDetails(userId){

    }

    onSubmitForm(e){
        if(this.isFormValid()){
            let data = {
                dietId : this.state.dietId,
                name   : this.state.name,
                description   : this.state.description,
                type   : 'Master',
                status : this.state.status,
                dietDays : this.state.dietDays
            }

            if(this.state.isNew){//add
                HttpService.post('diet',data).then((result)=>{
                    toast.success("Diet added successfully!", { autoClose : 2000 });
                    this.props.history.push('/list-diet');
                }).catch((err)=>{
                    console.log(err);
                })
            }else{//update
                HttpService.put('diet',data).then((result)=>{
                    toast.success("Diet updated successfully!", { autoClose : 2000 });
                    this.props.history.push('/list-diet');
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

    onDaySelect(e){
        if(e !== null)
        this.setState({tempDay : e.value});
    }

    onTimingSelect(e){
        if(e !== null)
        this.setState({tempTiming : e.value});
    }

    // statusOnChange(e){
    //     if(e.target.id === 'rbActive'){
    //         this.setState({status : 'ACTIVE'});
    //     }else{
    //         this.setState({status : 'DISABLED'});
    //     }
    // }

    addDay(){
        if(this.state.tempDay === 0){
            this.setState({
                errors: {
                    tempDay: "Please select day!",
                }
            });
        }else if(this.state.tempTiming === ''){
            this.setState({
                errors: {
                    tempTiming: "Please select timing!",
                }
            });
        }else if(this.state.tempDiet === ''){
            this.setState({
                errors: {
                    tempDiet: "Please enter diet!",
                }
            });
        }else{
            let dt = {
                day    : this.state.tempDay,
                time : this.state.tempTiming,
                diet   : this.state.tempDiet
            }
            let oldData = this.state.dietDays;
            oldData.push(dt);
            this.setState({dietDays: oldData});
            console.log(this.state.dietDays);
        }
    }

    deleteDietDay(index){
        let arr = this.state.dietDays.filter((day,i) =>{
            if(i !== index){
                return day;
            }
        })        

        this.setState({ dietDays : arr });
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
                        name: "special character not allowed!",
                    }
                });
            }
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
                            <h3 className="card-title">Add Diet</h3>
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
                                    {/* <div className="col-md-6 radio-with-label" style={{display:'flex'}}>
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
                                    </div> */}
                                </div>
                                <div className="row">
                                    <div className="col-md-12" style={{textAlign:'left'}}>
                                        <div className="form-group">
                                            <label htmlFor="description">Description</label>
                                            <textarea className="form-control" name="description" value={this.state.description} placeholder="Description" onChange={this.onChangeState}></textarea>
                                            { this.state.errors.description !== undefined && (<span className="error-span">{this.state.errors.description}</span>)}
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="card card-default">
                                            <div className="card-header">
                                                <h3 className="card-title">Add Days</h3>
                                                <div className="card-tools"></div>
                                            </div>
                                            <div className="card-body">
                                                <div className="row">
                                                    <div className="col-md-2" style={{textAlign:'left'}}>
                                                        <div className="form-group">
                                                            <label htmlFor="day">Day</label>
                                                            <Select
                                                                className="basic-single"
                                                                classNamePrefix="Select Day"
                                                                name="day"
                                                                onChange={this.onDaySelect}
                                                                isClearable="false"
                                                                isSearchable="false"
                                                                name="color"
                                                                options={this.state.dayList}
                                                            />
                                                            { this.state.errors.tempDay !== undefined && (<span className="error-span">{this.state.errors.tempDay}</span>)}
                                                        </div>
                                                    </div>
                                                    <div className="col-md-3" style={{textAlign:'left'}}>
                                                        <div className="form-group">
                                                            <label htmlFor="timing">Timing</label>
                                                            <Select
                                                                className="basic-single"
                                                                classNamePrefix="Select Timing"
                                                                name="timing"
                                                                onChange={this.onTimingSelect}
                                                                isSearchable="false"
                                                                name="color"
                                                                options={this.state.dietTime}
                                                            />
                                                            { this.state.errors.tempTiming !== undefined && (<span className="error-span">{this.state.errors.tempTiming}</span>)}
                                                        </div>
                                                    </div>
                                                    <div className="col-md-5" style={{textAlign:'left'}}>
                                                        <div className="form-group">
                                                            <label htmlFor="diet">Diet</label>
                                                            <textarea className="form-control col-md-12" name="tempDiet" value={this.state.tempDiet} placeholder="diet" onChange={this.onChangeState}>{this.state.role}</textarea>
                                                            { this.state.errors.tempDiet !== undefined && (<span className="error-span">{this.state.errors.tempDiet}</span>)}
                                                        </div>
                                                    </div>
                                                    <div className="col-md-2" style={{textAlign:'left'}}>
                                                        <button type="button" className="btn btn-info" style={{marginTop: '32px'}} onClick={this.addDay}>Add Day</button>
                                                    </div>

                                                </div>
                                                <hr></hr>
                                                {
                                                    this.state.dietDays.map((day,index) =>(
                                                        <div className="row" key={index}>
                                                            <div className="col-md-1" style={{textAlign:'left'}}>
                                                                <div className="diet_card">
                                                                    <span className="span_title">Day</span>
                                                                    <span className="span_value">{ day.day }</span>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-2" style={{textAlign:'left'}}>
                                                                <div className="diet_card">
                                                                    <span className="span_title">Timing</span>
                                                                    <span className="span_value">{ day.time }</span>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-8" style={{textAlign:'left'}}>
                                                                <div className="diet_card">
                                                                    <span className="span_title">Diet</span>
                                                                    <span className="span_value">{ day.diet }</span>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-1 delete_icon" style={{textAlign:'center'}}>
                                                                <i className="far fa-trash-alt delete_icon_fa" onClick={ ()=> this.deleteDietDay(index)}></i>
                                                            </div>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer">
                                { this.state.isNew === 1 && (<button type="submit" className="btn btn-info">Create Diet Plan</button>)}
                                { this.state.isNew === 0 && (<button type="submit" className="btn btn-info">Update Diet Plan</button>)}
                                <Link to="/list-diet" type="button" className="btn btn-default float-right">Plan List</Link>
                            </div>
                        </form>
                        
                    </div>
                </div>
            </section>
        )
    }
}

export default AddDietComponent;