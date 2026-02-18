import { useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';

export default function LandingPage() {
    const navigate = useNavigate();
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const { theme, toggleTheme } = useTheme();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const applications = [
        {
            title: "Campus Infrastructure",
            category: "Infrastructure",
            description: "District-wide monitoring for university campuses and large corporate headquarters to manage sprawling utility networks.",
            image: "/images/campus.jpg"
        },
        {
            title: "Manufacturing Plants",
            category: "Manufacturing",
            description: "Process water and energy tracking for heavy industrial production lines, ensuring zero-downtime operations.",
            image: "/images/manufacturing.jpg"
        },
        {
            title: "Data Centers",
            category: "Data Centers",
            description: "Critical cooling system leak detection and power efficiency monitoring for high-density compute environments.",
            image: "/images/data-center.jpg"
        },
        {
            title: "Smart Agriculture",
            category: "Agriculture",
            description: "Precision irrigation control and leak prevention for large-scale agricultural operations to optimize water usage.",
            image: "/images/smart-agriculture.jpg"
        },
        {
            title: "Municipal Water",
            category: "Utilities",
            description: "City-wide pressure management and leak detection for municipal water supply networks to reduce non-revenue water.",
            image: "/images/municipal-water.jpg"
        },
        {
            title: "Oil & Gas Pipelines",
            category: "Energy",
            description: "Remote monitoring of oil and gas pipelines for leak detection and integrity management in harsh environments.",
            image: "/images/oil-gas.jpg"
        }
    ];

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -400, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 400, behavior: 'smooth' });
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen text-slate-900 dark:text-neutral-100 font-display transition-colors duration-200">
            {/* Nav */}
            <nav className="sticky top-0 z-50 border-b border-slate-200 dark:border-neutral-800 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                            <span className="material-icons text-white text-xl">precision_manufacturing</span>
                        </div>
                        <span className="text-lg sm:text-xl font-bold tracking-tight">AMD <span className="text-primary font-extrabold">SLINGSHOT</span></span>
                    </div>
                    <div className="hidden md:flex items-center gap-8">
                        <a className="text-sm font-medium hover:text-primary transition-colors" href="#architecture">Architecture</a>
                        <a className="text-sm font-medium hover:text-primary transition-colors" href="#impact">Sustainability</a>
                        <a className="text-sm font-medium hover:text-primary transition-colors" href="#applications">Applications</a>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4">
                        <button onClick={toggleTheme} className="p-2 text-slate-400 hover:text-primary transition-colors flex items-center justify-center leading-none" title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
                            <span className="material-icons text-[20px] leading-none">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
                        </button>
                        <div className="hidden sm:flex items-center gap-2 sm:gap-4">
                            <SignedOut>
                                <button onClick={() => navigate('/login')} className="text-sm font-medium px-4 py-2 hover:bg-slate-100 dark:hover:bg-neutral-800 rounded-lg transition-all">Login</button>
                                <button onClick={() => navigate('/signup')} className="bg-primary text-white text-sm font-semibold px-5 py-2 rounded-lg hover:shadow-lg hover:shadow-primary/30 transition-all">Sign Up</button>
                            </SignedOut>
                            <SignedIn>
                                <button onClick={() => navigate('/dashboard')} className="bg-primary text-white text-sm font-semibold px-5 py-2 rounded-lg hover:shadow-lg hover:shadow-primary/30 transition-all">Dashboard</button>
                                <UserButton afterSignOutUrl="/" />
                            </SignedIn>
                        </div>
                        {/* Mobile hamburger */}
                        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="sm:hidden p-2 text-slate-500 hover:text-primary transition-colors">
                            <span className="material-icons text-[24px]">{mobileMenuOpen ? 'close' : 'menu'}</span>
                        </button>
                    </div>
                </div>
                {/* Mobile menu dropdown */}
                {mobileMenuOpen && (
                    <div className="sm:hidden border-t border-slate-200 dark:border-neutral-800 bg-white dark:bg-background-dark px-4 py-4 space-y-3">
                        <a className="block text-sm font-medium hover:text-primary transition-colors py-2" href="#architecture" onClick={() => setMobileMenuOpen(false)}>Architecture</a>
                        <a className="block text-sm font-medium hover:text-primary transition-colors py-2" href="#impact" onClick={() => setMobileMenuOpen(false)}>Sustainability</a>
                        <a className="block text-sm font-medium hover:text-primary transition-colors py-2" href="#applications" onClick={() => setMobileMenuOpen(false)}>Applications</a>
                        <div className="border-t border-slate-200 dark:border-neutral-800 pt-3 flex flex-col gap-2">
                            <SignedOut>
                                <button onClick={() => { navigate('/login'); setMobileMenuOpen(false); }} className="text-sm font-medium px-4 py-2.5 hover:bg-slate-100 dark:hover:bg-neutral-800 rounded-lg transition-all text-left">Login</button>
                                <button onClick={() => { navigate('/signup'); setMobileMenuOpen(false); }} className="bg-primary text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:shadow-lg hover:shadow-primary/30 transition-all text-center">Sign Up</button>
                            </SignedOut>
                            <SignedIn>
                                <button onClick={() => { navigate('/dashboard'); setMobileMenuOpen(false); }} className="bg-primary text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:shadow-lg hover:shadow-primary/30 transition-all text-center">Dashboard</button>
                            </SignedIn>
                        </div>
                    </div>
                )}
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center mb-16 sm:mb-32">
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            <span className="text-xs font-bold text-primary tracking-wider uppercase font-mono-alt">System Status: Active</span>
                        </div>
                        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-slate-900 dark:text-white">
                            Smart Edge-Based <br />
                            <span className="text-primary">Water & Energy</span> <br />
                            Loss Detection
                        </h1>
                        <p className="text-base sm:text-xl text-slate-600 dark:text-neutral-400 max-w-xl leading-relaxed">
                            Real-time monitoring, intelligent leak validation, and controlled shutdown powered by embedded AI for industrial-grade engineering environments.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <SignedOut>
                                <button onClick={() => navigate('/login')} className="bg-primary text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-primary-dark shadow-xl shadow-primary/20 transition-all flex items-center gap-2">
                                    Get Started
                                    <span className="material-icons">arrow_forward</span>
                                </button>
                            </SignedOut>
                            <SignedIn>
                                <button onClick={() => navigate('/dashboard')} className="bg-primary text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-primary-dark shadow-xl shadow-primary/20 transition-all flex items-center gap-2">
                                    Access Dashboard
                                    <span className="material-icons">arrow_forward</span>
                                </button>
                            </SignedIn>
                            <button className="bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 text-slate-900 dark:text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-slate-50 dark:hover:bg-neutral-700 transition-all">
                                View System Overview
                            </button>
                        </div>
                        <div className="flex flex-wrap items-center gap-6 sm:gap-8 pt-4 border-t border-slate-200 dark:border-neutral-800">
                            <div>
                                <p className="text-xl sm:text-2xl font-bold">99.9%</p>
                                <p className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-widest font-semibold font-mono-alt">Detection Accuracy</p>
                            </div>
                            <div>
                                <p className="text-xl sm:text-2xl font-bold">&lt; 50ms</p>
                                <p className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-widest font-semibold font-mono-alt">Edge Latency</p>
                            </div>
                            <div>
                                <p className="text-xl sm:text-2xl font-bold">ISO 27001</p>
                                <p className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-widest font-semibold font-mono-alt">Security Certified</p>
                            </div>
                        </div>
                    </div>
                    <div className="relative group">
                        <div className="absolute -inset-4 bg-primary/5 rounded-3xl blur-2xl group-hover:bg-primary/10 transition-colors"></div>
                        <div className="relative bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-2xl technical-grid">
                            <img alt="Technical system diagram" className="w-full h-auto rounded-xl border border-slate-100 dark:border-neutral-800" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNa9QcLiVXqL39xRtgFFWxrSLZHXOeCjfEmpiG5xrthRj_3XRnixFRQLz4lg96ByqHGuqxaKqzkpaMEVKrUBmZl3lPSQgu_BM8nCbj4cImIK4WtHWmsYz_7M1H4dI7lqYg5AUam6MoZvc12SP7k7QMFvzSQbFf570G8WcS27TZ_MThFcgk3CChhWwRchlo0bQx3RtNjFfedxYYXjYArxQGzo7JK6AhBoIj9biAZvrmYrEhTjp4y7Dh546ZrCFY30LcviHDV1r0b6Si" />
                            <div className="absolute top-4 left-4 sm:top-12 sm:left-12 bg-white/90 dark:bg-neutral-800/90 backdrop-blur p-2 sm:p-3 rounded-lg border border-slate-200 dark:border-neutral-700 shadow-lg">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    <span className="text-[10px] sm:text-xs font-mono font-bold tracking-tight">NODE_01: NOMINAL</span>
                                </div>
                            </div>
                            <div className="absolute bottom-4 right-4 sm:bottom-12 sm:right-12 bg-white/90 dark:bg-neutral-800/90 backdrop-blur p-2 sm:p-4 rounded-lg border border-slate-200 dark:border-neutral-700 shadow-lg">
                                <div className="space-y-1">
                                    <div className="w-20 sm:w-32 h-1.5 bg-slate-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                                        <div className="bg-primary w-2/3 h-full"></div>
                                    </div>
                                    <span className="text-[8px] sm:text-[10px] font-mono text-slate-500 font-bold uppercase">Throughput Efficiency</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mb-16 sm:mb-32" id="architecture">
                    <div className="mb-12">
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Technical Architecture</h2>
                        <div className="h-1 w-20 bg-primary mt-4 rounded-full"></div>
                        <p className="mt-6 text-slate-600 dark:text-neutral-400 max-w-2xl">A multi-layered approach to industrial monitoring, combining high-fidelity sensors with localized edge intelligence and global cloud synchronization.</p>
                    </div>
                    <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl sm:rounded-3xl p-6 sm:p-12 overflow-hidden relative">
                        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-center gap-8 md:gap-0 relative z-10 px-0 sm:px-4">
                            <div className="flex flex-col items-center gap-4 text-center w-48 shrink-0">
                                <div className="w-20 h-20 rounded-2xl bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-slate-400 text-4xl">settings_input_component</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white">Industrial Sensors</h4>
                                    <p className="text-xs text-slate-500 font-mono-alt uppercase mt-1">Acoustic / Flow / Pressure</p>
                                </div>
                            </div>
                            <div className="hidden md:flex flex-1 items-center justify-center min-w-[100px]">
                                <div className="w-full border-t-2 border-dashed border-slate-200 dark:border-neutral-800 relative">
                                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white dark:bg-neutral-900 px-2 text-[10px] font-bold text-slate-400 tracking-widest uppercase whitespace-nowrap">Analog/Digital</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-center gap-4 text-center w-full sm:w-56 shrink-0 sm:scale-110">
                                <div className="w-24 h-24 rounded-3xl bg-primary/5 border-2 border-primary/20 flex items-center justify-center relative shadow-lg shadow-primary/5">
                                    <span className="material-symbols-outlined text-primary text-5xl">developer_board</span>
                                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-accent-green flex items-center justify-center border-2 border-white dark:border-slate-900">
                                        <span className="material-icons text-[12px] text-white">bolt</span>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white">Edge Gateway</h4>
                                    <p className="text-xs text-primary font-bold font-mono-alt uppercase mt-1">Real-time AI Validation</p>
                                </div>
                            </div>
                            <div className="hidden md:flex flex-1 items-center justify-center min-w-[100px]">
                                <div className="w-full border-t-2 border-dashed border-slate-200 dark:border-neutral-800 relative">
                                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white dark:bg-neutral-900 px-2 text-[10px] font-bold text-slate-400 tracking-widest uppercase whitespace-nowrap">MQTT TLS 1.3</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-center gap-4 text-center w-48 shrink-0">
                                <div className="w-20 h-20 rounded-2xl bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-slate-400 text-4xl">cloud_sync</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white">Cloud Sync</h4>
                                    <p className="text-xs text-slate-500 font-mono-alt uppercase mt-1">Central Intelligence Hub</p>
                                </div>
                            </div>
                        </div>
                        <div className="absolute inset-0 technical-grid opacity-30 pointer-events-none"></div>
                    </div>
                </section>

                <section className="mb-16 sm:mb-32" id="impact">
                    <div className="mb-12 text-center">
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Sustainability Impact</h2>
                        <div className="h-1 w-20 bg-accent-green mx-auto mt-4 rounded-full"></div>
                        <p className="mt-6 text-slate-600 dark:text-neutral-400 max-w-2xl mx-auto">Measurable environmental gains through precision resource management and leak mitigation across our active deployments.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white dark:bg-neutral-900 p-6 sm:p-10 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-neutral-800 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 -mr-16 -mt-16 rounded-full group-hover:scale-110 transition-transform"></div>
                            <div className="relative z-10">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                                    <span className="material-symbols-outlined text-primary">water_drop</span>
                                </div>
                                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-2 font-mono-alt">Total Water Conserved</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">12.4M</span>
                                    <span className="text-slate-500 font-medium">Gallons</span>
                                </div>
                                <div className="mt-6 flex items-center gap-2 text-accent-green text-sm font-bold">
                                    <span className="material-symbols-outlined text-sm">trending_up</span>
                                    <span>+18% vs Last Qtr</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-neutral-900 p-6 sm:p-10 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-neutral-800 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 -mr-16 -mt-16 rounded-full group-hover:scale-110 transition-transform"></div>
                            <div className="relative z-10">
                                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-6">
                                    <span className="material-symbols-outlined text-amber-600">bolt</span>
                                </div>
                                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-2 font-mono-alt">Energy Reduction</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">842k</span>
                                    <span className="text-slate-500 font-medium">kWh</span>
                                </div>
                                <div className="mt-6 flex items-center gap-2 text-accent-green text-sm font-bold">
                                    <span className="material-symbols-outlined text-sm">trending_up</span>
                                    <span>-12% Energy Waste</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-neutral-900 p-6 sm:p-10 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-neutral-800 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-green/5 -mr-16 -mt-16 rounded-full group-hover:scale-110 transition-transform"></div>
                            <div className="relative z-10">
                                <div className="w-12 h-12 rounded-xl bg-accent-green/10 flex items-center justify-center mb-6">
                                    <span className="material-symbols-outlined text-accent-green">co2</span>
                                </div>
                                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-2 font-mono-alt">CO2 Equivalent Saved</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">596</span>
                                    <span className="text-slate-500 font-medium">Metric Tons</span>
                                </div>
                                <div className="mt-6 flex items-center gap-2 text-accent-green text-sm font-bold">
                                    <span className="material-symbols-outlined text-sm">park</span>
                                    <span>Equivalent to 2.4k Trees</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mb-16 sm:mb-32" id="applications">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Industrial Applications</h2>
                            <div className="h-1 w-20 bg-primary mt-4 rounded-full"></div>
                            <p className="mt-6 text-slate-600 dark:text-neutral-400 max-w-2xl">Tailored monitoring solutions for critical infrastructure and complex facility ecosystems.</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={scrollLeft} className="w-12 h-12 rounded-full border border-slate-200 dark:border-neutral-700 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors">
                                <span className="material-icons">chevron_left</span>
                            </button>
                            <button onClick={scrollRight} className="w-12 h-12 rounded-full border border-slate-200 dark:border-neutral-700 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors">
                                <span className="material-icons">chevron_right</span>
                            </button>
                        </div>
                    </div>

                    {/* Carousel Container */}
                    <div
                        ref={scrollContainerRef}
                        className="flex overflow-x-auto gap-8 pb-8 snap-x snap-mandatory scrollbar-hide scroll-smooth"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {applications.map((app, index) => (
                            <div key={index} className="group cursor-pointer min-w-[280px] sm:min-w-[350px] md:min-w-[400px] snap-center">
                                <div className="relative h-48 sm:h-64 mb-4 sm:mb-6 rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-200">
                                    <img alt={app.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-100" src={app.image} />
                                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/40 transition-colors duration-500"></div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                                    <div className="absolute bottom-6 left-6">
                                        <span className="px-3 py-1 bg-primary text-white text-[10px] font-bold uppercase tracking-widest rounded-full">{app.category}</span>
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{app.title}</h3>
                                <p className="text-sm text-slate-600 dark:text-neutral-400 leading-relaxed">{app.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mt-16 sm:mt-32">
                    <div className="mb-12">
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Core System Capabilities</h2>
                        <div className="h-1 w-20 bg-primary mt-4 rounded-full"></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                        <div className="bg-white dark:bg-neutral-900 p-8 rounded-2xl border border-slate-200 dark:border-neutral-800 hover:border-primary/50 transition-all group">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                                <span className="material-icons text-primary group-hover:text-white">speed</span>
                            </div>
                            <h3 className="text-lg font-bold mb-3">Real-Time Analysis</h3>
                            <p className="text-sm text-slate-600 dark:text-neutral-400 leading-relaxed">Low-latency edge processing for immediate fault detection and telemetry streaming.</p>
                        </div>
                        <div className="bg-white dark:bg-neutral-900 p-8 rounded-2xl border border-slate-200 dark:border-neutral-800 hover:border-primary/50 transition-all group">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                                <span className="material-icons text-primary group-hover:text-white">psychology</span>
                            </div>
                            <h3 className="text-lg font-bold mb-3">Intelligent Validation</h3>
                            <p className="text-sm text-slate-600 dark:text-neutral-400 leading-relaxed">AI-driven filtering mechanisms to eliminate false positives in acoustic leak detection.</p>
                        </div>
                        <div className="bg-white dark:bg-neutral-900 p-8 rounded-2xl border border-slate-200 dark:border-neutral-800 hover:border-primary/50 transition-all group">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                                <span className="material-icons text-primary group-hover:text-white">power_settings_new</span>
                            </div>
                            <h3 className="text-lg font-bold mb-3">Automated Shutdown</h3>
                            <p className="text-sm text-slate-600 dark:text-neutral-400 leading-relaxed">Precision control protocols for rapid energy loss mitigation and safety interlocks.</p>
                        </div>
                        <div className="bg-white dark:bg-neutral-900 p-8 rounded-2xl border border-slate-200 dark:border-neutral-800 hover:border-primary/50 transition-all group">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                                <span className="material-icons text-primary group-hover:text-white">security</span>
                            </div>
                            <h3 className="text-lg font-bold mb-3">Secure Telemetry</h3>
                            <p className="text-sm text-slate-600 dark:text-neutral-400 leading-relaxed">End-to-end encrypted data transmission from proprietary hardware to central dashboards.</p>
                        </div>
                    </div>
                </section>

                <section className="mt-16 sm:mt-32 border border-slate-200 dark:border-neutral-800 rounded-2xl sm:rounded-[2rem] overflow-hidden bg-slate-900 text-white relative">
                    <div className="absolute inset-0 opacity-20">
                        <img alt="Global network monitoring map" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQ30Wa3yTQwGBEuJxB52MEETMRA3Gf7qeotxtxEam6OibprWhcgnV1hTAgKTTcgX7WmojxcdA49kT60zH-BMLATgkp2yFDH_-flSr_5VXULm7hRHUbkqwYeuev-dUg5UqBM-9He0yCZLQCEJS8-3bHe9oK035IuKNR95VpuBj18zBBS9Ule2bPFUPxGjSga_nFQkw5DbVFL3zbEfJDVEga4VhFUzvtsDzSBWD0dRtW2Gp5RGbn-UdrThPXcF-rQhc5RejW0HyeWVcY" />
                    </div>
                    <div className="relative p-6 sm:p-12 lg:p-20 z-10 flex flex-col md:flex-row items-center justify-between gap-8 sm:gap-12">
                        <div className="max-w-xl">
                            <h2 className="text-2xl sm:text-3xl font-extrabold mb-4">Enterprise-Ready Deployment</h2>
                            <p className="text-slate-400 text-lg leading-relaxed">
                                Scale your monitoring across multiple sites globally with our unified management console. AMD Slingshot supports both on-premise and cloud-native integration.
                            </p>
                        </div>
                        <div className="flex-shrink-0">
                            <button className="bg-primary text-white px-8 py-4 rounded-xl font-bold hover:scale-105 transition-transform flex items-center gap-3">
                                Schedule System Demo
                                <span className="material-icons">event</span>
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="bg-white dark:bg-neutral-900 border-t border-slate-200 dark:border-neutral-800 py-8 sm:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-8">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-slate-400 dark:bg-slate-600 rounded flex items-center justify-center">
                            <span className="material-icons text-white text-[14px]">precision_manufacturing</span>
                        </div>
                        <span className="font-bold text-slate-500">AMD SLINGSHOT <span className="text-[10px] ml-1 opacity-50">v2.4.0</span></span>
                    </div>
                    <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-sm font-medium text-slate-500">
                        <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
                        <a className="hover:text-primary transition-colors" href="#">Terms of Service</a>
                        <a className="hover:text-primary transition-colors" href="#">API Docs</a>
                        <a className="hover:text-primary transition-colors" href="#">Contact Engineering</a>
                    </div>
                    <div className="text-sm text-slate-400 font-mono-alt">
                        © 2024 AMD Engineering Solutions. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}
