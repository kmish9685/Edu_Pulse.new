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

    // Intelligence State
    const [clarityScore, setClarityScore] = useState(100);
    const [clusters, setClusters] = useState<import("@/lib/intelligence").Cluster[]>([]);
    const [recommendations, setRecommendations] = useState<import("@/lib/intelligence").Recommendation[]>([]);

    useEffect(() => {
        getSession(sessionId).then((data) => {
            setSession(data);
            setLoading(false);
        });
    }, [sessionId]);

    // Update Intelligence on new signals
    useEffect(() => {
        const { calculateClarityScore, clusterSignals, getRecommendations } = require("@/lib/intelligence");

        const score = calculateClarityScore(signals, 0); // TODO: Pass actual duration
        const newClusters = clusterSignals(signals);
        const latestCluster = newClusters.length > 0 ? newClusters[0] : undefined;
        const recs = getRecommendations(score, latestCluster);

        setClarityScore(score);
        setClusters(newClusters);
        setRecommendations(recs);
    }, [signals]);

    const getClarityColor = (score: number) => {
        if (score > 80) return "text-green-400"; // success
        if (score > 50) return "text-yellow-400"; // warning
        return "text-red-400"; // confusion
    };

    if (loading) return <div className="text-white p-8 animate-pulse">Initializing Neural Link...</div>;
    if (!session) return <div className="text-white p-8">Session not found.</div>;

    const studentUrl = typeof window !== 'undefined' ? `${window.location.origin}/student?session=${sessionId}` : '';

    return (
        <div className="min-h-screen p-6 space-y-6">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-md gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">{session.course_name}</h1>
                    <p className="text-gray-400">Educator: {session.educator_name}</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm font-medium flex items-center gap-2 border border-green-500/20">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        LIVE INTELLIGENCE
                    </div>
                    <Button variant="destructive" onClick={() => endSession(sessionId)}>
                        End Session
                    </Button>
                </div>
            </header>

            {/* AI Recommendations Banner */}
            {recommendations.length > 0 && (
                <div className={`p-4 rounded-xl border border-l-4 animate-in slide-in-from-top-4 ${recommendations[0].type === 'critical' ? 'bg-red-500/10 border-red-500 text-red-100' :
                        recommendations[0].type === 'warning' ? 'bg-yellow-500/10 border-yellow-500 text-yellow-100' :
                            'bg-green-500/10 border-green-500 text-green-100'
                    }`}>
                    <div className="flex items-start gap-3">
                        <Activity className="w-6 h-6 mt-1 flex-shrink-0" />
                        <div>
                            <h3 className="font-bold text-lg">AI Recommendation: {recommendations[0].action}</h3>
                            <p className="opacity-90">{recommendations[0].message}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Left Col: Connectivity */}
                <Card className="md:col-span-1 h-fit bg-white/5 border-white/10">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                            <Users className="w-5 h-5 text-blue-400" />
                            Session Access
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center space-y-6">
                        <div className="p-4 bg-white rounded-xl shadow-2xl shadow-blue-500/20">
                            <QRCodeSVG value={studentUrl} size={180} />
                        </div>
                        <div className="text-center w-full">
                            <p className="text-xs text-gray-500 font-mono mb-2 bg-black/40 p-2 rounded break-all select-all">
                                {studentUrl}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Middle Col: Clarity Score & Stats */}
                <div className="md:col-span-2 space-y-6">
                    {/* Stats Row */}
                    <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                        <Card className="bg-gradient-to-br from-white/10 to-transparent border-white/10 backdrop-blur-md">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">Real-Time Clarity</p>
                                        <h3 className={`text-6xl font-black mt-2 tracking-tighter ${getClarityColor(clarityScore)}`}>
                                            {clarityScore}%
                                        </h3>
                                        <p className="text-xs text-gray-500 mt-2">Based on weighted signal decay</p>
                                    </div>
                                    <div className={`p-3 rounded-full bg-white/5 ${getClarityColor(clarityScore)}`}>
                                        <Activity className="w-8 h-8" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-white/10 to-transparent border-white/10 backdrop-blur-md">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">Active Confusion</p>
                                        <h3 className="text-6xl font-black mt-2 tracking-tighter text-white">
                                            {confusionCount}
                                        </h3>
                                        <p className="text-xs text-gray-500 mt-2">Signals in last 5 mins</p>
                                    </div>
                                    <div className="p-3 rounded-full bg-confusion-500/20 text-confusion-500 animate-pulse">
                                        <AlertCircle className="w-8 h-8" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Clustering / Timeline */}
                    <Card className="overflow-hidden border-white/10 bg-white/5 flex flex-col">
                        <CardHeader className="border-b border-white/5">
                            <CardTitle className="text-white flex items-center justify-between">
                                <span>Confusion Clusters</span>
                                <span className="text-xs font-normal text-gray-400 px-3 py-1 rounded-full bg-white/5">
                                    AI Grouped
                                </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-y-auto space-y-4 p-4 max-h-[400px] custom-scrollbar">
                            {clusters.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-gray-600">
                                    <CheckCircle className="w-12 h-12 mb-4 opacity-50" />
                                    <p>No confusion clusters detected yet.</p>
                                </div>
                            ) : (
                                clusters.map((cluster) => (
                                    <div key={cluster.id} className="relative pl-6 border-l-2 border-white/10 pb-6 last:pb-0">
                                        <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-4 border-[#0a0a0a] ${cluster.intensity === 'high' ? 'bg-red-500' :
                                                cluster.intensity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                                            }`} />

                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm font-mono text-gray-400">
                                                    {new Date(cluster.startTime).toLocaleTimeString()}
                                                </span>
                                                <span className={`text-xs px-2 py-0.5 rounded uppercase font-bold tracking-wider ${cluster.intensity === 'high' ? 'bg-red-500/20 text-red-400' :
                                                        cluster.intensity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                                            'bg-blue-500/20 text-blue-400'
                                                    }`}>
                                                    {cluster.intensity} Intensity
                                                </span>
                                            </div>
                                            <p className="text-white font-medium text-lg">
                                                {cluster.count} students signaled confusion
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Topic: {cluster.topic || "General Pacing"}
                                            </p>
                                        </div>
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
