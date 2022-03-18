import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/auth.service";

import Login from "./components/login.component";
import Register from "./components/register.component";
import Profile from "./components/profile.component";
import BoardUser from "./components/user.component";
import BoardAdmin from "./components/admin.component";
import BoardModerator from "./components/moderator.component";
import EditTask from "./components/editTask.component";
import CreateTask from "./components/TaskForm.component";
import View from "./components/view.component";
import EventBus from "./common/EventBus";
import viewTask from "./components/viewTask.component";
import Restricted from "./components/restricted.component"
class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      showAdminBoard: false,
      showModeratorBoard: false,
      currentUser: undefined,
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
        showAdminBoard: user.roles.includes("ROLE_ADMIN"),
        showModeratorBoard: user.roles.includes("ROLE_MODERATOR"),
      });
    }
    
    EventBus.on("logout", () => {
      this.logOut();
    });
  }

  componentWillUnmount() {
    EventBus.remove("logout");
  }

  logOut() {
    AuthService.logout();
    this.setState({
      showAdminBoard: false,
      currentUser: undefined,
    });
  }

  render() {
    const { currentUser, showAdminBoard, showModeratorBoard } = this.state;

    return (
      <div>
        <nav className="navbar navbar-expand navbar-dark bg-primary">
          <Link to={"/user"} className="navbar-brand">
            Task-Associations
          </Link>
          <div className="navbar-nav mr-auto">
            {showAdminBoard && (
              <li className="nav-item">
                <Link to={"/admin"} className="nav-link">
                  Admin Board
                </Link>
              </li>
            )}

            {showModeratorBoard && (
              <li className="nav-item">
                <Link to={"/moderator"} className="nav-link">
                  Moderator Board
                </Link>
              </li>
            )}

            {currentUser && (
              <li className="nav-item">
                <Link to={"/user"} className="nav-link">
                  Dashboard
                </Link>
              </li>
              
            )}
            {currentUser && (
              <li className="nav-item">
              <Link to={"/restricted/task"} className="nav-link">
                Restricted Task
              </Link>
              </li>
            )}
            {currentUser && (
              <li className="nav-item">
              <Link to={"/createTask"} className="nav-link">
                Create Task
              </Link>
              </li>
            )}


          </div>

          {currentUser ? (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/profile"} className="nav-link">
                <i class="fa fa-user" aria-hidden="true"></i>
                  &nbsp;{currentUser.username}
                </Link>
              </li>
              <li className="nav-item">
                <a href="/login" className="nav-link" onClick={this.logOut}>
                <i class="fa fa-sign-out" aria-hidden="true"></i>
                  &nbsp;LogOut
                </a>
              </li>
            </div>
          ) : (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/login"} className="nav-link">
                <i class="fa fa-sign-in" aria-hidden="true"></i>
                  &nbsp;Login
                </Link>
              </li>

              <li className="nav-item">
                <Link to={"/register"} className="nav-link">
                <i class="fa fa-user-plus" aria-hidden="true"></i>
                 &nbsp;Register
                </Link>
              </li>
            </div>
          )}
        </nav>

        <div className="container mt-3">
          <Switch>
          
            <Route exact path={["/login"]} component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path={["/","/profile"]} component={Profile} />
            <Route path="/user" component={BoardUser} />
            <Route path="/admin" component={BoardAdmin} />
            <Route path="/moderator" component={BoardModerator} />
            <Route path="/createTask" component={CreateTask} />
            <Route path="/edit/:id" component={EditTask} />
            <Route path="/view" component={View} />
            <Route path="/read/:id" component={viewTask} />
            <Route path="/restricted" component={Restricted} />


          </Switch>
        </div>
      </div>
    );
  }
}

export default App;