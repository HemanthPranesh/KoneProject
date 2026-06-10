import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export const diagnoseFault = async (data) => {
  const response = await API.post("/diagnose", data);

  return response.data;
};
export const chatWithAI = async (question, faultData) => {
  const response = await API.post("/chat", {
    question,
    fault_data: faultData,
  });

  return response.data;
};