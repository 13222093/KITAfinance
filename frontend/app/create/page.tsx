'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '../../components/Navbar';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { CONTRACTS } from '../../lib/config'; // Import alamat kontrak
import { NUNGGU_ABI } from '../../lib/abi';   // Import ABI (Kamus bahasa mesin)

export default function CreatePosition() {
  // 1. Ambil data wallet user
  const { isConnected } = useAccount();

  // 2. Siapkan fungsi buat nulis ke Smart Contract
  const { data: hash, writeContract, isPending } = useWriteContract();

  // 3. Pantau status transaksi (Loading -> Sukses/Gagal)
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // State Input User
  const [targetPrice, setTargetPrice] = useState('');
  const [amount, setAmount] = useState('');

  // Simulasi hitung cashback (1.5% dari deposit)
  const estimatedCashback = amount ? (parseInt(amount) * 0.015).toLocaleString('id-ID') : '0';

  // --- LOGIC UTAMA: TOMBOL EKSEKUSI ---
  const handleExecute = async () => {
    if (!isConnected) {
      alert("Connect wallet dulu bos di pojok kanan atas!");
      return;
    }

    if (!amount || !targetPrice) {
      alert("Isi dulu modal dan harga targetnya!");
      return;
    }

    try {
      console.log("Mengirim transaksi ke Blockchain...");

      // Manggil Smart Contract
      writeContract({
        address: CONTRACTS.VAULT_ADDRESS, // Alamat Contract dari config.ts
        abi: NUNGGU_ABI,                  // ABI dari abi.ts
        functionName: 'createPosition',
        args: [
          parseEther(amount),             // Arg 1: Collateral (Jumlah Deposit)
          parseEther(targetPrice),        // Arg 2: Target Price (Strike)
          BigInt(7 * 24 * 60 * 60),       // Arg 3: Durasi (7 Hari dalam detik)
          false                           // Arg 4: Auto Roll (False dulu)
        ],
      });

    } catch (error) {
      console.error("Gagal transaksi:", error);
      alert("Transaksi batal atau error. Cek console.");
    }
  };

  // Efek samping kalau transaksi sukses (Reset form & Munculin Alert)
  useEffect(() => {
    if (isConfirmed) {
      alert(`🎉 Transaksi Berhasil! Hash: ${hash}\nPosisi lo udah aman.`);
      setAmount('');
      setTargetPrice('');
    }
  }, [isConfirmed, hash]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-dark-gray text-white pt-32 px-4 pb-20">
        <div className="max-w-xl mx-auto">

          <div className="mb-10 text-center">
            <h1 className="heading text-4xl mb-3 text-indigo">Mulai Nabung Solo</h1>
            <p className="body-text text-light-gray max-w-md mx-auto">
              Pilih aset, tentukan harga beli, dan dapatkan <span className="text-mint font-bold">cashback instan</span>.
            </p>
          </div>

          <div className="bg-light-gray/5 border border-light-gray/10 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm">

            {/* Input Aset (Static ETH) */}
            <div className="mb-8">
              <label className="block subheading text-sm mb-3 text-light-gray">Aset yang mau dibeli</label>
              <div className="p-4 bg-dark-gray/50 rounded-2xl border border-light-gray/20 flex justify-between items-center group cursor-not-allowed opacity-80">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo/20 flex items-center justify-center text-xl">💎</div>
                  <span className="font-bold text-lg">Ethereum (ETH)</span>
                </div>
                <div className="text-right">
                  <div className="text-mint text-sm font-bold">Rp 42.000.000</div>
                  <div className="text-xs text-light-gray">Harga Pasar</div>
                </div>
              </div>
            </div>

            {/* Input Harga Target */}
            <div className="mb-8">
              <label className="block subheading text-sm mb-3 text-light-gray">Mau beli di harga berapa? (Target)</label>
              <div className="relative group">
                <input
                  type="number"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  placeholder="Contoh: 38000000"
                  className="w-full bg-dark-gray/50 border border-light-gray/20 rounded-2xl p-4 pl-4 pr-16 text-white text-lg font-bold focus:border-indigo focus:ring-1 focus:ring-indigo focus:outline-none transition-all placeholder:text-light-gray/30"
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-light-gray font-semibold">IDRX</span>
              </div>
              <p className="text-xs text-light-gray mt-2 ml-1">
                *Posisi tereksekusi otomatis jika harga ETH turun ke angka ini.
              </p>
            </div>

            {/* Input Modal */}
            <div className="mb-10">
              <label className="block subheading text-sm mb-3 text-light-gray">Modal Nabung (Deposit)</label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Min. 1000000"
                  className="w-full bg-dark-gray/50 border border-light-gray/20 rounded-2xl p-4 pl-4 pr-16 text-white text-lg font-bold focus:border-indigo focus:ring-1 focus:ring-indigo focus:outline-none transition-all placeholder:text-light-gray/30"
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-light-gray font-semibold">IDRX</span>
              </div>
            </div>

            {/* Summary Box */}
            <div className="bg-gradient-to-r from-indigo/20 to-indigo/10 border border-indigo/30 rounded-2xl p-5 mb-8 relative overflow-hidden">
              <div className="flex justify-between items-end mb-2 relative z-10">
                <span className="text-indigo/80 font-semibold text-sm">Estimasi Cashback Instan</span>
                <span className="text-mint font-bold text-2xl">Rp {estimatedCashback}</span>
              </div>
              <p className="text-xs text-indigo/60 relative z-10">
                Langsung masuk wallet lo di depan (Upfront Yield).
              </p>
            </div>

            {/* Tombol Eksekusi Pintar */}
            <button
              onClick={handleExecute}
              disabled={isPending || isConfirming || !amount || !targetPrice}
              className={`w-full py-5 rounded-2xl font-bold text-lg transition-all transform active:scale-[0.98] ${
                !isConnected
                  ? 'bg-salmon text-white hover:bg-salmon/90'
                  : (isPending || isConfirming)
                    ? 'bg-light-gray/10 text-light-gray cursor-wait'
                    : 'bg-indigo hover:bg-indigo/90 text-white shadow-xl shadow-indigo/20'
              }`}
            >
              {!isConnected
                ? 'Connect Wallet Dulu'
                : (isPending || isConfirming)
                  ? 'Lagi Proses di Blockchain...'
                  : 'Pasang Posisi & Ambil Cashback'
              }
            </button>

          </div>
        </div>
      </main>
    </>
  );
}