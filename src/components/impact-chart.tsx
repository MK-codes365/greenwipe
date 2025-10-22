
"use client"

import { useState, useEffect } from "react";
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton";
import { getWipeEvents } from "@/app/actions";

export function ImpactChart() {
  const [chartData, setChartData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchEvents = async () => {
      try {
        const events = await getWipeEvents();
        if (!mounted) return;
        // map timestamp -> friendly label
        const mapped = events.map((e: any) => ({
          ...e,
          date: new Date(e.timestamp).toLocaleString(),
        }));
        setChartData(mapped);
      } catch (error) {
        console.error("Failed to fetch wipe events:", error);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchEvents();

    // Polling fallback (1s)
    const interval = setInterval(fetchEvents, 1000);

    // BroadcastChannel subscription for immediate updates
    let bc: BroadcastChannel | null = null;
    try {
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        bc = new BroadcastChannel("green-wipe-updates");
        bc.onmessage = (ev: MessageEvent) => {
          if (ev?.data?.type === "wipe") {
            fetchEvents();
          }
        };
      }
    } catch (e) {
      console.error("BroadcastChannel error in ImpactChart:", e);
    }

    return () => {
      mounted = false;
      clearInterval(interval);
      if (bc) {
        try {
          bc.close();
        } catch (e) {
          // ignore
        }
      }
    };
  }, []);


  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-primary transition-all duration-300 hover:scale-105 hover:drop-shadow-[0_0_10px_hsl(var(--primary))]">Environmental Impact Tracker</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="h-[400px] w-full">
            {isLoading ? (
              <div className="flex h-full w-full items-center justify-center">
                <Skeleton className="h-[350px] w-full" />
              </div>
            ) : (
                <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "hsl(var(--background))",
                            borderColor: "hsl(var(--border))",
                        }}
                    />
                    <Legend />
                    <Line 
                        type="monotone" 
                        dataKey="co2Saved" 
                        name="CO₂ Saved (kg)"
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2} 
                        dot={{ fill: "hsl(var(--primary))" }}
                        activeDot={{ r: 8, style: { stroke: "hsl(var(--primary))" } }}
                    />
                    <Line 
                        type="monotone" 
                        dataKey="eWasteDiverted" 
                        name="E-Waste Diverted (kg)"
                        stroke="#82ca9d" 
                        strokeWidth={2}
                        dot={{ fill: "#82ca9d" }}
                        activeDot={{ r: 8, style: { stroke: "#82ca9d" } }}
                    />
                    <Line 
                        type="monotone" 
                        dataKey="energySaved" 
                        name="Energy Saved (kWh)"
                        stroke="#ffc658" 
                        strokeWidth={2}
                        dot={{ fill: "#ffc658" }}
                        activeDot={{ r: 8, style: { stroke: "#ffc658" } }}
                    />
                </LineChart>
                </ResponsiveContainer>
            )}
        </div>
      </CardContent>
    </Card>
  )
}
