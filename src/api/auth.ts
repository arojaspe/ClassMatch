import axios from "./axiosConfig";

export const checkAuth = async () => {
  try {
    const response = await axios.get("/auth");
    return response.data;
  } catch {
    return null;
  }
};
