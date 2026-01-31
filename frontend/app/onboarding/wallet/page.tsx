import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAccount, useConnect, useSignMessage } from 'wagmi';
import { Button } from '@/components/ui/Button';
import { Wallet, ArrowRight, ShieldCheck, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';

export default function WalletOnboarding() {
    const router = useRouter();
    const { address, isConnected } = useAccount();
    const { connect, connectors } = useConnect();
    const { signMessageAsync } = useSignMessage();
    const [isLinking, setIsLinking] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // Ensure user came from profile step
        const phone = localStorage.getItem('phoneNumber');
        if (!phone) {
            router.push('/onboarding/phone');
        }
    }, [router]);

    const handleConnectWallet = async () => {
        try {
            // Find MetaMask or any injected wallet connector
            const injectedConnector = connectors.find(c => c.id === 'injected' || c.name.includes('MetaMask'));
            if (injectedConnector) {
                await connect({ connector: injectedConnector });
            } else {
                setError('Tidak ada wallet terdeteksi. Install MetaMask atau Coinbase Wallet.');
            }
        } catch (err: any) {
            console.error('Connection error:', err);
            setError(err.message || 'Gagal menghubungkan wallet');
        }
    };

    const linkWallet = async () => {
        if (!address) return;

        setIsLinking(true);
        setError('');

        try {
            // 1. Get user phone from local storage
            const phoneNumber = localStorage.getItem('phoneNumber');
            if (!phoneNumber) throw new Error('Phone number not found');

            // 2. Call Backend API to update wallet address
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/user/profile`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phoneNumber,
                    walletAddress: address
                })
            });

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error || 'Failed to link wallet');
            }

            // 3. Update Session
            const sessionStr = localStorage.getItem('userSession');
            if (sessionStr) {
                const session = JSON.parse(sessionStr);
                localStorage.setItem('userSession', JSON.stringify({
                    ...session,
                    walletAddress: address
                }));
            }

            // 4. Redirect to Profiling
            router.push('/onboarding/profiling');

        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Gagal menghubungkan wallet');
        } finally {
            setIsLinking(false);
        }
    };

    // Auto-trigger link if already connected (optional, but good UX)
    // useEffect(() => {
    //   if (isConnected && address && !isLinking) {
    //      // Can prompt user to confirm instead of auto-linking
    //   }
    // }, [isConnected, address]);

    return (
        <div className="min-h-screen flex bg-primary-50">
            {/* Left Panel - Decorative (Same as other onboarding pages) */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#FFBC57] to-[#FF9500] p-12 flex-col justify-between relative overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute top-20 right-20 w-64 h-64 bg-white/20 rounded-full blur-3xl" />
                <div className="absolute bottom-20 left-10 w-96 h-96 bg-yellow-200/20 rounded-full blur-3xl" />

                {/* Logo */}
                <div className="relative z-10">
                    <div className="lg:hidden flex items-center justify-center mb-6">
                        <div>
                            <h1 className="text-2xl font-extrabold text-white">KITA<span className="font-serif italic font-light tracking-wide text-[#f59e1b] bg-clip-border">finance</span></h1>
                            <div className="flex items-center gap-1 w-fit">
                                <Sparkles className="h-3.5 w-3.5 text-white" />
                                <span className="text-xs font-bold text-white">Powered by Thetanuts V4</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="relative z-10 space-y-6">
                    <h2 className="text-4xl font-extrabold text-white leading-tight">
                        Hubungkan<br />
                        Wallet Kamu 🔗
                    </h2>
                    <p className="text-lg text-white/90 font-medium max-w-md">
                        Hubungkan wallet crypto kamu untuk mulai investasi, terima yield, dan akses fitur DeFi penuh.
                    </p>
                </div>

                {/* Benefits */}
                <div className="relative z-10 space-y-3">
                    {[
                        "Kontrol penuh aset kamu",
                        "Transaksi on-chain transparan",
                        "Terima profit USDC langsung"
                    ].map((benefit, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-hard-sm">
                                <CheckCircle2 className="h-5 w-5 text-[#FF9500]" />
                            </div>
                            <span className="text-white font-semibold">{benefit}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Panel - Action */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md bg-white rounded-3xl border-2 border-primary-100 p-8 shadow-xl text-center">
                    <div className="w-20 h-20 bg-orange-100 rounded-full mx-auto flex items-center justify-center mb-6">
                        <Wallet className="w-10 h-10 text-[#FF9500]" />
                    </div>

                    <h2 className="text-2xl font-black text-[#0A4A7C] mb-2">Connect Wallet</h2>
                    <p className="text-gray-500 mb-8">
                        Pilih wallet favoritmu untuk terhubung ke KITA Apps
                    </p>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold">
                            {error}
                        </div>
                    )}

                    {isConnected ? (
                        <div className="space-y-6">
                            <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                                <p className="text-sm text-green-700 font-bold mb-1">Wallet Terhubung!</p>
                                <p className="text-xs text-gray-500 font-mono break-all">{address}</p>
                            </div>

                            <Button
                                onClick={linkWallet}
                                disabled={isLinking}
                                className="w-full bg-[#0A4A7C] hover:bg-[#093c65] text-white py-4 rounded-xl font-bold shadow-lg"
                            >
                                {isLinking ? 'Menghubungkan...' : 'Lanjut ke Profiling'}
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <Button
                                onClick={handleConnectWallet}
                                className="w-full bg-[#FF9500] hover:bg-[#e68600] text-white py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2"
                            >
                                <Wallet className="w-5 h-5" />
                                Connect Wallet
                            </Button>
                            <p className="text-xs text-gray-400 mt-4">
                                Belum punya wallet? <a href="https://metamask.io/" target="_blank" className="text-[#0A4A7C] font-bold hover:underline">Download MetaMask</a>
                            </p>
                        </div>
                    )}

                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <button
                            onClick={() => router.push('/onboarding/profiling')}
                            className="text-gray-400 hover:text-gray-600 text-sm font-semibold hover:underline"
                        >
                            Lewati dulu (Nanti aja)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
