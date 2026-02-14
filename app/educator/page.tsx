"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSession } from "@/app/actions/session";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Play } from "lucide-react";

export default function EducatorStartPage() {
    const [courseName, setCourseName] = useState("");
    const [educatorName, setEducatorName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleStartSession = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!courseName || !educatorName) return;

        setIsLoading(true);
        try {
            const session = await createSession(courseName, educatorName);
            if (session) {
                router.push(`/educator/${session.id}`);
            }
        } catch (error) {
            console.error("Failed to start session:", error);
            // Ideally show toast error
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <Card className="w-full max-w-md border-white/10 bg-white/5 backdrop-blur-xl">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                        EduPulse
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                        Start a new live learning session.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleStartSession} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="course" className="text-sm font-medium text-gray-300">
                                Course Name
                            </label>
                            <input
                                id="course"
                                type="text"
                                placeholder="e.g. Intro to Computer Science"
                                value={courseName}
                                onChange={(e) => setCourseName(e.target.value)}
                                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="educator" className="text-sm font-medium text-gray-300">
                                Your Name
                            </label>
                            <input
                                id="educator"
                                type="text"
                                placeholder="e.g. Dr. Smith"
                                value={educatorName}
                                onChange={(e) => setEducatorName(e.target.value)}
                                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full text-lg h-12 mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all shadow-lg shadow-blue-500/25"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                "Starting..."
                            ) : (
                                <>
                                    <Play className="w-5 h-5 mr-2 fill-current" />
                                    Start Live Session
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
