'use client';

import { Navbar } from '@/components/Navbar';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChatBot } from '@/components/ChatBot';

export default function Profile() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  useEffect(() => {
    const data = localStorage.getItem('userData');
    if (data) {
      const user = JSON.parse(data);
      setUserData(user);
      setEditedName(user.fullName);
      setProfilePhoto(user.profilePhoto || null);
    } else {
      router.push('/login');
    }
    setIsLoading(false);
  }, [router]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveEdit = () => {
    if (userData) {
      const updatedUser = { ...userData, fullName: editedName, profilePhoto };
      setUserData(updatedUser);
      localStorage.setItem('userData', JSON.stringify(updatedUser));
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedName(userData.fullName);
    setProfilePhoto(userData.profilePhoto || null);
    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('phoneNumber');
    localStorage.removeItem('userProfiling');
    setShowLogoutModal(false);
    router.push('/');
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 pt-24 px-4 flex items-center justify-center">
          <div className="text-gray-600 text-lg">Loading...</div>
        </div>
      </>
    );
  }

  if (!userData) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-24 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 mt-8">
            <h1 className="text-ultra-heading text-white mb-1">Profil</h1>
            <p className="text-body text-slate-300">Kelola informasi profil dan akunmu</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Section */}
            <div className="lg:col-span-2 space-y-8">
              {/* Profile Picture & Basic Info */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
                <div className="flex items-start justify-between mb-6">
                  <h2 className="text-subheading text-white">Informasi Profil</h2>
                  {!isEditing ? (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="text-blue-400 hover:text-blue-300 text-body hover:underline"
                    >
                      Edit
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button 
                        onClick={handleCancelEdit}
                        className="text-slate-400 hover:text-slate-300 text-body"
                      >
                        Batal
                      </button>
                      <button 
                        onClick={handleSaveEdit}
                        className="text-blue-400 hover:text-blue-300 text-body"
                      >
                        Simpan
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-6 mb-8">
                  <div className="relative">
                    {profilePhoto ? (
                      <img 
                        src={profilePhoto} 
                        alt="Profile" 
                        className="w-20 h-20 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-3xl">👤</span>
                      </div>
                    )}
                    {isEditing && (
                      <>
                        <input
                          type="file"
                          id="photo-upload"
                          accept="image/*"
                          onChange={handlePhotoChange}
                          className="hidden"
                        />
                        <button 
                          onClick={() => document.getElementById('photo-upload')?.click()}
                          className="absolute bottom-0 right-0 w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                        >
                          <span className="text-xs">📷</span>
                        </button>
                      </>
                    )}
                  </div>
                  <div className="flex-1">
                    {!isEditing ? (
                      <>
                        <h3 className="text-subheading text-white">{userData.fullName}</h3>
                        <p className="text-body text-slate-400">@{userData.username}</p>
                      </>
                    ) : (
                      <>
                        <input
                          type="text"
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                          className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white text-subheading mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Nama Lengkap"
                        />
                        <p className="text-body text-slate-400">@{userData.username}</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between py-3 border-b border-slate-700/30">
                    <span className="text-body text-slate-400">Nama Lengkap</span>
                    <span className="text-body text-white">{isEditing ? editedName : userData.fullName}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-slate-700/30">
                    <span className="text-body text-slate-400">Email</span>
                    <span className="text-body text-white">{userData.email}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-slate-700/30">
                    <span className="text-body text-slate-400">Nomor Telepon</span>
                    <span className="text-body text-white">{userData.phoneNumber}</span>
                  </div>
                  <div className="flex justify-between py-3">
                    <span className="text-body text-slate-400">Bergabung Sejak</span>
                    <span className="text-body text-white">
                      {new Date(userData.createdAt).toLocaleDateString('id-ID', { 
                        day: 'numeric',
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Account Actions */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
                <h2 className="text-subheading text-white mb-4">Aksi Akun</h2>
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-red-900/30 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-body text-red-400">Keluar</span>
                  </div>
                  <span className="text-red-400">→</span>
                </button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-white">
                <h3 className="text-body mb-4 opacity-90">Status Akun</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs opacity-75">Total Investasi</p>
                    <p className="text-heading">Rp 0</p>
                  </div>
                  <div>
                    <p className="text-xs opacity-75">Return</p>
                    <p className="text-subheading">+0%</p>
                  </div>
                </div>
              </div>

              {/* Help Card */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full mx-auto flex items-center justify-center mb-3">
                    <span className="text-2xl">💬</span>
                  </div>
                  <h3 className="text-subheading text-white mb-2">Butuh Bantuan?</h3>
                  <p className="text-body text-slate-400 mb-4">Tim support kami siap membantu kamu</p>
                  <button className="text-button w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 rounded-lg hover:shadow-lg transition-all">
                    Hubungi Support
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-dark-gray/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-slate-800 rounded-2xl p-6 max-w-sm w-full border border-slate-700/50">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-500/20 rounded-full mx-auto flex items-center justify-center mb-4">
                <span className="text-4xl">🚪</span>
              </div>
              <h3 className="text-heading text-white mb-2">Keluar dari Akun?</h3>
              <p className="text-body text-slate-400">
                Kamu akan keluar dari akun ini. Data kamu akan tetap tersimpan dan bisa login kembali kapan saja.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="text-button flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleLogout}
                className="text-button flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}
      <ChatBot />
    </>
  );
}
