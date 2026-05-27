import { useContext } from "react";

import { AuthContext } from "../auth.context.jsx";


export const useAuth = () => {

  const context = useContext(AuthContext);

  if (!context) {

    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  const {
    user,
    setUser,
    loading,
    setLoading,
    login,
    logout,
    register,
    fetchCurrentUser,
  } = context;


  // ================= LOGIN =================

  const handleLogin = async (
    email,
    password
  ) => {

    setLoading(true);

    try {

      const response = await login(
        email,
        password
      );

      localStorage.setItem(
        "token",
        response.data.token
      );

      setUser(response.data.user);

      return response.data;

    } catch (error) {

      console.error(
        "Login error:",
        error
      );

      throw error;

    } finally {

      setLoading(false);
    }
  };


  // ================= LOGOUT =================

  const handleLogout = async () => {

    setLoading(true);

    try {

      await logout();

      localStorage.removeItem("token");

      setUser(null);

    } catch (error) {

      console.error(
        "Logout error:",
        error
      );

      throw error;

    } finally {

      setLoading(false);
    }
  };


  // ================= REGISTER =================

  const handleRegister = async (
    username,
    email,
    password
  ) => {

    setLoading(true);

    try {

      const response = await register(
        username,
        email,
        password
      );

      localStorage.setItem(
        "token",
        response.data.token
      );

      setUser(response.data.user);

      return response.data;

    } catch (error) {

      console.error(
        "Registration error:",
        error
      );

      throw error;

    } finally {

      setLoading(false);
    }
  };


  // ================= FETCH CURRENT USER =================

  const handleFetchCurrentUser = async () => {

    const token =
      localStorage.getItem("token");

    if (!token) {

      return null;
    }

    setLoading(true);

    try {

      const response =
        await fetchCurrentUser();

      setUser(response.data.user);

      return response.data;

    } catch (error) {

      console.error(
        "Fetch current user error:",
        error
      );

      localStorage.removeItem("token");

      setUser(null);

      return null;

    } finally {

      setLoading(false);
    }
  };


  return {
    user,
    loading,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister,
    fetchCurrentUser:
      handleFetchCurrentUser,
  };
};