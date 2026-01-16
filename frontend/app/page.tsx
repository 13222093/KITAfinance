import Link from 'next/link';
import { Navbar } from '@/components/Navbar';

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-dark-gray">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-6xl md:text-7xl font-bold mb-6">
              <span className="text-indigo">KITA</span>
            </h1>
            <p className="subheading text-light-gray mb-8 max-w-2xl mx-auto">
              Turn your idle IDRX stablecoins into passive income with DeFi options strategies. 
              Get instant cashback and earn APY while waiting for the perfect price.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/create"
                className="px-8 py-4 bg-indigo hover:bg-indigo/80 text-white btn-text rounded-lg transition-colors shadow-lg"
              >
                Get Started
              </Link>
              <Link
                href="/dashboard"
                className="px-8 py-4 bg-light-gray/20 hover:bg-light-gray/30 text-white btn-text rounded-lg transition-colors border-2 border-light-gray/30"
              >
                View Dashboard
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-dark-gray/50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="heading text-center mb-12 text-white">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 bg-light-gray/10 rounded-xl shadow-lg border border-light-gray/20">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="subheading mb-3 text-white">Deposit IDRX</h3>
                <p className="body-text text-light-gray">
                  Deposit your idle IDRX stablecoins and set your target ETH price
                </p>
              </div>

              <div className="p-6 bg-light-gray/10 rounded-xl shadow-lg border border-light-gray/20">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="subheading mb-3 text-white">Instant Cashback</h3>
                <p className="body-text text-light-gray">
                  Receive premium (cashback) immediately to your wallet
                </p>
              </div>

              <div className="p-6 bg-light-gray/10 rounded-xl shadow-lg border border-light-gray/20">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="subheading mb-3 text-white">Buy at Target</h3>
                <p className="body-text text-light-gray">
                  When price hits your target, option executes and you buy ETH
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-dark-gray">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="heading text-center mb-12 text-white">Why Choose Us?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex gap-4">
                <div className="text-2xl">✅</div>
                <div>
                  <h3 className="subheading mb-2 text-white">Passive Income</h3>
                  <p className="body-text text-light-gray">
                    Earn APY on stablecoins instead of letting them sit idle
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="text-2xl">✅</div>
                <div>
                  <h3 className="subheading mb-2 text-white">Smart Pricing</h3>
                  <p className="body-text text-light-gray">
                    Set your target price and buy crypto when it's right for you
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="text-2xl">✅</div>
                <div>
                  <h3 className="subheading mb-2 text-white">Auto-Roll</h3>
                  <p className="body-text text-light-gray">
                    Automatically renew positions to keep earning without manual work
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="text-2xl">✅</div>
                <div>
                  <h3 className="subheading mb-2 text-white">Base Network</h3>
                  <p className="body-text text-light-gray">
                    Low fees, fast transactions, and secure infrastructure
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-light-gray/10 py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="heading text-white mb-6">
              Ready to Start Earning?
            </h2>
            <p className="subheading text-white/80 mb-8">
              Connect your wallet and create your first position in minutes
            </p>
            <Link
              href="/create"
              className="inline-block px-8 py-4 bg-white text-indigo hover:bg-white/90 btn-text rounded-lg transition-colors shadow-lg"
            >
              Create Position Now
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-light-gray/20 py-8 bg-dark-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="body-text text-light-gray">© 2026 KITA. Built on Base Network.</p>
        </div>
      </footer>
    </>
  );
}
