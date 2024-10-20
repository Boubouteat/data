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

export default function Home() {
  const [userData, setUserData] = useState<UserData | null>(null)

  useEffect(() => {
    if (WebApp.initDataUnsafe.user) {
      setUserData(WebApp.initDataUnsafe.user as UserData)
    }
  }, [])

  return (
    <main className="p-4">
      {userData ? (
        <div className="flex items-center space-x-4 absolute top-4 left-4">
          {userData.photo_url && (
            <img
              src={userData.photo_url}
              alt="User Avatar"
              className="w-16 h-16 rounded-full border-2 border-white shadow-lg"
            />
          )}
          <div className="text-white">
            <h1 className="text-xl font-bold">
              {userData.first_name} {userData.last_name || ''}
            </h1>
          </div>
        </div>
      ) : (
        <div className="text-white">Loading...</div>
      )}
    </main>
  )
}
