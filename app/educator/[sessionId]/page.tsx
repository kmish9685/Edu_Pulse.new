"use client";

import { useEffect, useState, use } from "react"; // 'use' is for unwrapping promises in client components if passed, but for page props in Nextjs 15+ we need to handle it.
// Actually, for client components in Next.js 15, params are still passed as props but might be promises in Layouts. 
// In Pages, if it's a Server Component, params is a Promise. If Client Component, it's also a Promise in Next 15.
// Let's assume params is a Promise.

import { useRealtimeSignals } from "@/hooks/use-realtime";
import { getSession, endSession, SessionData } from "@/app/actions/session";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QRCodeSVG } from "qrcode.react";
import { Activity, Users, Clock, AlertCircle, CheckCircle } from "lucide-react";

export default function EducatorDashboard({ params }: { params: Promise<{ sessionId: string }> }) {
    const resolvedParams = use(params);
    const sessionId = resolvedParams.sessionId;

    const { signals, confusionCount } = useRealtimeSignals(sessionId);
    const [session, setSession] = useState<SessionData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getSession(sessionId).then((data) => {
            setSession(data);
            setLoading(false);
        });
    }, [sessionId]);

    // Simple Clarity Score Algorithm for MVP
    // Start at 100. Deduct 5 points per signal. Recover 1 point every 30 seconds (mocked here or handled backend).
    // For now: Clarity = Math.max(0, 100 - (confusionCount * 2))
    const clarityScore = Math.max(0, 100 - confusionCount * 2);

    const getClarityColor = (score: number) => {
        if (score > 80) return "text-success-500";
        if (score > 50) return "text-warning-500";
        return "text-confusion-500";
    };

    if (loading) return <div className="text-white p-8">Loading session...</div>;
    if (!session) return <div className="text-white p-8">Session not found.</div>;

    const studentUrl = typeof window !== 'undefined' ? `${window.location.origin}/student?session=${sessionId}` : '';

    return (
        <div className="min-h-screen p-6 space-y-6">
            {/* Header */}
            <header className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-md">
                <div>
                    <h1 className="text-2xl font-bold text-white">{session.course_name}</h1>
                    <p className="text-gray-400">Educator: {session.educator_name}</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm font-medium flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        LIVE
                    </div>
                    <Button variant="destructive" onClick={() => endSession(sessionId)}>
                        End Session
                    </Button>
                </div>
            </header>

            {/* Main Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Left Col: QR & Join Info */}
                <Card className="md:col-span-1 h-fit">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-blue-400" />
                            Join Session
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center space-y-4">
                        <div className="p-4 bg-white rounded-xl">
                            <QRCodeSVG value={studentUrl} size={200} />
                        </div>
                        <p className="text-center text-gray-400 text-sm break-all">
                            {studentUrl}
                        </p>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-white">{0} (Mock)</p>
                            <p className="text-sm text-gray-500">Students Active</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Middle Col: Clarity Score & Stats */}
                <div className="md:col-span-2 space-y-6">
                    {/* Stats Row */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <Card className="bg-gradient-to-br from-white/10 to-transparent border-white/10">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm text-gray-400">Clarity Score</p>
                                        <h3 className={`text-4xl font-black mt-2 ${getClarityColor(clarityScore)}`}>
                                            {clarityScore}%
                                        </h3>
                                    </div>
                                    <Activity className={`w-8 h-8 ${getClarityColor(clarityScore)} opacity-80`} />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-white/10 to-transparent border-white/10">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm text-gray-400">Confusion Signals</p>
                                        <h3 className="text-4xl font-black mt-2 text-confusion-400">
                                            {confusionCount}
                                        </h3>
                                    </div>
                                    <AlertCircle className="w-8 h-8 text-confusion-400 opacity-80" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-white/10 to-transparent border-white/10">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm text-gray-400">Session Time</p>
                                        <h3 className="text-4xl font-black mt-2 text-blue-400">
                                            12m
                                        </h3>
                                    </div>
                                    <Clock className="w-8 h-8 text-blue-400 opacity-80" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Timeline / Live Feed */}
                    <Card className="h-[400px] overflow-hidden flex flex-col">
                        <CardHeader>
                            <CardTitle>Live Signal Feed</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-y-auto space-y-3 custom-scrollbar">
                            {signals.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-50">
                                    <CheckCircle className="w-12 h-12 mb-2" />
                                    <p>Class is clear. No confusion detected.</p>
                                </div>
                            ) : (
                                signals.slice().reverse().map((signal) => (
                                    <div key={signal.id} className="flex items-center p-3 rounded-lg bg-white/5 border border-white/5 animate-in fade-in slide-in-from-bottom-2">
                                        <div className="p-2 rounded-full bg-confusion-500/20 text-confusion-400 mr-3">
                                            <AlertCircle className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-white font-medium">Confusion Detected</p>
                                            <p className="text-sm text-gray-400">Unknown Device ({signal.device_id.slice(0, 4)})</p>
                                        </div>
                                        <span className="text-xs text-gray-500">
                                            {new Date(signal.created_at).toLocaleTimeString()}
                                        </span>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
}
