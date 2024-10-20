'use client'

import WebApp from '@twa-dev/sdk'
import { useEffect, useState } from 'react'

// Define the interface for user data
interface UserData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  language_code: string;
  is_premium?: boolean;
}

// Define the list of users
const users = [
  { name: 'Borhane', role: 'admin' },
  { name: 'User1', role: 'user' },
  { name: 'User2', role: 'user' },
  { name: 'User3', role: 'user' },
  { name: 'Shaib', role: 'admin' }
];

export default function Home() {
  const [userData, setUserData] = useState<UserData | null>(null)

  useEffect(() => {
    if (WebApp.initDataUnsafe.user) {
      setUserData(WebApp.initDataUnsafe.user as UserData)
    }
  }, [])

  return (
    <main className="p-4 bg-gray-900 min-h-screen">
      {userData ? (
        <div className="flex items-center space-x-4 absolute top-4 left-4 bg-black rounded-lg p-4 shadow-xl border border-gray-700">
          {userData.photo_url ? (
            <img
              src={userData.photo_url}
              alt="User Avatar"
              className="w-16 h-16 rounded-full border-2 border-green-500 shadow-lg"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center text-white">
              N/A
            </div>
          )}
          <div className="text-green-500">
            <h1 className="text-2xl font-bold">
              {userData.first_name} {userData.last_name || ''}
            </h1>
          </div>
        </div>
      ) : (
        <div className="text-white">Loading...</div>
      )}

      {/* قائمة المستخدمين */}
      <section className="mt-24 p-4">
        <h2 className="text-white text-xl font-bold mb-4">User List</h2>
        <ul className="bg-gray-800 p-4 rounded-lg shadow-lg">
          {users.map((user, index) => (
            <li key={index} className="flex justify-between items-center mb-2">
              <span className="text-white text-lg">{user.name}</span>
              {user.role === 'admin' && (
                <span className="text-green-400 text-sm font-bold">admin</span>
              )}
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
