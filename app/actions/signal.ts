"use server";

import { createSupabaseServerClient } from "@/lib/supabase-server";

export type SignalData = {
    id: string;
    session_id: string;
    device_id: string;
    signal_type: string;
    topic?: string;
    created_at: string;
};

// Rate limiting map (in-memory for now, ideally Redis or DB)
// Note: In serverless/edge, in-memory cache is per-instance and ephemeral.
// For a production app, we should check the DB for the last signal from this device_id
// within the last 30 seconds.
async function checkCooldown(supabase: any, deviceId: string, sessionId: string): Promise<boolean> {
    // Check if a signal exists for this device in this session created in the last 30 seconds
    const thirtySecondsAgo = new Date(Date.now() - 30 * 1000).toISOString();

    const { count, error } = await supabase
        .from("signals")
        .select("*", { count: "exact", head: true })
        .eq("session_id", sessionId)
        .eq("device_id", deviceId)
        .gte("created_at", thirtySecondsAgo);

    if (error) {
        console.error("Error checking cooldown:", error);
        return false; // Fail open or closed? Let's fail open but log.
    }

    return (count || 0) > 0;
}

export async function submitSignal(
    sessionId: string,
    deviceId: string,
    signalType: string = "confusion",
    topic?: string
) {
    const supabase = await createSupabaseServerClient();

    // 1. Check rate limit/cooldown
    const isCooledDown = await checkCooldown(supabase, deviceId, sessionId);
    if (isCooledDown) {
        return { success: false, message: "Please wait 30 seconds before sending another signal." };
    }

    // 2. Insert signal
    const { data, error } = await supabase
        .from("signals")
        .insert([
            {
                session_id: sessionId,
                device_id: deviceId,
                signal_type: signalType,
                topic: topic,
            },
        ])
        .select()
        .single();

    if (error) {
        console.error("Error submitting signal:", error);
        return { success: false, message: "Failed to submit signal." };
    }

    return { success: true, data: data as SignalData };
}
