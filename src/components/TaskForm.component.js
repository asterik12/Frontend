import React, { Component } from "react";
import {Redirect} from "react-router-dom"
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import AuthService from "../services/auth.service";
import CheckButton from "react-validation/build/button";
import taskService from "../services/task.service";
export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChangetaskName = this.onChangetaskName.bind(this);
    this.onChangetaskDescription = this.onChangetaskDescription.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleStatus = this.handleStatus.bind(this);
    
    this.state = {
        taskName: "",
        taskDescription: "",
        sharedWith: "all",
        status:'Active',
        redirect: null,
        userReady: false,
        currentUser: { username: "" }

    };
  }
  componentDidMount() {
    const currentUser = AuthService.getCurrentUser();
    console.log(currentUser);

    if (!currentUser) {
      this.setState({ redirect: "/login" });
    }
      
    else{
      this.setState({ currentUser: currentUser, userReady: true })
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

  handleSubmit(e) {
    e.preventDefault();
    this.setState({
      message: "",
      successful: false
    });
    
    console.log(this.state);

    if (this.checkBtn.context._errors.length === 0) {
      taskService.createTask(
        this.state.taskName,
        this.state.taskDescription,
        this.state.currentUser.id,
        this.state.sharedWith,
        this.state.status
      ).then(
        response => {
          this.setState({
            message: response.data.message,
            successful: true
          });
          this.props.history.push("/user");
          window.location.reload();
         
         
        },
        error => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          this.setState({
            successful: false,
            message: resMessage
          });
        }
      );
    }
  }
  

  
  render() {

    if(this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }
    const { currentUser } = this.state;


    return (
      <div className="container">
        <header className="jumbotron">
          <h3>Create Task</h3>
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
                  <button className="btn btn-primary">Create </button>
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
    );
  }
}