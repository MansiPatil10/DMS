import React, {Component} from 'react';
import HttpService from '../../../Services/HttpService';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure()
class ListDietComponent extends Component{
    constructor(){
        super()
        this.state = {
            tmpDietList : [],
            dietList : [],
            search : ''
        }
        this.getDietList = this.getDietList.bind(this);
        this.deleteDiet = this.deleteDiet.bind(this);
        this.onChangeState = this.onChangeState.bind(this);
        this.onSearch = this.onSearch.bind(this);
    }

    componentDidMount(){
        this.getDietList();
    }

    getDietList(){
        HttpService.get('diet/list').then((result)=>{
            this.setState({ dietList : [],tmpDietList : [] });
            this.setState({ dietList : result.data, tmpDietList : result.data });
        }).catch((err) => { 
            if(err.response !==undefined && err.response.data.error_code === 404){
                this.setState({ dietList : [],tmpDietList : [] });
            }
        })
    }
    // chang

    deleteDiet(dietId){
        HttpService.delete(`diet/${dietId}`).then((result)=>{
            toast.success("Diet deleted successfully!", { autoClose : 2000 });
            this.getDietList();
        }).catch((err)=>{
            console.log(err)
        })
    }

    onChangeState(event){
        this.setState({[event.target.name] : event.target.value});
    }

    onSearch(){
        if(this.state.search != ''){
            let dt = this.state.dietList.filter((diet)=>{
                if(diet.name.toLocaleLowerCase().includes(this.state.search.toLocaleLowerCase())){
                    return diet;
                }
            });

            this.setState({ tmpDietList : dt });
        }else{
            this.setState({ tmpDietList : this.state.dietList });
        }
    }

    render(){
        return (
            <section className="content" style={{marginTop : '20px'}} >
                <div className="container">
                    <div className="row" style={{marginTop : '20px'}}>
                        <div className="col-12" style={{display:'flex',justifyContent : 'flex-end'}}>
                            <Link to="/add-diet" type="button" className="btn btn-primary">Add New</Link>
                        </div>
                    </div>
                    <div className="row" style={{marginTop : '20px'}}>
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">Diet Plan List</h3>
                                    <div className="card-tools">
                                        <div className="input-group input-group-sm" style={{width: '150px'}}>
                                            <input type="text" name="search" className="form-control float-right" placeholder="Search" onChange={this.onChangeState} />
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
                                                <th style={{ width:'75%' }}>Diet Plan Name</th>
                                                <th style={{ width:'10%' }}>Status</th>
                                                <th style={{ width:'10%' }}>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.tmpDietList.map((diet,index) =>(
                                                    <tr key={diet.dietId}>
                                                        <td>{index+1}</td>
                                                        <td>{diet.name}</td>
                                                        <td>{diet.status}</td>
                                                        <td style={{ width:'10%' }}>
                                                            <Link to={`/edit-diet/${diet.dietId}`} type="button" className="btn btn-xs btn-primary" style={{ marginRight : '5px' }}>Edit</Link>
                                                            <button type="button" className="btn btn-xs btn-danger" onClick={() => this.deleteDiet(diet.dietId)}>Delete</button>
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

export default ListDietComponent;