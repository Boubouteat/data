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

  useEffect(() => {
    if (WebApp.initDataUnsafe.user) {
      console.log('User data loaded:', WebApp.initDataUnsafe.user);
      setUserData(WebApp.initDataUnsafe.user as UserData);
    }
  }, [])

  // Check if the user is an admin based on username
  const isAdmin = userData && admins.includes(userData.username || '');

  console.log('Is Admin:', isAdmin); // سجل ما إذا كان المستخدم مشرفًا

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

      {/* Show bubble image for admin users */}
      {isAdmin && (
        <a href="https://t.me/wgoRSZPpeiphY2Jk" target="_blank" rel="noopener noreferrer">
          <img
            src="/icon2.png"
            alt="Telegram Channel"
            className="fixed bottom-4 right-4 w-16 h-16 rounded-full border-2 border-green-500 shadow-lg cursor-pointer"
          />
        </a>
      )}
    </main>
  )
}
