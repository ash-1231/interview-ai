import { createBrowserRouter, Outlet } from "react-router";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Protected from "./features/auth/components/Protected";
import Home from "./features/interview/pages/Home";
import Interview from "./features/interview/pages/Interview";

import { AuthProvider } from "./features/auth/auth.context.jsx";
import { InterviewProvider } from "./features/interview/interview.context.jsx";

// 👇 THIS IS THE IMPORTANT PART
const RootLayout = () => {
  return (
    <AuthProvider>
      <InterviewProvider>
        <Outlet />
      </InterviewProvider>
    </AuthProvider>
  );
};

export const router = createBrowserRouter([
  {
    element: <RootLayout />,   // 👈 wraps everything
    children: [
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/register",
        element: <Register />
      },
      {
        path: "/",
        element: <Protected><Home /></Protected>
      },
      {
        path: "/interview/:interviewId",
        element: <Protected><Interview /></Protected>
      }
    ]
  }
]);
