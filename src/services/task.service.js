import axios from "axios";
const API_URL = 'http://localhost:8080/api/task/';

class TaskService {


    task() {
      return axios.get(API_URL + 'createTask');
    }
    createTask(taskName, taskDescription, userId, sharedWith,status) {
      return axios.post(API_URL + "createTask/submit", {
        taskName,
        taskDescription,
        userId,
        sharedWith,
        status
      });
    }

    addComment(text, userId, taskId) {
      return axios.put(API_URL + "view/add/comment", {
        text,
        userId,
        taskId,
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

    getTaskData() {
      return axios.get(API_URL + 'AllUserTaskData');
    }
    getAdminTaskData() {
      return axios.get(API_URL + 'AllAdminTaskData');
    }
    getModeratorTaskData() {
      return axios.get(API_URL + 'AllModeratorTaskData');
    }
    getCommentData() {
      return axios.get(API_URL + 'AllCommentData');
    }
    getCommentUserData() {
      return axios.get(API_URL + 'AllCommentUserData');
    }

    getRestrictedTask() {
      return axios.get(API_URL + 'restricted');
    }

    getALLSharedTask() {
      return axios.get(API_URL + 'AllCommonTaskData');
    }
    
    
}

export default new TaskService();