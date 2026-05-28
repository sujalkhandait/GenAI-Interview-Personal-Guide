import { createBrowserRouter } from "react-router-dom";

import Login from "./features/auth/pages/Login.jsx";
import Register from "./features/auth/pages/Register.jsx";
import Protected from "./features/auth/components/Protected.jsx";

import Home from "./features/report/pages/Home.jsx";
import Interview from "./features/report/pages/Interview.jsx";
import History from "./features/report/pages/History.jsx";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },

  {
    path: "/register",
    
    element: <Register />,
  },

  {
    path: "/",
    element: (
      <Protected>
        <Home />
      </Protected>
    ),
  },

  // =========================
  // INTERVIEW HISTORY PAGE
  // =========================
  {
    path: "/history",
    element: (
      <Protected>
        <History />
      </Protected>
    ),
  },

  // =========================
  // INTERVIEW REPORT PAGE
  // =========================
  {
    path: "/interview/:interviewId",
    element: (
      <Protected>
        <Interview />
      </Protected>
    ),
  },

  // =========================
  // 404 PAGE
  // =========================
  {
    path: "*",
    element: <h1>404 - Page Not Found</h1>,
  },
]);

export default router;
