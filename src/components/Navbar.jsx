
import { BookOpen, Award, Sparkles, Lock, Palette } from 'lucide-react';
import { playClickSound } from '../utils/audio';

const THEMES = [
  { id: 'sky', color: '#3b82f6', label: '天蓝色' },
  { id: 'mint', color: '#10b981', label: '薄荷绿' },
  { id: 'cotton', color: '#d946ef', label: '糖果粉' },
  { id: 'sunset', color: '#f97316', label: '落日橙' },
  { id: 'dark', color: '#1e293b', label: '暗黑模式' }
];

export default function Navbar({ activeTab, setActiveTab, currentTheme, setTheme, hasMistakes, starsCount }) {
  const tabs = [
    { id: 'word', label: '单词大作战', icon: BookOpen, color: 'text-emerald-500' },
    { id: 'quiz', label: '真题大闯关', icon: Award, color: 'text-indigo-500' },
    { id: 'stickers', label: '贴纸收集册', icon: Sparkles, color: 'text-amber-500' },
    { id: 'parent', label: '家长专区', icon: Lock, color: 'text-rose-500', badge: hasMistakes }
  ];

  const handleTabClick = (tabId) => {
    playClickSound();
    setActiveTab(tabId);
  };

  const handleThemeChange = (themeId) => {
    playClickSound();
    setTheme(themeId);
  };

  return (
    <header className="glass-card mb-2 p-3 flex flex-col md:flex-row justify-between items-center gap-4 rounded-3xl" style={{ animation: 'float 6s infinite ease-in-out' }}>
      {/* Brand Logo */}
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleTabClick('word')}>
        <span className="text-3xl animate-bounce">🦖</span>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="logo-gradient-text" style={{ margin: 0, fontSize: '1.4rem', fontFamily: 'var(--font-heading)' }}>
              Sparks KET English
            </h1>
            {starsCount !== undefined && (
              <div className="stars-badge-mini animate-pulse-slow">
                <span>⭐</span>
                <span>{starsCount}</span>
              </div>
            )}
          </div>
          <p className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>宝宝KET英语快乐学堂</p>
        </div>
      </div>

      {/* Tabs */}
      <nav className="flex flex-wrap justify-center gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`nav-btn ${isActive ? 'active' : ''}`}
              style={{
                borderRadius: '16px'
              }}
            >
              <Icon size={18} />
              <span>{tab.label}</span>
              
              {/* Badge for Parent Zone if there are mistakes */}
              {tab.badge && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Theme Picker */}
      <div className="theme-selector-container">
        <Palette size={16} style={{ color: 'var(--text-muted)', opacity: 0.6 }} />
        <div className="flex gap-1.5">
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => handleThemeChange(t.id)}
              className={`theme-dot-btn ${currentTheme === t.id ? 'active' : ''}`}
              style={{ backgroundColor: t.color }}
              title={t.label}
            />
          ))}
        </div>
      </div>
    </header>
  );
}
