import axios from "axios";

const uri = "http://192.168.2.130:3333";

export const api = axios.create({
  baseURL: uri,
});
