import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Code, 
  Palette, 
  PenTool, 
  BarChart, 
  ShieldCheck, 
  Zap, 
  Users, 
  ArrowRight,
  Star
} from 'lucide-react';

const Home = () => {
  // Categories Data
  const categories = [
    { name: 'Web Development', icon: <Code size={32} />, count: '1,200+ Pros', color: 'bg-blue-500' },
    { name: 'Graphic Design', icon: <Palette size={32} />, count: '850+ Pros', color: 'bg-purple-500' },
    { name: 'Content Writing', icon: <PenTool size={32} />, count: '600+ Pros', color: 'bg-orange-500' },
    { name: 'Digital Marketing', icon: <BarChart size={32} />, count: '450+ Pros', color: 'bg-green-500' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      
      {/* 1. HERO SECTION */}
      <header className="relative bg-gradient-to-br from-green-700 to-green-900 text-white py-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tighter">
              Find the perfect <span className="text-green-400 italic">freelance</span> services for your business
            </h1>
            <p className="text-xl text-green-100 max-w-lg leading-relaxed">
              Work with talented experts at affordable prices. Teyzix Core Marketplace is where big ideas meet great execution.
            </p>
            
            {/* Search Bar Feel */}
            <div className="flex items-center bg-white dark:bg-gray-800 rounded-2xl p-2 shadow-2xl max-w-xl group focus-within:ring-4 focus-within:ring-green-400/50 transition-all">
              <div className="pl-4 text-gray-400">
                <Search size={24} />
              </div>
              <input 
                type="text" 
                placeholder="Try 'website design' or 'logo'..." 
                className="w-full p-4 text-gray-800 dark:text-white outline-none bg-transparent font-medium"
              />
              <Link to="/browse-services" className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg">
                Search
              </Link>
            </div>

            <div className="flex gap-6 pt-4 items-center">
              <p className="text-sm font-bold text-green-200 uppercase tracking-widest">Trusted By:</p>
              <div className="flex gap-4 opacity-50 grayscale invert dark:invert-0 font-black text-2xl italic tracking-tighter">
                <span>TECH</span>
                <span>GLOBAL</span>
                <span>CORE</span>
              </div>
            </div>
          </div>

          <div className="hidden md:block relative">
             <div className="absolute -top-10 -left-10 w-40 h-40 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
             <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-700"></div>
             
             <div className="bg-white/10 backdrop-blur-md p-8 rounded-[40px] border border-white/20 shadow-2xl">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-xl transform hover:-translate-y-2 transition-transform">
                    <Zap className="text-yellow-500 mb-4" />
                    <p className="font-black text-gray-800 dark:text-white text-2xl">Fast</p>
                    <p className="text-xs text-gray-500">Delivery within 24h</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-xl mt-8 transform hover:-translate-y-2 transition-transform">
                    <ShieldCheck className="text-green-500 mb-4" />
                    <p className="font-black text-gray-800 dark:text-white text-2xl">Secure</p>
                    <p className="text-xs text-gray-500">Milestone payments</p>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </header>

      {/* 2. STATS SECTION */}
      <section className="bg-white dark:bg-gray-800 py-12 border-b dark:border-gray-700 transition-colors">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-1">
            <h3 className="text-4xl font-black text-gray-900 dark:text-white">5k+</h3>
            <p className="text-gray-500 font-bold uppercase text-xs tracking-widest">Active Experts</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-4xl font-black text-gray-900 dark:text-white">10k+</h3>
            <p className="text-gray-500 font-bold uppercase text-xs tracking-widest">Projects Done</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-4xl font-black text-gray-900 dark:text-white">4.9/5</h3>
            <p className="text-gray-500 font-bold uppercase text-xs tracking-widest">Service Rating</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-4xl font-black text-gray-900 dark:text-white">100%</h3>
            <p className="text-gray-500 font-bold uppercase text-xs tracking-widest">Safe Payments</p>
          </div>
        </div>
      </section>

      {/* 3. CATEGORIES SECTION */}
      <section className="py-24 px-6 bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div className="space-y-2">
              <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">Explore Marketplace</h2>
              <div className="h-1.5 w-24 bg-green-500 rounded-full"></div>
            </div>
            <Link to="/browse-services" className="text-green-600 font-black flex items-center gap-2 hover:underline">
              View All <ArrowRight size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((cat, idx) => (
              <div key={idx} className="group bg-white dark:bg-gray-800 p-8 rounded-[35px] shadow-sm hover:shadow-2xl border border-gray-100 dark:border-gray-700 transition-all duration-500">
                <div className={`${cat.color} text-white w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  {cat.icon}
                </div>
                <h4 className="text-xl font-black text-gray-800 dark:text-white mb-2">{cat.name}</h4>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{cat.count}</p>
                <Link to="/browse-services" className="mt-6 inline-flex items-center text-xs font-black text-gray-400 group-hover:text-green-600 transition-colors uppercase tracking-widest">
                  Explore Now <ArrowRight size={14} className="ml-2" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE US */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
           <div className="order-2 md:order-1">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=60" 
                  alt="Team Working" 
                  className="rounded-[50px] shadow-2xl z-10 relative"
                />
                <div className="absolute -bottom-6 -right-6 bg-green-600 text-white p-8 rounded-3xl shadow-xl z-20 hidden lg:block">
                  <div className="flex gap-1 mb-2">
                    {/* FIXED: idx added to map arguments */}
                    {[1,2,3,4,5].map((s, idx) => <Star key={idx} size={16} fill="white" />)}
                  </div>
                  <p className="font-bold text-lg">"Best service experience ever!"</p>
                  <p className="text-xs opacity-75">Verified Platform Client</p>
                </div>
              </div>
           </div>

           <div className="order-1 md:order-2 space-y-8">
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tighter leading-tight">
                Quality services at your <br/> <span className="text-green-600">fingertips</span>
              </h2>
              
              <div className="space-y-6">
                {[
                  { t: 'Built-in Messaging', d: 'Chat with providers in real-time before you hire.', i: <Users className="text-blue-500"/> },
                  { t: 'Verified Experts', d: 'Every provider is hand-picked for their skills.', i: <ShieldCheck className="text-green-500"/> },
                  { t: 'Milestone Tracking', d: 'Pay only when you are 100% satisfied.', i: <Zap className="text-yellow-500"/> },
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 group">
                    <div className="mt-1 bg-gray-50 dark:bg-gray-800 p-3 rounded-xl transition-colors group-hover:bg-white group-hover:shadow-md">
                      {item.i}
                    </div>
                    <div>
                      <h5 className="font-black text-xl text-gray-800 dark:text-white">{item.t}</h5>
                      <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
           </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION */}
      <section className="mb-20 px-6">
        <div className="max-w-7xl mx-auto bg-green-600 dark:bg-green-700 rounded-[50px] p-12 md:p-20 text-center text-white relative overflow-hidden">
            <div className="relative z-10 max-w-3xl mx-auto space-y-8">
              <h2 className="text-4xl md:text-6xl font-black leading-none tracking-tighter">Ready to grow your business?</h2>
              <p className="text-xl text-green-100 font-medium">Join thousands of entrepreneurs who trust Teyzix Marketplace for their daily operations.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                <Link to="/register" className="bg-white text-green-700 px-10 py-5 rounded-2xl font-black text-lg shadow-2xl hover:bg-gray-100 transition-all transform hover:scale-105">
                  Get Started for Free
                </Link>
                <Link to="/login" className="bg-green-800 text-white px-10 py-5 rounded-2xl font-black text-lg border border-green-400/30 hover:bg-green-900 transition-all">
                  Sign In
                </Link>
              </div>
            </div>
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-green-400/20 rounded-full blur-3xl"></div>
        </div>
      </section>

    </div>
  );
};

export default Home;