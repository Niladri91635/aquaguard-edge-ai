import { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, ReferenceLine } from 'recharts';

const efficiencyData = [
    { name: 'Efficiency', value: 72 },
    { name: 'Remaining', value: 28 },
];
const EFFICIENCY_COLORS = ['#eb6917', '#e2e8f0'];

const chartData1H = [
    { name: '02:00 PM', flow: 125, pressure: 138, voltage: 118, current: 130, vibration: 90, temperature: 105 },
    { name: '02:10 PM', flow: 130, pressure: 132, voltage: 125, current: 115, vibration: 95, temperature: 110 },
    { name: '02:20 PM', flow: 118, pressure: 142, voltage: 112, current: 128, vibration: 102, temperature: 98 },
    { name: '02:30 PM', flow: 110, pressure: 150, voltage: 105, current: 135, vibration: 115, temperature: 92 },
    { name: '02:40 PM', flow: 95, pressure: 160, voltage: 95, current: 142, vibration: 125, temperature: 100 },
    { name: '02:50 PM', flow: 105, pressure: 152, voltage: 108, current: 120, vibration: 110, temperature: 95 },
    { name: '03:00 PM', flow: 115, pressure: 145, voltage: 115, current: 125, vibration: 100, temperature: 102 },
];

const chartData6H = [
    { name: '09:00 AM', flow: 110, pressure: 125, voltage: 88, current: 105, vibration: 80, temperature: 95 },
    { name: '10:00 AM', flow: 130, pressure: 115, voltage: 110, current: 95, vibration: 88, temperature: 108 },
    { name: '11:00 AM', flow: 145, pressure: 120, voltage: 135, current: 112, vibration: 105, temperature: 120 },
    { name: '12:00 PM', flow: 135, pressure: 135, voltage: 148, current: 125, vibration: 118, temperature: 135 },
    { name: '01:00 PM', flow: 120, pressure: 150, voltage: 125, current: 140, vibration: 130, temperature: 125 },
    { name: '02:00 PM', flow: 95, pressure: 160, voltage: 100, current: 150, vibration: 140, temperature: 112 },
    { name: '03:00 PM', flow: 115, pressure: 145, voltage: 115, current: 130, vibration: 120, temperature: 118 },
];

const chartData24H = [
    { name: '12:00 AM', flow: 60, pressure: 155, voltage: 65, current: 80, vibration: 65, temperature: 75 },
    { name: '03:00 AM', flow: 62, pressure: 148, voltage: 62, current: 75, vibration: 62, temperature: 72 },
    { name: '06:00 AM', flow: 75, pressure: 142, voltage: 78, current: 88, vibration: 70, temperature: 80 },
    { name: '09:00 AM', flow: 110, pressure: 125, voltage: 88, current: 105, vibration: 80, temperature: 95 },
    { name: '12:00 PM', flow: 135, pressure: 135, voltage: 148, current: 125, vibration: 118, temperature: 135 },
    { name: '03:00 PM', flow: 115, pressure: 145, voltage: 115, current: 135, vibration: 120, temperature: 118 },
    { name: '06:00 PM', flow: 90, pressure: 155, voltage: 85, current: 110, vibration: 98, temperature: 100 },
    { name: '09:00 PM', flow: 70, pressure: 150, voltage: 72, current: 92, vibration: 78, temperature: 85 },
    { name: '11:00 PM', flow: 63, pressure: 152, voltage: 65, current: 82, vibration: 68, temperature: 78 },
];

const chartDataMap: Record<string, typeof chartData6H> = {
    '1H': chartData1H,
    '6H': chartData6H,
    '24H': chartData24H,
};

const eventLogs = [
    { time: '14:41:22', event: 'Manual Override Off', status: 'Info', statusColor: 'text-success bg-success/10 border-success/20' },
    { time: '14:38:15', event: 'Pressure Check OK', status: 'Info', statusColor: 'text-success bg-success/10 border-success/20' },
    { time: '14:30:00', event: 'Auto Calibration Run', status: 'System', statusColor: 'text-primary bg-primary/10 border-primary/20' },
    { time: '13:12:44', event: 'Vibration Spike Detect', status: 'Warning', statusColor: 'text-warning bg-warning/10 border-warning/20' },
    { time: '12:55:01', event: 'System Start Init', status: 'System', statusColor: 'text-primary bg-primary/10 border-primary/20' },
    { time: '11:20:18', event: 'External API Sync', status: 'Info', statusColor: 'text-success bg-success/10 border-success/20' },
    { time: '10:45:12', event: 'Low Flow Threshold Update', status: 'System', statusColor: 'text-primary bg-primary/10 border-primary/20' },
];

export default function Dashboard() {
    const [activeMetric, setActiveMetric] = useState('Flow & Pressure');
    const [activeTimeRange, setActiveTimeRange] = useState('6H');
    const [metricOpen, setMetricOpen] = useState(false);
    const [timeOpen, setTimeOpen] = useState(false);
    const metricRef = useRef<HTMLDivElement>(null);
    const timeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (metricRef.current && !metricRef.current.contains(e.target as Node)) setMetricOpen(false);
            if (timeRef.current && !timeRef.current.contains(e.target as Node)) setTimeOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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
        ? { backgroundColor: '#171717', border: '1px solid #404040', borderRadius: '8px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)', fontSize: '12px', color: '#f5f5f5' }
        : { backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 12px -2px rgba(0,0,0,0.1)', fontSize: '12px', color: '#1e293b' };

    const tooltipLabelColor = isDark ? '#94a3b8' : '#1e293b';

    return (
        <div className="p-4 sm:p-6 lg:p-8 overflow-y-auto">
            {/* System Status Banner */}
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-white dark:bg-neutral-900 border border-success/30 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
                <div className="flex items-center gap-3 sm:gap-4">
                    <div className="p-2 bg-success/10 rounded-lg">
                        <span className="material-icons text-success">check_circle</span>
                    </div>
                    <div>
                        <div className="text-sm font-bold text-slate-800 dark:text-neutral-100 uppercase tracking-tight">System Status: Nominal</div>
                        <div className="text-xs text-slate-500">All subsystems are reporting positive diagnostics. No leaks detected in the last 24 hours.</div>
                    </div>
                </div>
                <button className="text-xs font-bold text-primary uppercase hover:underline whitespace-nowrap">View Detailed Report</button>
            </div>

            {/* 5 KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
                <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-slate-200 dark:border-neutral-800 shadow-sm hover:shadow-md hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-200 cursor-default">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Water Flow</div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">124.5</span>
                        <span className="text-sm font-medium text-slate-500 uppercase">L/min</span>
                    </div>
                    <div className="mt-4 flex items-center gap-1 text-[10px] font-bold text-success">
                        <span className="material-icons text-xs">trending_flat</span>
                        STABLE
                    </div>
                </div>
                <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-slate-200 dark:border-neutral-800 shadow-sm hover:shadow-md hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-200 cursor-default">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">System Pressure</div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">412.8</span>
                        <span className="text-sm font-medium text-slate-500 uppercase">kPa</span>
                    </div>
                    <div className="mt-4 flex items-center gap-1 text-[10px] font-bold text-slate-400">
                        <span className="material-icons text-xs">remove</span>
                        TARGET: 410
                    </div>
                </div>
                <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-slate-200 dark:border-neutral-800 shadow-sm hover:shadow-md hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-200 cursor-default">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Pump Current</div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">14.22</span>
                        <span className="text-sm font-medium text-slate-500 uppercase">A</span>
                    </div>
                    <div className="mt-4 flex items-center gap-1 text-[10px] font-bold text-warning">
                        <span className="material-icons text-xs">north_east</span>
                        +2.4% vs AVG
                    </div>
                </div>
                <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-slate-200 dark:border-neutral-800 shadow-sm hover:shadow-md hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-200 cursor-default">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Vibration</div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-slate-800 dark:text-white uppercase">Normal</span>
                    </div>
                    <div className="mt-4 flex items-center gap-1 text-[10px] font-bold text-success">
                        <span className="material-icons text-xs">lens</span>
                        LOW FREQ
                    </div>
                </div>
                <div className="col-span-2 md:col-span-1 bg-white dark:bg-neutral-900 p-6 rounded-xl border border-slate-200 dark:border-neutral-800 shadow-sm hover:shadow-md hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-200 cursor-default">
                    <div className="flex flex-row md:flex-col items-center md:items-start justify-between md:justify-start gap-2 md:gap-0">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0 md:mb-1">Fluid Temp</div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">22.4</span>
                            <span className="text-sm font-medium text-slate-500 uppercase">°C</span>
                        </div>
                        <div className="mt-0 md:mt-4 flex items-center gap-1 text-[10px] font-bold text-slate-400">
                            <span className="material-icons text-xs">thermostat</span>
                            OPTIMAL
                        </div>
                    </div>
                </div>
            </div>

            {/* Live Telemetry + Event Log */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 items-stretch">
                {/* Live Telemetry Chart */}
                <div className="xl:col-span-6 bg-white dark:bg-neutral-900 rounded-xl border border-slate-200 dark:border-neutral-800 shadow-sm overflow-hidden flex flex-col h-[300px] sm:h-[380px] lg:h-[480px]">
                    <div className="p-3 sm:p-4 lg:p-6 border-b border-slate-200 dark:border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 flex-shrink-0">
                        <h3 className="font-bold text-slate-800 dark:text-neutral-100">Live Telemetry</h3>
                        <div className="flex items-center gap-3">
                            {/* Metric Dropdown */}
                            <div ref={metricRef} className="relative">
                                <button
                                    onClick={() => { setMetricOpen(!metricOpen); setTimeOpen(false); }}
                                    className="px-3 py-1 text-xs font-bold bg-slate-100 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-lg text-slate-700 dark:text-neutral-300 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary cursor-pointer flex items-center gap-2"
                                >
                                    {activeMetric}
                                    <span className="material-icons text-sm text-slate-400" style={{ transition: 'transform 0.2s', transform: metricOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>expand_more</span>
                                </button>
                                {metricOpen && (
                                    <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-lg shadow-lg dark:shadow-black/40 z-50 overflow-hidden">
                                        {['Flow & Pressure', 'Voltage & Current', 'Vibration', 'Temperature'].map((opt) => (
                                            <button
                                                key={opt}
                                                onClick={() => { setActiveMetric(opt); setMetricOpen(false); }}
                                                className={`w-full text-left px-3 py-2 text-xs font-bold transition-colors ${activeMetric === opt ? 'bg-primary/15 text-primary' : 'text-slate-600 dark:text-neutral-300 hover:bg-slate-50 dark:hover:bg-neutral-700'}`}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {/* Time Range Dropdown */}
                            <div ref={timeRef} className="relative">
                                <button
                                    onClick={() => { setTimeOpen(!timeOpen); setMetricOpen(false); }}
                                    className="px-3 py-1 text-[10px] font-bold bg-slate-100 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-lg text-slate-700 dark:text-neutral-300 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary cursor-pointer flex items-center gap-1.5"
                                >
                                    {activeTimeRange}
                                    <span className="material-icons text-sm text-slate-400" style={{ transition: 'transform 0.2s', transform: timeOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>expand_more</span>
                                </button>
                                {timeOpen && (
                                    <div className="absolute top-full right-0 mt-1 w-24 bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-lg shadow-lg dark:shadow-black/40 z-50 overflow-hidden">
                                        {['1H', '6H', '24H'].map((opt) => (
                                            <button
                                                key={opt}
                                                onClick={() => { setActiveTimeRange(opt); setTimeOpen(false); }}
                                                className={`w-full text-left px-3 py-2 text-[10px] font-bold transition-colors ${activeTimeRange === opt ? 'bg-primary/15 text-primary' : 'text-slate-600 dark:text-neutral-300 hover:bg-slate-50 dark:hover:bg-neutral-700'}`}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="p-3 sm:p-4 lg:p-6 flex-1 flex flex-col min-h-0">
                        <div className="flex-1 w-full outline-none" tabIndex={-1}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartDataMap[activeTimeRange]} margin={isMobile ? { top: 5, right: 11, left: -40, bottom: 5 } : { top: 5, right: 30, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#262626' : '#e2e8f0'} horizontal={false} />
                                    <ReferenceLine y={60} stroke={isDark ? '#262626' : '#e2e8f0'} strokeDasharray="3 3" />
                                    <ReferenceLine y={180} stroke={isDark ? '#262626' : '#e2e8f0'} strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="name"
                                        stroke="#94a3b8"
                                        fontSize={isMobile ? 8 : 10}
                                        tickLine={false}
                                        axisLine={false}
                                        interval={isMobile ? 2 : 0}
                                        tickFormatter={isMobile ? (v: string) => v.replace(':00 ', '').replace('AM', 'am').replace('PM', 'pm') : undefined}
                                    />
                                    <YAxis stroke="#94a3b8" fontSize={isMobile ? 8 : 10} tickLine={false} axisLine={false} domain={[60, 180]} ticks={[60, 90, 120, 150, 180]} />
                                    <Tooltip
                                        contentStyle={tooltipStyle}
                                        labelStyle={{ color: tooltipLabelColor, fontWeight: 700, marginBottom: '4px' }}
                                        itemStyle={{ fontSize: '12px', fontWeight: 600 }}
                                    />
                                    {activeMetric === 'Flow & Pressure' && (
                                        <>
                                            <Line type="monotone" dataKey="flow" name="Flow (L/min)" stroke="#eb6917" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
                                            <Line type="monotone" dataKey="pressure" name="Pressure (kPa)" stroke="#f59e0b" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
                                        </>
                                    )}
                                    {activeMetric === 'Voltage & Current' && (
                                        <>
                                            <Line type="monotone" dataKey="voltage" name="Voltage (V)" stroke="#10b981" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
                                            <Line type="monotone" dataKey="current" name="Current (A)" stroke="#ef4444" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
                                        </>
                                    )}
                                    {activeMetric === 'Vibration' && (
                                        <Line type="monotone" dataKey="vibration" name="Vibration (Hz)" stroke="#8b5cf6" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
                                    )}
                                    {activeMetric === 'Temperature' && (
                                        <Line type="monotone" dataKey="temperature" name="Temperature (°C)" stroke="#06b6d4" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
                                    )}
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Event Log Table */}
                <div className="xl:col-span-6 bg-white dark:bg-neutral-900 rounded-xl border border-slate-200 dark:border-neutral-800 shadow-sm flex flex-col overflow-hidden h-[300px] sm:h-[380px] lg:h-[480px]">
                    <div className="p-3 sm:p-4 lg:p-6 border-b border-slate-200 dark:border-neutral-800 flex items-center justify-between flex-shrink-0">
                        <h3 className="font-bold text-slate-800 dark:text-neutral-100">Event Log</h3>
                        <button className="text-xs font-bold text-primary">Clear All</button>
                    </div>
                    <div className="flex-1 overflow-auto scrollbar-hide">
                        <table className="w-full text-left text-sm table-fixed">
                            <thead className="bg-slate-50 dark:bg-neutral-800 sticky top-0 z-10">
                                <tr>
                                    <th className="w-28 px-3 sm:px-4 lg:px-6 py-3 font-bold text-slate-500 text-[10px] uppercase tracking-wider">Timestamp</th>
                                    <th className="px-3 sm:px-4 lg:px-6 py-3 font-bold text-slate-500 text-[10px] uppercase tracking-wider">Event</th>
                                    <th className="w-28 px-3 sm:px-4 lg:px-6 py-3 font-bold text-slate-500 text-[10px] uppercase tracking-wider text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">
                                {eventLogs.map((log, i) => (
                                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-neutral-800/50 transition-colors">
                                        <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-xs font-medium text-slate-500 whitespace-nowrap">{log.time}</td>
                                        <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-xs text-slate-700 dark:text-neutral-300 truncate">{log.event}</td>
                                        <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-right">
                                            <span className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded uppercase border ${log.statusColor}`}>{log.status}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 border-t border-slate-200 dark:border-neutral-800 text-center flex-shrink-0">
                        <button className="text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-primary transition-colors">Full Audit History</button>
                    </div>
                </div>
            </div>

            {/* Bottom Row: Power Efficiency + Advanced Forecasting */}
            <div className="mt-4 sm:mt-6 lg:mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                {/* Power Efficiency */}
                <div className="bg-white dark:bg-neutral-900 p-4 sm:p-6 lg:p-8 rounded-xl border border-slate-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center gap-4 sm:gap-8 shadow-sm">
                    <div className="flex-shrink-0 relative w-32 h-32 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={efficiencyData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={42}
                                    outerRadius={58}
                                    startAngle={90}
                                    endAngle={-270}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {efficiencyData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={EFFICIENCY_COLORS[index]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            const data = payload[0];
                                            return (
                                                <div style={{ ...tooltipStyle, padding: '10px 14px', zIndex: 50, position: 'relative' as const }}>
                                                    <div style={{ fontWeight: 700, color: tooltipLabelColor, marginBottom: '2px' }}>{data.name}</div>
                                                    <div style={{ fontWeight: 600, color: data.payload.fill }}>{data.value}%</div>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <div className="text-2xl font-bold">72%</div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase">Efficiency</div>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-bold text-lg mb-2">Power Efficiency Rating</h4>
                        <p className="text-sm text-slate-500 leading-relaxed mb-4">Your current energy expenditure per cubic meter of fluid moved is within the top 15% of industrial standards for this facility type.</p>
                        <div className="flex gap-4">
                            <div className="text-center bg-slate-50 dark:bg-neutral-800 px-4 py-2 rounded-lg border border-slate-200 dark:border-neutral-800">
                                <div className="text-xs font-bold text-slate-400">TODAY</div>
                                <div className="font-bold">412kWh</div>
                            </div>
                            <div className="text-center bg-slate-50 dark:bg-neutral-800 px-4 py-2 rounded-lg border border-slate-200 dark:border-neutral-800">
                                <div className="text-xs font-bold text-slate-400">SAVINGS</div>
                                <div className="font-bold text-success">+$24.12</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Advanced Forecasting CTA */}
                <div className="bg-primary/5 dark:bg-neutral-900 border-2 border-dashed border-primary/20 dark:border-neutral-700 rounded-xl p-4 sm:p-6 lg:p-8 flex items-center justify-center">
                    <div className="text-center max-w-sm">
                        <div className="p-3 bg-primary/10 rounded-full inline-block mb-4">
                            <span className="material-icons text-primary text-3xl">add_chart</span>
                        </div>
                        <h4 className="font-bold text-lg mb-1">Advanced Forecasting</h4>
                        <p className="text-sm text-slate-500 leading-relaxed mb-6">Upgrade to Premium to unlock AI-powered predictive maintenance and leak forecasting models.</p>
                        <button className="bg-primary text-white font-bold py-2 px-6 rounded-lg text-sm hover:bg-primary-dark hover:scale-105 active:scale-95 transition-all duration-200">Explore Features</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
