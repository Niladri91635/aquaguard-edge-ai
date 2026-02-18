import { useState, useRef, useEffect } from 'react';

interface EventEntry {
    timestamp: string;
    source: string;
    eventType: string;
    description: string;
    severity: 'info' | 'system' | 'warning' | 'critical';
}

const allEvents: EventEntry[] = [
    { timestamp: '2025-02-15 14:41:22', source: 'Main Control Valve', eventType: 'System', description: 'Manual override state changed from ON to OFF by Admin-01', severity: 'info' },
    { timestamp: '2025-02-15 14:38:15', source: 'Pressure Sensor B-04', eventType: 'Diagnostic', description: 'Automated pressure check completed successfully. Variance < 0.1%', severity: 'info' },
    { timestamp: '2025-02-15 14:30:00', source: 'Flow Meter Alpha', eventType: 'Maintenance', description: 'Weekly auto-calibration cycle initiated by system scheduler', severity: 'system' },
    { timestamp: '2025-02-15 13:12:44', source: 'Main Pump Unit-1', eventType: 'Leak Detection', description: 'Minor vibration spike detected on motor bearing housing (Axis Y)', severity: 'warning' },
    { timestamp: '2025-02-15 12:55:01', source: 'Edge Gateway GTW-09', eventType: 'System', description: 'System startup initialization complete. All processes reporting healthy.', severity: 'system' },
    { timestamp: '2025-02-15 11:20:18', source: 'Cloud Sync Service', eventType: 'Network', description: 'External API synchronization successful. 2,400 records uploaded.', severity: 'info' },
    { timestamp: '2025-02-15 10:45:12', source: 'Logic Controller PLC-12', eventType: 'Config', description: 'Low flow threshold updated to 5.0 L/min for Zone C', severity: 'system' },
    { timestamp: '2025-02-15 09:12:05', source: 'Main Intake Valve', eventType: 'Hardware', description: 'Critical: Actuator failure detected. Valve fails to respond to command signals.', severity: 'critical' },
    { timestamp: '2025-02-15 08:30:11', source: 'Battery Backup UPS-01', eventType: 'Hardware', description: 'Self-test completed. Battery health at 92%.', severity: 'info' },
    { timestamp: '2025-02-15 07:55:44', source: 'Coolant Temp Probe', eventType: 'Diagnostic', description: 'Temperature reading stable at 22.4°C. Within operational range.', severity: 'info' },
    { timestamp: '2025-02-15 07:30:10', source: 'Motor-213 Shaft', eventType: 'Leak Detection', description: 'Vibration amplitude exceeded 18 mm/s threshold on Y-axis', severity: 'critical' },
    { timestamp: '2025-02-15 07:15:33', source: 'PLC Controller-07', eventType: 'Config', description: 'Relay timing parameter updated: delay changed from 200ms to 150ms', severity: 'system' },
    { timestamp: '2025-02-15 06:50:22', source: 'Flow Meter Beta', eventType: 'Maintenance', description: 'Scheduled sensor cleaning cycle completed. Accuracy restored to 99.8%', severity: 'info' },
    { timestamp: '2025-02-15 06:30:05', source: 'Voltage Regulator VR-3', eventType: 'Hardware', description: 'Output voltage fluctuation detected. Peak: 421V (limit: 440V)', severity: 'warning' },
    { timestamp: '2025-02-15 06:12:18', source: 'Edge Gateway GTW-12', eventType: 'Network', description: 'Connection timeout to cloud endpoint. Retrying in 30 seconds.', severity: 'warning' },
    { timestamp: '2025-02-15 05:45:00', source: 'Compressor B', eventType: 'System', description: 'Compressor duty cycle reached 85%. Scheduling preventive maintenance.', severity: 'system' },
    { timestamp: '2025-02-15 05:20:11', source: 'Water Quality Sensor', eventType: 'Diagnostic', description: 'pH level reading: 7.2 — within acceptable range (6.5–8.5)', severity: 'info' },
    { timestamp: '2025-02-15 04:55:30', source: 'Pump Station C', eventType: 'Hardware', description: 'Impeller wear indicator triggered. Estimated remaining life: 340 hours.', severity: 'warning' },
    { timestamp: '2025-02-15 04:30:44', source: 'Main Control Valve', eventType: 'System', description: 'Valve position sensor recalibrated. Zero offset corrected by 0.3°', severity: 'system' },
    { timestamp: '2025-02-15 04:10:15', source: 'Cloud Sync Service', eventType: 'Network', description: 'Batch upload complete. 1,850 telemetry records synced to dashboard.', severity: 'info' },
    { timestamp: '2025-02-15 03:45:22', source: 'Pressure Sensor A-01', eventType: 'Diagnostic', description: 'Pressure drop detected at junction node. Delta: -12 kPa in 5 min.', severity: 'warning' },
    { timestamp: '2025-02-15 03:20:08', source: 'Emergency Shutoff', eventType: 'System', description: 'Emergency shutoff relay tested successfully. Response time: 45ms.', severity: 'system' },
    { timestamp: '2025-02-15 02:55:33', source: 'Logic Controller PLC-08', eventType: 'Config', description: 'Firmware update applied: v3.2.1 → v3.2.4. Restart required.', severity: 'system' },
    { timestamp: '2025-02-15 02:30:19', source: 'Motor-415 Drive', eventType: 'Hardware', description: 'Critical: Drive fault code E-47. Motor stalled under load.', severity: 'critical' },
    { timestamp: '2025-02-15 02:10:45', source: 'Flow Meter Alpha', eventType: 'Leak Detection', description: 'Anomalous flow pattern detected. Possible micro-leak in Zone A piping.', severity: 'warning' },
    { timestamp: '2025-02-15 01:45:00', source: 'Battery Backup UPS-02', eventType: 'Hardware', description: 'Battery charge level: 78%. Charging from mains supply active.', severity: 'info' },
    { timestamp: '2025-02-15 01:20:14', source: 'Coolant Pump D', eventType: 'Maintenance', description: 'Bearing lubrication cycle completed. Next scheduled in 720 hours.', severity: 'info' },
    { timestamp: '2025-02-15 00:55:30', source: 'Edge Gateway GTW-09', eventType: 'Network', description: 'SSL certificate renewed. New expiry: 2026-02-14T23:59:59Z', severity: 'system' },
    { timestamp: '2025-02-15 00:30:05', source: 'Main Pump Unit-2', eventType: 'System', description: 'Pump switched to standby mode. Primary pump Unit-1 online.', severity: 'info' },
    { timestamp: '2025-02-15 00:05:18', source: 'Pressure Relief Valve', eventType: 'Hardware', description: 'Critical: Relief valve activation at 520 kPa. Over-pressure event logged.', severity: 'critical' },
];

const ITEMS_PER_PAGE = 5;

export default function EventLogs() {
    const [searchQuery, setSearchQuery] = useState('');
    const [severityFilter, setSeverityFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const [severityOpen, setSeverityOpen] = useState(false);
    const severityRef = useRef<HTMLDivElement>(null);
    const [severityDesktopOpen, setSeverityDesktopOpen] = useState(false);
    const severityDesktopRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (severityRef.current && !severityRef.current.contains(e.target as Node)) {
                setSeverityOpen(false);
            }
            if (severityDesktopRef.current && !severityDesktopRef.current.contains(e.target as Node)) {
                setSeverityDesktopOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getSeverityStyle = (severity: string) => {
        switch (severity) {
            case 'info': return 'text-success bg-success/10 border-success/20';
            case 'system': return 'text-primary bg-primary/10 border-primary/20';
            case 'warning': return 'text-warning bg-warning/10 border-warning/20';
            case 'critical': return 'text-error bg-error/10 border-error/20';
            default: return 'text-slate-500 bg-slate-100 border-slate-200';
        }
    };

    const getSeverityLabel = (severity: string) => {
        switch (severity) {
            case 'info': return 'Info';
            case 'system': return 'System';
            case 'warning': return 'Warning';
            case 'critical': return 'Critical';
            default: return severity;
        }
    };

    const getRowBg = (severity: string) => {
        if (severity === 'critical') return 'bg-error/5';
        return '';
    };

    // Filter events
    const filtered = allEvents.filter((e) => {
        const matchesSearch = searchQuery === '' ||
            e.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
            e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            e.eventType.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSeverity = severityFilter === 'all' ||
            (severityFilter === 'critical' && e.severity === 'critical') ||
            (severityFilter === 'warning_critical' && (e.severity === 'warning' || e.severity === 'critical')) ||
            (severityFilter === 'info' && e.severity === 'info') ||
            (severityFilter === 'system' && e.severity === 'system');

        // Date range filter
        let matchesDate = true;
        if (startDate || endDate) {
            const eventDateStr = e.timestamp.split(' ')[0]; // "2025-02-15"
            if (startDate && eventDateStr < startDate) matchesDate = false;
            if (endDate && eventDateStr > endDate) matchesDate = false;
        }

        return matchesSearch && matchesSeverity && matchesDate;
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
    const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    // Export handlers
    const handleExportCSV = () => {
        const headers = ['Timestamp', 'Source', 'Event Type', 'Description', 'Severity'];
        const csvRows = [headers.join(',')];
        filtered.forEach(e => {
            csvRows.push([`"${e.timestamp}"`, `"${e.source}"`, `"${e.eventType}"`, `"${e.description}"`, `"${e.severity}"`].join(','));
        });
        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `event_logs_${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleExportPDF = () => {
        window.print();
    };






    const getSeverityAccent = (severity: string) => {
        switch (severity) {
            case 'info': return 'border-l-emerald-500';
            case 'system': return 'border-l-primary';
            case 'warning': return 'border-l-amber-500';
            case 'critical': return 'border-l-red-500';
            default: return 'border-l-slate-300';
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 flex-1 flex flex-col min-h-0 h-full">
            {/* Toolbar */}
            <div className="bg-white dark:bg-neutral-900 border border-border-light dark:border-neutral-800 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 shadow-sm flex-shrink-0">
                {/* Row 1: Search + Export */}
                <div className="flex items-center gap-3 mb-3">
                    <div className="flex-1 relative">
                        <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                        <input
                            type="text"
                            placeholder="Search events..."
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                            className="w-full pl-10 pr-4 h-9 bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-lg text-sm focus:ring-primary focus:border-primary focus:outline-none transition-all text-slate-700 dark:text-neutral-200 placeholder:text-slate-400"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={handleExportCSV} className="w-9 h-9 flex items-center justify-center bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-lg hover:bg-slate-100 dark:hover:bg-neutral-700 transition-all text-slate-500 dark:text-neutral-400" title="Export CSV">
                            <span className="material-icons text-[18px]">description</span>
                        </button>
                        <button onClick={handleExportPDF} className="w-9 h-9 flex items-center justify-center bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-lg hover:bg-slate-100 dark:hover:bg-neutral-700 transition-all text-slate-500 dark:text-neutral-400" title="Export PDF">
                            <span className="material-icons text-[18px]">picture_as_pdf</span>
                        </button>
                    </div>
                </div>

                {/* Row 2: Filters — Mobile (compact) */}
                <div className="flex items-center gap-2 sm:hidden">
                    <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-lg px-2 h-9 min-w-0 shrink">
                        <span className="material-icons text-slate-400 text-sm">calendar_today</span>
                        <input type="date" value={startDate} onChange={(e) => { setStartDate(e.target.value); setCurrentPage(1); }} className="bg-transparent border-none text-[10px] py-0 px-0 focus:ring-0 focus:outline-none text-slate-600 dark:text-neutral-300 w-[85px] min-w-0" />
                        <span className="text-slate-300 dark:text-neutral-600 text-[10px]">→</span>
                        <input type="date" value={endDate} onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1); }} className="bg-transparent border-none text-[10px] py-0 px-0 focus:ring-0 focus:outline-none text-slate-600 dark:text-neutral-300 w-[85px] min-w-0" />
                    </div>
                    <div ref={severityRef} className="relative shrink-0">
                        <button
                            onClick={() => setSeverityOpen(!severityOpen)}
                            className="bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-lg text-[11px] h-9 px-2 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none text-slate-600 dark:text-neutral-300 flex items-center gap-1 min-w-[80px] justify-between"
                        >
                            <span>
                                {severityFilter === 'all' && 'All'}
                                {severityFilter === 'critical' && 'Critical'}
                                {severityFilter === 'warning_critical' && 'Warn+Crit'}
                                {severityFilter === 'info' && 'Info'}
                                {severityFilter === 'system' && 'System'}
                            </span>
                            <span className="material-icons text-[14px] text-slate-400" style={{ transform: severityOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>expand_more</span>
                        </button>
                        {severityOpen && (
                            <div className="absolute top-full right-0 mt-1 w-32 bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-lg shadow-lg dark:shadow-black/40 z-50 overflow-hidden">
                                {[
                                    { value: 'all', label: 'All' },
                                    { value: 'critical', label: 'Critical' },
                                    { value: 'warning_critical', label: 'Warn+Crit' },
                                    { value: 'info', label: 'Info' },
                                    { value: 'system', label: 'System' }
                                ].map((opt) => (
                                    <button
                                        key={opt.value}
                                        onClick={() => { setSeverityFilter(opt.value); setCurrentPage(1); setSeverityOpen(false); }}
                                        className={`w-full text-left px-3 py-2 text-[11px] font-bold transition-colors ${severityFilter === opt.value ? 'bg-primary/15 text-primary' : 'text-slate-600 dark:text-neutral-300 hover:bg-slate-50 dark:hover:bg-neutral-700'}`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Row 2: Filters — Desktop (full) */}
                <div className="hidden sm:flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-lg px-2.5 h-9">
                        <span className="material-icons text-slate-400 text-sm">calendar_today</span>
                        <input type="date" value={startDate} onChange={(e) => { setStartDate(e.target.value); setCurrentPage(1); }} className="bg-transparent border-none text-xs py-0 px-0 focus:ring-0 focus:outline-none text-slate-600 dark:text-neutral-300 w-[100px]" />
                        <span className="text-slate-300 dark:text-neutral-600 text-xs">→</span>
                        <input type="date" value={endDate} onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1); }} className="bg-transparent border-none text-xs py-0 px-0 focus:ring-0 focus:outline-none text-slate-600 dark:text-neutral-300 w-[100px]" />
                    </div>
                    <div ref={severityDesktopRef} className="relative">
                        <button
                            onClick={() => setSeverityDesktopOpen(!severityDesktopOpen)}
                            className="bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-lg text-xs h-9 px-3 focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none text-slate-600 dark:text-neutral-300 flex items-center gap-2 min-w-[140px] justify-between"
                        >
                            <span>
                                {severityFilter === 'all' && 'All Severities'}
                                {severityFilter === 'critical' && 'Critical Only'}
                                {severityFilter === 'warning_critical' && 'Warning & Critical'}
                                {severityFilter === 'info' && 'Info Only'}
                                {severityFilter === 'system' && 'System Only'}
                            </span>
                            <span className="material-icons text-[16px] text-slate-400" style={{ transform: severityDesktopOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>expand_more</span>
                        </button>
                        {severityDesktopOpen && (
                            <div className="absolute top-full right-0 mt-1 w-48 bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-lg shadow-lg dark:shadow-black/40 z-50 overflow-hidden">
                                {[
                                    { value: 'all', label: 'All Severities' },
                                    { value: 'critical', label: 'Critical Only' },
                                    { value: 'warning_critical', label: 'Warning & Critical' },
                                    { value: 'info', label: 'Info Only' },
                                    { value: 'system', label: 'System Only' }
                                ].map((opt) => (
                                    <button
                                        key={opt.value}
                                        onClick={() => { setSeverityFilter(opt.value); setCurrentPage(1); setSeverityDesktopOpen(false); }}
                                        className={`w-full text-left px-3 py-2 text-xs font-bold transition-colors ${severityFilter === opt.value ? 'bg-primary/15 text-primary' : 'text-slate-600 dark:text-neutral-300 hover:bg-slate-50 dark:hover:bg-neutral-700'}`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="ml-auto text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {filtered.length} events
                    </div>
                </div>
            </div>

            {/* Data Display */}
            <div className="bg-white dark:bg-neutral-900 rounded-xl border border-border-light dark:border-neutral-800 shadow-sm flex flex-col flex-1 overflow-hidden">

                {/* ─── Mobile Card View (< md) ─── */}
                <div className="md:hidden flex-1 overflow-y-auto">
                    {paginated.length > 0 ? (
                        <div className="divide-y divide-slate-100 dark:divide-neutral-800">
                            {paginated.map((event, index) => (
                                <div
                                    key={index}
                                    className={`px-4 py-3 border-l-2 ${getSeverityAccent(event.severity)} ${event.severity === 'critical' ? 'bg-red-50/40 dark:bg-red-950/10' : ''}`}
                                >
                                    {/* Row 1: Source + Severity + Time */}
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-bold text-slate-800 dark:text-neutral-100 truncate flex-1">{event.source}</span>
                                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase shrink-0 ${getSeverityStyle(event.severity)}`}>
                                            {getSeverityLabel(event.severity)}
                                        </span>
                                        <span className="text-[10px] text-slate-400 tabular-nums shrink-0">{event.timestamp.split(' ')[1]}</span>
                                    </div>
                                    {/* Row 2: Description */}
                                    <p className="text-[11px] text-slate-500 dark:text-neutral-400 leading-snug truncate">{event.description}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                            <span className="material-icons text-3xl mb-2">search_off</span>
                            <p className="text-xs font-medium">No events match your filters</p>
                        </div>
                    )}
                </div>

                {/* ─── Desktop Table View (md+) ─── */}
                <div className="hidden md:flex flex-col flex-1 overflow-hidden">
                    <div className="overflow-auto scrollbar-hide flex-1">
                        <table className="w-full text-center text-sm table-fixed min-w-[900px]">
                            <thead className="bg-slate-50 dark:bg-neutral-800 sticky top-0 z-20 border-b border-border-light dark:border-neutral-700">
                                <tr>
                                    <th className="w-48 px-4 lg:px-8 py-4 font-bold text-slate-500 text-[10px] uppercase tracking-wider text-center">Timestamp</th>
                                    <th className="w-48 px-4 lg:px-8 py-4 font-bold text-slate-500 text-[10px] uppercase tracking-wider text-center">Source</th>
                                    <th className="w-40 px-4 lg:px-8 py-4 font-bold text-slate-500 text-[10px] uppercase tracking-wider text-center">Event Type</th>
                                    <th className="px-4 lg:px-8 py-4 font-bold text-slate-500 text-[10px] uppercase tracking-wider text-center">Description</th>
                                    <th className="w-32 px-4 lg:px-8 py-4 font-bold text-slate-500 text-[10px] uppercase tracking-wider text-center">Severity</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {paginated.length > 0 ? paginated.map((event, index) => (
                                    <tr key={index} className={`hover:bg-slate-100/50 dark:hover:bg-neutral-800/80 transition-colors ${getRowBg(event.severity)}`}>
                                        <td className="px-4 lg:px-8 py-4 text-xs font-medium text-slate-500 text-center">{event.timestamp}</td>
                                        <td className="px-4 lg:px-8 py-4 text-xs font-bold text-slate-700 dark:text-neutral-200 text-center">{event.source}</td>
                                        <td className="px-4 lg:px-8 py-4 text-xs text-slate-500 uppercase tracking-tighter text-center">{event.eventType}</td>
                                        <td className="px-4 lg:px-8 py-4 text-xs text-slate-700 dark:text-neutral-300 truncate text-center">{event.description}</td>
                                        <td className="px-4 lg:px-8 py-4 text-center">
                                            <span className={`inline-block text-[10px] font-bold px-4 py-1.5 rounded uppercase border ${getSeverityStyle(event.severity)}`}>
                                                {getSeverityLabel(event.severity)}
                                            </span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-12 text-center text-sm text-slate-400">
                                            No events match your filters.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination Footer */}
                <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 bg-slate-50 dark:bg-neutral-800 border-t border-border-light dark:border-neutral-700 flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0">
                    <div className="text-[10px] sm:text-xs text-slate-500 font-medium uppercase tracking-widest">
                        {filtered.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
                    </div>

                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                />
                            </PaginationItem>

                            {(() => {
                                const startPage = Math.floor((currentPage - 1) / 3) * 3 + 1;
                                const endPage = Math.min(startPage + 2, totalPages);
                                const pages = [];

                                if (startPage > 1) {
                                    pages.push(
                                        <PaginationItem key="prev-ellipsis">
                                            <PaginationEllipsis />
                                        </PaginationItem>
                                    );
                                }

                                for (let i = startPage; i <= endPage; i++) {
                                    pages.push(
                                        <PaginationItem key={i}>
                                            <PaginationLink
                                                isActive={currentPage === i}
                                                onClick={() => setCurrentPage(i)}
                                            >
                                                {i}
                                            </PaginationLink>
                                        </PaginationItem>
                                    );
                                }

                                if (endPage < totalPages) {
                                    pages.push(
                                        <PaginationItem key="next-ellipsis">
                                            <PaginationEllipsis />
                                        </PaginationItem>
                                    );
                                }

                                return pages;
                            })()}

                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
        </div>
    );
}

/* ─── Inline Pagination Components ─── */

function Pagination({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return (
        <nav role="navigation" aria-label="pagination" className={`flex justify-center ${className}`}>
            {children}
        </nav>
    );
}

function PaginationContent({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return (
        <ul className={`flex items-center gap-1 ${className}`}>
            {children}
        </ul>
    );
}

function PaginationItem({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return <li className={className}>{children}</li>;
}

function PaginationLink({
    children,
    isActive = false,
    onClick,
    className = '',
}: {
    children: React.ReactNode;
    isActive?: boolean;
    onClick?: () => void;
    className?: string;
}) {
    return (
        <button
            onClick={onClick}
            className={`
                inline-flex items-center justify-center w-9 h-9 rounded-md text-sm font-medium transition-colors
                ${isActive
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:bg-slate-100 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-slate-100'
                }
                ${className}
            `}
        >
            {children}
        </button>
    );
}

function PaginationPrevious({
    onClick,
    disabled = false,
    className = '',
}: {
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
}) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
                inline-flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors
                ${disabled
                    ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
                    : 'text-slate-500 hover:bg-slate-100 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-slate-100'
                }
                ${className}
            `}
        >
            <span className="material-icons text-base">chevron_left</span>
            <span className="hidden sm:inline">Previous</span>
        </button>
    );
}

function PaginationNext({
    onClick,
    disabled = false,
    className = '',
}: {
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
}) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
                inline-flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors
                ${disabled
                    ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
                    : 'text-slate-500 hover:bg-slate-100 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-slate-100'
                }
                ${className}
            `}
        >
            <span className="hidden sm:inline">Next</span>
            <span className="material-icons text-base">chevron_right</span>
        </button>
    );
}

function PaginationEllipsis({ className = '' }: { className?: string }) {
    return (
        <span className={`inline-flex items-center justify-center w-9 h-9 flex-none text-slate-400 dark:text-neutral-500 ${className}`}>
            <span className="material-icons text-base">more_horiz</span>
        </span>
    );
}
