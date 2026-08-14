'use client';

import React, { useEffect, useState } from 'react';
import { analyticsService } from '@/services/analytics.service';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Calendar, Users, TrendingUp, Search } from 'lucide-react';
import Preloader from '@/components/shared/Preloader';

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [monthlyData, setMonthlyData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [dashboardStats, analytics] = await Promise.all([
                    analyticsService.getDashboardStats(),
                    analyticsService.getMonthlyAnalytics()
                ]);
                setStats(dashboardStats);
                
                // Format the monthly data for the chart
                const formattedData = analytics.map((item: any) => ({
                    name: item.name, // e.g., '2025-01'
                    Queries: item.queries || 0,
                    Bookings: item.bookings || 0,
                }));
                
                setMonthlyData(formattedData);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) return <Preloader />;

    // Calculate total queries (we'll estimate from the chart data since dashboardStats only tracks Bookings natively right now)
    const totalQueries = monthlyData.reduce((acc, curr) => acc + curr.Queries, 0);
    const chartBookings = monthlyData.reduce((acc, curr) => acc + curr.Bookings, 0);
    
    // Overall Conversion Rate
    const conversionRate = totalQueries > 0 ? ((chartBookings / totalQueries) * 100).toFixed(2) : '0.00';

    return (
        <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Dashboard Overview</h1>
                <p className="text-gray-500 mt-2">Monitor your inquiries, bookings, and overall performance.</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 flex items-center justify-between group hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all">
                    <div>
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Leads/Queries</p>
                        <h3 className="text-3xl font-bold text-gray-900">{totalQueries.toLocaleString()}</h3>
                    </div>
                    <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Search size={24} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 flex items-center justify-between group hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all">
                    <div>
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Bookings</p>
                        <h3 className="text-3xl font-bold text-gray-900">{chartBookings.toLocaleString()}</h3>
                    </div>
                    <div className="h-12 w-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Calendar size={24} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 flex items-center justify-between group hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all">
                    <div>
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Conversion Rate</p>
                        <h3 className="text-3xl font-bold text-gray-900">{conversionRate}%</h3>
                    </div>
                    <div className="h-12 w-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <TrendingUp size={24} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 flex items-center justify-between group hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all">
                    <div>
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Customers</p>
                        <h3 className="text-3xl font-bold text-gray-900">{stats?.totalUsers?.toLocaleString() || 0}</h3>
                    </div>
                    <div className="h-12 w-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Users size={24} />
                    </div>
                </div>
            </div>

            {/* Graphs Section */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-[0_2px_20px_-3px_rgba(6,81,237,0.05)] border border-gray-100">
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Queries vs Bookings Over Time</h2>
                    <p className="text-sm text-gray-500 mt-1">Monthly trend of generated leads converting into successful bookings.</p>
                </div>
                
                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={monthlyData}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="colorQueries" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.5}/>
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis 
                                dataKey="name" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: '#64748b', fontSize: 12 }} 
                                dy={10}
                            />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: '#64748b', fontSize: 12 }} 
                            />
                            <Tooltip 
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                                cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                            />
                            <Legend verticalAlign="top" height={36} iconType="circle" />
                            <Area 
                                type="monotone" 
                                dataKey="Queries" 
                                stroke="#3b82f6" 
                                strokeWidth={3}
                                fillOpacity={1} 
                                fill="url(#colorQueries)" 
                                activeDot={{ r: 6, strokeWidth: 0 }}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="Bookings" 
                                stroke="#10b981" 
                                strokeWidth={3}
                                fillOpacity={1} 
                                fill="url(#colorBookings)" 
                                activeDot={{ r: 6, strokeWidth: 0 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
            
            {/* Recent Activity or Extra space */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-[0_2px_20px_-3px_rgba(6,81,237,0.05)] border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="flex gap-4">
                        <a href="/admin/tours" className="px-5 py-2.5 bg-deepBlue text-white rounded-xl font-medium hover:bg-blue-800 transition shadow-lg shadow-deepBlue/30 text-sm">Manage Tours</a>
                        <a href="/admin/bookings" className="px-5 py-2.5 bg-saffron text-white rounded-xl font-medium hover:bg-orange-600 transition shadow-lg shadow-saffron/30 text-sm">View All Bookings</a>
                    </div>
                 </div>
            </div>
        </div>
    );
}
