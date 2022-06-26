import axios from "axios";

const client = axios.create({ baseURL: process.env.API_SERVER });

export default client;
