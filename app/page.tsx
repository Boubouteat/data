'use client'

import WebApp from '@twa-dev/sdk'
import { useEffect, useState } from 'react'

// Define the interface for user data
interface UserData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code: string;
  is_premium?: boolean;
}

// List of admins based on their username
const admins = ['Kharwaydo', 'amineboss1', 'borhane_username'];

export default function Home() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false); // حالة فتح/إغلاق النافذة المنبثقة
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false); // حالة فتح قائمة المسؤولين

  useEffect(() => {
    if (WebApp.initDataUnsafe.user) {
      console.log('User data loaded:', WebApp.initDataUnsafe.user);
      setUserData(WebApp.initDataUnsafe.user as UserData);
    }
  }, [])

  // Check if the user is an admin based on username
  const isAdmin = userData && admins.includes(userData.username || '');

  console.log('Is Admin:', isAdmin); // سجل ما إذا كان المستخدم مشرفًا

  // Toggle the modal open/close state
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Toggle the admin list modal
  const toggleAdminModal = () => {
    setIsAdminModalOpen(!isAdminModalOpen);
  };

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
          </div>
        </div>
      ) : (
        <div className="text-white">Loading...</div>
      )}

      {/* Show the gear icon for admin users */}
      {isAdmin && (
        <div className="fixed top-4 right-4 cursor-pointer" onClick={toggleModal}>
          <img
            src="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/icons/gear-fill.svg" // أيقونة المسننة من Bootstrap
            alt="Settings"
            className="w-8 h-8"
            style={{ color: '#FFCC00' }} // لون المسننة الواضح (ذهبي أو أصفر)
          />
        </div>
      )}

      {/* Admins modal with Telegram and Admin List options */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full text-white">
            <h2 className="text-lg font-bold mb-4">خيارات المسؤول</h2>
            <div className="grid grid-cols-2 gap-4"> {/* Grid layout for bubbles */}
              {/* فقاعة تنقلني إلى Telegram */}
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
              
              {/* فقاعة تعرض قائمة المسؤولين */}
              <div
                className="flex flex-col items-center cursor-pointer"
                onClick={toggleAdminModal} // عرض قائمة المسؤولين عند النقر
              >
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

      {/* Admins List modal */}
      {isAdminModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-lg font-bold mb-4">قائمة المسؤولين</h2>
            <ul className="list-group">
              {admins.map((admin, index) => (
                <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                  {admin}
                  <span className={`badge ${admin === 'Kharwaydo' ? 'bg-purple-500' : 'bg-success'}`}>
                    {admin === 'Kharwaydo' ? 'Super Admin' : 'Admin'}
                  </span>
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
    </main>
  )
}
