import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, 
  Activity, 
  Briefcase, 
  Database, 
  ShieldCheck, 
  Mail, 
  Calendar, 
  DollarSign,
  UserCheck,
  TrendingUp,
  Search,
  RefreshCw
} from 'lucide-react';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data.data);
    } catch (err) {
      console.error("Admin Access Error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Filter Logic for Users
  const filteredUsers = data?.usersList?.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950">
      <RefreshCw className="animate-spin text-indigo-600 mb-4" size={40} />
      <p className="text-sm font-black uppercase tracking-widest dark:text-white">Synchronizing System Data...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      
      {/* --- TOP BRANDED NAVIGATION --- */}
      <div className="bg-indigo-900 text-white p-6 shadow-2xl border-b-4 border-indigo-500">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-white p-2 text-indigo-900">
              <ShieldCheck size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black uppercase tracking-tighter">TEYZIX CORE • COMMAND</h1>
              <p className="text-[10px] font-bold text-indigo-300 tracking-widest uppercase">Administrative Intelligence Interface</p>
            </div>
          </div>
          <button 
            onClick={fetchData} 
            className="bg-indigo-600 hover:bg-white hover:text-indigo-900 px-6 py-2 text-xs font-black uppercase tracking-widest transition-all"
          >
            Refresh Logs
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-8 space-y-8">

        {/* --- KPI METRICS GRID --- */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-900 border-l-8 border-blue-600 p-6 shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Total Population</p>
                <h3 className="text-4xl font-black italic">{data?.stats.users.total}</h3>
              </div>
              <Users className="text-blue-600 opacity-20" size={40} />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-900 border-l-8 border-emerald-600 p-6 shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Verified Providers</p>
                <h3 className="text-4xl font-black italic">{data?.stats.users.providers}</h3>
              </div>
              <UserCheck className="text-emerald-600 opacity-20" size={40} />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border-l-8 border-indigo-600 p-6 shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Active Services</p>
                <h3 className="text-4xl font-black italic">{data?.stats.services.total}</h3>
              </div>
              <Database className="text-indigo-600 opacity-20" size={40} />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border-l-8 border-amber-500 p-6 shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Total Revenue Vol.</p>
                <h3 className="text-4xl font-black italic">{data?.stats.projects.total}</h3>
              </div>
              <DollarSign className="text-amber-500 opacity-20" size={40} />
            </div>
          </div>
        </section>

        {/* --- MAIN INTERFACE TABS --- */}
        <div className="bg-white dark:bg-gray-900 shadow-xl border border-gray-200 dark:border-gray-800">
          <div className="flex border-b dark:border-gray-800">
            {['Overview', 'User Registry', 'Project Ledger'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-5 text-xs font-black uppercase tracking-[0.2em] transition-all border-r dark:border-gray-800 ${activeTab === tab ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-8">
            {/* 1. OVERVIEW TAB */}
            {activeTab === 'Overview' && (
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <h2 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
                    <TrendingUp className="text-indigo-600" /> Platform Growth Analysis
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-6 bg-blue-50 dark:bg-blue-900/10 border-2 border-blue-100 dark:border-blue-900">
                      <p className="font-bold text-blue-800 dark:text-blue-400 uppercase text-xs">Customer Base</p>
                      <div className="mt-2 flex items-end gap-2">
                        <span className="text-5xl font-black">{data?.stats.users.customers}</span>
                        <span className="text-xs font-bold text-blue-500 mb-2">Live Accounts</span>
                      </div>
                    </div>
                    <div className="p-6 bg-emerald-50 dark:bg-emerald-900/10 border-2 border-emerald-100 dark:border-emerald-900">
                      <p className="font-bold text-emerald-800 dark:text-emerald-400 uppercase text-xs">Provider Base</p>
                      <div className="mt-2 flex items-end gap-2">
                        <span className="text-5xl font-black">{data?.stats.users.providers}</span>
                        <span className="text-xs font-bold text-emerald-500 mb-2">Service Experts</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-900 text-white p-8 border-l-8 border-indigo-500">
                    <h4 className="text-sm font-black uppercase tracking-widest text-indigo-400">Platform Status</h4>
                    <p className="mt-4 text-xl font-serif italic text-gray-300">"The system is currently operating at optimal efficiency with {data?.stats.services.total} verified services and {data?.stats.projects.total} active project engagements."</p>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/50 p-6 border dark:border-gray-700">
                  <h3 className="font-black uppercase text-xs tracking-widest mb-6">Security & Logs</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-900 border-b-2 border-green-500">
                      <Activity className="text-green-500" size={18}/>
                      <span className="text-xs font-bold">API Gateway: Online</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-900 border-b-2 border-blue-500">
                      <RefreshCw className="text-blue-500" size={18}/>
                      <span className="text-xs font-bold">Auto-Backup: Active</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-900 border-b-2 border-purple-500">
                      <ShieldCheck className="text-purple-500" size={18}/>
                      <span className="text-xs font-bold">Encrypted Storage: Stable</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. USER REGISTRY TAB */}
            {activeTab === 'User Registry' && (
              <div className="space-y-6">
                <div className="flex items-center bg-gray-50 dark:bg-gray-800 p-2 px-4 border dark:border-gray-700">
                  <Search className="text-gray-400" size={20} />
                  <input 
                    type="text" 
                    placeholder="SEARCH REGISTRY BY NAME OR EMAIL..." 
                    className="w-full p-3 bg-transparent outline-none text-xs font-black tracking-widest"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse border dark:border-gray-800">
                    <thead className="bg-gray-100 dark:bg-gray-800">
                      <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 border-b-2 border-gray-300 dark:border-gray-700">
                        <th className="p-5 border-r dark:border-gray-700">Identity Details</th>
                        <th className="p-5 border-r dark:border-gray-700">Designation</th>
                        <th className="p-5 border-r dark:border-gray-700">Institutional Contact</th>
                        <th className="p-5">Registry Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-gray-800">
                      {filteredUsers?.map((u) => (
                        <tr key={u._id} className="hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-colors">
                          <td className="p-5 border-r dark:border-gray-800">
                            <div className="flex items-center gap-4">
                              <div className="h-10 w-10 bg-indigo-600 text-white flex items-center justify-center font-black">
                                {u.name.charAt(0)}
                              </div>
                              <span className="font-black uppercase text-sm tracking-tighter">{u.name}</span>
                            </div>
                          </td>
                          <td className="p-5 border-r dark:border-gray-800">
                            <span className={`px-4 py-1 text-[10px] font-black border-2 ${u.role === 'ADMIN' ? 'border-rose-600 text-rose-600 bg-rose-50 dark:bg-rose-900/10' : 'border-indigo-600 text-indigo-600 bg-indigo-50 dark:bg-indigo-900/10'}`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="p-5 border-r dark:border-gray-800 font-mono text-xs italic text-gray-500">{u.email}</td>
                          <td className="p-5 text-xs font-bold text-gray-400 tracking-tighter">
                            <Calendar size={12} className="inline mr-2" /> {new Date(u.createdAt).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 3. PROJECT LEDGER TAB */}
            {activeTab === 'Project Ledger' && (
              <div className="space-y-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse border dark:border-gray-800">
                    <thead className="bg-indigo-900 text-white">
                      <tr className="text-[10px] font-black uppercase tracking-[0.2em]">
                        <th className="p-5">Contract Title</th>
                        <th className="p-5">Valuation</th>
                        <th className="p-5">Client</th>
                        <th className="p-5">Expert</th>
                        <th className="p-5">Fulfillment Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-gray-800">
                      {data?.projectsList.map((p) => (
                        <tr key={p._id} className="hover:bg-amber-50 dark:hover:bg-amber-900/10">
                          <td className="p-5 font-black uppercase text-sm tracking-tighter">{p.listing?.title}</td>
                          <td className="p-5 font-mono font-black text-emerald-600 text-lg">${p.budget}</td>
                          <td className="p-5 text-xs font-bold uppercase">{p.customer?.name}</td>
                          <td className="p-5 text-xs font-bold uppercase">{p.provider?.name}</td>
                          <td className="p-5">
                            <div className="flex items-center gap-2">
                              <div className={`h-2 w-2 ${p.status === 'Delivered' ? 'bg-green-500' : 'bg-amber-500'} animate-pulse`}></div>
                              <span className="text-[10px] font-black uppercase tracking-widest">{p.status}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {data?.projectsList.length === 0 && (
                    <div className="p-20 text-center text-gray-400 italic border-2 border-dashed border-gray-200 mt-4">
                      No active ledger records in the current session.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- FOOTER REGISTRY NOTE --- */}
      <div className="max-w-7xl mx-auto p-8 flex justify-between items-center text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">
          <span>Security Level: Superuser</span>
          <span>© 2026 Teyzix Intelligence Units</span>
      </div>
    </div>
  );
};

export default AdminDashboard;