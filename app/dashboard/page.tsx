'use client'

import React, { useState, useMemo } from 'react';
import { BookOpen, Target, BarChart3, User, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// --- Mock Data ---
const mockStats = {
  quizzesAnswered: 45,
  lessonsCompleted: 12,
  totalQuizzes: 60,
  totalLessons: 20,
};

const mockFocusAreas = [
  { area: 'Algebraic Formulas', score: 65, color: 'bg-red-500', barColor: '#EF4444' },
  { area: 'Geometry Theorems', score: 88, color: 'bg-green-500', barColor: '#10B981' },
  { area: 'Trigonometry Basics', score: 42, color: 'bg-amber-500', barColor: '#F59E0B' },
  { area: 'Probability & Stats', score: 75, color: 'bg-indigo-500', barColor: '#6366F1' },
];

const navItems = [
  { name: 'Lessons', href: '#lessons', icon: BookOpen },
  { name: 'Practice', href: '#practice', icon: Target },
  { name: 'Analytics', href: '#analytics', icon: TrendingUp },
  // Future items can be added here easily
];

// --- Components ---

const Navbar = () => {
  const [active, setActive] = useState('Lessons');
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-10 bg-white dark:bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <span className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
              <BarChart3 className="w-6 h-6" /> 
              SkillDash
            </span>
          </div>
          <div className="flex space-x-4">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setActive(item.name)}
                className={`flex items-center px-4 py-2 rounded-xl text-sm font-semibold transition duration-200 ease-in-out
                  ${active === item.name 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/50' 
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
              >
                <item.icon className="w-5 h-5 mr-2" />
                {item.name}
              </a>
            ))}
          </div>
          <div className="flex items-center">
            <User className="w-6 h-6 text-gray-700 dark:text-gray-300 hover:text-indigo-600 transition" />
          </div>
        </div>
      </div>
    </nav>
  );
};

const StatCard = ({ title, value, total, icon: Icon, color, unit = '' }) => {
  const percentage = total ? Math.round((value / total) * 100) : 0;
  
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-xl border-l-4 border-indigo-500 dark:border-indigo-400 space-y-3 transition duration-300 hover:shadow-2xl">
      <div className="flex items-center justify-between">
        <h3 className="text-md font-medium text-gray-500 dark:text-gray-400">{title}</h3>
        <div className={`p-2 rounded-full ${color.replace('text-', 'bg-')} bg-opacity-10`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
      </div>
      <p className="text-4xl font-extrabold text-gray-900 dark:text-white">{value}{unit}</p>
      {total && (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {total - value} remaining ({percentage}%)
        </div>
      )}
      {total && (
        <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
          <div 
            className={`h-2 rounded-full ${color.replace('text-', 'bg-')}`} 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      )}
    </div>
  );
};

const PerformanceChart = ({ data }) => {
  const chartData = useMemo(() => data.map(item => ({ 
    name: item.area, 
    Score: item.score,
    barColor: item.barColor,
  })), [data]);

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-2xl space-y-6 h-96">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
        <BarChart3 className="w-6 h-6 text-indigo-600" />
        Area Performance Overview (Score %)
      </h2>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" className="dark:stroke-gray-700" vertical={false} />
            <XAxis dataKey="name" tickLine={false} axisLine={false} className="text-sm dark:text-gray-400" />
            <YAxis 
                domain={[0, 100]} 
                tickLine={false} 
                axisLine={false} 
                className="text-sm dark:text-gray-400" 
            />
            <Tooltip 
                cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }} 
                contentStyle={{ 
                    borderRadius: '8px', 
                    border: '1px solid #e0e0e0', 
                    backgroundColor: '#ffffff',
                    padding: '10px'
                }}
            />
            <Bar dataKey="Score">
              {chartData.map((entry, index) => (
                <Bar key={`bar-${index}`} dataKey="Score" fill={entry.barColor} radius={[4, 4, 0, 0]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-10">
      
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-10">
          Student Dashboard
        </h1>
        
        {/* --- 1. User Statistics Cards --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard 
            title="Quizzes Answered" 
            value={mockStats.quizzesAnswered} 
            total={mockStats.totalQuizzes}
            icon={Target}
            color="text-indigo-600"
          />
          <StatCard 
            title="Lessons Completed" 
            value={mockStats.lessonsCompleted} 
            total={mockStats.totalLessons}
            icon={BookOpen}
            color="text-green-600"
          />
          <StatCard 
            title="Overall Mastery" 
            value={Math.round(((mockStats.quizzesAnswered + mockStats.lessonsCompleted) / (mockStats.totalQuizzes + mockStats.totalLessons)) * 100)} 
            unit="%"
            icon={BarChart3}
            color="text-purple-600"
          />
        </div>

        {/* --- 2. Focus Areas Graph/Visualization --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <PerformanceChart data={mockFocusAreas} />

          {/* --- 3. Recommended Focus Area List --- */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-2xl space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-amber-500" />
              High-Impact Focus Areas
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Your lowest scores indicate these areas need immediate practice to improve overall performance.
            </p>
            
            <ul className="space-y-3">
              {mockFocusAreas
                .filter(item => item.score < 75) // Filter for low-scoring areas
                .sort((a, b) => a.score - b.score) // Sort by lowest score first
                .map((item, index) => (
                <li key={item.area} className={`p-3 border-l-4 ${item.color} bg-opacity-5 dark:bg-opacity-10 rounded-md flex justify-between items-center transition duration-200 hover:scale-[1.01] hover:shadow-sm`}>
                  <span className="font-medium text-gray-800 dark:text-gray-200">{index + 1}. {item.area}</span>
                  <span className={`text-sm font-bold ${item.color.replace('bg-', 'text-')}`}>Score: {item.score}%</span>
                </li>
              ))}
              {mockFocusAreas.filter(item => item.score < 75).length === 0 && (
                 <li className="p-3 text-center text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-md">
                   Excellent! All focus areas are above the improvement threshold.
                 </li>
              )}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;