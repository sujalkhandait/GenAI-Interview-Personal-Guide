import axios from "axios";

const api = axios.create({
baseURL: `${import.meta.env.VITE_API_URL}/api/auth`,
  withCredentials: true,
});


// ================= REGISTER =================

export async function registerUser({
  username,
  email,
  password,
}) {
  try {
    const response = await api.post("/register", {
      username,
      email,
      password,
    });

    return response;

  } catch (error) {

    console.error(
      "Error registering user:",
      error
    );

    throw error;
  }
}


// ================= LOGIN =================

export async function loginUser({
  email,
  password,
}) {
  try {
    const response = await api.post("/login", {
      email,
      password,
    });

    return response;

  } catch (error) {

    console.error(
      "Error logging in user:",
      error
    );

    throw error;
  }
}


// ================= LOGOUT =================

export async function logoutUser() {

  try {

    const token = localStorage.getItem("token");

    const response = await api.get("/logout", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;

  } catch (error) {

    console.error(
      "Error logging out user:",
      error
    );

    throw error;
  }
}


// ================= GET CURRENT USER (/me) =================

export async function getCurrentUser() {

  try {

    const token = localStorage.getItem("token");

    const response = await api.get("/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;

  } catch (error) {

    console.error(
      "Error fetching current user:",
      error
    );

    throw error;
  }
}