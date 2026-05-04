import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../hooks/useAuth";

const Register = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { loading, handleRegister } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleRegister({ username, email, password });
    navigate("/");
  };

  const handleGoogleSignup = () => {
    window.location.href = "http://localhost:3000/api/auth/google";
  };

if (loading) {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-black">
      
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-[#e1034d] opacity-30 animate-ping"></div>
        <div className="w-16 h-16 border-4 border-t-[#e1034d] border-gray-700 rounded-full animate-spin"></div>
      </div>

      <p className="mt-4 text-gray-400 text-sm tracking-wide">
        Creating your account...
      </p>

    </main>
  );
}

return (
  <main className="flex items-center justify-center min-h-screen bg-black text-white">
    <div className="w-full max-w-md px-6">

      <h1 className="text-4xl font-bold mb-8">Create Account</h1>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Username */}
        <div>
          <label className="block mb-2 text-gray-300">Username</label>
          <input
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            placeholder="Enter username"
            className="w-full px-5 py-3 rounded-xl bg-gray-200 text-black focus:outline-none"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block mb-2 text-gray-300">Email</label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Enter email address"
            className="w-full px-5 py-3 rounded-xl bg-gray-200 text-black focus:outline-none"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block mb-2 text-gray-300">Password</label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Enter password"
            className="w-full px-5 py-3 rounded-xl bg-gray-200 text-black focus:outline-none"
          />
        </div>

        {/* Button */}
        <button
            className="w-full bg-[#e1034d] text-white px-6 py-3 rounded-xl transition-all duration-300 active:scale-90 cursor-pointer hover:bg-[#b0023c]"
        >
          Register
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center my-6">
        <div className="flex-1 h-px bg-gray-700"></div>
        <span className="px-3 text-gray-400 text-sm">OR</span>
        <div className="flex-1 h-px bg-gray-700"></div>
      </div>

      {/* Google */}
      <button
        onClick={handleGoogleSignup}
        className="w-full flex items-center justify-center gap-2 border border-gray-600 py-3 rounded-xl hover:bg-gray-900 transition cursor-pointer"
      >
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          className="w-5 h-5"
        />
        Sign up with Google
      </button>

      {/* Login */}
      <p className="text-sm text-gray-300 mt-6">
        Already have an account?{" "}
        <Link to="/login" className="text-[#e1034d] underline underline-offset-4">
          Login
        </Link>
      </p>

    </div>
  </main>
);
};

export default Register;