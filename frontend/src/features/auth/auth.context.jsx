import {
  createContext,
  useState,
  useEffect,
} from "react";

import {
  loginUser,
  logoutUser,
  registerUser,
  getCurrentUser,
} from "./services/auth.api.js";


export const AuthContext = createContext();
const logClientError = async (payload) => {
  try {
    await fetch(`${import.meta.env.VITE_API_URL}/api/debug/client-error`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    console.error("Failed to send client error log:", e);
  }
};

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  // ================= BOOTSTRAP USER =================

  useEffect(() => {

    const fetchUser = async () => {

      try {

        const token =
          localStorage.getItem("token");

        if (!token) {
          setLoading(false);
          return;
        }

        const response =
          await getCurrentUser();

        setUser(response.data.user);

      } catch (error) {
        console.error(
          "Failed to fetch current user:",
          error
        );
       await logClientError({
  type: "BOOTSTRAP_USER_ERROR",
  message: error.message,
  status: error.response?.status,
  response: error.response?.data,
});

      } finally {

        setLoading(false);
      }
    };

    fetchUser();

  }, []);


  // ================= LOGIN =================

  const login = async (email, password) => {

    try {

      const response = await loginUser({
        email,
        password,
      });

      localStorage.setItem(
        "token",
        response.data.token
      );

      setUser(response.data.user);

      return response;

    } catch (error) {

      console.error(
        "Login failed:",
        error
      );
      
     await logClientError({
  type: "LOGIN_ERROR",
  message: error.message,
  error: error.message,
  email: email || null,
  status: error.response?.status,
  response: error.response?.data,
});

      throw error;
    }
  };


  // ================= REGISTER =================

  const register = async (
    username,
    email,
    password
  ) => {

    try {

      const response = await registerUser({
        username,
        email,
        password,
      });

      localStorage.setItem(
        "token",
        response.data.token
      );

      setUser(response.data.user);

      return response;

    } catch (error) {

  console.error("Register failed:", error);

  await logClientError({
    type: "REGISTER_ERROR",
    message: error.message,
    error: error.message,
   username: username || null,
    email: email || null,
    status: error.response?.status,
    response: error.response?.data,
  });

  throw error;
}
  };


  // ================= LOGOUT =================

  const logout = async () => {

    try {

      await logoutUser();

      localStorage.removeItem("token");

      setUser(null);

    } catch (error) {

      console.error(
        "Logout failed:",
        error
      );

      throw error;
    }
  };


  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        setLoading,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};