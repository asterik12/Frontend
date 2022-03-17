import axios from "axios";
const API_URL = 'http://localhost:8080/api/task/';

class TaskService {


    task() {
      return axios.get(API_URL + 'createTask');
    }
    createTask(taskName, taskDescription, userId, sharedWith) {
      return axios.post(API_URL + "createTask/submit", {
        taskName,
        taskDescription,
        userId,
        sharedWith
      });
    }

    addComment(text, userId, taskId ) {
      return axios.post(API_URL + "view/add/comment", {
        text,
        userId,
        taskId
      });
    }

    getLikesData() {
      return axios.get(API_URL + 'AllLikesData');
    }
    getFollowData() {
      return axios.get(API_URL + 'AllFollowData');
    }
    getFollowUserDetails() {
      return axios.get(API_URL + 'AllFollowUserData');
    }
    getUserDetail() {
      return axios.get(API_URL + 'AllLikesUserData');
    }
    
}

export default new TaskService();