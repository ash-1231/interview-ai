import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";
import React from 'react'

const Protected = ({children}) => {
    const { loading, user } = useAuth()

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
        )
    }

    if(!user){
        return <Navigate to={'/login'}/>
    }
    return (
       children
    )
}

export default Protected

