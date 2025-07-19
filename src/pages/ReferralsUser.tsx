import axios from "axios";
import React, { useEffect, useState } from "react";

type ReferredUser = {
  username: string;
  name: string;
  email: string;
};

type Referral = {
  id: string;
  referredUser: ReferredUser;
  createdAt: string;
  earning: string;
  level: string;
};

const PAGE_SIZE = 10;

const ReferralsUser = () => {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        setLoading(true);
        const token = sessionStorage.getItem("gigpesa_token");
        if (!token) {
          setError("Unauthorized. Please login again.");
          setLoading(false);
          return;
        }

        const res = await axios.get(
          `http://192.168.1.24:5000/api/user/referrals`,
          {
            params: {
              start: (currentPage - 1) * PAGE_SIZE,
              limit: PAGE_SIZE,
            },
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const { referrals: newTasks, total } = res.data;
        setTotalPages(Math.ceil((total || 0) / PAGE_SIZE));
        setReferrals((prev) => {
          const allReferrals = [...prev, ...(newTasks || [])];
          const uniqueReferrals = Array.from(
            new Map(allReferrals.map((task) => [task.id, task])).values()
          );
          return uniqueReferrals;
        });
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Unknown error");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReferrals();
  }, [currentPage]);

  useEffect(() => {
    const handleScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >= document.body.scrollHeight - 200;

      const hasMore = currentPage < totalPages;

      if (nearBottom && !loading && hasMore) {
        setCurrentPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [currentPage, totalPages, loading]);

  return (
  <div className="p-4 mx-auto h-full ">
      <h2 className="text-2xl font-semibold text-green-600 mb-4">Referrals</h2>

      {loading ? (
        <p className="text-blue-500">Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : referrals.length === 0 ? (
        <p className="m-auto text-gray-400 text-center min-h-96 flex justify-center items-center">No referrals found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-md overflow-hidden">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="p-3 border border-gray-300 text-left">Username</th>
                <th className="p-3 border border-gray-300 text-left">Name</th>
                <th className="p-3 border border-gray-300 text-left">Email</th>
                <th className="p-3 border border-gray-300 text-left">Level</th>
                <th className="p-3 border border-gray-300 text-left">Earning</th>
                <th className="p-3 border border-gray-300 text-left">Joined At</th>
              </tr>
            </thead>
            <tbody>
              {referrals.map((ref) => (
                <tr key={ref.id} className="text-gray-800 even:bg-gray-50 hover:bg-gray-100 transition">
                  <td className="p-3 border border-gray-300">{ref.referredUser.username}</td>
                  <td className="p-3 border border-gray-300">{ref.referredUser.name}</td>
                  <td className="p-3 border border-gray-300">{ref.referredUser.email}</td>
                  <td className="p-3 border border-gray-300">{ref.level}</td>
                  <td className="p-3 border border-gray-300">₹{ref.earning}</td>
                  <td className="p-3 border border-gray-300">
                    {new Date(ref.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReferralsUser;
