'use client'

import WebApp from '@twa-dev/sdk'
import { useEffect, useState } from 'react'

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

// قائمة المستخدمين المحظورين بناءً على اسم المستخدم أو ID
const bannedUsers = [
  { id: 1, username: 'amineboss1' },
  { id: 2, username: '' },
  // يمكن إضافة المزيد من المستخدمين المحظورين هنا
];

// قائمة المسؤولين بناءً على اسم المستخدم والدور
const admins = [
  { name: 'Kharwaydo', role: 'Super Admin' },
  { name: 'amineboss1', role: 'Admin' },
  { name: 'Yrqr52', role: 'Admin' }
];

export default function Home() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (WebApp.initDataUnsafe.user) {
      console.log('User data loaded:', WebApp.initDataUnsafe.user);
      setUserData({
        ...WebApp.initDataUnsafe.user,
        balance: 5000,
      } as UserData);
    }
  }, []);

  // تحقق مما إذا كان المستخدم محظورًا بناءً على الـ username أو الـ ID
  const isBanned = userData && bannedUsers.some(user => user.username === (userData.username || '') || user.id === userData.id);

  // تحقق مما إذا كان المستخدم إداريًا بناءً على اسم المستخدم
  const isAdmin = userData && admins.some(admin => admin.name === (userData.username || ''));

  // تبديل حالة النافذة المنبثقة
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  if (isBanned) {
    // عرض الصفحة الخاصة بالمستخدمين المحظورين
    return (
      <main className="p-4 bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <img src="/icon8.png" alt="Banned Icon" className="mx-auto mb-4 w-32 h-32" />
          <div className="alert" role="alert" style={{ color: 'red', border: '1px solid red' }}>
            <h4 className="alert-heading">أنت محظور</h4>
            <p>لقد تم حظرك من الوصول إلى هذه الصفحة. إذا كنت تعتقد أن هذا حدث عن طريق الخطأ، الرجاء الاتصال بالمسؤول.</p>
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

      {isAdmin && (
        <div className="fixed top-4 right-4 cursor-pointer" onClick={toggleModal}>
          <img
            src="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/icons/tree.svg"
            alt="Settings"
            className="w-8 h-8"
            style={{ filter: 'invert(100%)', color: '#00BFFF' }}
          />
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full text-white">
            <h2 className="text-lg font-bold mb-4">Admin Panel Hex</h2>
            <div className="grid grid-cols-2 gap-4">
              <a
                href="https://t.me/wgoRSZPpeiphY2Jk"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center cursor-pointer"
              >
                <img
                  src="/icon2.png"
                  alt="Telegram"
                  className="w-16 h-16 rounded-full border-2 border-blue-500 shadow-lg mb-2"
                />
                <span>Telegram</span>
              </a>
              
              <div className="flex flex-col items-center cursor-pointer" onClick={toggleModal}>
                <img
                  src="/icon3.png"
                  alt="Admins List"
                  className="w-16 h-16 rounded-full border-2 border-green-500 shadow-lg mb-2"
                />
                <span>Admins</span>
              </div>
            </div>
            <button
              className="mt-4 w-full bg-red-500 hover:bg-red-700 text-white py-2 rounded"
              onClick={toggleModal}
            >
              اغلاق
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
