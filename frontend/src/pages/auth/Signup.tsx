import { SignUp } from '@clerk/clerk-react';
import { dark } from '@clerk/themes';
import { useTheme } from '../../context/ThemeContext';

export default function Signup() {
    const { theme } = useTheme();

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display antialiased">
            <main className="flex-grow flex items-center justify-center px-4 py-16">
                <div className="w-full max-w-lg">
                    {/* Branding Header */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/5 rounded-lg mb-5">
                            <span className="material-icons text-primary text-3xl">sensors</span>
                        </div>
                        <h1 className="text-2xl font-bold text-slate-custom dark:text-white tracking-tight uppercase">
                            AMD Slingshot
                        </h1>
                        <p className="text-sm text-slate-light dark:text-neutral-400 mt-1 font-medium">
                            Industrial Monitoring &amp; Loss Detection
                        </p>
                    </div>

                    {/* Clerk Sign Up */}
                    <div className="flex justify-center">
                        <SignUp
                            routing="path"
                            path="/signup"
                            signInUrl="/login"
                            forceRedirectUrl="/dashboard"
                            appearance={{
                                baseTheme: theme === 'dark' ? dark : undefined,
                                variables: {
                                    colorPrimary: '#896cff',
                                },
                            }}
                        />
                    </div>

                    {/* Security Badges */}
                    <div className="mt-10 flex items-center justify-center space-x-8">
                        <div className="flex items-center space-x-2 text-slate-light dark:text-neutral-500">
                            <span className="material-icons text-base">verified_user</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest">TLS 1.3 Encryption Active</span>
                        </div>
                        <div className="flex items-center space-x-2 text-slate-light dark:text-neutral-500">
                            <span className="material-icons text-base">lan</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest">Node v4.2.0-STABLE</span>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="py-8 px-4 border-t border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                <div className="container mx-auto text-center">
                    <p className="text-[11px] text-slate-light dark:text-neutral-500 font-medium uppercase tracking-tighter">
                        © 2024 AMD Systems. All Rights Reserved. Professional Engineering Grade Asset Deployment.
                    </p>
                </div>
            </footer>
        </div>
    );
}
