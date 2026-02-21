export default function SystemSetup() {
    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 lg:space-y-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-2 mb-6">
                    <span className="material-icons text-primary text-xl">settings</span>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-neutral-100">System Configuration</h2>
                </div>

                <div className="space-y-4 sm:space-y-6">
                    {/* General Settings */}
                    <div className="bg-white dark:bg-neutral-900 rounded-xl border border-border-light dark:border-neutral-800 shadow-sm p-4 sm:p-5 lg:p-6">
                        <div className="section-header">
                            <h3 className="font-bold text-slate-800 dark:text-neutral-100">General Settings</h3>
                        </div>

                        <div className="space-y-4 max-w-lg">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">System Name</label>
                                <input className="form-input-technical" type="text" defaultValue="AMD Slingshot Node 01" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Location Identifier</label>
                                <input className="form-input-technical" type="text" defaultValue="Sector 7G - Industrial Park" />
                            </div>
                            <div className="flex items-center justify-between pt-2">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-neutral-300">Maintenance Mode</label>
                                    <p className="text-xs text-slate-500">Disables all automated control logic.</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* User Management */}
                    <div className="bg-white dark:bg-neutral-900 rounded-xl border border-border-light dark:border-neutral-800 shadow-sm p-4 sm:p-5 lg:p-6">
                        <div className="section-header">
                            <h3 className="font-bold text-slate-800 dark:text-neutral-100">Authorized Personnel</h3>
                        </div>
                        <div className="space-y-4">
                            {[
                                { name: 'Dr. Sarah Connor', role: 'Lead Engineer', status: 'Active' },
                                { name: 'John Smith', role: 'Operator', status: 'Active' },
                                { name: 'System Admin', role: 'Administrator', status: 'Active' },
                            ].map((user, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-neutral-800/50 rounded-lg border border-slate-100 dark:border-neutral-800">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-neutral-700 flex items-center justify-center font-bold text-xs text-slate-500">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800 dark:text-neutral-200">{user.name}</p>
                                            <p className="text-xs text-slate-500">{user.role}</p>
                                        </div>
                                    </div>
                                    <button className="text-xs font-bold text-primary hover:underline">Manage</button>
                                </div>
                            ))}
                            <button className="w-full py-2 border border-dashed border-slate-300 dark:border-neutral-600 rounded-lg text-slate-500 text-xs font-bold uppercase hover:bg-slate-50 dark:hover:bg-neutral-800 transition-colors">
                                + Add New User
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
