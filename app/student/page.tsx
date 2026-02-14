"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getSession } from "@/app/actions/session";
import { submitSignal } from "@/app/actions/signal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, CheckCircle, Zap } from "lucide-react";

function StudentInterface() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session");
    const [status, setStatus] = useState<"loading" | "active" | "error" | "ended">("loading");
    const [courseName, setCourseName] = useState("");
    const [cooldown, setCooldown] = useState(0);
    const [deviceId, setDeviceId] = useState("");

    useEffect(() => {
        // Generate or retrieve persistent device ID
        let id = localStorage.getItem("eduPulse_deviceId");
        if (!id) {
            id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            localStorage.setItem("eduPulse_deviceId", id);
        }
        setDeviceId(id);

        if (!sessionId) {
            setStatus("error");
            return;
        }

        getSession(sessionId).then((session) => {
            if (session) {
                if (session.status === "ended") {
                    setStatus("ended");
                } else {
                    setStatus("active");
                    setCourseName(session.course_name);
                }
            } else {
                setStatus("error");
            }
        });
    }, [sessionId]);

    useEffect(() => {
        if (cooldown > 0) {
            const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [cooldown]);

    const handleSignal = async (type: string) => {
        if (cooldown > 0 || !sessionId || !deviceId) return;

        // Optimistic cooldown
        setCooldown(30);

        const result = await submitSignal(sessionId, deviceId, type);
        if (!result.success) {
            // If server rejects (e.g. server-side cooldown), maintain cooldown
            console.error(result.message);
        }
    };

    if (status === "loading") {
        return <div className="min-h-screen flex items-center justify-center text-white">Connecting...</div>;
    }

    if (status === "error") {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
                <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                <h1 className="text-2xl font-bold text-white mb-2">Invalid Session</h1>
                <p className="text-gray-400">Please scan a valid QR code from your instructor.</p>
            </div>
        );
    }

    if (status === "ended") {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                <h1 className="text-2xl font-bold text-white mb-2">Session Ended</h1>
                <p className="text-gray-400">Thank you for participating.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col p-4 space-y-6 max-w-md mx-auto">
            <header className="pt-4 pb-2">
                <p className="text-sm text-gray-400 uppercase tracking-widest">Live Session</p>
                <h1 className="text-2xl font-bold text-white">{courseName}</h1>
            </header>

            <div className="flex-1 flex flex-col justify-center space-y-6">
                <div className="text-center space-y-2">
                    <h2 className="text-xl font-semibold text-white">How is the pace?</h2>
                    <p className="text-gray-400 text-sm">Tap a button to give anonymous feedback.</p>
                </div>

                <Button
                    variant="destructive"
                    size="lg"
                    className="h-32 text-xl shadow-2xl shadow-confusion-500/30 border-confusion-400/20 active:scale-95 transition-all w-full relative overflow-hidden"
                    onClick={() => handleSignal("confusion")}
                    disabled={cooldown > 0}
                >
                    <span className="relative z-10 flex flex-col items-center gap-2">
                        <AlertCircle className="w-10 h-10" />
                        I'm Confused
                    </span>
                    {cooldown > 0 && (
                        <div
                            className="absolute inset-0 bg-black/50 flex items-center justify-center z-20 backdrop-blur-sm"
                        >
                            <span className="font-mono text-2xl">{cooldown}s</span>
                        </div>
                    )}
                </Button>

                <div className="grid grid-cols-2 gap-4">
                    <Button
                        variant="secondary"
                        className="h-20 text-lg border-white/10"
                        onClick={() => handleSignal("too_fast")}
                        disabled={cooldown > 0}
                    >
                        <Zap className="w-5 h-5 mr-2 text-yellow-500" />
                        Too Fast
                    </Button>
                    <Button
                        variant="secondary"
                        className="h-20 text-lg border-white/10"
                        onClick={() => handleSignal("too_slow")}
                        disabled={cooldown > 0}
                    >
                        Too Slow
                    </Button>
                </div>
            </div>

            <footer className="text-center text-xs text-gray-500 pb-4">
                ID: {deviceId.substring(0, 8)} • Anonymous
            </footer>
        </div>
    );
}

export default function StudentPage() {
    return (
        <Suspense fallback={<div className="text-white p-4">Loading...</div>}>
            <StudentInterface />
        </Suspense>
    );
}
