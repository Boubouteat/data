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
    <main className="p-4 flex justify-center items-center min-h-screen bg-gray-900">
      {userData ? (
        <>
          <div className="text-white text-center">
            <h1 className="text-4xl font-bold">
              {userData.first_name} {userData.last_name || ''}
            </h1>
          </div>
        </>
      ) : (
        <div className="text-white">Loading...</div>
      )}
    </main>
  )
}
