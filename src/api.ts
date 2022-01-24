import axios from "axios";

const ApiMiddleware = axios.create({
  baseURL: "/api",
  timeout: 30000,
});

//console.log('api',process.env.NEXT_PUBLIC_SERVER_BASE_URL)

export default ApiMiddleware;
