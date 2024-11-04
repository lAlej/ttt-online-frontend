import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

interface User {
  username: string;
  email: string;
  password: string;
}

interface Login {
  username: string;
  password: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getAllUsers = async () => {
  try {
    const response = await apiClient.get("/getAllUsers");
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const newUser = async (user: User) => {
  try {
    const response = await apiClient.post("/registerUser", user);
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const loginUser = async (user: Login) => {
  try {
    const response = await apiClient.post("/loginUser", user);
    return response.data;
  } catch (error) {
    console.error("Error in login:", error);
    throw error;
  }
};
