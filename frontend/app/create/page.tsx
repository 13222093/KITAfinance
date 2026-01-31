'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '../../components/Navbar';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { CONTRACTS } from '../../lib/config'; // Import alamat kontrak
import { KITA_VAULT_ABI } from '../../lib/abi';   // Import ABI (Kamus bahasa mesin)

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
        abi: KITA_VAULT_ABI,                  // ABI dari abi.ts
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
      <main className="relative min-h-screen bg-gradient-to-br from-[#0A4A7C] via-[#0A98FF] to-[#04877f] pt-32 px-4 pb-20">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(10,152,255,0.3),transparent_50%)] animate-pulse pointer-events-none" />

        {/* Floating orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-[#C15BFF] rounded-full blur-3xl opacity-20 animate-float" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#FBFF2B] rounded-full blur-3xl opacity-10 animate-float-delayed" />
        </div>

        <div className="relative z-10 max-w-xl mx-auto">

          <div className="mb-10 text-center">
            <h1 className="text-4xl font-black text-white drop-shadow-lg mb-3">Mulai Nabung Solo</h1>
            <p className="text-lg text-white/90 font-medium max-w-md mx-auto">
              Pilih aset, tentukan harga beli, dan dapatkan <span className="text-[#00FFF0] font-bold">cashback instan</span>.
            </p>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-4 border-white/50">

            {/* Input Aset (Static ETH) */}
            <div className="mb-8">
              <label className="block text-[#0A4A7C] font-bold text-sm mb-3">Aset yang mau dibeli</label>
              <div className="p-4 bg-gray-50 rounded-2xl border-2 border-gray-200 flex justify-between items-center group shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-2xl shadow-inner">💎</div>
                  <span className="font-bold text-lg text-gray-800">Ethereum (ETH)</span>
                </div>
                <div className="text-right">
                  <div className="text-[#00B4D8] text-sm font-bold">Rp 42.000.000</div>
                  <div className="text-xs text-gray-500 font-medium">Harga Pasar</div>
                </div>
              </div>
            </div>

            {/* Input Harga Target */}
            <div className="mb-8">
              <label className="block text-[#0A4A7C] font-bold text-sm mb-3">Mau beli di harga berapa? (Target)</label>
              <div className="relative group">
                <input
                  type="number"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  placeholder="Contoh: 38000000"
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl p-4 pl-4 pr-16 text-[#0A4A7C] text-xl font-bold focus:border-[#0A98FF] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#0A98FF]/10 transition-all placeholder:text-gray-300"
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 font-bold">IDRX</span>
              </div>
              <p className="text-xs text-gray-500 font-medium mt-2 ml-1">
                *Posisi tereksekusi otomatis jika harga ETH turun ke angka ini.
              </p>
            </div>

            {/* Input Modal */}
            <div className="mb-10">
              <label className="block text-[#0A4A7C] font-bold text-sm mb-3">Modal Nabung (Deposit)</label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Min. 1000000"
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl p-4 pl-4 pr-16 text-[#0A4A7C] text-xl font-bold focus:border-[#0A98FF] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#0A98FF]/10 transition-all placeholder:text-gray-300"
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 font-bold">IDRX</span>
              </div>
            </div>

            {/* Summary Box */}
            <div className="bg-gradient-to-br from-[#0A4A7C] to-[#0A98FF] rounded-2xl p-6 mb-8 relative overflow-hidden shadow-lg border border-white/20">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              <div className="flex justify-between items-end mb-2 relative z-10">
                <span className="text-blue-100 font-bold text-sm">Estimasi Cashback Instan</span>
                <span className="text-[#00FFF0] font-black text-3xl">Rp {estimatedCashback}</span>
              </div>
              <p className="text-xs text-blue-200 font-medium relative z-10">
                Langsung masuk wallet lo di depan (Upfront Yield).
              </p>
            </div>

            {/* Tombol Eksekusi Pintar */}
            <button
              onClick={handleExecute}
              disabled={isPending || isConfirming || !amount || !targetPrice}
              className={`w-full py-5 rounded-2xl font-black text-lg transition-all transform active:scale-[0.98] active:translate-y-1 border-b-4 border-black/10 active:border-b-0 ${!isConnected
                ? 'bg-red-500 text-white hover:bg-red-600 shadow-xl'
                : (isPending || isConfirming)
                  ? 'bg-gray-200 text-gray-400 cursor-wait'
                  : 'bg-gradient-to-r from-[#FFBC57] to-[#FF9500] text-white hover:shadow-[0_8px_0_0_#D97706] shadow-[0_6px_0_0_#D97706]'
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