import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity } from 'lucide-react';

const ActivityLog = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/activity', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLogs(res.data.data);
      } catch (err) {
        console.error('Error fetching logs', err);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border dark:border-gray-700 transition-colors duration-300">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-100">
        <Activity className="text-green-500" /> Recent Activity Logs
      </h3>
      
      <div className="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
        {logs.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 italic text-sm">No recent activity found.</p>
        ) : (
          logs.map((log) => (
            <div key={log._id} className="flex flex-col border-b dark:border-gray-700 pb-2 last:border-0">
              <span className="font-bold text-sm text-gray-800 dark:text-gray-200">{log.action}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{log.details}</span>
              <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 italic">
                {new Date(log.createdAt).toLocaleString()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActivityLog;