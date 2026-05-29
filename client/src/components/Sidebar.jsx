import React from 'react';
import { MessageSquare, Hash, BookOpen, Cpu, Briefcase, HelpCircle, Megaphone, Activity } from 'lucide-react';

const CATEGORIES = [
  { name: 'All Categories', icon: MessageSquare, filter: '' },
  { name: 'General', icon: BookOpen, filter: 'General' },
  { name: 'Technology', icon: Cpu, filter: 'Technology' },
  { name: 'Programming', icon: Hash, filter: 'Programming' },
  { name: 'Career Advice', icon: Briefcase, filter: 'Career Advice' },
  { name: 'Announcements', icon: Megaphone, filter: 'Announcements' },
  { name: 'Support', icon: HelpCircle, filter: 'Support' },
];

const POPULAR_TAGS = [
  'React', 'NodeJS', 'MongoDB', 'SocketIO', 'ExpressJS', 'Tailwind',
  'Javascript', 'MERN', 'WebDev', 'Career', 'InterviewPrep', 'REST_API'
];

const Sidebar = ({ selectedCategory, onSelectCategory, selectedTag, onSelectTag }) => {
  return (
    <aside className="w-full lg:w-64 space-y-6">
      {/* Category List */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Categories
        </h3>
        <ul className="space-y-1">
          {CATEGORIES.map((category) => {
            const Icon = category.icon;
            const isSelected = selectedCategory === category.filter && !selectedTag;
            return (
              <li key={category.name}>
                <button
                  onClick={() => {
                    onSelectCategory(category.filter);
                    onSelectTag(''); // reset tag filter when selecting category
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isSelected
                      ? 'bg-indigo-600/20 text-indigo-400 border-l-4 border-indigo-500 pl-2'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
                  <span>{category.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Popular Tags */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Popular Tags
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {POPULAR_TAGS.map((tag) => {
            const isSelected = selectedTag === tag;
            return (
              <button
                key={tag}
                onClick={() => onSelectTag(isSelected ? '' : tag)}
                className={`text-xs px-2.5 py-1 rounded-full transition-all border ${
                  isSelected
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-500/20'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-600'
                }`}
              >
                #{tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* Forum Stats */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl text-slate-400">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center space-x-2">
          <Activity className="h-4 w-4 text-indigo-400" />
          <span>Platform Stats</span>
        </h3>
        <div className="space-y-3 text-xs">
          <div className="flex justify-between border-b border-slate-800 pb-2">
            <span>Online Members</span>
            <span className="font-semibold text-slate-200 flex items-center space-x-1">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-ping inline-block mr-1"></span>
              <span>Active Now</span>
            </span>
          </div>
          <div className="flex justify-between border-b border-slate-800 pb-2">
            <span>Total Topics</span>
            <span className="font-semibold text-slate-200">124</span>
          </div>
          <div className="flex justify-between">
            <span>Total Messages</span>
            <span className="font-semibold text-slate-200">2.4k</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
