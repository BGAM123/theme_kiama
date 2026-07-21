import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

interface GenerationChartProps {
    data: { date: string; count: number }[];
    loading?: boolean;
}

export function GenerationChart({ data, loading }: GenerationChartProps) {
    if (loading) {
        return <Skeleton className="h-[300px] w-full rounded-xl" />;
    }

    // Provide mock chart data if backend data is empty for demo effect
    const chartData = data.length > 0 ? data : [
        { date: 'Lun', count: 12 }, { date: 'Mar', count: 19 }, { date: 'Mer', count: 15 },
        { date: 'Jeu', count: 22 }, { date: 'Ven', count: 30 }, { date: 'Sam', count: 8 }, { date: 'Dim', count: 5 }
    ];

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748B', fontSize: 12, fontWeight: 500 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748B', fontSize: 12 }}
                    />
                    <Tooltip
                        cursor={{ fill: '#F8FAFC' }}
                        contentStyle={{
                            borderRadius: '8px',
                            border: '1px solid #E2E8F0',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                            fontWeight: 500
                        }}
                        itemStyle={{ color: '#4F46E5', fontWeight: 'bold' }}
                    />
                    <Bar
                        dataKey="count"
                        fill="#4F46E5"
                        radius={[6, 6, 0, 0]}
                        maxBarSize={48}
                        animationDuration={1500}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
