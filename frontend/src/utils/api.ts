import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export const testDiagnose = async () => {
  const response = await API.post("/diagnose", {
    error_code: "E204",
  });

  return response.data;
};