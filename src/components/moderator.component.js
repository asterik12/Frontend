import React, { Component } from "react";
import AuthService from "../services/auth.service"
import UserService from "../services/user.service";
import {Redirect} from "react-router-dom"
import {Link, Route} from "react-router-dom"
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import Moment from "moment";
import Axios from "axios";
import taskService from "../services/task.service";

export default class ModeratorBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      currentUser:{username: "" },
      userId: '',
      taskId:'',      
      redirect: null,
      userReady: false,
      text:'',
      check: false,
      followCheck: false,
      checkTask:false,
      AllTask:[],
      commentCheck:false,
      task:[],
      likes:[],
      follower:[],
      comments:[],
      // showModal:false,
      // modalId: null
    };
    this.onChangetext = this.onChangetext.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
 
  componentDidMount() {
    const currentUser = AuthService.getCurrentUser();
    
    console.log(currentUser);
    if (!currentUser) {
      this.setState({ redirect: "/login" });
    }
      
    else{
      this.setState({ currentUser: currentUser, userReady: true })
      UserService.getModeratorBoard().then(
        response => {
          this.setState({
            AllTask:response.data,
            id: response.data.id,
            userId: currentUser.id,
          });
        }
      );
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
      taskService.getModeratorTaskData().then(
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
      taskService.getModeratorTaskData().then(
        response => {
          this.setState({
            task:response.data,
            checkTask:false
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

  onChangetext(e, i){

    const Ntext = [...this.state.text];
    Ntext[i] = e.target.value;
    this.setState({
      Ntext
    })
    e.preventDefault();
   
  }

  handleSubmit(e, taskId, index) {
    const currentUser = AuthService.getCurrentUser();

    e.preventDefault();
    this.setState({
      message: "",
      successful: false
    });
    
    const Ntext = [...this.state.text];

    if (this.checkBtn.context._errors.length === 0) {
      taskService.addComment(
        this.state.Ntext[index],
        currentUser.id,
        taskId
      ).then(
        response => {
          console.log(response);
          this.state.Ntext[index] = e.target.reset()
          this.setState({
            message: response.data.message,
            successful: true,
            commentCheck: true,
            Ntext
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

  // showModal = (e, index) => {
  //   this.setState({ showModal: true, modalId: index });
  //   console.log("Index: " + index);
  // };

  // hideModal = (e, index) => {
  //   this.setState({ showModal: false, modalId: index });
  //   console.log("Index: " + index);
  // };

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }
    const { currentUser } = this.state;
    

    const likeTask = (id) => {
      
      const newData = {
        userId: this.state.userId,
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
          check: true
        })
      }).catch(err => console.log(err));
    }

    const DislikeTask = (id) => {
      
      const newData = {
        userId: this.state.userId,
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
          check: true
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
        userId: this.state.userId,
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
          followCheck: true
        })
      }).catch(err => console.log(err));
    }

    const UnfollowTask = (id) => {
      
      const newData = {
        userId: this.state.userId,
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
          followCheck: true
        })
      }).catch(err => console.log(err));
    }

    


    let x = new Set();
    let f = new Set();
    let LCount = new Array();
    let CCount = new Array();
    let FCount = new Array();

    // let modalClose = () => this.setState({showModal: false});
    return (
      <div className="container">
        <header className="jumbotron">
          <h3>Dashboard</h3>
          <button type="button" class="btn btn-primary">
            Tasks <span class="badge badge-light">{this.state.task.length}</span>
            <span class="sr-only">unread messages</span>
          </button>
        </header>


        <div class="card-group">
          <div class = "row">
            {/* task */}
            
              {this.state.task.map( (e, index) =>{
                return(
                  
                <div class="col-sm-6 col-md-4" 
                    style={{
                          border: '2px solid #eee',
                          padding: '1%'
                          }}>

                  <img class="card-img-top" src="/assets/task.jpg" alt="Card image cap"/>
                  <span class="badge badge-info" style={{transform:'rotate(-30deg)' ,position: 'absolute',top: '3%',left: '0%'}}>{e.sharedWith}</span>
                  {(e.userId === currentUser.id) ?
                  <span>
                    <Link to={`/edit/${e.id}`}>
                      <span class="badge badge-primary" style={{ position: 'absolute',top: '0%',right: '0%', fontSize: '14px'}}>
                      <i class="fa fa-edit" aria-hidden="true"></i>
                      </span>
                    </Link>

                   
                    <span  class="badge badge-primary" style={{ position: 'absolute',top: '0%',right: '7%', fontSize: '14px'}}>
                    <i class="fa fa-trash" aria-hidden="true"  onClick={() => deleteTask(e.id)}></i>
                    </span>
                  </span>
                    :    
                       <span ></span>
                  }
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
                              
                  {x.clear()}
                  {f.clear()}
                  {LCount.splice(0, LCount.length)}
                  {CCount.splice(0, CCount.length)}
                  {FCount.splice(0, FCount.length)}

                  <div class="card-footer-actions">
                    <small class="text-muted">
                    <Link to={`/read/${e.id}`} >
                     <span class= "show-action-content">
                       {this.state.likes.map((c) => {
                         return(
                          (c.taskId === e.id) ? (LCount.push("") !== -1)?'':'' : ''
                         )
                       })}
                       {LCount.length} likes
                      </span> 
                    </Link>  
                      &nbsp;&nbsp;
                    <Link to={`/read/${e.id}`} >
                      <span class= "show-action-content">
                      {this.state.comments.map((c) => {
                         return(
                          (c.taskId === e.id) ? (CCount.push("") !== -1)?'':'' : ''
                         )
                       })}
                       {CCount.length} Comments
                      
                      </span>
                    </Link>
                      &nbsp;&nbsp;
                    <Link to={`/read/${e.id}`} >
                      <span class= "show-action-content">
                      {this.state.follower.map((c) => {
                         return(
                          (c.taskId === e.id) ? (FCount.push("") !== -1)?'':'' : ''
                         )
                       })}
                       {FCount.length} followers
                      </span>
                    </Link>
                    
                    </small>
                  </div>
                  <div class="card-footer">

                    {/* like task  */}

                    {this.state.likes.length === 0 ? 
                    <span>
                       <button type="button" class="btn btn-outline-primary btn-sm" onClick={() => likeTask(e.id)}>Like</button>&nbsp;

                    </span>
                    :
                    
                    <span>
                    
                      {this.state.likes.map((c) => {
                        return(
                            (c.taskId === e.id)&& (c.userId === currentUser.id) ? x.add("") : ''
                          
                        )
                      })}

                      { x.has("") ? 
                      
                        <span> 
                          <button type="button" class="btn btn-primary btn-sm" onClick={() => DislikeTask(e.id)} >Unlike</button>&nbsp;
                        </span>

                      : 
                        <span> 
                          <button type="button" class="btn btn-outline-primary btn-sm" onClick={() => likeTask(e.id)}>Like</button>&nbsp;
                        </span>
                      }
                        
                     </span>
                    }

                    {/* Comment task */}
                    <Link to={`/read/${e.id}`} >
                    <button type="button" class="btn btn-outline-secondary btn-sm">Comment</button>&nbsp;
                    </Link>
                    {/* follow task */}
                    {this.state.follower.length === 0 ? 
                    <span>
                       <button type="button" class="btn btn-outline-success btn-sm" onClick={() => followTask(e.id)}>Follow</button>&nbsp;

                    </span>
                    :
                    
                    <span>
                    
                      {this.state.follower.map((foo) => {
                        return(
                            (foo.taskId === e.id)&& (foo.userId === currentUser.id) ? f.add("") : ''
                          
                        )
                      })}

                      { f.has("") ? 
                      
                        <span> 
                          <button type="button" class="btn btn-success btn-sm" onClick={() => UnfollowTask(e.id)} >Unfollow</button>&nbsp;
                        </span>

                      : 
                        <span> 
                          <button type="button" class="btn btn-outline-success btn-sm" onClick={() => followTask(e.id)}>Follow</button>&nbsp;
                        </span>
                      }
                        
                     </span>
                    }
                    
                    </div>

                    <Form
                    name="commentForm"
                      onSubmit={(event) => this.handleSubmit(event, e.id, index)}
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
                              onChange={(event) => this.onChangetext(event, index) }
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
                );
                
              })}
          </div>
          
          
          
        </div>

      </div>
    );
  }
}