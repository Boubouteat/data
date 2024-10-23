'use client'

import WebApp from '@twa-dev/sdk'
import { useEffect, useState } from 'react'
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
  { id: 3, username: 'Sanji7zy' , reason: 'test test test' },
  { id: 4, username: 'Seidmmf' , reason: 'قرر النظام ان يڨوفينديك هههه' },
];

// قائمة المسؤولين بناءً على اسم المستخدم والدور
const admins = [
  { name: 'Kharwaydo', role: 'Super Admin' },
  { name: 'amineboss1', role: 'Admin' },
  { name: 'Yrqr52', role: 'Admin' }
];

export default function Home() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // لحالة القائمة
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isBanListModalOpen, setIsBanListModalOpen] = useState(false);
  
  // حالات الزراعة
  const [isFarming, setIsFarming] = useState(false);
  const [farmingTime, setFarmingTime] = useState(0); // الوقت المتبقي
  const [intervalId, setIntervalId] = useState<number | null>(null); // لحفظ معرف المؤقت

  useEffect(() => {
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setUserData(parsedData);
    } else if (WebApp.initDataUnsafe.user) {
      console.log('User data loaded:', WebApp.initDataUnsafe.user);
      const initialUserData = {
        ...WebApp.initDataUnsafe.user,
        balance: 5000,
      } as UserData;
      setUserData(initialUserData);
      localStorage.setItem('userData', JSON.stringify(initialUserData));
    }

    // استرجاع حالة الزراعة من localStorage
    const farmingData = localStorage.getItem('farmingData');
    if (farmingData) {
      const { isFarming, farmingTime } = JSON.parse(farmingData);
      setIsFarming(isFarming);
      setFarmingTime(farmingTime);
    }
  }, []);

  useEffect(() => {
    // إعداد عداد الوقت
    if (isFarming && farmingTime > 0) {
      const id = setInterval(() => {
        setFarmingTime(prev => {
          if (prev <= 1) {
            clearInterval(id);
            setIsFarming(false);
            setFarmingTime(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setIntervalId(id);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isFarming, farmingTime]);

  const startFarming = () => {
    setIsFarming(true);
    setFarmingTime(7 * 60 * 60); // 7 ساعات
    localStorage.setItem('farmingData', JSON.stringify({ isFarming: true, farmingTime: 7 * 60 * 60 }));
  };

  const claimPoints = () => {
    if (userData) {
      const updatedBalance = userData.balance + 50;
      setUserData({ ...userData, balance: updatedBalance });
      localStorage.setItem('userData', JSON.stringify({ ...userData, balance: updatedBalance }));
      setIsFarming(false);
      setFarmingTime(0);
      localStorage.removeItem('farmingData'); // مسح بيانات الزراعة بعد المطالبة
    }
  };

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
    <main className="p-4 bg-gray-900 min-h-screen flex flex-col items-center justify-center">
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
          </ul>
        </div>
      )}

      {/* زر البدء في الزراعة */}
      <div className="flex flex-col items-center mt-8">
        <img
          src="/farming.gif" // إضافة صورة متحركة هنا
          alt="Farming Animation"
          className="w-64 h-64"
        />
        {!isFarming ? (
          <button
            className="bg-green-500 text-white py-2 px-4 rounded-lg mt-4 hover:bg-green-600"
            onClick={startFarming}
          >
            Start Farming
          </button>
        ) : (
          <div className="mt-4 text-white">
            <p>Farming Time Remaining: {Math.floor(farmingTime / 3600)}:{Math.floor((farmingTime % 3600) / 60).toString().padStart(2, '0')}:{(farmingTime % 60).toString().padStart(2, '0')}</p>
            {farmingTime === 0 && (
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded-lg mt-4 hover:bg-blue-600"
                onClick={claimPoints}
              >
                Claim 50 Points
              </button>
            )}
          </div>
        )}
      </div>

      {/* نافذة قائمة الحظر */}
      {isBanListModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 text-black shadow-lg">
            <h2 className="text-xl font-bold mb-4">Banned Users</h2>
            <ul>
              {bannedUsers.map(user => (
                <li key={user.id} className="mb-2">
                  {user.username}: {user.reason}
                </li>
              ))}
            </ul>
            <button
              className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
              onClick={toggleBanListModal}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* نافذة قائمة المسؤولين */}
      {isAdminModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 text-black shadow-lg">
            <h2 className="text-xl font-bold mb-4">Admin List</h2>
            <ul>
              {admins.map(admin => (
                <li key={admin.name} className="mb-2">
                  {admin.name} - {admin.role}
                </li>
              ))}
            </ul>
            <button
              className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
              onClick={toggleAdminModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
