/*
import { useEffect, useState } from "react";
import { HabitCard } from "../components/HabitCard";
import { getHabits } from "../api";
import * as jwt_decode from 'jwt-decode';

export function Profile() {

    const [habits, setHabits] = useState([])
    const [user, setUser] = useState({})

    useEffect(() => {
        async function loadUserData() {
            const token = sessionStorage.getItem("User")
            const decodedUser = jwt_decode.jwtDecode(token)
            const allHabits = await getHabits()
            const filteredHabits = allHabits.filter((habit) => habit.author == decodedUser._id)
            setHabits(filteredHabits)
            setUser(decodedUser)
        }
        loadUserData()
    }, [])

    return (
        <>
        <label>Name: </label>
        <h2>{user.name}</h2>
        <label>Email: </label>
        <h2>{user.email}</h2>
        <label>Join Date: </label>
        <h2>{user.joinDate?.slice(0,10)}</h2>
        {habits.map((habit) => {
            return (
                <HabitCard habit={habit}/>
            )
        })}
        </>
    )
}
*/



import { useEffect, useState } from "react";
import { HabitCard } from "../components/HabitCard";
import { getHabits } from "../api";
import * as jwt_decode from 'jwt-decode';

export function Profile() {
    const [habits, setHabits] = useState([]);
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalHabits: 0,
        completedToday: 0,
        longestStreak: 0,
        thisWeek: 0
    });

    useEffect(() => {
        async function loadUserData() {
            try {
                setLoading(true);
                const token = sessionStorage.getItem("User");
                const decodedUser = jwt_decode.jwtDecode(token);
                const allHabits = await getHabits();
                const filteredHabits = allHabits.filter((habit) => habit.author == decodedUser._id);
                
                // Sort habits by date
                filteredHabits.sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));
                
                setHabits(filteredHabits);
                setUser(decodedUser);

                // Calculate stats
                const now = new Date();
                const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                
                setStats({
                    totalHabits: filteredHabits.length,
                    completedToday: Math.floor(Math.random() * 5), // Mock data
                    longestStreak: Math.floor(Math.random() * 30) + 5, // Mock data
                    thisWeek: filteredHabits.filter(h => new Date(h.dateCreated) > weekAgo).length
                });
            } catch (error) {
                console.error("Failed to load user data:", error);
            } finally {
                setLoading(false);
            }
        }
        loadUserData();
    }, []);

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="animate-pulse space-y-8">
                    <div className="flex items-center space-x-4">
                        <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                        <div className="space-y-2">
                            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Profile Header */}
            <div className="bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600 rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
                
                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center space-x-6 mb-6 md:mb-0">
                            {/* Avatar */}
                            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                                <span className="text-3xl font-bold text-white">
                                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                </span>
                            </div>
                            
                            {/* User Info */}
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-2">
                                    {user.name || 'User'}
                                </h1>
                                <p className="text-white/80 text-lg">
                                    {user.email}
                                </p>
                                <p className="text-white/60 text-sm mt-1">
                                    Member since {user.joinDate ? new Date(user.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently'}
                                </p>
                            </div>
                        </div>
                        
                        {/* Quick Actions */}
                        <div className="flex space-x-3">
                            <button className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg backdrop-blur-sm border border-white/30 transition-all duration-200 font-medium">
                                Edit Profile
                            </button>
                            <button className="px-6 py-3 bg-white text-purple-600 hover:bg-gray-100 rounded-lg transition-all duration-200 font-medium shadow-lg">
                                Settings
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Habits</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.totalHabits}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Today's Progress</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.completedToday}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Longest Streak</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.longestStreak}</p>
                        </div>
                        <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">This Week</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.thisWeek}</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* My Habits Section */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        My Habits ({habits.length})
                    </h2>
                    <div className="flex items-center space-x-3">
                        <select className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                            <option>All Habits</option>
                            <option>Active</option>
                            <option>Completed</option>
                            <option>Paused</option>
                        </select>
                        <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 text-sm font-medium">
                            + New Habit
                        </button>
                    </div>
                </div>

                {habits.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No habits created yet</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                            Start your journey by creating your first habit. Building good habits is the key to achieving your goals.
                        </p>
                        <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Create Your First Habit
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {habits.map((habit) => (
                            <HabitCard key={habit._id} habit={habit} />
                        ))}
                    </div>
                )}
            </div>

            {/* Achievement Section */}
            {habits.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                        <svg className="w-6 h-6 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                        Achievements
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
                            <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                </svg>
                            </div>
                            <h4 className="font-bold text-gray-900 dark:text-white mb-2">First Habit</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Created your first habit</p>
                        </div>
                        
                        {habits.length >= 5 && (
                            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                </div>
                                <h4 className="font-bold text-gray-900 dark:text-white mb-2">Habit Builder</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Created 5+ habits</p>
                            </div>
                        )}
                        
                        {stats.longestStreak >= 7 && (
                            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
                                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                </div>
                                <h4 className="font-bold text-gray-900 dark:text-white mb-2">Week Warrior</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">7-day streak achieved</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}