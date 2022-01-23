import axios from "axios";

const ApiMiddleware = axios.create({
  baseURL: "http://localhost:3000/api",
  timeout: 30000,
});

export default ApiMiddleware;
