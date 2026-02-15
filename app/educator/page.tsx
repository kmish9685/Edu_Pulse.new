"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart3, Clock, Plus, Users, Zap, ArrowLeft } from "lucide-react";

export default function EducatorDashboard() {
    return (
        <div className="min-h-screen p-8 space-y-8">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Institutional Dashboard</h1>
                    <p className="text-gray-400">Overview of learning intelligence across your sessions.</p>
                </div>
                <Link href="/educator/new">
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20">
                        <Plus className="w-5 h-5 mr-2" />
                        Start New Session
                    </Button>
                </Link>
            </header>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Avg. Clarity Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-green-400 flex items-center gap-2">
                            84%
                            <span className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-400 font-normal">+5%</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Across last 12 sessions</p>
                    </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Total Signals Processed</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-blue-400">1,248</div>
                        <p className="text-xs text-gray-500 mt-2">Prevented ~45 learning gaps</p>
                    </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Active Students</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-purple-400">324</div>
                        <p className="text-xs text-gray-500 mt-2">Across 3 active courses</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity / Sessions (Mock Data for now) */}
            <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white">Recent Sessions</h2>
                <div className="grid gap-4">
                    {/* Session 1 */}
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 hover:bg-white/10 transition-colors cursor-pointer group">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                                <BarChart3 className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-white">Intro to Database Systems</h3>
                                <p className="text-sm text-gray-400">Dr. Smith • 2 hours ago</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-8">
                            <div className="text-right">
                                <div className="text-sm text-gray-400">Clarity Score</div>
                                <div className="font-bold text-green-400">92/100</div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm text-gray-400">Confusion Points</div>
                                <div className="font-bold text-white">3 Detected</div>
                            </div>
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="w-5 h-5 rotate-180" />
                            </Button>
                        </div>
                    </div>

                    {/* Session 2 */}
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 hover:bg-white/10 transition-colors cursor-pointer group">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                                <Users className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-white">Algorithms & Complexity</h3>
                                <p className="text-sm text-gray-400">Prof. Mehta • Yesterday</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-8">
                            <div className="text-right">
                                <div className="text-sm text-gray-400">Clarity Score</div>
                                <div className="font-bold text-yellow-400">68/100</div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm text-gray-400">Confusion Points</div>
                                <div className="font-bold text-white">12 Detected</div>
                            </div>
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="w-5 h-5 rotate-180" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
