import { SignIn } from '@clerk/clerk-react';
import { dark } from '@clerk/themes';
import { useTheme } from '../../context/ThemeContext';

export default function Login() {
    const { theme } = useTheme();

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display">
            <main className="flex-grow flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">
                    {/* Branding Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-xl mb-4">
                            <span className="material-icons text-primary text-3xl">sensors</span>
                        </div>
                        <h1 className="text-2xl font-bold text-slate-custom dark:text-white tracking-tight uppercase">
                            AMD Slingshot
                        </h1>
                        <p className="text-sm text-slate-light dark:text-neutral-400 mt-1">
                            Industrial Monitoring &amp; Loss Detection
                        </p>
                    </div>

                    {/* Clerk Sign In */}
                    <div className="flex justify-center">
                        <SignIn
                            routing="path"
                            path="/login"
                            signUpUrl="/signup"
                            forceRedirectUrl="/dashboard"
                            appearance={{
                                baseTheme: theme === 'dark' ? dark : undefined,
                                variables: {
                                    colorPrimary: '#896cff',
                                },
                            }}
                        />
                    </div>

                    {/* Supporting Info */}
                    <div className="mt-8 flex items-center justify-center space-x-6">
                        <div className="flex items-center space-x-1 text-slate-light dark:text-neutral-500">
                            <span className="material-icons text-xs">verified_user</span>
                            <span className="text-[10px] font-semibold uppercase tracking-tighter">TLS 1.3 Encryption</span>
                        </div>
                        <div className="flex items-center space-x-1 text-slate-light dark:text-neutral-500">
                            <span className="material-icons text-xs">lan</span>
                            <span className="text-[10px] font-semibold uppercase tracking-tighter">Node v4.2.0-STABLE</span>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="py-6 px-4">
                <div className="container mx-auto text-center">
                    <p className="text-xs text-slate-light dark:text-neutral-500">
                        © 2024 AMD Systems. All Rights Reserved. Professional Engineering Grade Asset.
                    </p>
                </div>
            </footer>
        </div>
    );
}
