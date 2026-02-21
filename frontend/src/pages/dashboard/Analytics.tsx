import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ComposedChart, Line, ReferenceLine, ReferenceArea, Label } from 'recharts';

const weeklyEnergyData = [
    { day: 'Mon', wh: 52 },
    { day: 'Tue', wh: 32 },
    { day: 'Wed', wh: 68 },
    { day: 'Thu', wh: 44 },
    { day: 'Fri', wh: 56 },
    { day: 'Sat', wh: 24 },
    { day: 'Sun', wh: 20 },
];

const flowRateData = [
    { time: '14:40:00', flow: 2.5, efficiency: 0 },
    { time: '14:40:10', flow: 2.6, efficiency: 0 },
    { time: '14:40:20', flow: 2.4, efficiency: 0 },
    { time: '14:40:30', flow: 2.5, efficiency: 0 },
    { time: '14:40:40', flow: 2.7, efficiency: 0 },
    { time: '14:40:50', flow: 2.5, efficiency: 0 },
    { time: '14:41:00', flow: 2.3, efficiency: 12 },
    { time: '14:41:10', flow: 1.8, efficiency: 35 },
    { time: '14:41:20', flow: 1.2, efficiency: 55 },
    { time: '14:41:30', flow: 0.7, efficiency: 72 },
    { time: '14:41:40', flow: 0.3, efficiency: 82 },
    { time: '14:41:50', flow: 0.0, efficiency: 87 },
    { time: '14:42:00', flow: 0.0, efficiency: 87 },
];

const recoveryData = [
    { event: 'Ev #040 · 10:05', actual: 7.20, estimated: 7.42, accuracy: 97.8 },
    { event: 'Ev #041 · 12:15', actual: 2.10, estimated: 2.15, accuracy: 99.1 },
    { event: 'Ev #042 · 14:41', actual: 5.30, estimated: 5.40, accuracy: 98.2 },
];

const CustomLeakLabel = ({ viewBox }: { viewBox?: { x?: number; y?: number } }) => {
    const x = viewBox?.x ?? 0;
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    const w = isMobile ? 72 : 105;
    const fs = isMobile ? 7 : 9;
    return (
        <g>
            <rect x={x - w / 2 + 4} y={8} width={w} height={16} rx={4} fill="#ef4444" />
            <text x={x + 4} y={19} textAnchor="middle" fill="#fff" fontSize={fs} fontWeight="bold">Leak Detected</text>
        </g>
    );
};

const CustomShutdownLabel = ({ viewBox }: { viewBox?: { x?: number; y?: number } }) => {
    const x = viewBox?.x ?? 0;
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    const w = isMobile ? 56 : 82;
    const fs = isMobile ? 7 : 9;
    const yPos = isMobile ? 28 : 8;
    return (
        <g>
            <rect x={x - w / 2 + 3} y={yPos} width={w} height={16} rx={4} fill="#f59e0b" />
            <text x={x + 3} y={yPos + 11} textAnchor="middle" fill="#fff" fontSize={fs} fontWeight="bold">Pump OFF</text>
        </g>
    );
};

export default function Analytics() {
    const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));
    const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 640);

    useEffect(() => {
        const observer = new MutationObserver(() => {
            setIsDark(document.documentElement.classList.contains('dark'));
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 640);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const tooltipStyle = isDark
        ? { backgroundColor: '#171717', border: '1px solid #404040', borderRadius: '8px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)', fontSize: '11px', color: '#f5f5f5' }
        : { backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 12px -2px rgba(0,0,0,0.1)', fontSize: '11px', color: '#1e293b' };

    const tooltipLabelColor = isDark ? '#94a3b8' : '#64748b';

    return (
        <div className="flex flex-col h-full">
            {/* Main Content Area */}
            <div className="p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-4 sm:space-y-6 lg:space-y-8">
                {/* Top KPI Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                    <div className="bg-white dark:bg-neutral-900 p-4 rounded-lg border border-slate-200 dark:border-neutral-800 shadow-sm hover:shadow-md hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-200 cursor-default">
                        <div className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: '#90a1b9' }}>Water Saved</div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-slate-800 dark:text-white leading-none">5.3</span>
                            <span className="text-[10px] font-bold text-slate-500">L</span>
                        </div>
                        <div className="mt-2 text-[9px] font-bold text-success flex items-center gap-1">
                            <span className="material-icons text-[10px]">trending_up</span> +12% Recovery
                        </div>
                    </div>
                    <div className="bg-white dark:bg-neutral-900 p-4 rounded-lg border border-slate-200 dark:border-neutral-800 shadow-sm hover:shadow-md hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-200 cursor-default">
                        <div className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: '#90a1b9' }}>Detection Accuracy</div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-slate-800 dark:text-white leading-none">94.6</span>
                            <span className="text-[10px] font-bold text-slate-500">%</span>
                        </div>
                        <div className="mt-2 text-[9px] font-bold text-primary italic">Inference Quality: High</div>
                    </div>
                    <div className="bg-white dark:bg-neutral-900 p-4 rounded-lg border border-slate-200 dark:border-neutral-800 shadow-sm hover:shadow-md hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-200 cursor-default">
                        <div className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: '#90a1b9' }}>Max Leak Flow</div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-slate-800 dark:text-white leading-none">2.8</span>
                            <span className="text-[10px] font-bold text-slate-500">L/min</span>
                        </div>
                        <div className="mt-2 text-[9px] font-bold text-error">Anomalous Peak</div>
                    </div>
                    <div className="bg-white dark:bg-neutral-900 p-4 rounded-lg border border-slate-200 dark:border-neutral-800 shadow-sm hover:shadow-md hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-200 cursor-default">
                        <div className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: '#90a1b9' }}>Runtime Saved</div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-slate-800 dark:text-white leading-none">2.4</span>
                            <span className="text-[10px] font-bold text-slate-500">mins</span>
                        </div>
                        <div className="mt-2 text-[9px] font-bold text-success uppercase">Auto-Stop Active</div>
                    </div>
                    <div className="bg-white dark:bg-neutral-900 p-4 rounded-lg border border-slate-200 dark:border-neutral-800 shadow-sm ring-1 ring-primary/10 hover:shadow-md hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-200 cursor-default">
                        <div className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: '#90a1b9' }}>Response Latency</div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-slate-800 dark:text-white leading-none">3.2</span>
                            <span className="text-[10px] font-bold text-slate-500">s</span>
                        </div>
                        <div className="mt-2 text-[9px] font-bold uppercase" style={{ color: '#a78bfa' }}>Sensor-to-Valve</div>
                    </div>
                    <div className="bg-white dark:bg-neutral-900 p-4 rounded-lg border border-slate-200 dark:border-neutral-800 shadow-sm ring-1 ring-primary/10 hover:shadow-md hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-200 cursor-default">
                        <div className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: '#90a1b9' }}>Prevention Reliability</div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-slate-800 dark:text-white leading-none">99.2</span>
                            <span className="text-[10px] font-bold text-slate-500">%</span>
                        </div>
                        <div className="mt-2 text-[9px] font-bold uppercase" style={{ color: '#f472b6' }}>Mission Critical</div>
                    </div>
                </div>

                {/* Row 1: Flow Rate Chart + Summary Stats / Weekly Energy */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6 items-stretch">
                    {/* Flow Rate Chart (7 cols) */}
                    <div className="xl:col-span-7 bg-white dark:bg-neutral-900 rounded-xl border border-slate-200 dark:border-neutral-800 shadow-sm overflow-hidden flex flex-col">
                        <div className="p-3 sm:p-4 lg:p-6 border-b border-slate-200 dark:border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                            <div>
                                <h3 className="font-bold text-slate-800 dark:text-neutral-100 uppercase text-sm tracking-tight">Flow Rate vs Leak Recovery Efficiency</h3>
                                <p className="text-[11px] text-slate-500 font-medium">Real-time hydro-analytics &bull; shaded band = leak duration</p>
                            </div>
                            <div className="hidden sm:flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="w-5 h-0.5 bg-primary rounded-full"></span>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase">Flow Rate (L/min)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-5 h-0 border-t-2 border-dotted border-success"></span>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase">Recovery Efficiency (%)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 bg-error/15 border border-error/30 rounded-sm"></span>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase">Leak Duration</span>
                                </div>
                            </div>
                        </div>
                        <div className="p-3 sm:p-4 flex-1 min-h-[280px] sm:min-h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={flowRateData} margin={isMobile ? { top: 30, right: 10, left: -10, bottom: 5 } : { top: 30, right: 20, left: 5, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#262626' : '#e2e8f0'} />
                                    <XAxis
                                        dataKey="time"
                                        stroke="#94a3b8"
                                        fontSize={isMobile ? 8 : 10}
                                        fontWeight={600}
                                        tickLine={false}
                                        axisLine={false}
                                        interval={isMobile ? 4 : 2}
                                        tickFormatter={isMobile ? (v: string) => v.slice(3) : undefined}
                                    />
                                    <YAxis
                                        yAxisId="flow"
                                        stroke="#eb6917"
                                        fontSize={isMobile ? 8 : 10}
                                        tickLine={false}
                                        axisLine={false}
                                        domain={[0, 10]}
                                        ticks={isMobile ? [0, 5, 10] : [0, 2, 4, 6, 8, 10]}
                                        width={isMobile ? 25 : 60}
                                        label={isMobile ? undefined : { value: 'Flow (L/min)', angle: -90, position: 'insideLeft', style: { fontSize: 10, fontWeight: 700, fill: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' } }}
                                    />
                                    <YAxis
                                        yAxisId="efficiency"
                                        orientation="right"
                                        stroke="#10b981"
                                        fontSize={isMobile ? 8 : 10}
                                        tickLine={false}
                                        axisLine={false}
                                        domain={[0, 100]}
                                        ticks={isMobile ? [0, 50, 100] : [0, 20, 40, 60, 80, 100]}
                                        width={isMobile ? 25 : 60}
                                        label={isMobile ? undefined : { value: 'Efficiency (%)', angle: 90, position: 'insideRight', style: { fontSize: 10, fontWeight: 700, fill: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' } }}
                                    />
                                    <Tooltip
                                        contentStyle={tooltipStyle}
                                        labelStyle={{ color: tooltipLabelColor, fontWeight: 700, textTransform: 'uppercase' as const, fontSize: '10px', marginBottom: '4px' }}
                                        formatter={(value: number | undefined, name?: string) => {
                                            if (name === 'flow') return [`${value ?? 0} L/min`, 'Flow Rate'];
                                            return [`${value ?? 0}%`, 'Efficiency'];
                                        }}
                                    />
                                    <ReferenceArea yAxisId="flow" x1="14:41:00" x2="14:41:40" fill="#ef4444" fillOpacity={0.08} />
                                    <ReferenceLine yAxisId="flow" x="14:41:00" stroke="#ef4444" strokeDasharray="6 3" strokeWidth={1.5}>
                                        <Label content={<CustomLeakLabel />} />
                                    </ReferenceLine>
                                    <ReferenceLine yAxisId="flow" x="14:41:40" stroke="#f59e0b" strokeDasharray="6 3" strokeWidth={1.5}>
                                        <Label content={<CustomShutdownLabel />} />
                                    </ReferenceLine>

                                    <Line yAxisId="flow" type="monotone" dataKey="flow" stroke="#eb6917" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: '#eb6917', stroke: '#fff', strokeWidth: 2 }} />
                                    <Line yAxisId="efficiency" type="monotone" dataKey="efficiency" stroke="#10b981" strokeWidth={2} strokeDasharray="2 4" dot={false} activeDot={{ r: 4, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }} />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Right Column (5 cols) — Summary Stats + Weekly Energy */}
                    <div className="xl:col-span-5 flex flex-col gap-6">
                        <div className="bg-white dark:bg-neutral-900 p-3 sm:p-4 lg:p-5 rounded-xl border border-slate-200 dark:border-neutral-800 shadow-sm flex-1">
                            <h3 className="font-bold text-slate-800 dark:text-neutral-100 mb-4 uppercase text-xs tracking-wider flex items-center gap-2">
                                <span className="material-icons text-sm">analytics</span>
                                Summary Stats
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center group">
                                    <span className="text-xs text-slate-500 font-medium">Avg Flow at Leak</span>
                                    <span className="text-xs font-bold text-slate-800 dark:text-white tabular-nums">2.4 L/min</span>
                                </div>
                                <div className="h-px bg-slate-50 dark:bg-neutral-800"></div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-slate-500 font-medium">Auto-Isolation State</span>
                                    <span className="px-2 py-0.5 bg-success/10 text-success text-[10px] font-bold rounded uppercase">Engaged</span>
                                </div>
                                <div className="h-px bg-slate-50 dark:bg-neutral-800"></div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-slate-500 font-medium">System Uptime %</span>
                                    <span className="text-xs font-bold text-slate-800 dark:text-white">99.98%</span>
                                </div>
                                <div className="h-px bg-slate-50 dark:bg-neutral-800"></div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-slate-500 font-medium">Energy Saved (Wh)</span>
                                    <span className="text-xs font-bold text-primary tabular-nums">482.5 Wh</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-neutral-900 p-3 sm:p-4 lg:p-5 rounded-xl border border-slate-200 dark:border-neutral-800 shadow-sm flex-1">
                            <h3 className="font-bold text-slate-800 dark:text-neutral-100 mb-6 uppercase text-xs tracking-wider flex items-center gap-2">
                                <span className="material-icons text-sm">bolt</span>
                                Weekly Energy Usage
                            </h3>
                            <div className="h-40 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={weeklyEnergyData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                        <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                                        <Tooltip
                                            cursor={{ fill: isDark ? 'rgba(235,105,23,0.1)' : 'rgba(235,105,23,0.05)' }}
                                            contentStyle={tooltipStyle}
                                            formatter={(value: number | undefined) => [`${value ?? 0} Wh`, 'Energy']}
                                        />
                                        <Bar dataKey="wh" fill="#eb6917" radius={[4, 4, 0, 0]} barSize={20} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="mt-4 flex justify-between items-center border-t border-slate-50 dark:border-neutral-800 pt-4">
                                <div className="text-[10px] font-bold text-slate-400 uppercase">Avg Daily Wh</div>
                                <div className="text-xs font-bold text-slate-800 dark:text-white tabular-nums">42.8 Wh</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Water Recovery Proof — Full Width */}
                <div className="bg-white dark:bg-neutral-900 p-4 sm:p-5 lg:p-6 rounded-xl border border-slate-200 dark:border-neutral-800 shadow-sm">
                    <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                        <div>
                            <h3 className="font-bold text-slate-800 dark:text-neutral-100 uppercase text-xs tracking-wider">Water Recovery Proof</h3>
                            <p className="text-[10px] text-slate-500 mt-0.5 font-medium">98.4% Accuracy &bull;<span className="text-slate-400 ml-1">Performance Verification</span></p>
                        </div>
                        <div className="hidden sm:flex gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-primary rounded-sm"></div>
                                <span className="text-[10px] font-bold text-slate-500 uppercase">Actual Recovered (L)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-slate-300 dark:bg-neutral-600 rounded-sm"></div>
                                <span className="text-[10px] font-bold text-slate-500 uppercase">Estimated Waste (L)</span>
                            </div>
                        </div>
                    </div>
                    <div className="h-52 sm:h-52 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={recoveryData} layout="vertical" margin={isMobile ? { top: 5, right: 15, left: -5, bottom: 5 } : { top: 5, right: 30, left: 0, bottom: 5 }} barGap={4}>
                                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#262626' : '#e2e8f0'} horizontal={false} />
                                <XAxis type="number" stroke="#94a3b8" fontSize={isMobile ? 8 : 10} tickLine={false} axisLine={false} domain={[0, 8]} unit="L" ticks={isMobile ? [0, 2, 4, 6, 8] : undefined} />
                                <YAxis type="category" dataKey="event" stroke="#94a3b8" fontSize={isMobile ? 8 : 10} fontWeight={600} tickLine={false} axisLine={false} width={isMobile ? 65 : 100} />
                                <Tooltip
                                    cursor={{ fill: isDark ? 'rgba(235,105,23,0.1)' : 'rgba(235,105,23,0.05)' }}
                                    content={({ active, payload, label }) => {
                                        if (active && payload && payload.length) {
                                            const data = payload[0]?.payload;
                                            return (
                                                <div style={{ ...tooltipStyle, padding: '10px 14px' }}>
                                                    <div style={{ fontWeight: 700, color: tooltipLabelColor, marginBottom: '6px', fontSize: '11px' }}>{label}</div>
                                                    <div style={{ fontSize: '11px', marginBottom: '3px' }}><span style={{ color: '#eb6917', fontWeight: 600 }}>Actual Recovered:</span> {data.actual} L</div>
                                                    <div style={{ fontSize: '11px', marginBottom: '3px' }}><span style={{ color: isDark ? '#94a3b8' : '#64748b', fontWeight: 600 }}>Estimated Waste:</span> {data.estimated} L</div>
                                                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#10b981', marginTop: '4px', borderTop: `1px solid ${isDark ? '#404040' : '#e2e8f0'}`, paddingTop: '4px' }}>Accuracy: {data.accuracy}%</div>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Bar dataKey="actual" name="actual" fill="#eb6917" radius={[0, 4, 4, 0]} barSize={isMobile ? 12 : 16} />
                                <Bar dataKey="estimated" name="estimated" fill={isDark ? '#475569' : '#cbd5e1'} radius={[0, 4, 4, 0]} barSize={isMobile ? 12 : 16} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* TinyML Engine — Eye-Catching Card */}
                <div className="bg-white dark:bg-neutral-900 rounded-xl border border-slate-200 dark:border-neutral-800 shadow-sm overflow-hidden">
                    <div className="p-4 sm:p-5">
                        {/* Header Row */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <span className="material-icons text-primary text-xl">psychology</span>
                                </div>
                                <div>
                                    <div className="text-[10px] font-black uppercase tracking-[0.15em] leading-none" style={{ color: '#90a1b9' }}>TinyML Engine</div>
                                    <div className="text-sm font-extrabold text-slate-800 dark:text-white mt-0.5">v2.4.1<span className="text-[10px] font-bold text-success ml-1">stable</span></div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-75" style={{ animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite' }}></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success"></span>
                                </span>
                                <span className="text-[9px] font-bold text-success uppercase tracking-wider">Active</span>
                            </div>
                        </div>

                        {/* Stats Grid — 2 columns on mobile */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            {/* Last Inference */}
                            <div className="rounded-xl p-3 bg-slate-50 dark:bg-neutral-800/60 border border-slate-100 dark:border-neutral-700/50">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <span className="material-icons text-warning text-base">warning</span>
                                    <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: '#90a1b9' }}>Last Inference</span>
                                </div>
                                <div className="text-xs font-extrabold uppercase tracking-wide text-error">Burst Detected</div>
                            </div>

                            {/* Inference Time */}
                            <div className="rounded-xl p-3 bg-slate-50 dark:bg-neutral-800/60 border border-slate-100 dark:border-neutral-700/50">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <span className="material-icons text-success text-base">speed</span>
                                    <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: '#90a1b9' }}>Inference Time</span>
                                </div>
                                <div className="text-lg font-extrabold text-slate-800 dark:text-white leading-none">42<span className="text-[10px] font-bold text-slate-400 ml-0.5">ms</span></div>
                            </div>

                            {/* Model Accuracy */}
                            <div className="rounded-xl p-3 bg-slate-50 dark:bg-neutral-800/60 border border-slate-100 dark:border-neutral-700/50">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <span className="material-icons text-primary text-base">analytics</span>
                                    <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: '#90a1b9' }}>Accuracy</span>
                                </div>
                                <div className="text-lg font-extrabold text-slate-800 dark:text-white leading-none">94.6<span className="text-[10px] font-bold text-slate-400 ml-0.5">%</span></div>
                            </div>

                            {/* Model Size */}
                            <div className="rounded-xl p-3 bg-slate-50 dark:bg-neutral-800/60 border border-slate-100 dark:border-neutral-700/50">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <span className="material-icons text-base" style={{ color: '#a78bfa' }}>memory</span>
                                    <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: '#90a1b9' }}>Model Size</span>
                                </div>
                                <div className="text-lg font-extrabold text-slate-800 dark:text-white leading-none">48<span className="text-[10px] font-bold text-slate-400 ml-0.5">KB</span></div>
                            </div>
                        </div>

                        {/* Hardware Health Section */}
                        <div className="rounded-xl p-3 bg-slate-50 dark:bg-neutral-800/40 border border-slate-100 dark:border-neutral-700/50">
                            <div className="text-[9px] font-black uppercase tracking-[0.15em] mb-2.5" style={{ color: '#90a1b9' }}>Hardware Health</div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-success/10 border border-success/20">
                                    <span className="material-icons text-success text-sm">schedule</span>
                                    <span className="text-[11px] font-bold text-success">RTC</span>
                                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-success"></span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-success/10 border border-success/20">
                                    <span className="material-icons text-success text-sm">sd_card</span>
                                    <span className="text-[11px] font-bold text-success">SD Card</span>
                                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-success"></span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-success/10 border border-success/20">
                                    <span className="material-icons text-success text-sm">bolt</span>
                                    <span className="text-[11px] font-bold text-success">Power</span>
                                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-success"></span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 border border-primary/20">
                                    <span className="material-icons text-primary text-sm">wifi</span>
                                    <span className="text-[11px] font-bold text-primary">LoRa</span>
                                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
