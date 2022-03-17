import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import AuthService from "../services/auth.service";

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
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

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }

    const { currentUser } = this.state;

    return (
      <div className="container">
        {(this.state.userReady) ?
        <div>
        <header className="jumbotron">
        <img
            src="/assets/avatar.png"
            alt="profile-img"
            className="profile-img-card"
          />
          <h3>
            <strong>{currentUser.username}</strong> 
          </h3>
          <span>
            {currentUser.roles &&
                currentUser.roles.map((role, index) => 
                  <p key={index}>
                   <span class="badge badge-primary">{role}</span>
                  </p>
                  )}
          </span>
              
          
        </header>
        
        <p>
          <strong>Email:</strong>{" "}
          {currentUser.email}
        </p>
       
        
      </div>: null}
      </div>
    );
  }
}