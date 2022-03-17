import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/testUser/';

class UserService {
  
  getUserBoard() {
    return axios.get(API_URL + 'user', { headers: authHeader() });
  }

  getAdminBoard() {
    return axios.get(API_URL + 'admin', { headers: authHeader() });
  }

  getModeratorBoard() {
    return axios.get(API_URL + 'moderator', { headers: authHeader() });
  }
  
}

export default new UserService();