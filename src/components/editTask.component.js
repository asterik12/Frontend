import React, { Component } from 'react'
import {Redirect} from "react-router-dom"
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import AuthService from "../services/auth.service";
import CheckButton from "react-validation/build/button";
import Axios from 'axios';
export default class editTask extends Component {
    constructor(props) {
        super(props);
        
    
        this.state = {
            id: "",
            userId: "",
            taskName: "",
            taskDescription: "",
            sharedWith: "",
            status:"",
            createDate: "",
            updatedDate: "",
            redirect: null,
            userReady: false,
            currentUser: { username: "" },
            
    
        };
        
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onChangetaskName = this.onChangetaskName.bind(this);
        this.onChangetaskDescription = this.onChangetaskDescription.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleStatus = this.handleStatus.bind(this);
      }



      // componentWillMount() {
      //     this.getDetails();
      // }
       getDetails() {
        const currentUser = AuthService.getCurrentUser();
          let meetId = this.props.match.params.id;
          console.log(meetId)
          Axios.get(`http://localhost:8080/api/task/edit/${meetId}`) 
          .then(response => {
              this.setState({
                id: response.data.id,
                taskName: response.data.taskName,
                taskDescription: response.data.taskDescription,
                sharedWith: response.data.sharedWith,
                status: response.data.status,
                userId: response.data.userId,
                createDate: response.data.createDate,
                updatedDate: response.data.updatedDate,
              }, () => {
                  // console.log(this.state)
                  if(!(this.state.userId === currentUser.id)) {
                    this.setState({ redirect: "/profile"});
                  } 
                  
                 
              })
          })
          .catch(err => console.log(err))
      }
      
      

      componentDidMount() {
        const currentUser = AuthService.getCurrentUser();
        console.log(currentUser);
        
        if (!currentUser) {
          this.setState({ redirect: "/login" });
        }
          
        else{
          this.setState({ currentUser: currentUser, userReady: true })
          this.getDetails();
          
        }
        
      }

   

    
      onChangetaskName(e) {
        this.setState({
          taskName: e.target.value
        })
      }
    
      onChangetaskDescription(e) {
        this.setState({
          taskDescription: e.target.value
        })
      }
      handleChange(e) {
        this.setState({
          sharedWith: e.target.value
        })
      }
      handleStatus(e) {
        this.setState({
          status: e.target.value
        })
      }
    
      getUpdatedData(newData) {
        Axios.request({
          method:'put',
          url: `http://localhost:8080/api/task/edit/${this.state.id}`,
          data: newData
        }).then(response => {
          // this.props.history.push('/profile')
          // console.log(response)
        }).catch(err => console.log(err));
      }

      handleSubmit(e) {
        const currentUser = AuthService.getCurrentUser();
        const newData = {
          id: this.state.id,
          taskName: this.state.taskName,
          taskDescription: this.state.taskDescription,
          sharedWith: this.state.sharedWith,
          status:this.state.status,
          userId: currentUser.id,
          createDate: this.state.createDate,
          updatedDate: Date.now(),
        }
       
        console.log(this.state);
    
        if (this.checkBtn.context._errors.length === 0) {
          this.getUpdatedData(newData);
        }
        e.preventDefault();
        
      } 
      
      
  render() {
    if(this.state.redirect) {
        return <Redirect to={this.state.redirect} />
      }
    const { currentUser } = this.state;
    return (
        <div className="container">
        <header className="jumbotron">
          <h3>Edit Task</h3>
          <strong>{currentUser.username}</strong> 
          <Form
            onSubmit={this.handleSubmit}
            ref={c => {
              this.form = c;
            }}
          >
            
              <div>
                <div className="form-group">
                  <label htmlFor="taskName">Task Name</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="taskName"
                    value={this.state.taskName}
                    onChange={this.onChangetaskName}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="taskdescription">Task Description</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="taskdescription"
                    value={this.state.taskDescription}
                    onChange={this.onChangetaskDescription}
                  />
                </div>

                <label htmlFor="status">Status</label>
                <select class="form-control form-control-sm" 
                    value={this.state.status} onChange={this.handleStatus}>
                
                  <option value="Active" selected>Active</option>
                  <option value="Completed">Completed</option>

                </select>

                <label htmlFor="sharedWith">Share With</label>
                <select class="form-control form-control-sm" 
                    value={this.state.sharedWith} onChange={this.handleChange}>
                
                  <option value="users">Users</option>
                  <option value="admin">Admin</option>
                  <option value="moderator">Moderator</option>
                  <option value="all" selected>All</option>

                </select>

                

                <div className="form-group">
                  <button className="btn btn-primary">Update</button>
                </div>
              </div>
            
            <CheckButton
              style={{ display: "none" }}
              ref={c => {
                this.checkBtn = c;
              }}
            />
          </Form>
        </header>
      </div>
    )
  }
}

