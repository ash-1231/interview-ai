import React, { useState, useEffect } from 'react'
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate, useParams } from 'react-router'
import { useAuth } from '../../auth/hooks/useAuth.js'

const NAV_ITEMS = [
    { id: 'technical', label: 'Technical Questions' },
    { id: 'behavioral', label: 'Behavioral Questions' },
    { id: 'roadmap', label: 'Road Map' },
]
const auth = useAuth();
const handleLogout = auth?.handleLogout;
const navigate = useNavigate();


const onLogout = async () => {
    await handleLogout();
    navigate("/login");
};

// Question Card
const QuestionCard = ({ item, index }) => {
    const [open, setOpen] = useState(false)

    return (
        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
            <div
                onClick={() => setOpen(!open)}
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-800 transition"
            >
                <div className="flex gap-3 items-center">
                    <span className="text-pink-500 font-bold">Q{index + 1}</span>
                    <p className="text-gray-200">{item.question}</p>
                </div>
                <span className={`transition ${open ? 'rotate-180' : ''}`}>⌄</span>
            </div>

            {open && (
                <div className="p-4 border-t border-gray-800 space-y-4">
                    <div>
                        <p className="text-xs text-pink-400 mb-1">Intention</p>
                        <p className="text-gray-300">{item.intention}</p>
                    </div>
                    <div>
                        <p className="text-xs text-green-400 mb-1">Model Answer</p>
                        <p className="text-gray-300">{item.answer}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

// Roadmap Day
const RoadMapDay = ({ day }) => (
    <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
        <h3 className="text-pink-500 font-semibold mb-2">
            Day {day.day} — {day.focus}
        </h3>

        <ul className="space-y-2 text-gray-300">
            {day.tasks.map((task, i) => (
                <li key={i} className="flex gap-2">
                    <span>•</span>
                    {task}
                </li>
            ))}
        </ul>
    </div>
)

const Interview = () => {
    const [activeNav, setActiveNav] = useState('technical')
    const { report, getReportById, loading, getResumePdf } = useInterview()
    const { interviewId } = useParams()

    useEffect(() => {
        if (interviewId) getReportById(interviewId)
    }, [interviewId])

    if (loading || !report) {
        return (
            <main className="flex flex-col items-center justify-center min-h-screen bg-black">

                <div className="relative w-16 h-16">
                    {/* Pulse ring */}
                    <div className="absolute inset-0 rounded-full border-4 border-[#e1034d] opacity-30 animate-ping"></div>

                    {/* Spinner */}
                    <div className="w-16 h-16 border-4 border-t-[#e1034d] border-gray-700 rounded-full animate-spin"></div>
                </div>

                <p className="mt-4 text-gray-400 text-sm tracking-wide">
                    Downloading your resume.....
                </p>

            </main>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white flex">

            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 p-5 border-r border-gray-800">
                <p className="text-gray-400 mb-4">Sections</p>

                <div className="space-y-2">
                    {NAV_ITEMS.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveNav(item.id)}
                            className={`w-full text-left px-4 py-2 rounded-lg transition ${activeNav === item.id
                                ? 'bg-pink-600 text-white'
                                : 'hover:bg-gray-800'
                                }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => getResumePdf(interviewId)}
                    className="mt-6 w-full bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded-lg"
                >
                    Download Resume
                </button>
                <button
                 onClick={onLogout}
                 className="mt-6 w-full bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
                 >
                  Logout
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 space-y-6">

                {activeNav === 'technical' && (
                    <>
                        <h2 className="text-2xl font-bold">Technical Questions</h2>
                        <div className="space-y-4">
                            {report.technicalQuestions.map((q, i) => (
                                <QuestionCard key={i} item={q} index={i} />
                            ))}
                        </div>
                    </>
                )}

                {activeNav === 'behavioral' && (
                    <>
                        <h2 className="text-2xl font-bold">Behavioral Questions</h2>
                        <div className="space-y-4">
                            {report.behavioralQuestions.map((q, i) => (
                                <QuestionCard key={i} item={q} index={i} />
                            ))}
                        </div>
                    </>
                )}

                {activeNav === 'roadmap' && (
                    <>
                        <h2 className="text-2xl font-bold">Roadmap</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            {report.preparationPlan.map(day => (
                                <RoadMapDay key={day.day} day={day} />
                            ))}
                        </div>
                    </>
                )}
            </main>

            {/* Right Sidebar */}
            <aside className="w-72 bg-gray-900 p-5 border-l border-gray-800 space-y-6">

                <div className="text-center">
                    <p className="text-gray-400">Match Score</p>
                    <div className="text-4xl font-bold text-pink-500">
                        {report.matchScore}%
                    </div>
                </div>

                <div>
                    <p className="text-gray-400 mb-2">Skill Gaps</p>
                    <div className="flex flex-wrap gap-2">
                        {report.skillGaps.map((gap, i) => (
                            <span
                                key={i}
                                className="px-2 py-1 bg-gray-800 rounded text-sm"
                            >
                                {gap.skill}
                            </span>
                        ))}
                    </div>
                </div>

            </aside>
        </div>
    )
}

export default Interview

