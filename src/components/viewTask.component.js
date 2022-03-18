import React, { Component } from 'react'
import {Redirect} from "react-router-dom"
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import AuthService from "../services/auth.service";
import CheckButton from "react-validation/build/button";
import Axios from 'axios';
import {Link, Route} from "react-router-dom"
import taskService from "../services/task.service";
import Moment from "moment";

export default class viewTask extends Component {
    constructor(props) {
        super(props);
        
    
        this.state = {
            id: '',
            currentUser:{username: "" },
            
            taskName: "",
            taskDescription: "",
            sharedWith: "",
            status:"",
            createDate: "",
            updatedDate: "",
            userId: '',
            taskId:'',      
            redirect: null,
            userReady: false,
            text:'',
            check: false,
            followCheck: false,
            checkTask:false,
            commentCheck:false,
            updatedFUser: false,
            updatedLUser:false,
            updatedCUser:false,
            Cusers:[],
            Fusers:[],
            users:[],
            likes:[],
            follower:[],
            comments:[],
            
    
        };
        this.onChangetext = this.onChangetext.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        
      }

      getDetails() {
        const currentUser = AuthService.getCurrentUser();
          let meetId = this.props.match.params.id;
          console.log(meetId)
          Axios.get(`http://localhost:8080/api/task/read/${meetId}`) 
          .then(response => {
               console.log(response)
               this.setState({
                id: response.data.id,
                taskName: response.data.taskName,
                taskDescription: response.data.taskDescription,
                sharedWith: response.data.sharedWith,
                status: response.data.status,
                userId: response.data.userId,
                createDate: response.data.createDate,
                updatedDate: response.data.updatedDate,
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
          taskService.getLikesData().then(
            response => {
              this.setState({
                likes:response.data
              });
            }
          );
          taskService.getFollowData().then(
            response => {
              this.setState({
                follower:response.data
              });
            }
          );
          taskService.getTaskData().then(
            response => {
              this.setState({
                task:response.data
              });
            }
          );
          taskService.getCommentData().then(
            response => {
              this.setState({
                comments:response.data
              });
            }
          );
          taskService.getUserDetail().then(
            response => {
              this.setState({
                users:response.data,
              });
            }
          );
          taskService.getCommentUserData().then(
            response => {
              this.setState({
                Cusers:response.data,
              });
            }
          );
          taskService.getFollowUserDetails().then(
            response => {
              this.setState({
                Fusers:response.data,
              });
            }
          );
         
          
        }
        
      }

      componentDidUpdate() {
        const currentUser = AuthService.getCurrentUser();
    
        if(this.state.check) {
          taskService.getLikesData().then(
            response => {
              this.setState({
                likes:response.data,
                check:false
              });
            }
          );
        }
        if(this.state.followCheck) {
          taskService.getFollowData().then(
            response => {
              this.setState({
                follower:response.data,
                followCheck:false
              });
            }
          );
        }
    
        if(this.state.checkTask) {
          taskService.getTaskData().then(
            response => {
              this.setState({
                task:response.data,
                checkTask:false
              });
            }
          );
        }
    
        if(this.state.updatedLUser) {
          taskService.getUserDetail().then(
            response => {
              this.setState({
                users:response.data,
                updatedLUser:false
              });
            }
          );
        }

        if(this.state.updatedFUser) {
          taskService.getFollowUserDetails().then(
            response => {
              this.setState({
                Fusers:response.data,
                updatedFUser:false
              });
            }
          );
        }

        if(this.state.updatedCUser) {
          taskService.getCommentUserData().then(
            response => {
              this.setState({
                Cusers:response.data,
                updatedCUser:false
              });
            }
          );
        }
        if(this.state.commentCheck) {
          taskService.getCommentData().then(
            response => {
              this.setState({
                comments:response.data,
                commentCheck:false
              });
            }
          );
        }
        
    
       
        
        
      }

      onChangetext(e){

        this.setState({
          text:e.target.value
        })
        e.preventDefault();
       
      }
    
      handleSubmit(e, taskId) {
        const currentUser = AuthService.getCurrentUser();
    
        e.preventDefault();
        this.setState({
          message: "",
          successful: false
        });
        
        
    
        if (this.checkBtn.context._errors.length === 0) {
          taskService.addComment(
            this.state.text,
            currentUser.id,
            taskId
          ).then(
            response => {
              console.log(response);
              this.setState({
                message: response.data.message,
                successful: true,
                commentCheck: true,
                updatedCUser: true,
                text:e.target.reset()
              });
              // this.props.history.push("/user");
              // window.location.reload();
             
             
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


    const likeTask = (id) => {
      
        const newData = {
          userId: currentUser.id,
          taskId: id
        }
        Axios.request({
          method: 'put',
          url:`http://localhost:8080/api/task/edit/${id}/like`,
          
          data: newData
        })
        .then(response => {
          // this.props.history.push('/profile')
          console.log(response)
          this.setState({
            check: true,
            updatedLUser:true
          })
        }).catch(err => console.log(err));
      }
  
      const DislikeTask = (id) => {
        
        const newData = {
          userId: currentUser.id,
          taskId: id
        }
        
        Axios.request({
          method: 'delete',
          url:`http://localhost:8080/api/task/edit/${id}/unlike`,
          data: newData
        })
        .then(response => {
          // this.props.history.push('/profile')
          console.log(response)
          this.setState({
            check: true,
            updatedLUser:true
          })
        }).catch(err => console.log(err));
      }
  
      const deleteTask = (id) => {
        Axios.request({
          method: 'delete',
          url:`http://localhost:8080/api/task/delete/${id}`,
        })
        .then(response => {
          console.log(response)
          this.setState({
            checkTask: true
          })
          this.props.history.push("/user");
          // window.location.reload();
          
        }).catch(err => console.log(err));
      }
  
  
      const followTask = (id) => {
        
        const newData = {
          userId: currentUser.id,
          taskId: id
        }
        Axios.request({
          method: 'put',
          url:`http://localhost:8080/api/task/edit/${id}/follow`,
          data: newData
        })
        .then(response => {
          console.log(response)
          this.setState({
            followCheck: true,
            updatedFUser:true
          })
        }).catch(err => console.log(err));
      }
  
      const UnfollowTask = (id) => {
        
        const newData = {
          userId: currentUser.id,
          taskId: id
        }
        Axios.request({
          method: 'delete',
          url:`http://localhost:8080/api/task/edit/${id}/unfollow`,
          data: newData
        })
        .then(response => {
          console.log(response)
          this.setState({
            followCheck: true,
            updatedFUser:true
          })
        }).catch(err => console.log(err));
      }
  
      
  
  
      let x = new Set();
      let f = new Set();
      let LCount = new Array();
      let CCount = new Array();
      let FCount = new Array();

    return (
        <div className="container">
            <div class="card-group">
          <div class = "row">
            {/* task */}

              
                <div class="col-sm-6 col-md-4" 
                    style={{
                          border: '2px solid #eee',
                          padding: '1%'
                          }}>

                  <img class="card-img-top" src="/assets/task.jpg" alt="Card image cap"/>
                  <span class="badge badge-info" style={{transform:'rotate(-30deg)' ,position: 'absolute',top: '3%',left: '0%'}}>{this.state.sharedWith}</span>
                  
                  
                  <div class="card-body">
                    <h5 class="card-title">{this.state.taskName}</h5>
                    <p class="card-text">{this.state.taskDescription}</p>
                    <small class="text-muted"> 
                    
                      <i class="fa fa-clock-o" aria-hidden="true"></i>  &nbsp;
                      {Moment(this.state.createDate).format('MMM Do YY')}
                      &nbsp;&nbsp;&nbsp;
                      <i class="fa fa-refresh" aria-hidden="true"></i> &nbsp; 
                      {Moment(this.state.createDate).startOf('second').fromNow()}
                    </small>
                    
                  </div>
                              
                  {x.clear()}
                  {f.clear()}
                  {LCount.splice(0, LCount.length)}
                  {CCount.splice(0, CCount.length)}
                  {FCount.splice(0, FCount.length)}

                  <div class="card-footer-actions">
                    <small class="text-muted"> 
                     <span class= "show-action-content">
                       {this.state.likes.map((c) => {
                         return(
                          (c.taskId === this.state.id) ? (LCount.push("") !== -1)?'':'' : ''
                         )
                       })}
                       {LCount.length} likes
                      </span> 
                      
                      &nbsp;&nbsp;

                      <span class= "show-action-content">
                      {this.state.comments.map((c) => {
                         return(
                          (c.taskId === this.state.id) ? (CCount.push("") !== -1)?'':'' : ''
                         )
                       })}
                       {CCount.length} Comments
                      
                      </span>
                      &nbsp;&nbsp;
                      <span class= "show-action-content">
                      {this.state.follower.map((c) => {
                         return(
                          (c.taskId === this.state.id) ? (FCount.push("") !== -1)?'':'' : ''
                         )
                       })}
                       {FCount.length} followers
                      </span>
                    
                    </small>
                  </div>
                  <div class="card-footer">

                    {/* like task  */}

                    {this.state.likes.length === 0 ? 
                    <span>
                       <button type="button" class="btn btn-outline-primary btn-sm" onClick={() => likeTask(this.state.id)}>Like</button>&nbsp;

                    </span>
                    :
                    
                    <span>
                    
                      {this.state.likes.map((c) => {
                        return(
                            (c.taskId === this.state.id)&& (c.userId === currentUser.id) ? x.add("") : ''
                          
                        )
                      })}

                      { x.has("") ? 
                      
                        <span> 
                          <button type="button" class="btn btn-primary btn-sm" onClick={() => DislikeTask(this.state.id)} >Unlike</button>&nbsp;
                        </span>

                      : 
                        <span> 
                          <button type="button" class="btn btn-outline-primary btn-sm" onClick={() => likeTask(this.state.id)}>Like</button>&nbsp;
                        </span>
                      }
                        
                     </span>
                    }

                    
                    {/* follow task */}
                    {this.state.follower.length === 0 ? 
                    <span>
                       <button type="button" class="btn btn-outline-success btn-sm" onClick={() => followTask(this.state.id)}>Follow</button>&nbsp;

                    </span>
                    :
                    
                    <span>
                    
                      {this.state.follower.map((foo) => {
                        return(
                            (foo.taskId === this.state.id)&& (foo.userId === currentUser.id) ? f.add("") : ''
                          
                        )
                      })}

                      { f.has("") ? 
                      
                        <span> 
                          <button type="button" class="btn btn-success btn-sm" onClick={() => UnfollowTask(this.state.id)} >Unfollow</button>&nbsp;
                        </span>

                      : 
                        <span> 
                          <button type="button" class="btn btn-outline-success btn-sm" onClick={() => followTask(this.state.id)}>Follow</button>&nbsp;
                        </span>
                      }
                        
                     </span>
                    }
                    
                    </div>

                    <Form
                    name="commentForm"
                      onSubmit={(event) => this.handleSubmit(event, this.state.id)}
                      ref={c => {
                        this.form = c;
                      }}
                    >
                      
                      <div class="row">
                       <div class = "col">
                            <input
                              type="text"
                              
                              className="form-control"
                              placeholder="Comment"
                              name="text"
                              autoComplete="off"
                              onChange={(event) => this.onChangetext(event) }
                            />
                      </div>
                      <button type="submit" className="btn btn-primary btn-sm input-group-text"><i class="fa fa-paper-plane" aria-hidden="true"></i></button>
                         
                        </div>
                      <CheckButton
                        style={{ display: "none" }}
                        ref={c => {
                          this.checkBtn = c;
                        }}
                      />
                    </Form>
                  </div>

                  <div class="col-sm-6 col-md-4" 
                    style={{
                          border: '2px solid #eee',
                          padding: '1%'
                          }}>
                          <span class="badge badge-primary">Likes</span>


                          {this.state.likes.map((value)=> {
                          return(
                              <p> 
                                
                                {(value.taskId === this.state.id) ? 
                                  <span>
                                    {this.state.users.map((key)=> {
                                    return(
                                      <p>
                                        {(value.taskId === this.state.id) && (value.userId === key.id) ? 
                                        
                                        <span class="badge badge-info">{key.username }</span>
                                        
                                        :''
                                        
                                        }
                                        
                                      </p>
                                    )
                                  })}
                                  
                                  

                                  </span> 
                                : 
                                ''
                              }
                              
                              </p>
                              
                          )
                      })}

                      <span class="badge badge-primary">Followers</span>

                      {this.state.follower.map((value)=> {
                          return(
                              <p> 
                                
                                {(value.taskId === this.state.id) ? 
                                  <span>
                                    {this.state.Fusers.map((key)=> {
                                    return(
                                      <p>
                                        {(value.taskId === this.state.id) && (value.userId === key.id) ? 
                                        
                                        <span class="badge badge-info">{key.username }</span>

                                        
                                        :''
                                        
                                        }
                                        
                                      </p>
                                    )
                                  })}
                                  
                                  

                                  </span> 
                                : 
                                ''
                              }
                              
                              </p>
                              
                          )
                      })}
                  </div>
                  <div class="col-sm-6 col-md-4" 
                    style={{
                          border: '2px solid #eee',
                          padding: '1%'
                          }}>
                         <span class="badge badge-primary">Comments</span>
                        

                        {this.state.comments.map((value)=> {
                          return(
                              <p> 
                                
                                {(value.taskId === this.state.id) ? 
                                  <span>
                                    {this.state.Cusers.map((key)=> {
                                    return(
                                      <p>
                                        {(value.taskId === this.state.id) && (value.userId === key.id) ?
                                        
                                        <span class="badge badge-info">{key.username}</span>
                        
                                         :''
                                        
                                        }
                                        
                                      </p>
                                    )
                                  })}
                                   <span class="alert alert-primary">{value.text}</span>
                                   <span class="alert">{Moment(value.createDate).startOf('second').fromNow()}</span>
                        
                                  </span> 
                                : 
                                ''
                              }
                              
                              </p>
                              
                          )
                      })}
                  </div>
                
          </div>
          
          
          
        </div>
      </div>
    )
  }
}

