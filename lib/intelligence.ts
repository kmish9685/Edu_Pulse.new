import { SignalData } from "@/app/actions/signal";

export type Cluster = {
    id: string;
    startTime: string;
    endTime: string;
    count: number;
    intensity: "low" | "medium" | "high";
    topic?: string;
};

export type Recommendation = {
    id: string;
    type: "critical" | "warning" | "positive";
    message: string;
    action: string;
};

// P0-2: Advanced Clarity Score Algorithm
export function calculateClarityScore(signals: SignalData[], sessionDurationMinutes: number): number {
    if (signals.length === 0) return 100;

    // Decay Factor: Older signals affect the score less.
    const now = new Date().getTime();
    let totalSeverity = 0;

    signals.forEach(signal => {
        const signalTime = new Date(signal.created_at).getTime();
        const ageMinutes = (now - signalTime) / (1000 * 60);

        // Weight: 1.0 if < 1 min ago, 0.5 if < 5 min ago, 0.1 if > 10 min ago
        let weight = 0.1;
        if (ageMinutes < 1) weight = 1.0;
        else if (ageMinutes < 5) weight = 0.5;
        else if (ageMinutes < 10) weight = 0.3;

        totalSeverity += weight * 5; // Base penalty of 5 points per weighted signal
    });

    // Recovery: Score naturally recovers over time if no new signals come in
    // This is implicitly handled by the decay weight reducing totalSeverity.

    return Math.max(0, Math.min(100, Math.round(100 - totalSeverity)));
}

// P0-1: Real-Time Confusion Clustering
export function clusterSignals(signals: SignalData[]): Cluster[] {
    // Group signals that are within 60 seconds of each other
    const clusters: Cluster[] = [];
    if (signals.length === 0) return clusters;

    // Sort by time
    const sortedSignals = [...signals].sort((a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    let currentCluster: Cluster | null = null;
    const CLUSTER_WINDOW_MS = 60 * 1000; // 1 minute window

    sortedSignals.forEach(signal => {
        const signalTime = new Date(signal.created_at).getTime();

        if (!currentCluster) {
            currentCluster = {
                id: `cluster-${signal.id}`,
                startTime: signal.created_at,
                endTime: signal.created_at,
                count: 1,
                intensity: "low",
                topic: signal.topic
            };
        } else {
            const clusterEndTime = new Date(currentCluster.endTime).getTime();

            if (signalTime - clusterEndTime < CLUSTER_WINDOW_MS) {
                // Add to current cluster
                currentCluster.count++;
                currentCluster.endTime = signal.created_at;
                // Update intensity
                if (currentCluster.count > 10) currentCluster.intensity = "high";
                else if (currentCluster.count > 5) currentCluster.intensity = "medium";
            } else {
                // Finalize current cluster and start new one
                clusters.push(currentCluster);
                currentCluster = {
                    id: `cluster-${signal.id}`,
                    startTime: signal.created_at,
                    endTime: signal.created_at,
                    count: 1,
                    intensity: "low",
                    topic: signal.topic
                };
            }
        }
    });

    if (currentCluster) {
        clusters.push(currentCluster);
    }

    return clusters.reverse(); // Newest first
}

// P0-3: Recommended Teaching Actions
export function getRecommendations(clarityScore: number, recentCluster?: Cluster): Recommendation[] {
    const recs: Recommendation[] = [];

    if (clarityScore < 40) {
        recs.push({
            id: "rec-critical",
            type: "critical",
            message: "Class is lost.",
            action: "Stop completely. Ask: 'Which specific part of the last 5 mins was unclear?'"
        });
    } else if (clarityScore < 70) {
        recs.push({
            id: "rec-warning",
            type: "warning",
            message: "Significant confusion detected.",
            action: "Pause and rephrase the last concept with a new example."
        });
    } else if (clarityScore > 90) {
        recs.push({
            id: "rec-positive",
            type: "positive",
            message: "Excellent pacing.",
            action: "You can move to the next topic or increase depth."
        });
    }

    if (recentCluster && recentCluster.intensity === "high") {
        recs.push({
            id: "rec-cluster",
            type: "critical",
            message: "Sudden spike in confusion!",
            action: "Addressed immediately. Did you just introduce a complex term?"
        });
    }

    return recs;
}
