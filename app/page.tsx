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
  { id: 4, username: 'Seidmmf' , reason: 'قرر النظام ان يڡوفينديك هههه' },
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
  const [memberCount, setMemberCount] = useState<number | null>(null); // لحفظ عدد الأعضاء

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

  // وظيفة لجلب عدد الأعضاء من القناة
  const getChannelMembersCount = async () => {
    try {
      const response = await fetch(`https://api.telegram.org/bot<7409408890:AAFdKiBDzDnya3ZERrtcHHUZdRipMsy1uBs>/getChatMembersCount?chat_id=-1002221437349`);
      const data = await response.json();
      return data.result; // عدد الأعضاء
    } catch (error) {
      console.error("Error fetching member count:", error);
      return 0; // قيمة افتراضية في حال حدوث خطأ
    }
  };

  const handleMemberCountClick = async () => {
    const count = await getChannelMembersCount();
    setMemberCount(count);
    alert(`عدد الأعضاء في القناة: ${count}`);
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
            <li className="cursor-pointer" onClick={handleMemberCountClick}>
              <img
                src="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/icons/person-lines-fill.svg"
                alt="Member Count"
                className="w-6 h-6 mr-2 inline"
              />
              عدد الأعضاء
            </li>
            <li className="cursor-pointer">
              <a href="https://t.me/your_channel" target="_blank">
                <img
                  src="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/icons/telegram.svg"
                  alt="Telegram"
                  className="w-6 h-6 mr-2 inline"
                />
                Telegram
              </a>
            </li>
          </ul>
        </div>
      )}

      {/* Admin Modal */}
      {isAdminModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full text-white">
            <h2 className="text-lg font-bold mb-4">Admins List</h2>
            <ul>
              {admins.map((admin, index) => (
                <li key={index} className="mb-2">
                  {admin.name} - {admin.role}
                </li>
              ))}
            </ul>
            <button
              className="mt-4 w-full bg-red-500 hover:bg-red-700 text-white py-2 rounded"
              onClick={toggleAdminModal}
            >
              اغلاق
            </button>
          </div>
        </div>
      )}

      {/* Ban List Modal */}
      {isBanListModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full text-white">
            <h2 className="text-lg font-bold mb-4">Banned Users List</h2>
            <ul>
              {bannedUsers.map((bannedUser, index) => (
                <li key={index} className="mb-2">
                  {bannedUser.username} - سبب: {bannedUser.reason}
                </li>
              ))}
            </ul>
            <button
              className="mt-4 w-full bg-red-500 hover:bg-red-700 text-white py-2 rounded"
              onClick={toggleBanListModal}
            >
              اغلاق
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
