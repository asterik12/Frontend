import React, { Component } from "react";
import AuthService from "../services/auth.service";
import {Redirect} from "react-router-dom"
import UserService from "../services/user.service";
import EventBus from "../common/EventBus";

export default class ModeratorBoard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: "",
      redirect: null,
      userReady: false,
      task:[]
    };
  }

  componentDidMount() {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) {
      this.setState({ redirect: "/login" });
    }
      
    else{
      this.setState({ currentUser: currentUser, userReady: true })
      UserService.getModeratorBoard().then(
        response => {
          this.setState({
            content: response.data,
            task: response.data
          });
        });
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
          <h3>ModeratorBoard</h3>
          <button type="button" class="btn btn-primary">
            Tasks <span class="badge badge-light">{this.state.task.length}</span>
            <span class="sr-only">unread messages</span>
          </button>
        </header>

        
        <div class="card-group">
          <div class = "row">
            {/* task */}
              {this.state.task.map( (e) =>{
                return(
                <div class="col-sm-6 col-md-4" 
                    style={{
                          border: '2px solid #eee',
                          padding: '1%'
                          }}>

                  <img class="card-img-top" src="/assets/task.jpg" alt="Card image cap"/>
                  <div class="card-body">
                    <h5 class="card-title">{e.taskName}</h5>
                    <p class="card-text">{e.taskDescription}</p>
                    <p class="card-text">
                      {/* {
                        new Intl.DateTimeFormat('en-GB', { dateStyle: 'full', timeStyle: 'long' }).format(e.createDate)
                      } */}
                      {e.createDate}
                    </p>

                  </div>
                  <div class="card-footer">
                    <button type="button" class="btn btn-outline-primary">Like</button>&nbsp;
                    <button type="button" class="btn btn-outline-secondary">Comment</button>&nbsp;
                    <button type="button" class="btn btn-outline-success">Follow</button>&nbsp;
                    </div>
                  </div>
                );
                
              })}
          </div>
          
          
          
        </div>

      </div>
    );
  }
}