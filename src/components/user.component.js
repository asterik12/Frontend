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
export default class Dashboard extends Component {
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
      task:[],
      likes:[],
      follower:[]
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
      UserService.getUserBoard().then(
        response => {
          this.setState({
            task:response.data,
            
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
    
    
  }

  onChangetext(e, i){
    const Ntext = [...this.state.text];
    Ntext[i] = e.target.value;
    this.setState({Ntext})
   
  }

  handleSubmit(e, taskId) {
    const currentUser = AuthService.getCurrentUser();

    e.preventDefault();
    this.setState({
      message: "",
      successful: false
    });
    
    console.log(this.state);

    if (this.checkBtn.context._errors.length === 0) {
      taskService.addComment(
        this.state.text,
        currentUser.id,
        taskId
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
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }
    const { currentUser } = this.state;
    

    const likeTask = (id) => {
      
      const newData = {
        userId: this.state.userId,
        taskId: id
      }
     
      console.log("New data : ", newData)
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
        // this.props.history.push('/profile')
        console.log(response)
      }).catch(err => console.log(err));
    }

    


    let x = new Set();
    let f = new Set();
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
                    <Link to={`/edit/${e.id}`} className="nav-link" >
                      <span class="badge badge-primary" style={{ position: 'absolute',top: '0%',right: '0%', fontSize: '14px'}}>
                      <i class="fa fa-edit" aria-hidden="true"></i>
                      </span>
                    </Link>

                   
                    <span onClick={() => deleteTask(e.id)} class="badge badge-primary" style={{ position: 'absolute',top: '0%',right: '7%', fontSize: '14px'}}>
                    <i class="fa fa-trash" aria-hidden="true"  ></i>
                    </span>
                  </span>
                    :    
                       <span ></span>
                  }
                  
                  <div class="card-body">
                    <h5 class="card-title">{e.taskName}</h5>
                    <p class="card-text">{e.taskDescription}</p>
                    <p class="card-text">
                      
                      Created At 
                     
                      {e.createDate}
                    </p>
                    <p class="card-text">
                      Updated At {e.updatedDate}
                    </p>

                  </div>
                              
                  {x.clear()}
                  {f.clear()}
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
                            (c.taskId === e.id)&& (c.userId === currentUser.id) ? x.add(" ") : ''
                          
                        )
                      })}

                      { x.has(" ") ? 
                      
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
                    <button type="button" class="btn btn-outline-secondary btn-sm">Comment</button>&nbsp;
                    
                    {/* follow task */}
                    {this.state.follower.length === 0 ? 
                    <span>
                       <button type="button" class="btn btn-outline-success btn-sm" onClick={() => followTask(e.id)}>Follow</button>&nbsp;

                    </span>
                    :
                    
                    <span>
                    
                      {this.state.follower.map((foo) => {
                        return(
                            (foo.taskId === e.id)&& (foo.userId === currentUser.id) ? f.add(" ") : ''
                          
                        )
                      })}

                      { f.has(" ") ? 
                      
                        <span> 
                          <button type="button" class="btn btn-success btn-sm" onClick={() => UnfollowTask(e.id)} >Unfollow</button>&nbsp;
                        </span>

                      : 
                        <span> 
                          <button type="button" class="btn btn-outline-sucess btn-sm" onClick={() => followTask(e.id)}>Follow</button>&nbsp;
                        </span>
                      }
                        
                     </span>
                    }
                    
                    </div>

                    <Form
                      onSubmit={(event) => this.handleSubmit(event, e.id)}
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