import axios from 'axios';

const api = axios.create({
  baseURL: 'https://church-nazareno.herokuapp.com/api/',
});

export default api;
