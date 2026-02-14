"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { SignalData } from "@/app/actions/signal";
import { useRouter } from "next/navigation";

export function useRealtimeSignals(sessionId: string) {
    const [signals, setSignals] = useState<SignalData[]>([]);
    const [confusionCount, setConfusionCount] = useState(0);
    const router = useRouter();

    useEffect(() => {
        if (!sessionId) return;

        // Load initial signals (optional, or just start fresh)
        const fetchSignals = async () => {
            const { data } = await supabase
                .from("signals")
                .select("*")
                .eq("session_id", sessionId)
                .order("created_at", { ascending: true });

            if (data) {
                setSignals(data as SignalData[]);
                setConfusionCount(data.length);
            }
        };

        fetchSignals();

        // Subscribe to new signals
        const channel = supabase
            .channel(`session-${sessionId}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "signals",
                    filter: `session_id=eq.${sessionId}`,
                },
                (payload) => {
                    const newSignal = payload.new as SignalData;
                    setSignals((prev) => [...prev, newSignal]);
                    setConfusionCount((prev) => prev + 1);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [sessionId]);

    return { signals, confusionCount };
}
