"use server";

import { createClient } from "@supabase/supabase-js";

// Note: We're using the client-side supabase client for now in this file 
// because we need to adapt it for server-side usage with cookies if we were doing auth.
// But since we are "No login ever" for students and simple dashboard for teachers (for now),
// we can use a direct client or the SSR client. 
// However, 'use server' requires us to be careful with client instantiation.
// Let's use the one from lib/supabase.ts for admin tasks if we have the service key, 
// but here we only have the anon key in env. 
// For production transparency, we should use the SSR client.

import { createSupabaseServerClient } from "@/lib/supabase-server";

export type SessionData = {
    id: string;
    course_name: string;
    educator_name: string;
    status: "active" | "ended";
    started_at: string;
    ended_at?: string;
};

export async function createSession(courseName: string, educatorName: string) {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
        .from("sessions")
        .insert([
            {
                course_name: courseName,
                educator_name: educatorName,
                status: "active",
            },
        ])
        .select()
        .single();

    if (error) {
        console.error("Error creating session:", error);
        throw new Error("Failed to create session");
    }

    return data as SessionData;
}

export async function endSession(sessionId: string) {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
        .from("sessions")
        .update({ status: "ended", ended_at: new Date().toISOString() })
        .eq("id", sessionId)
        .select()
        .single();

    if (error) {
        console.error("Error ending session:", error);
        throw new Error("Failed to end session");
    }

    return data as SessionData;
}

export async function getSession(sessionId: string) {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
        .from("sessions")
        .select("*")
        .eq("id", sessionId)
        .single();

    if (error) {
        // If not found, return null
        if (error.code === "PGRST116") return null;
        console.error("Error getting session:", error);
        throw new Error("Failed to get session");
    }

    return data as SessionData;
}
