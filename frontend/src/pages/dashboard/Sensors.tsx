import { useState, useEffect } from 'react';
import { LineChart, Line, Tooltip, ResponsiveContainer } from 'recharts';

interface SensorConfig {
    type: string;
    name: string;
    value: string | null;
    unit: string;
    health: number;
    sparkColor: string | null;
    sparkData: { t: string; v: number }[] | null;
    alertThreshold: number;
    pollingRate: number;
    location: string;
}

export default function Sensors() {
    const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));
    const [settingsOpen, setSettingsOpen] = useState<number | null>(null);

    useEffect(() => {
        const observer = new MutationObserver(() => {
            setIsDark(document.documentElement.classList.contains('dark'));
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    const tooltipStyle = isDark
        ? { backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)', fontSize: '11px', color: '#f1f5f9' }
        : { backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 12px -2px rgba(0,0,0,0.1)', fontSize: '11px', color: '#1e293b' };

    // value: null means no data from backend → shows Signal Lost
    const sensors: SensorConfig[] = [
        {
            type: 'Flow Meter',
            name: 'Main Line Alpha',
            value: '124.5',
            unit: 'L/min',
            health: 98.2,
            sparkColor: '#eb6917',
            alertThreshold: 150,
            pollingRate: 10,
            location: 'Section A – Main Intake',
            sparkData: [
                { t: '14:30', v: 128 }, { t: '14:31', v: 121 }, { t: '14:32', v: 132 },
                { t: '14:33', v: 108 }, { t: '14:34', v: 122 }, { t: '14:35', v: 117 },
                { t: '14:36', v: 130 }, { t: '14:37', v: 105 }, { t: '14:38', v: 120 },
                { t: '14:39', v: 113 }, { t: '14:40', v: 124 },
            ],
        },
        {
            type: 'Pressure Transducer',
            name: 'Pump Outlet P-04',
            value: '412.8',
            unit: 'kPa',
            health: 99.5,
            sparkColor: '#e11d48',
            alertThreshold: 500,
            pollingRate: 10,
            location: 'Booster Station',
            sparkData: [
                { t: '14:30', v: 410 }, { t: '14:31', v: 408 }, { t: '14:32', v: 415 },
                { t: '14:33', v: 411 }, { t: '14:34', v: 418 }, { t: '14:35', v: 413 },
                { t: '14:36', v: 410 }, { t: '14:37', v: 416 }, { t: '14:38', v: 409 },
                { t: '14:39', v: 407 }, { t: '14:40', v: 413 },
            ],
        },
        {
            type: 'Current Clamp',
            name: 'Compressor B',
            value: '14.22',
            unit: 'A',
            health: 82.1,
            sparkColor: '#f59e0b',
            alertThreshold: 20,
            pollingRate: 5,
            location: 'Compressor Bay',
            sparkData: [
                { t: '14:30', v: 10 }, { t: '14:31', v: 18 }, { t: '14:32', v: 10 },
                { t: '14:33', v: 18 }, { t: '14:34', v: 10 }, { t: '14:35', v: 18 },
                { t: '14:36', v: 10 }, { t: '14:37', v: 18 }, { t: '14:38', v: 10 },
                { t: '14:39', v: 18 }, { t: '14:40', v: 14 },
            ],
        },
        {
            type: 'Vibration Sensor',
            name: 'Motor-213 Shaft',
            value: null,
            unit: 'mm/s',
            health: 14.0,
            sparkColor: '#d13ba4ff',
            alertThreshold: 25,
            pollingRate: 10,
            location: 'Pump Room B',
            sparkData: null,
        },
        {
            type: 'Temperature Probe',
            name: 'Coolant Inflow',
            value: '22.4',
            unit: '°C',
            health: 98.9,
            sparkColor: '#06b6d4',
            alertThreshold: 35,
            pollingRate: 15,
            location: 'Treatment Plant',
            sparkData: [
                { t: '14:30', v: 21.8 }, { t: '14:31', v: 22.1 }, { t: '14:32', v: 22.6 },
                { t: '14:33', v: 22.0 }, { t: '14:34', v: 22.8 }, { t: '14:35', v: 22.3 },
                { t: '14:36', v: 21.9 }, { t: '14:37', v: 22.5 }, { t: '14:38', v: 22.1 },
                { t: '14:39', v: 22.7 }, { t: '14:40', v: 22.4 },
            ],
        },
        {
            type: 'Voltage Meter',
            name: 'Motor Voltage',
            value: '415.2',
            unit: 'V',
            health: 97.4,
            sparkColor: '#8b5cf6',
            alertThreshold: 440,
            pollingRate: 10,
            location: 'Motor Control Center',
            sparkData: [
                { t: '14:30', v: 412 }, { t: '14:31', v: 418 }, { t: '14:32', v: 410 },
                { t: '14:33', v: 416 }, { t: '14:34', v: 419 }, { t: '14:35', v: 411 },
                { t: '14:36', v: 417 }, { t: '14:37', v: 409 }, { t: '14:38', v: 418 },
                { t: '14:39', v: 413 }, { t: '14:40', v: 415 },
            ],
        },
    ];

    const activeSensor = settingsOpen !== null ? sensors[settingsOpen] : null;

    return (
        <div className="p-4 sm:p-6 lg:p-8 overflow-y-auto h-full">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {sensors.map((sensor, i) => {
                    const isOnline = sensor.value !== null;
                    const healthColor = sensor.health >= 90 ? 'text-success' : sensor.health >= 50 ? 'text-warning' : 'text-error';

                    return (
                        <div
                            key={i}
                            className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-lg overflow-hidden flex flex-col shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-200"
                        >
                            {/* Header */}
                            <div className="p-3 sm:p-4 border-b border-slate-200 dark:border-neutral-800 flex justify-between items-start">
                                <div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{sensor.type}</div>
                                    <h3 className="font-bold text-slate-800 dark:text-neutral-100">{sensor.name}</h3>
                                </div>
                                {isOnline ? (
                                    <span className="flex items-center gap-1 text-[10px] font-bold text-success bg-success/10 px-2 py-0.5 rounded">
                                        <span className="w-1.5 h-1.5 bg-success rounded-full"></span>
                                        CONNECTED
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-neutral-800 px-2 py-0.5 rounded">
                                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full"></span>
                                        OFFLINE
                                    </span>
                                )}
                            </div>

                            {/* Body */}
                            <div className="p-4 sm:p-6 flex-1 flex flex-col justify-center">
                                <div className="flex items-baseline gap-2 mb-4 sm:mb-6">
                                    <span className={`text-3xl sm:text-4xl font-bold ${isOnline ? 'text-slate-800 dark:text-white' : 'text-slate-400'}`}>
                                        {isOnline ? sensor.value : '---'}
                                    </span>
                                    <span className="text-sm font-semibold text-slate-400 uppercase tracking-tighter">{sensor.unit}</span>
                                </div>

                                {isOnline && sensor.sparkData ? (
                                    <div className="h-16 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={sensor.sparkData} margin={{ top: 6, right: 8, left: 8, bottom: 6 }}>
                                                <Tooltip
                                                    contentStyle={tooltipStyle}
                                                    labelStyle={{ display: 'none' }}
                                                    formatter={(value: number | undefined) => [`${value ?? 0} ${sensor.unit}`, sensor.type]}
                                                    cursor={{ stroke: isDark ? '#334155' : '#e2e8f0', strokeWidth: 1 }}
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="v"
                                                    stroke={sensor.sparkColor ?? '#eb6917'}
                                                    strokeWidth={2}
                                                    dot={false}
                                                    activeDot={{ r: 4, fill: sensor.sparkColor ?? '#eb6917', stroke: '#fff', strokeWidth: 2 }}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                ) : (
                                    <div className="h-16 w-full flex items-center justify-center bg-slate-50/50 dark:bg-neutral-800/30 rounded border border-dashed border-slate-200 dark:border-neutral-700">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Signal Lost</span>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="px-3 sm:px-4 py-2 sm:py-3 bg-slate-50 dark:bg-neutral-800/50 flex justify-between items-center border-t border-slate-200 dark:border-neutral-800">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-slate-500">HEALTH</span>
                                    <span className={`text-sm font-bold ${healthColor}`}>{sensor.health}%</span>
                                </div>
                                <button
                                    onClick={() => setSettingsOpen(i)}
                                    className="text-slate-400 hover:text-primary transition-colors"
                                >
                                    <span className="material-icons text-lg">settings</span>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Settings Modal */}
            {settingsOpen !== null && activeSensor && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSettingsOpen(null)}></div>

                    {/* Modal */}
                    <div className="relative bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
                        {/* Modal Header */}
                        <div className="p-5 border-b border-slate-200 dark:border-neutral-800 flex items-center justify-between">
                            <div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{activeSensor.type}</div>
                                <h3 className="font-bold text-lg text-slate-800 dark:text-white">{activeSensor.name}</h3>
                            </div>
                            <button
                                onClick={() => setSettingsOpen(null)}
                                className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-neutral-800 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-neutral-200 transition-colors"
                            >
                                <span className="material-icons text-lg">close</span>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-5 space-y-5">
                            {/* Status Row */}
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-500 uppercase">Status</span>
                                {activeSensor.value !== null ? (
                                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-success bg-success/10 px-2.5 py-1 rounded">
                                        <span className="w-1.5 h-1.5 bg-success rounded-full"></span>
                                        CONNECTED
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-neutral-800 px-2.5 py-1 rounded">
                                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full"></span>
                                        OFFLINE
                                    </span>
                                )}
                            </div>

                            {/* Info Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-50 dark:bg-neutral-800/50 rounded-lg p-3">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Current Reading</div>
                                    <div className="text-lg font-bold text-slate-800 dark:text-white">
                                        {activeSensor.value ?? '---'} <span className="text-xs font-semibold text-slate-400">{activeSensor.unit}</span>
                                    </div>
                                </div>
                                <div className="bg-slate-50 dark:bg-neutral-800/50 rounded-lg p-3">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Health</div>
                                    <div className={`text-lg font-bold ${activeSensor.health >= 90 ? 'text-success' : activeSensor.health >= 50 ? 'text-warning' : 'text-error'}`}>
                                        {activeSensor.health}%
                                    </div>
                                </div>
                            </div>

                            {/* Configuration Fields */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Location</label>
                                    <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 dark:bg-neutral-800/50 rounded-lg border border-slate-200 dark:border-neutral-700 text-sm text-slate-700 dark:text-neutral-300">
                                        <span className="material-icons text-slate-400 text-sm">place</span>
                                        {activeSensor.location}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Alert Threshold</label>
                                        <input
                                            type="number"
                                            defaultValue={activeSensor.alertThreshold}
                                            className="w-full px-3 py-2.5 bg-slate-50 dark:bg-neutral-800/50 rounded-lg border border-slate-200 dark:border-neutral-700 text-sm text-slate-700 dark:text-neutral-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
                                        />
                                        <span className="text-[10px] text-slate-400 mt-0.5 block">{activeSensor.unit}</span>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Polling Rate</label>
                                        <input
                                            type="number"
                                            defaultValue={activeSensor.pollingRate}
                                            className="w-full px-3 py-2.5 bg-slate-50 dark:bg-neutral-800/50 rounded-lg border border-slate-200 dark:border-neutral-700 text-sm text-slate-700 dark:text-neutral-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
                                        />
                                        <span className="text-[10px] text-slate-400 mt-0.5 block">seconds</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-5 border-t border-slate-200 dark:border-neutral-800 flex items-center justify-between gap-3">
                            <button
                                onClick={() => setSettingsOpen(null)}
                                className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-neutral-700 rounded-lg text-xs font-bold text-slate-600 dark:text-neutral-300 hover:bg-slate-50 dark:hover:bg-neutral-800 transition-all"
                            >
                                <span className="material-icons text-sm">restart_alt</span>
                                Recalibrate
                            </button>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setSettingsOpen(null)}
                                    className="px-4 py-2.5 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-neutral-800 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => setSettingsOpen(null)}
                                    className="px-5 py-2.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary/90 transition-all shadow-sm"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
