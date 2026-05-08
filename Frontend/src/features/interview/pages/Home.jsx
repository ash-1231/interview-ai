import React, { useState, useRef } from 'react'
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate } from 'react-router'
import { useAuth } from "../../auth/hooks/useAuth.js"

const Home = () => {
    const { loading, generateReport, reports } = useInterview()
    const [jobDescription, setJobDescription] = useState("")
    const [selfDescription, setSelfDescription] = useState("")
    const resumeInputRef = useRef()
    const { handleLogout } = useAuth();

    const navigate = useNavigate()

    const handleGenerateReport = async () => {
        const resumeFile = resumeInputRef.current.files[0]
        const data = await generateReport({ jobDescription, selfDescription, resumeFile })
        navigate(`/interview/${data._id}`)
    }
    const onLogout = async () => {
    await handleLogout();
    navigate("/login");
    };

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
        Loading your Interview plan....
      </p>

    </main>
  );
}

   
return (
    <div className="min-h-screen bg-[#0b0f17] text-white px-6 py-12">

        {/* Header */}
    <header className="flex justify-between items-center mb-12">

    <div className="text-left">
        <h1 className="text-4xl md:text-5xl font-bold">
            Create Your Custom{" "}
            <span className="text-pink-500">Interview Plan</span>
        </h1>
        <p className="text-gray-400 mt-3">
            Let our AI analyze the job requirements and your unique profile
            to build a winning strategy.
        </p>
    </div>

    <button
        onClick={onLogout}
        className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
    >
        Logout
    </button>

</header>

        {/* Card */}
        <div className="max-w-6xl mx-auto bg-[#111827] border border-gray-800 rounded-2xl shadow-xl overflow-hidden">

            <div className="grid md:grid-cols-2">

                {/* LEFT PANEL */}
                <div className="p-6 border-r border-gray-800">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="font-semibold">Target Job Description</h2>
                        <span className="text-xs bg-pink-600/20 text-pink-400 px-2 py-1 rounded">
                            REQUIRED
                        </span>
                    </div>

                    <textarea
                        onChange={(e) => setJobDescription(e.target.value)}
                        className="w-full h-72 p-4 rounded-lg bg-[#0b0f17] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-600 text-sm"
                        placeholder="Paste the full job description here..."
                    />

                    <p className="text-xs text-gray-500 mt-2 text-right">
                        0 / 5000 chars
                    </p>
                </div>

                {/* RIGHT PANEL */}
                <div className="p-6">

                    <h2 className="font-semibold mb-4">Your Profile</h2>

                    {/* Upload */}
                    <div className="mb-5">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm">Upload Resume</span>
                            <span className="text-xs bg-pink-600/20 text-pink-400 px-2 py-1 rounded">
                                BEST RESULTS
                            </span>
                        </div>

                        <label className="flex flex-col items-center justify-center h-36 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-pink-500 transition bg-[#0b0f17]">
                            <p className="text-gray-400">
                                Click to upload or drag & drop
                            </p>
                            <p className="text-xs text-gray-500">
                                PDF or DOCX (Max 5MB)
                            </p>
                            <input ref={resumeInputRef} type="file" hidden />
                        </label>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center my-4">
                        <div className="flex-1 h-px bg-gray-800" />
                        <span className="px-3 text-gray-500 text-sm">OR</span>
                        <div className="flex-1 h-px bg-gray-800" />
                    </div>

                    {/* Self Description */}
                    <div>
                        <p className="text-sm mb-2">Quick Self-Description</p>
                        <textarea
                            onChange={(e) => setSelfDescription(e.target.value)}
                            className="w-full h-28 p-4 rounded-lg bg-[#0b0f17] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-600 text-sm"
                            placeholder="Briefly describe your experience..."
                        />
                    </div>

                    {/* Info box */}
                    <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-sm text-blue-300">
                        Either a <strong>Resume</strong> or a{" "}
                        <strong>Self Description</strong> is required to generate personalised plans.
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-800">
                <span className="text-sm text-gray-500">
                    AI-Powered Strategy Generation • Approx 30s
                </span>

                <button
                    onClick={handleGenerateReport}
                    className="bg-pink-600 hover:bg-pink-700 px-6 py-3 rounded-lg font-semibold shadow-lg transition"
                >
                    Generate My Interview Strategy
                </button>
            </div>
        </div>
    </div>
)


}

export default Home

