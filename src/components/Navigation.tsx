import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavigationProps {
  isSidebarCollapsed: boolean;
  onSidebarToggle: () => void;
  onNotificationClick?: () => void;
  onUserAvatarClick?: () => void;
  onGlobalSearch?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  globalSearchKeyword?: string;
  onSearchChange?: (value: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  isSidebarCollapsed,
  onSidebarToggle,
  onNotificationClick,
  onUserAvatarClick,
  onGlobalSearch,
  globalSearchKeyword = '',
  onSearchChange,
}) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* 顶部导航栏 */}
      <header className="fixed top-0 left-0 right-0 h-18 tech-card z-50">
        <div className="flex items-center justify-between h-full px-6">
          {/* 左侧：Logo和产品名称 */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={onSidebarToggle}
              className="p-3 rounded-xl hover:bg-white/10 transition-all group data-stream"
            >
              <i className="fas fa-bars text-blue-400 group-hover:text-purple-400 group-hover:scale-110 transition-all"></i>
            </button>
            <div className="flex items-center space-x-3">
              <div className="relative w-12 h-12 tech-card flex items-center justify-center group cursor-pointer">
                <i className="fas fa-brain text-2xl text-blue-400 group-hover:text-purple-400 group-hover:animate-pulse"></i>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl opacity-0 group-hover:opacity-20 blur transition-all duration-500"></div>
              </div>
              <div>
                <h1 className="tech-title text-xl">深夜疗愈空间</h1>
                <p className="text-xs text-gray-400 tracking-wider">温暖陪伴</p>
              </div>
            </div>
          </div>
          
          {/* 中间：搜索框 */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <input 
                type="text" 
                placeholder="搜索历史记录、疗愈方案..." 
                value={globalSearchKeyword}
                onChange={(e) => onSearchChange?.(e.target.value)}
                onKeyPress={onGlobalSearch}
                className="tech-input pr-12 tech-font text-sm"
              />
              <i className="fas fa-search absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-400"></i>
              <div className="absolute inset-0 data-stream opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            </div>
          </div>
          
          {/* 右侧：通知和用户头像 */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={onNotificationClick}
              className="relative p-3 rounded-xl hover:bg-white/10 transition-all group tech-card"
            >
              <i className="fas fa-bell text-orange-400 group-hover:text-yellow-400 group-hover:scale-110 transition-all"></i>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full border-2 border-gray-900 animate-pulse"></span>
            </button>
            <div className="relative">
              <button 
                onClick={onUserAvatarClick}
                className="flex items-center space-x-3 p-2 rounded-xl hover:bg-white/10 transition-all group tech-card"
              >
                <div className="relative">
                  <img 
                    src="https://s.coze.cn/image/FFIG_zbIRLw/" 
                    alt="用户头像" 
                    className="w-9 h-9 rounded-full object-cover border-2 border-blue-400/50 group-hover:border-purple-400/50 transition-all"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-gray-900 animate-pulse"></div>
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-300 group-hover:text-white transition-colors">用户_001</span>
                <i className="fas fa-chevron-down text-xs text-gray-400 group-hover:text-white transition-colors"></i>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 左侧导航 */}
      <aside className={`fixed left-0 top-18 bottom-0 tech-card z-40 transition-all duration-500 ${isSidebarCollapsed ? 'w-20' : 'w-64'} border-r border-white/10`}>
        <nav className="p-4 space-y-2">
          <Link 
            to="/home" 
            className={`flex items-center space-x-4 px-4 py-3.5 rounded-xl transition-all duration-300 text-sm font-medium relative overflow-hidden group ${
              isActive('/home') || isActive('/')
                ? 'tech-card text-white glow-border'
                : 'hover:bg-white/10 text-gray-300 hover:text-white'
            }`}
          >
            <div className="relative z-10 flex items-center space-x-4">
              <i className="fas fa-home text-lg text-blue-400 group-hover:text-purple-400 transition-colors"></i>
              {!isSidebarCollapsed && <span className="tech-font tracking-wide">控制台</span>}
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
          
          <Link 
            to="/emotion-select" 
            className={`flex items-center space-x-4 px-4 py-3.5 rounded-xl transition-all duration-300 text-sm font-medium relative overflow-hidden group ${
              isActive('/emotion-select')
                ? 'tech-card text-white glow-border'
                : 'hover:bg-white/10 text-gray-300 hover:text-white'
            }`}
          >
            <div className="relative z-10 flex items-center space-x-4">
              <i className="fas fa-heart text-lg text-pink-400 group-hover:text-red-400 transition-colors group-hover:scale-110"></i>
              {!isSidebarCollapsed && <span className="tech-font tracking-wide">情绪分析</span>}
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600/20 to-red-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
          
          <Link 
            to="/history" 
            className={`flex items-center space-x-4 px-4 py-3.5 rounded-xl transition-all duration-300 text-sm font-medium relative overflow-hidden group ${
              isActive('/history')
                ? 'tech-card text-white glow-border'
                : 'hover:bg-white/10 text-gray-300 hover:text-white'
            }`}
          >
            <div className="relative z-10 flex items-center space-x-4">
              <i className="fas fa-history text-lg text-cyan-400 group-hover:text-blue-400 transition-colors group-hover:scale-110"></i>
              {!isSidebarCollapsed && <span className="tech-font tracking-wide">疗愈记录</span>}
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
          
          <Link 
            to="/collection" 
            className={`flex items-center space-x-4 px-4 py-3.5 rounded-xl transition-all duration-300 text-sm font-medium relative overflow-hidden group ${
              isActive('/collection')
                ? 'tech-card text-white glow-border'
                : 'hover:bg-white/10 text-gray-300 hover:text-white'
            }`}
          >
            <div className="relative z-10 flex items-center space-x-4">
              <i className="fas fa-bookmark text-lg text-green-400 group-hover:text-emerald-400 transition-colors group-hover:scale-110"></i>
              {!isSidebarCollapsed && <span className="tech-font tracking-wide">收藏夹</span>}
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-emerald-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
          
          <div className="tech-divider my-4"></div>
          
          <Link 
            to="/settings" 
            className={`flex items-center space-x-4 px-4 py-3.5 rounded-xl transition-all duration-300 text-sm font-medium relative overflow-hidden group ${
              isActive('/settings')
                ? 'tech-card text-white glow-border'
                : 'hover:bg-white/10 text-gray-300 hover:text-white'
            }`}
          >
            <div className="relative z-10 flex items-center space-x-4">
              <i className="fas fa-cog text-lg text-orange-400 group-hover:text-amber-400 transition-colors group-hover:rotate-90"></i>
              {!isSidebarCollapsed && <span className="tech-font tracking-wide">系统设置</span>}
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-amber-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
          
          <Link 
            to="/feedback" 
            className={`flex items-center space-x-4 px-4 py-3.5 rounded-xl transition-all duration-300 text-sm font-medium relative overflow-hidden group ${
              isActive('/feedback')
                ? 'tech-card text-white glow-border'
                : 'hover:bg-white/10 text-gray-300 hover:text-white'
            }`}
          >
            <div className="relative z-10 flex items-center space-x-4">
              <i className="fas fa-comment-dots text-lg text-yellow-400 group-hover:text-lime-400 transition-colors group-hover:scale-110"></i>
              {!isSidebarCollapsed && <span className="tech-font tracking-wide">反馈建议</span>}
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/20 to-lime-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
          
          <Link 
            to="/help" 
            className={`flex items-center space-x-4 px-4 py-3.5 rounded-xl transition-all duration-300 text-sm font-medium relative overflow-hidden group ${
              isActive('/help')
                ? 'tech-card text-white glow-border'
                : 'hover:bg-white/10 text-gray-300 hover:text-white'
            }`}
          >
            <div className="relative z-10 flex items-center space-x-4">
              <i className="fas fa-question-circle text-lg text-purple-400 group-hover:text-indigo-400 transition-colors group-hover:scale-110"></i>
              {!isSidebarCollapsed && <span className="tech-font tracking-wide">帮助中心</span>}
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
        </nav>
        
        {/* 底部状态指示器 */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="tech-card p-3 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs tech-font text-green-400">系统在线</span>
            </div>
            <div className="text-xs text-gray-500 tech-font">
              {!isSidebarCollapsed ? '陪伴模式已开启' : '陪伴中'}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

