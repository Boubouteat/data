'use client'

import WebApp from '@twa-dev/sdk'
import { useEffect, useState } from 'react'
import './styles.css';

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isBanListModalOpen, setIsBanListModalOpen] = useState(false);
  const [message, setMessage] = useState(''); // لحفظ الرسالة المدخلة
  const [memberCount, setMemberCount] = useState(0); // لحفظ عدد الأعضاء

  useEffect(() => {
    if (WebApp.initDataUnsafe.user) {
      setUserData({
        ...WebApp.initDataUnsafe.user,
        balance: 5000,
      } as UserData);
    }
    fetchMemberCount(); // جلب عدد الأعضاء عند تحميل الصفحة
  }, []);

  const fetchMemberCount = async () => {
    try {
      const response = await fetch(`https://api.telegram.org/bot7409408890:AAFdKiBDzDnya3ZERrtcHHUZdRipMsy1uBs/getChatMembersCount?chat_id=-1002221437349`);
      const data = await response.json();
      setMemberCount(data.result); // تحديث عدد الأعضاء
    } catch (error) {
      console.error("Error fetching member count:", error);
    }
  };

  const sendMessageToChannel = async () => {
    if (!message) return; // التحقق من وجود رسالة

    try {
      const response = await fetch(`https://api.telegram.org/bot7409408890:AAFdKiBDzDnya3ZERrtcHHUZdRipMsy1uBs/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chat_id: '-1002221437349',
          text: message,
        }),
      });

      const data = await response.json();
      if (data.ok) {
        alert("Message sent successfully!");
        setMessage(''); // مسح صندوق الرسالة بعد الإرسال
      } else {
        alert("Failed to send message.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
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
            <h4 className="alert-heading">!تم حظرك</h4>
            <p>{currentUserBan?.reason}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="p-4 bg-gray-900 min-h-screen flex flex-col">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl text-white">مرحباً {userData?.first_name}</h1>
        <button className="text-white" onClick={toggleMenu}>☰</button>
      </header>

      <div className="flex-grow flex items-center justify-center">
        <div className="text-white">
          <h2>عدد الأعضاء: {memberCount}</h2>
          {isAdmin && (
            <div>
              <button onClick={toggleAdminModal} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
                إدارة
              </button>
            </div>
          )}
        </div>
      </div>

      {/* صندوق النص وزر الإرسال */}
      <div className="p-4">
        <input 
          type="text" 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
          className="border rounded p-2 w-full" 
          placeholder="اكتب رسالتك هنا..." 
        />
        <button 
          onClick={sendMessageToChannel} 
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2"
        >
          إرسال
        </button>
      </div>

      {/* القائمة المنسدلة */}
      {isMenuOpen && (
        <div className="absolute top-16 right-4 bg-gray-800 text-white rounded shadow-lg p-4">
          <h3 className="text-lg font-bold">القائمة</h3>
          <ul>
            <li onClick={toggleAdminModal} className="cursor-pointer">إدارة المستخدمين</li>
            <li onClick={toggleBanListModal} className="cursor-pointer">قائمة المحظورين</li>
            <li onClick={toggleMenu} className="cursor-pointer">إغلاق القائمة</li>
            <li className="cursor-pointer">🗣️ Speaker</li> {/* الأيقونة الجديدة */}
          </ul>
        </div>
      )}
      
      {/* نافذة إدارة المستخدمين */}
      {isAdminModalOpen && (
        <div className="modal">
          <h2>إدارة المستخدمين</h2>
          <button onClick={toggleAdminModal} className="close">إغلاق</button>
        </div>
      )}

      {/* نافذة قائمة المحظورين */}
      {isBanListModalOpen && (
        <div className="modal">
          <h2>قائمة المحظورين</h2>
          <ul>
            {bannedUsers.map(user => (
              <li key={user.id}>{user.username} - {user.reason}</li>
            ))}
          </ul>
          <button onClick={toggleBanListModal} className="close">إغلاق</button>
        </div>
      )}
    </main>
  );
}
