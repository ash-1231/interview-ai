import React from "react";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";

const Protected = ({ children }) => {
  const { loading, user } = useAuth();

  // ⛔ wait until auth state is resolved
  if (loading) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-black">
        <div className="relative w-16 h-16">
          {/* Pulse ring */}
          <div className="absolute inset-0 rounded-full border-4 border-[#e1034d] opacity-30 animate-ping"></div>

          {/* Spinner */}
          <div className="w-16 h-16 border-4 border-t-[#e1034d] border-gray-700 rounded-full animate-spin"></div>
        </div>

        <p className="mt-4 text-gray-400 text-sm tracking-wide">
          Loading...
        </p>
      </main>
    );
  }

  // ❌ not logged in → redirect
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ✅ logged in → render children safely
  return <>{children}</>;
};

export default Protected;
