import { createBrowserRouter, Outlet } from "react-router"; // keep yours

import { AuthProvider } from "./features/auth/auth.context.jsx";
import { InterviewProvider } from "./features/interview/interview.context.jsx";

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
    element: <RootLayout />,   // 👈 THIS IS KEY
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
