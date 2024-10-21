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
const admins = ['Kharwaydo', 'amineboss1', 'borhane_username']; // تأكد من إضافة اسم المستخدم الفعلي هنا

export default function Home() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false); // حالة فتح/إغلاق النافذة المنبثقة

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

  return (
    <main className="p-4 bg-gray-900 min-h-screen">
      {userData ? (
        <div className="flex items-center space-x-4 absolute top-4 left-4 bg-black rounded-lg p-4 shadow-xl border border-gray-700">
          <img
            src={isAdmin ? '/icon1.png' : '/icon.png'} // استخدم icon1.png إذا كان المستخدم مشرفًا، وإلا استخدم icon.png
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
            src="/gear-icon.png" // صورة المسننة
            alt="Settings"
            className="w-8 h-8"
          />
        </div>
      )}

      {/* Admins modal with grid layout for admin bubbles */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full text-white">
            <h2 className="text-lg font-bold mb-4">قائمة المسؤولين</h2>
            <div className="grid grid-cols-2 gap-4"> {/* Grid layout for admin bubbles */}
              {admins.map((admin) => (
                <div key={admin} className="flex flex-col items-center">
                  <img
                    src="/icon2.png" // صورة الفقاعة
                    alt={`${admin} Avatar`}
                    className="w-16 h-16 rounded-full border-2 border-blue-500 shadow-lg mb-2"
                  />
                  <span>{admin}</span>
                  <span
                    className={`px-2 py-1 text-sm rounded ${
                      admin === 'Kharwaydo' ? 'bg-purple-500' : 'bg-green-500'
                    }`}
                  >
                    {admin === 'Kharwaydo' ? 'super admin' : 'admin'}
                  </span>
                </div>
              ))}
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
  )
}
