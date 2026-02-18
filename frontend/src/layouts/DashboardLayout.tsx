import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useTheme } from '../context/ThemeContext';
import { UserButton, useClerk } from '@clerk/clerk-react';
import { dark } from '@clerk/themes';

const sidebarItems = [
    { icon: 'dashboard', label: 'Dashboard', href: '/dashboard', exact: true },
    { icon: 'analytics', label: 'Analytics', href: '/dashboard/analytics' },
    { icon: 'sensors', label: 'Sensors', href: '/dashboard/sensors' },
    { icon: 'history', label: 'Event Logs', href: '/dashboard/event-logs' },
];

const engineeringItems = [
    { icon: 'settings_input_component', label: 'PLC Config', href: '/dashboard/plc-config' },
    { icon: 'settings', label: 'System Setup', href: '/dashboard/system-setup' },
];

export default function DashboardLayout() {
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const { signOut } = useClerk();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = async () => {
        await signOut();
        navigate('/');
    };

    // Close sidebar on route change (mobile)
    useEffect(() => {
        setSidebarOpen(false);
    }, [location.pathname]);

    // Live clock
    const [now, setNow] = useState(new Date());
    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-neutral-100 font-display min-h-screen flex">
            {/* Mobile Sidebar Backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "w-64 border-r border-border-light dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col",
                // Mobile: slide-over drawer, fixed full height
                "fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out",
                sidebarOpen ? "translate-x-0" : "-translate-x-full",
                // Desktop: sticky sidebar, always visible
                "lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:z-auto"
            )}>
                <div className="p-6 border-b border-border-light dark:border-neutral-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">A</div>
                        <span className="font-bold text-lg tracking-tight uppercase">Slingshot</span>
                    </div>
                    {/* Close button on mobile */}
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden p-1 text-slate-400 hover:text-slate-600 dark:hover:text-neutral-200 transition-colors"
                    >
                        <span className="material-icons text-xl">close</span>
                    </button>
                </div>

                <nav className="flex-1 py-6 overflow-y-auto lg:overflow-y-hidden">
                    <div className="px-4 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-widest">General</div>
                    {sidebarItems.map((item) => (
                        <NavLink
                            key={item.href}
                            to={item.href}
                            end={item.exact}
                            className={({ isActive }) => cn(
                                "flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors",
                                isActive
                                    ? "sidebar-item-active"
                                    : "text-slate-600 dark:text-neutral-400 hover:bg-slate-50 dark:hover:bg-neutral-800"
                            )}
                        >
                            <span className="material-icons text-[20px]">{item.icon}</span>
                            {item.label}
                        </NavLink>
                    ))}

                    <div className="px-4 mt-8 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-widest">Engineering</div>
                    {engineeringItems.map((item) => (
                        <NavLink
                            key={item.href}
                            to={item.href}
                            className={({ isActive }) => cn(
                                "flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors",
                                isActive
                                    ? "sidebar-item-active"
                                    : "text-slate-600 dark:text-neutral-400 hover:bg-slate-50 dark:hover:bg-neutral-800"
                            )}
                        >
                            <span className="material-icons text-[20px]">{item.icon}</span>
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 bg-slate-50 dark:bg-neutral-800/50 border-t border-border-light dark:border-neutral-800">
                    <button
                        onClick={handleLogout}
                        className="w-full py-2 px-3 border border-slate-200 dark:border-neutral-700 hover:border-red-200 dark:hover:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-500 hover:text-red-600 dark:text-neutral-400 dark:hover:text-red-400 rounded-lg text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                    >
                        <span className="material-icons text-[18px]">logout</span>
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0">
                <header className="h-14 sm:h-16 bg-white dark:bg-neutral-900 border-b border-border-light dark:border-neutral-800 px-3 sm:px-4 lg:px-8 flex items-center justify-between sticky top-0 z-30">
                    <div className="flex items-center gap-3 lg:gap-6">
                        {/* Hamburger — mobile/tablet only */}
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-1.5 -ml-1 text-slate-500 hover:text-primary transition-colors"
                        >
                            <span className="material-icons text-2xl">menu</span>
                        </button>
                        <h2 className="hidden sm:block text-sm font-semibold text-slate-500 uppercase tracking-wider">Water &amp; Energy Monitoring</h2>
                        <div className="flex items-center gap-2 px-3 py-1 bg-success/10 rounded-full">
                            <span className="w-2 h-2 bg-success rounded-full animate-pulse"></span>
                            <span className="text-xs font-bold text-success">CONNECTED</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 lg:gap-8">
                        <div className="text-right hidden sm:block">
                            <div className="text-sm font-bold text-slate-800 dark:text-neutral-100">{now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                            <div className="text-xs text-slate-500">{now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}</div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 pl-3 sm:pl-8 border-l border-border-light dark:border-neutral-800">
                            <button onClick={toggleTheme} className="p-2 text-slate-400 hover:text-primary transition-colors" title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
                                <span className="material-icons">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
                            </button>
                            <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                                <span className="material-icons">notifications</span>
                            </button>
                            <UserButton
                                afterSignOutUrl="/"
                                appearance={{
                                    baseTheme: theme === 'dark' ? dark : undefined,
                                    elements: {
                                        avatarBox: "w-8 h-8"
                                    }
                                }}
                            />
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
