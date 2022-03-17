import React, { Component } from "react";
import AuthService from "../services/auth.service"
import UserService from "../services/user.service";
import {Redirect} from "react-router-dom"
import taskService from "../services/task.service";

export default class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser:{username: "" },
      userId: '',
      taskId:'',
      redirect: null,
      userReady: false,
      likes:[],
      task:[],
      users:[]
    };
    
  }
 
  componentDidMount() {
    const currentUser = AuthService.getCurrentUser();
    
    console.log(currentUser);
    if (!currentUser) {
      this.setState({ redirect: "/login" });
    }
      
    else{
      this.setState({ currentUser: currentUser, userReady: true,})
      taskService.getLikesData().then(
        response => {
          this.setState({
            likes:response.data
          });
        }
      );
      UserService.getUserBoard().then(
        response => {
          this.setState({
            task:response.data,
          });
        }
      );
      taskService.getUserDetail().then(
        response => {
          this.setState({
            users:response.data,
          });
          console.log(this.state.users);
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
            
          <h3>Tasks</h3>
        </header>
        

        {this.state.task.map((e)=> {
            return(
                <div> 
                    Task: {e.id}
                    
                    <br/>
                    
                    
                    {this.state.likes.map((value)=> {
                        return(
                            <p> 
                              
                              {(value.taskId === e.id) ? 
                                <span>
                                  {this.state.users.map((key)=> {
                                  return(
                                    <p>
                                      {(value.taskId === e.id) && (value.userId === key.id) ? key.username :''
                                      
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
            )
            

        })}
        
        
          
          
      </div>
    );
  }
}