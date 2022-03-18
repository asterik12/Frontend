import React, { Component } from "react";
import AuthService from "../services/auth.service"
import {Redirect} from "react-router-dom"
import {Link, Route} from "react-router-dom"
import Moment from "moment";
import taskService from "../services/task.service";

export default class RestrictedTask extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      currentUser:{username: "" },     
      redirect: null,
      userReady: false,
      AdminTask:[],
      ModeratorTask:[]
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
      taskService.getAdminTaskData().then(
        response => {
          this.setState({
            AdminTask:response.data
          });
        }
      );
      taskService.getModeratorTaskData().then(
        response => {
          this.setState({
            ModeratorTask:response.data
          });
        }
      );
    }
    
  }


 

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }
    const { currentUser } = this.state;
    


    return (
      <div className="container">
        <header className="jumbotron">
          <h3>Restricted Tasks</h3>
        </header>


        <div class="card-group">
          <div class = "row">
            {/* task */}
           
            {currentUser.roles !== "ROLE_ADMIN" ? 
          
              this.state.AdminTask.map( (e, index) =>{
                return(
                  
                <div class="col-sm-6 col-md-4" 
                    style={{
                          border: '2px solid #eee',
                          padding: '1%'
                          }}>

                  <img class="card-img-top" src="/assets/task.jpg" alt="Card image cap"/>
                  <span class="badge badge-info" style={{transform:'rotate(-30deg)' ,position: 'absolute',top: '3%',left: '0%'}}>{e.sharedWith}</span>
                  
                  {e.status === "Active" ?<span class="badge badge-success">{e.status}</span>:<span class="badge badge-danger">{e.status}</span>}
                    
                  <div class="card-body">
                    <h5 class="card-title">{e.taskName}</h5>
                    <p class="card-text">{e.taskDescription}</p>
                    <small class="text-muted"> 
                    
                      <i class="fa fa-clock-o" aria-hidden="true"></i>  &nbsp;
                      {Moment(e.createDate).format('MMM Do YY')}
                      &nbsp;&nbsp;&nbsp;
                      <i class="fa fa-refresh" aria-hidden="true"></i> &nbsp; 
                      {Moment(e.updatedDate).startOf('second').fromNow()}
                    </small>
                    
                    </div>
                     
                  </div>
                )
                
              })
              
              

              : ''}

              {/* for moderator  */}
              {currentUser.roles !== 'ROLE_MODERATOR' && currentUser.roles !== 'ROLE_ADMIN'?
                this.state.ModeratorTask.map( (e, index) =>{
                    return(
                    
                    <div class="col-sm-6 col-md-4" 
                        style={{
                            border: '2px solid #eee',
                            padding: '1%'
                            }}>

                    <img class="card-img-top" src="/assets/task.jpg" alt="Card image cap"/>
                    <span class="badge badge-info" style={{transform:'rotate(-30deg)' ,position: 'absolute',top: '3%',left: '0%'}}>{e.sharedWith}</span>
                    
                    {e.status === "Active" ?<span class="badge badge-success">{e.status}</span>:<span class="badge badge-danger">{e.status}</span>}
                        
                    <div class="card-body">
                        <h5 class="card-title">{e.taskName}</h5>
                        <p class="card-text">{e.taskDescription}</p>
                        <small class="text-muted"> 
                        
                        <i class="fa fa-clock-o" aria-hidden="true"></i>  &nbsp;
                        {Moment(e.createDate).format('MMM Do YY')}
                        &nbsp;&nbsp;&nbsp;
                        <i class="fa fa-refresh" aria-hidden="true"></i> &nbsp; 
                        {Moment(e.updatedDate).startOf('second').fromNow()}
                        </small>
                        
                    </div>
                        
                    </div>
                    );
                    
                })

               : '' }
          </div>
          
          
          
        </div>

      </div>
    );
  }
}