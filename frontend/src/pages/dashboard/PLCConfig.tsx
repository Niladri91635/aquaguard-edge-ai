import { useState, useRef, useEffect } from 'react';

export default function PLCConfig() {
    const [watchdogEnabled, setWatchdogEnabled] = useState(true);
    const [manualOverride1, setManualOverride1] = useState(false);
    const [manualOverride2, setManualOverride2] = useState(false);
    const [manualOverride3, setManualOverride3] = useState(false);
    const [manualOverride4, setManualOverride4] = useState(true);

    const [protocol, setProtocol] = useState('Modbus TCP/IP');
    const [protocolOpen, setProtocolOpen] = useState(false);
    const protocolRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (protocolRef.current && !protocolRef.current.contains(e.target as Node)) {
                setProtocolOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-4 sm:space-y-6 lg:space-y-8">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                {/* Connection Settings */}
                <div className="bg-white dark:bg-neutral-900 rounded-xl border border-border-light dark:border-neutral-800 shadow-sm p-4 sm:p-5 lg:p-6">
                    <div className="section-header">
                        <span className="material-icons text-primary text-xl">lan</span>
                        <h3 className="font-bold text-slate-800 dark:text-neutral-100">Connection Settings</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">IPv4 Address</label>
                            <input className="form-input-technical" type="text" defaultValue="192.168.1.104" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Port Number</label>
                            <input className="form-input-technical" type="number" defaultValue={502} />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Communication Protocol</label>
                            <div ref={protocolRef} className="relative">
                                <button
                                    onClick={() => setProtocolOpen(!protocolOpen)}
                                    className="w-full text-left bg-slate-50 dark:bg-neutral-800 border-2 border-slate-200 dark:border-neutral-700 rounded-lg text-xs font-bold h-10 px-3 focus:outline-none focus:border-primary dark:focus:border-primary text-slate-600 dark:text-neutral-300 flex items-center justify-between"
                                >
                                    {protocol}
                                    <span className="material-icons text-sm text-slate-400 transform transition-transform duration-200" style={{ transform: protocolOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>expand_more</span>
                                </button>
                                {protocolOpen && (
                                    <div className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-lg shadow-lg dark:shadow-black/40 z-50 overflow-hidden">
                                        {['Modbus TCP/IP', 'EtherNet/IP', 'Profinet'].map((opt) => (
                                            <button
                                                key={opt}
                                                onClick={() => { setProtocol(opt); setProtocolOpen(false); }}
                                                className={`w-full text-left px-3 py-2.5 text-xs font-bold transition-colors ${protocol === opt ? 'bg-primary/15 text-primary' : 'text-slate-600 dark:text-neutral-300 hover:bg-slate-50 dark:hover:bg-neutral-700'}`}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Slave ID (Unit ID)</label>
                            <input className="form-input-technical" type="number" defaultValue={1} />
                        </div>
                    </div>
                </div>

                {/* Hardware Watchdog */}
                <div className="bg-white dark:bg-neutral-900 rounded-xl border border-border-light dark:border-neutral-800 shadow-sm p-4 sm:p-5 lg:p-6">
                    <div className="section-header">
                        <span className="material-icons text-warning text-xl">timer</span>
                        <h3 className="font-bold text-slate-800 dark:text-neutral-100">Hardware Watchdog</h3>
                    </div>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-neutral-800/50 rounded-lg border border-slate-100 dark:border-neutral-800">
                            <div>
                                <div className="text-sm font-bold">Watchdog Timer Enabled</div>
                                <div className="text-xs text-slate-500">Resets controller on firmware hang detected.</div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={watchdogEnabled}
                                    onChange={(e) => setWatchdogEnabled(e.target.checked)}
                                />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Timeout (ms)</label>
                                <input className="form-input-technical" type="number" defaultValue={1500} />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Retry Count</label>
                                <input className="form-input-technical" type="number" defaultValue={3} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Control Logic Parameters */}
                <div className="bg-white dark:bg-neutral-900 rounded-xl border border-border-light dark:border-neutral-800 shadow-sm p-4 sm:p-5 lg:p-6 xl:col-span-2">
                    <div className="section-header">
                        <span className="material-icons text-primary text-xl">account_tree</span>
                        <h3 className="font-bold text-slate-800 dark:text-neutral-100">Control Logic Parameters</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Low Pressure Threshold</label>
                                <div className="relative">
                                    <input className="form-input-technical pr-12" type="number" defaultValue={380.0} />
                                    <span className="absolute right-3 top-2 text-[10px] font-bold text-slate-400">kPa</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">High Pressure Cutoff</label>
                                <div className="relative">
                                    <input className="form-input-technical pr-12" type="number" defaultValue={450.0} />
                                    <span className="absolute right-3 top-2 text-[10px] font-bold text-slate-400">kPa</span>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">High Flow Delay</label>
                                <div className="relative">
                                    <input className="form-input-technical pr-12" type="number" defaultValue={120} />
                                    <span className="absolute right-3 top-2 text-[10px] font-bold text-slate-400">SEC</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Leak Detection Window</label>
                                <div className="relative">
                                    <input className="form-input-technical pr-12" type="number" defaultValue={15} />
                                    <span className="absolute right-3 top-2 text-[10px] font-bold text-slate-400">MIN</span>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Pump Startup Ramp</label>
                                <div className="relative">
                                    <input className="form-input-technical pr-12" type="number" defaultValue={5.5} />
                                    <span className="absolute right-3 top-2 text-[10px] font-bold text-slate-400">SEC</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">PID Proportional (Kp)</label>
                                <input className="form-input-technical" type="number" defaultValue={1.25} />
                            </div>
                        </div>
                        <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
                            <div className="text-[10px] font-bold text-primary uppercase mb-2">Logic Summary</div>
                            <p className="text-[11px] text-slate-500 leading-relaxed italic">
                                System will auto-engage Emergency Shutoff if pressure exceeds 450kPa for more than 5 seconds or if vibration sensors detect erratic patterns consistent with cavitating pumps.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Output Relays & Manual Overrides */}
                <div className="bg-white dark:bg-neutral-900 rounded-xl border border-border-light dark:border-neutral-800 shadow-sm p-4 sm:p-5 lg:p-6 xl:col-span-2">
                    <div className="section-header">
                        <span className="material-icons text-error text-xl">electrical_services</span>
                        <h3 className="font-bold text-slate-800 dark:text-neutral-100">Output Relays & Manual Overrides</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        {/* Relay 1 */}
                        <div className="p-4 rounded-xl border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-800/30">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="text-xs font-bold text-slate-400 uppercase mb-1">Relay 01</div>
                                    <div className="text-sm font-bold">Main Feed Valve</div>
                                </div>
                                <span className="w-3 h-3 bg-success rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-neutral-700">
                                <span className="text-[10px] font-bold uppercase text-slate-500">Manual Force</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" checked={manualOverride1} onChange={(e) => setManualOverride1(e.target.checked)} />
                                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-error"></div>
                                </label>
                            </div>
                        </div>

                        {/* Relay 2 */}
                        <div className="p-4 rounded-xl border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-800/30">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="text-xs font-bold text-slate-400 uppercase mb-1">Relay 02</div>
                                    <div className="text-sm font-bold">Booster Pump A</div>
                                </div>
                                <span className="w-3 h-3 bg-slate-300 dark:bg-neutral-700 rounded-full"></span>
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-neutral-700">
                                <span className="text-[10px] font-bold uppercase text-slate-500">Manual Force</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" checked={manualOverride2} onChange={(e) => setManualOverride2(e.target.checked)} />
                                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-error"></div>
                                </label>
                            </div>
                        </div>

                        {/* Relay 3 */}
                        <div className="p-4 rounded-xl border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-800/30">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="text-xs font-bold text-slate-400 uppercase mb-1">Relay 03</div>
                                    <div className="text-sm font-bold">Chlorine Dosing</div>
                                </div>
                                <span className="w-3 h-3 bg-success rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-neutral-700">
                                <span className="text-[10px] font-bold uppercase text-slate-500">Manual Force</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" checked={manualOverride3} onChange={(e) => setManualOverride3(e.target.checked)} />
                                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-error"></div>
                                </label>
                            </div>
                        </div>

                        {/* Relay 4 (Alarm) */}
                        <div className="p-4 rounded-xl border border-error/20 bg-error/5">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="text-xs font-bold text-error uppercase mb-1">Relay 04</div>
                                    <div className="text-sm font-bold text-error">System Alarm Horn</div>
                                </div>
                                <span className="w-3 h-3 bg-error rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]"></span>
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-error/20">
                                <span className="text-[10px] font-bold uppercase text-error">Forced ON</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" checked={manualOverride4} onChange={(e) => setManualOverride4(e.target.checked)} />
                                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-error"></div>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
