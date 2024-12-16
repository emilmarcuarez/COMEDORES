import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/', // Cambia esto a la URL base de tu API
  headers: {

     'Content-Type': 'application/json',
    'Accept': 'application/json',
    // 'X-Rquested-With' : 'XMLHttpRequest'
    // 'Authorization': 'Bearer <token>', // Si necesitas un token de autenticación, descomenta esta línea
  },
});

export default axiosInstance;
