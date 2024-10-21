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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clicks, setClicks] = useState<{ x: number; y: number }[]>([]); // Store click positions

  useEffect(() => {
    if (WebApp.initDataUnsafe.user) {
      console.log('User data loaded:', WebApp.initDataUnsafe.user);
      setUserData(WebApp.initDataUnsafe.user as UserData);
    }
  }, [])

  // Check if the user is an admin based on username
  const isAdmin = userData && admins.includes(userData.username || '');

  // Toggle the modal open/close state
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Handle click on the image
  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    const { clientX, clientY } = e;
    setClicks([...clicks, { x: clientX, y: clientY }]); // Capture click position

    // Remove the click effect after a short delay
    setTimeout(() => {
      setClicks((prevClicks) => prevClicks.slice(1));
    }, 1000); // Duration for the "قريبًا" text to disappear
  };

  return (
    <main className="p-4 bg-gray-900 min-h-screen relative">
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

      {/* Show bubble image for admin users */}
      {isAdmin && (
        <div>
          <a href="https://t.me/wgoRSZPpeiphY2Jk" target="_blank" rel="noopener noreferrer">
            <img
              src="/icon2.png"
              alt="Telegram Channel"
              className="fixed bottom-4 right-20 w-16 h-16 rounded-full border-2 border-green-500 shadow-lg cursor-pointer"
            />
          </a>

          {/* Second bubble for opening the admin modal */}
          <img
            src="/icon3.png"
            alt="Admins List"
            className="fixed bottom-4 right-4 w-16 h-16 rounded-full border-2 border-blue-500 shadow-lg cursor-pointer"
            onClick={toggleModal}
          />
        </div>
      )}

      {/* Admins modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full text-white">
            <h2 className="text-lg font-bold mb-4">قائمة المسؤولين</h2>
            <ul>
              {admins.map((admin) => (
                <li key={admin} className="flex justify-between items-center mb-2">
                  <span>{admin}</span>
                  <span
                    className={`px-2 py-1 text-sm rounded ${
                      admin === 'Kharwaydo' ? 'bg-purple-500' : 'bg-green-500'
                    }`}
                  >
                    {admin === 'Kharwaydo' ? 'super admin' : 'admin'}
                  </span>
                </li>
              ))}
            </ul>
            <button
              className="mt-4 w-full bg-red-500 hover:bg-red-700 text-white py-2 rounded"
              onClick={toggleModal}
            >
              اغلاق
            </button>
          </div>
        </div>
      )}

      {/* Tiger image in the center of the screen */}
      <div className="flex justify-center items-center h-screen">
        <img
          src="/icon7.png" // Changed to tiger.png
          alt="Tiger Image"
          className="w-64 h-64 cursor-pointer" // Increased size of the image
          onClick={handleImageClick}
        />
      </div>

      {/* Render the "قريبًا" text on click */}
      {clicks.map((click, index) => (
        <span
          key={index}
          className="absolute text-white text-2xl animate-rise" // Increased font size
          style={{
            left: click.x,
            top: click.y,
            transform: 'translate(-50%, -50%)',
          }}
        >
          قريبًا
        </span>
      ))}

      <style jsx>{`
        @keyframes rise {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) translateY(0);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) translateY(-20px);
          }
        }
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
        .animate-rise {
          animation: rise 1s ease-out forwards;
        }
        .cursor-pointer:hover {
          animation: pulse 0.5s ease-in-out; // Adding a pulse effect on hover
        }
      `}</style>
    </main>
  )
}
