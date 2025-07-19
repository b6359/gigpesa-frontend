// // src/pages/NotificationsPage.tsx
// import React, { useEffect, useState } from "react";

// type Notification = {
//   id: string;
//   message: string;
//   createdAt: string;
//   type: string;
// };

// const NotificationsPage: React.FC = () => {
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);

//   const fetchNotifications = async () => {
//     try {
//       const token = sessionStorage.getItem("gigpesa_token");
//       if (!token) return;

//       const response = await fetch("http://192.168.1.24:5000/api/user/notifications", {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) throw new Error("Failed to fetch notifications");

//       const data = await response.json();
//       setNotifications(data.notification || []);
//     } catch (err) {
//       console.error("Notification fetch error:", err);
//       setNotifications([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchNotifications();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <h1 className="text-2xl font-bold text-green-600 mb-6">My Notifications</h1>

//       {loading ? (
//         <div className="text-center text-gray-500">Loading...</div>
//       ) : notifications.length === 0 ? (
//         <div className="text-center text-gray-500">No notifications found.</div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//           {notifications.map((notif) => (
//             <div
//               key={notif.id}
//               className="bg-white p-4 rounded-lg shadow border hover:shadow-md transition"
//             >
//               <div className="text-gray-800 font-medium">{notif.message}</div>
//               <div className="text-sm text-gray-500 mt-2">
//                 {new Date(notif.createdAt).toLocaleString()}
//               </div>
//               <div className="text-xs mt-1 text-blue-500 uppercase tracking-wide font-semibold">
//                 {notif.type}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default NotificationsPage;


// src/pages/NotificationsPage.tsx
import { Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";

type Notification = {
  id: string;
  message: string;
  createdAt: string;
  type: string;
};

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchNotifications = async () => {
    try {
      const token = sessionStorage.getItem("gigpesa_token");
      if (!token) return;

      const response = await fetch("http://192.168.1.24:5000/api/user/notifications", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch notifications");

      const data = await response.json();
      setNotifications(data.notification || []);
    } catch (err) {
      console.error("Notification fetch error:", err);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = sessionStorage.getItem("gigpesa_token");
      if (!token) return;

      const response = await fetch(
        `http://192.168.1.24:5000/api/user/notification?notification_id=${id}`,
        {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete notification");

      // Remove from UI
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold text-green-600 mb-6">My Notifications</h1>

      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : notifications.length === 0 ? (
        <div className="text-center text-gray-500">No notifications found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className="bg-white p-4 rounded-lg shadow border hover:shadow-md transition relative"
            >
              <button
                onClick={() => handleDelete(notif.id)}
                className="absolute top-2 right-2 text-red-400 hover:text-red-600"
                title="Delete notification"
              >
                <Trash2 size={16} />
              </button>

              <div className="text-gray-800 font-medium">{notif.message}</div>
              <div className="text-sm text-gray-500 mt-2">
                {new Date(notif.createdAt).toLocaleString()}
              </div>
              <div className="text-xs mt-1 text-blue-500 uppercase tracking-wide font-semibold">
                {notif.type}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
