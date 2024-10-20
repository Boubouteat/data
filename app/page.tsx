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

export default function Home() {
  const [userData, setUserData] = useState<UserData | null>(null)

  useEffect(() => {
    if (WebApp.initDataUnsafe.user) {
      setUserData(WebApp.initDataUnsafe.user as UserData)
    }
  }, [])

  return (
    <main className="p-4 bg-black rounded-lg shadow-xl">
      {userData ? (
        <div className="flex items-center space-x-4">
          <img
            src={userData.username === 'Kharwaydo' ? '/admin.png' : '/icon.png'}
            alt="User Avatar"
            className="w-16 h-16 rounded-full border-2 border-green-500 shadow-lg transition hover:shadow-lg"
          />
          <div>
            <h1 className="text-xl font-bold text-white">User Data</h1>
            <p className="text-sm text-green-500">
              {userData.first_name} {userData.last_name || ''}
              {userData.username === 'Kharwaydo' && (
                <span className="bg-green-500 text-white rounded px-1 text-xs ml-2">Admin</span>
              )}
            </p>
          </div>
        </div>
      ) : (
        <div className="text-white">Loading...</div>
      )}
    </main>
  )
}
