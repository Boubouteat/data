'use client';

import WebApp from '@twa-dev/sdk';
import { useEffect, useState } from 'react';
import './styles.css'; // استيراد ملف CSS

// تعريف واجهة بيانات المستخدم
interface UserData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code: string;
  is_premium?: boolean;
  balance: number;
}

// قائمة المستخدمين المحظورين بناءً على اسم المستخدم أو ID مع سبب الحظر
const bannedUsers = [
  { id: 1, username: 'Yrqr52', reason: 'انت تحاول استخدام ادوات المسؤول بدون صلاحية' },
  { id: 2, username: 'amineboss1', reason: 'ماكش خدام هههه' },
  { id: 3, username: 'Sanji7zy', reason: 'test test test' },
  { id: 4, username: 'Seidmmf', reason: 'قرر النظام ان يڨوفينديك هههه' },
];

// قائمة المسؤولين بناءً على اسم المستخدم والدور
const admins = [
  { name: 'Kharwaydo', role: 'Super Admin' },
  { name: 'amineboss1', role: 'Admin' },
  { name: 'Yrqr52', role: 'Admin' },
];

export default function Home() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isBanListModalOpen, setIsBanListModalOpen] = useState(false);
  const [isFarming, setIsFarming] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (WebApp.initDataUnsafe.user) {
      console.log('User data loaded:', WebApp.initDataUnsafe.user);
      setUserData({
        ...WebApp.initDataUnsafe.user,
        balance: 5000,
      } as UserData);
    }
  }, []);

  const currentUserBan = userData && bannedUsers.find(user => user.username === (userData.username || '') || user.id === userData.id);
  const isBanned = currentUserBan !== undefined;
  const isAdmin = userData && admins.some(admin => admin.name === (userData.username || ''));

  const toggleAdminModal = () => {
    setIsAdminModalOpen(!isAdminModalOpen);
  };

  const toggleBanListModal = () => {
    setIsBanListModalOpen(!isBanListModalOpen);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const startFarming = () => {
    setIsFarming(true);
    setTimeLeft(7 * 60 * 60); // 7 ساعات بالثواني
    const id = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(id);
          setIsFarming(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setIntervalId(id);
  };

  const claimPoints = () => {
    if (userData) {
      setUserData({ ...userData, balance: userData.balance + 50 }); // إضافة 50 نقطة
      setIsFarming(false);
      setTimeLeft(0);
      if (intervalId) {
        clearInterval(intervalId); // إيقاف العد التنازلي
        setIntervalId(null);
      }
    }
  };

  if (isBanned) {
    return (
      <main className="p-4 bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <img src="/icon8.png" alt="Banned Icon" className="mx-auto mb-4 w-32 h-32" />
          <div className="alert" role="alert" style={{ color: 'white', border: '1px solid white' }}>
            <h4 className="alert-heading">!لقد تم حظرك</h4>
            <p style={{ color: 'yellow' }}>سبب: {currentUserBan?.reason}</p>
            <p>للتواصل مع المسؤول، <a href="https://t.me/bndusrhx_bot" target="_blank" className="text-blue-500"> هنا</a>.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="p-4 bg-gray-900 min-h-screen">
      {userData ? (
        <div className="flex items-center space-x-4 absolute top-4 left-4 bg-black rounded-lg p-4 shadow-xl border border-gray-700">
          <img
            src={isAdmin ? '/icon1.png' : '/icon.png'}
            alt="User Avatar"
            className="w-16 h-16 rounded-full border-2 border-green-500 shadow-lg"
          />
          <div className="text-white">
            <h1 className="text-lg font-bold flex items-center">
              {userData.first_name} {userData.last_name || ''}
              {isAdmin && (
                <span className="ml-2 px-2 py-1 bg-green-500 text-white text-sm rounded">
                  admin
                </span>
              )}
            </h1>
            <div className="flex items-center mt-2">
              <img
                src="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/icons/wallet2.svg" 
                alt="Wallet Icon"
                className="w-6 h-6 mr-2"
                style={{ filter: 'invert(100%)' }}
              />
              <span className="text-lg font-bold">{userData.balance} points</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-white">Loading...</div>
      )}

      {/* زر بدء الزراعة */}
      <div className="flex flex-col items-center mt-16">
        <img
          src="/farming.gif" // استبدل بمسار الصورة المتحركة
          alt="Farming GIF"
          className={`w-64 h-64 mb-4 ${isFarming ? 'animate' : ''}`}
          style={{ display: isFarming ? 'block' : 'none' }}
        />
        {!isFarming ? (
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={startFarming}
          >
            Start Farming
          </button>
        ) : (
          <div className="text-white">
            <p>وقت الزراعة المتبقي: {Math.floor(timeLeft / 3600)}:{Math.floor((timeLeft % 3600) / 60).toString().padStart(2, '0')}:{(timeLeft % 60).toString().padStart(2, '0')}</p>
            {timeLeft <= 0 && (
              <button
                className="bg-green-500 text-white px-4 py-2 rounded mt-2"
                onClick={claimPoints}
              >
                Claim
              </button>
            )}
          </div>
        )}
      </div>

      {/* Menu Icon (تظهر فقط للمسؤولين) */}
      {isAdmin && (
        <div className="fixed top-4 right-4 space-x-2 flex">
          <div className="cursor-pointer" onClick={toggleMenu}>
            <img
              src="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/icons/gear.svg"
              alt="Settings"
              className="w-8 h-8"
              style={{ filter: 'invert(100%)' }}
            />
          </div>
        </div>
      )}

      {/* Menu */}
      {isMenuOpen && (
        <div className="fixed top-12 right-4 bg-gray-500 p-4 rounded-lg shadow-lg text-white">
          <ul className="space-y-4">
            <li className="cursor-pointer" onClick={toggleAdminModal}>
              <img
                src="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/icons/tree.svg"
                alt="Admin List"
                className="w-6 h-6 mr-2 inline"
              />
              Admin List
            </li>
            <li className="cursor-pointer" onClick={toggleBanListModal}>
              <img
                src="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/icons/person-x.svg"
                alt="Ban List"
                className="w-6 h-6 mr-2 inline"
              />
              Banned List
            </li>
            <li className="cursor-pointer">
              <a href="https://t.me/your_channel" target="_blank">
                <img
                  src="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/icons/chat-left-dots.svg"
                  alt="Chat"
                  className="w-6 h-6 mr-2 inline"
                />
                Contact Support
              </a>
            </li>
          </ul>
        </div>
      )}

      {/* Admin Modal */}
      {isAdminModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-2">Admin List</h2>
            <ul>
              {admins.map((admin, index) => (
                <li key={index} className="py-2">
                  {admin.name} - {admin.role}
                </li>
              ))}
            </ul>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded mt-4"
              onClick={toggleAdminModal}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Ban List Modal */}
      {isBanListModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-2">Banned Users</h2>
            <ul>
              {bannedUsers.map((bannedUser, index) => (
                <li key={index} className="py-2">
                  {bannedUser.username} - {bannedUser.reason}
                </li>
              ))}
            </ul>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded mt-4"
              onClick={toggleBanListModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
