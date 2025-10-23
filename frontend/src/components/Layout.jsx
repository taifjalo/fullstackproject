
/*
import { useEffect } from "react";
import { Navbar } from "./Navbar";
import { Outlet, useNavigate } from "react-router-dom";




export function Layout() {

    let user = sessionStorage.getItem("User")
    const navigate = useNavigate()


    useEffect(() => {
        if (!user) {
            navigate("/")
        }
    }, [user])


    return (
        <>
            <Navbar/>
            <Outlet/>
        </>
    )
}
*/


import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { ModernSidebar } from "./ModernSidebar";

export function Layout() {
    const [user, setUser] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token = sessionStorage.getItem("User");
        if (!token) {
            navigate("/");
        } else {
            setUser(token);
        }
    }, [navigate]);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    if (!user) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Mobile menu overlay */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <ModernSidebar 
                isOpen={sidebarOpen} 
                onClose={() => setSidebarOpen(false)}
                currentPath={location.pathname}
            />

            {/* Main content */}
            <div className="lg:pl-64 flex flex-col flex-1">
                {/* Top header for mobile */}
                <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 lg:hidden">
                    <button
                        type="button"
                        className="border-r border-gray-200 dark:border-gray-700 px-4 text-gray-500 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 lg:hidden"
                        onClick={toggleSidebar}
                    >
                        <span className="sr-only">Open sidebar</span>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <div className="flex-1 px-4 flex justify-between items-center">
                        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                            HabitTracker
                        </h1>
                    </div>
                </div>

                {/* Main content area */}
                <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
                    <div className="py-6">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}