'use client';

import { useEffect, useState } from 'react';
import { Megaphone } from 'lucide-react';

const announcements = [
  'Welcome to our dashboard!',
  'Check out the latest freelance jobs.',
  'Invite your friends and earn rewards!',
  'Support is available 24/7 if you need help.',
];

export default function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % announcements.length);
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-yellow-100 border-b border-yellow-300 text-yellow-900 text-sm p-2 flex items-center gap-2">
      <Megaphone className="w-4 h-4" />
      <div className="overflow-hidden whitespace-nowrap">
        <div className="transition-all duration-500 ease-in-out">
          {announcements[currentIndex]}
        </div>
      </div>
    </div>
  );
}
