import axios from "axios";
import React, { useEffect, useState } from "react";

type Task = {
  id: string;
  task_name: string;
  task_id: string;
  status: string;
  proof: string;
  earnings: string;
  submitted_at: string;
  device_type: string;
  Task?: {
    id: string;
    name: string;
    description: string;
  };
};

const PAGE_SIZE = 10;

const JobHistory = () => {
  const [taskHistory, setTaskHistory] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const token = sessionStorage.getItem("gigpesa_token");
        if (!token) {
          setError("Unauthorized. Please login again.");
          setLoading(false);
          return;
        }

        const res = await axios.get(
          "http://192.168.1.24:5000/api/user/tasks/history",
          {
            params: {
              start: (currentPage - 1) * PAGE_SIZE,
              limit: PAGE_SIZE,
            },
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const { taskHistory: newTasks, total } = res.data;
        setTotalPages(Math.ceil((total || 0) / PAGE_SIZE));
        setTaskHistory((prev) => {
          const allTasks = [...prev, ...(newTasks || [])];
          const uniqueTasks = Array.from(
            new Map(allTasks.map((task) => [task.id, task])).values()
          );
          return uniqueTasks;
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

    fetchTasks();
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
    <div className="p-6 overflow-hidden">
      <h2 className="text-xl font-semibold mb-4 text-green-600">
        Submission History
      </h2>

      {error && <p className="text-red-500">{error}</p>}

      {taskHistory.length === 0 && !loading ? (
         <p className="m-auto text-gray-400 text-center min-h-96 flex justify-center items-center">No history found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-md overflow-hidden">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="p-3 border border-gray-300 text-left">
                  Task ID
                </th>
                <th className="p-3 border border-gray-300 text-left">
                  Task Name
                </th>
                <th className="p-3 border border-gray-300 text-left">Status</th>
                <th className="p-3 border border-gray-300 text-left">
                  Earnings
                </th>
                <th className="p-3 border border-gray-300 text-left">
                  Submitted At
                </th>
              </tr>
            </thead>
            <tbody>
              {taskHistory.map((task) => (
                <tr
                  key={task.id}
                  className="text-gray-800 even:bg-gray-50 hover:bg-gray-100 transition"
                >
                  <td className="p-3 border border-gray-300">{task.task_id}</td>
                  <td className="p-3 border border-gray-300">
                    {task.Task?.name || "N/A"}
                  </td>
                  <td className="p-3 border border-gray-300">{task.status}</td>
                  <td className="p-3 border border-gray-300">
                    ${parseFloat(task.earnings).toFixed(2)}
                  </td>
                  <td className="p-3 border border-gray-300">
                    {new Date(task.submitted_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {loading && (
        <p className="mt-4 text-center text-gray-600">Loading more tasks...</p>
      )}
    </div>
  );
};

export default JobHistory;
