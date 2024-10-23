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
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false); // لحالة مودال الرسالة
  const [memberCount, setMemberCount] = useState<number | null>(null); // لحفظ عدد الأعضاء
  const [message, setMessage] = useState<string>(''); // لحفظ الرسالة

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

  const toggleMessageModal = () => {
    setIsMessageModalOpen(!isMessageModalOpen);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // وظيفة لجلب عدد الأعضاء من القناة
  const getChannelMembersCount = async () => {
    try {
      const response = await fetch(`https://api.telegram.org/botYOUR_BOT_TOKEN/getChatMembersCount?chat_id=-1002221437349`);
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
    // عرض عدد الأعضاء في نافذة حوار بدلاً من تنبيه
    alert(`عدد الأعضاء في القناة: ${count}`);
  };

  const sendMessageToChannel = async () => {
    if (!message) return; // تحقق من أن الرسالة ليست فارغة
    try {
      const response = await fetch(`https://api.telegram.org/botYOUR_BOT_TOKEN/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: '-1002221437349', // معرف القناة
          text: message,
        }),
      });
      const data = await response.json();
      if (data.ok) {
        alert('تم إرسال الرسالة بنجاح!');
      } else {
        alert('فشل إرسال الرسالة!');
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert('حدث خطأ أثناء إرسال الرسالة!');
    } finally {
      setMessage(''); // إعادة تعيين الرسالة
      toggleMessageModal(); // إغلاق المودال
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
                src="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/icons/x-circle.svg"
                alt="Banned List"
                className="w-6 h-6 mr-2 inline"
              />
              Banned List
            </li>
            <li className="cursor-pointer" onClick={handleMemberCountClick}>
              <img
                src="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/icons/people.svg"
                alt="Member Count"
                className="w-6 h-6 mr-2 inline"
              />
              Member Count
            </li>
            <li className="cursor-pointer" onClick={toggleMessageModal}>
              <img
                src="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/icons/chat.svg"
                alt="Send Message"
                className="w-6 h-6 mr-2 inline"
              />
              msg
            </li>
          </ul>
        </div>
      )}

      {/* نافذة حوار قائمة المسؤولين */}
      {isAdminModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white">
            <h2 className="text-xl mb-4">قائمة المسؤولين</h2>
            <ul>
              {admins.map(admin => (
                <li key={admin.name} className="flex justify-between mb-2">
                  <span>{admin.name}</span>
                  <span>{admin.role}</span>
                </li>
              ))}
            </ul>
            <button className="mt-4 bg-red-500 px-4 py-2 rounded" onClick={toggleAdminModal}>
              إغلاق
            </button>
          </div>
        </div>
      )}

      {/* نافذة حوار قائمة المحظورين */}
      {isBanListModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white">
            <h2 className="text-xl mb-4">قائمة المحظورين</h2>
            <ul>
              {bannedUsers.map(user => (
                <li key={user.username} className="flex justify-between mb-2">
                  <span>{user.username}</span>
                  <span>{user.reason}</span>
                </li>
              ))}
            </ul>
            <button className="mt-4 bg-red-500 px-4 py-2 rounded" onClick={toggleBanListModal}>
              إغلاق
            </button>
          </div>
        </div>
      )}

      {/* نافذة حوار لإرسال الرسالة */}
      {isMessageModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white">
            <h2 className="text-xl mb-4">أرسل رسالة إلى القناة</h2>
            <textarea
              className="w-full h-24 p-2 rounded mb-4 bg-gray-700 text-white"
              placeholder="اكتب رسالتك هنا..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div className="flex justify-between">
              <button className="bg-green-500 px-4 py-2 rounded" onClick={sendMessageToChannel}>
                إرسال
              </button>
              <button className="bg-red-500 px-4 py-2 rounded" onClick={toggleMessageModal}>
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* نافذة حوار عدد الأعضاء */}
      {memberCount !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white">
            <h2 className="text-xl mb-4">عدد الأعضاء في القناة</h2>
            <p className="text-lg">{memberCount} أعضاء</p>
            <button className="mt-4 bg-red-500 px-4 py-2 rounded" onClick={() => setMemberCount(null)}>
              إغلاق
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
