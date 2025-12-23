import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

// 心情选项配置
interface MoodOption {
  id: string;
  emoji: string;
  title: string;
  description: string;
  gradient: string;
  iconColor: string;
}

const moodOptions: MoodOption[] = [
  {
    id: 'overthinking',
    emoji: '🤯',
    title: '大脑停不下来',
    description: '思绪纷飞，无法平静',
    gradient: 'from-purple-600 to-indigo-600',
    iconColor: 'text-purple-400'
  },
  {
    id: 'heartache',
    emoji: '💔',
    title: '心里有点难受',
    description: '情绪低落，需要安慰',
    gradient: 'from-pink-600 to-rose-600',
    iconColor: 'text-pink-400'
  },
  {
    id: 'insomnia',
    emoji: '😵‍💫',
    title: '失眠/睡不着',
    description: '辗转反侧，难以入眠',
    gradient: 'from-blue-600 to-cyan-600',
    iconColor: 'text-blue-400'
  },
  {
    id: 'sadness',
    emoji: '🌧️',
    title: '莫名低落',
    description: '情绪低迷，需要陪伴',
    gradient: 'from-gray-600 to-slate-600',
    iconColor: 'text-gray-400'
  },
  {
    id: 'anxiety',
    emoji: '😰',
    title: '焦虑不安',
    description: '心慌意乱，需要平静',
    gradient: 'from-orange-600 to-red-600',
    iconColor: 'text-orange-400'
  },
  {
    id: 'exhausted',
    emoji: '🫠',
    title: '身心俱疲',
    description: '精疲力尽，需要充电',
    gradient: 'from-green-600 to-teal-600',
    iconColor: 'text-green-400'
  }
];

const FlowBotHome: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const originalTitle = document.title;
    document.title = '心情疗愈师 - 选择你的心情';
    return () => { document.title = originalTitle; };
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('zh-CN', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
      setCurrentTime(timeString);
    };
    
    updateTime();
    const timeInterval = setInterval(updateTime, 60000);
    
    return () => clearInterval(timeInterval);
  }, []);

  const handleMoodSelect = (moodId: string) => {
    if (isTransitioning) return;
    
    setSelectedMood(moodId);
    setIsTransitioning(true);
    
    // 延迟导航到疗愈页面
    setTimeout(() => {
      navigate(`/healing?mood=${moodId}`);
    }, 800);
  };

  return (
    <div className={`${styles.pageWrapper} min-h-screen flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden`}>
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary" />
      <div className="absolute inset-0 bg-black/20" />
      
      {/* 动态光晕效果 */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/10 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      {/* 主要内容 */}
      <div className="relative z-10 w-full max-w-4xl">
        {/* 时间显示 */}
        <div className="text-center mb-12">
          <div className={`inline-block px-6 py-3 ${styles.glassCard} mb-8`}>
            <div className="text-3xl font-light text-text-primary/90 mb-1 tracking-wide">{currentTime}</div>
            <div className="text-sm text-text-secondary/80">深夜时刻</div>
          </div>
        </div>

        {/* 标题 */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-light text-text-primary mb-6 leading-tight">
            今晚，<span className="font-medium">你的心情是</span>？
          </h1>
          <p className="text-lg text-text-secondary/80 max-w-2xl mx-auto leading-relaxed">
            选择最贴合你此刻感受的卡片，让我为你准备一份专属的疗愈体验
          </p>
        </div>

        {/* 心情卡片网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {moodOptions.map((mood) => (
            <div
              key={mood.id}
              onClick={() => handleMoodSelect(mood.id)}
              className={`relative group cursor-pointer transform transition-all duration-500 ${
                selectedMood === mood.id ? 'scale-95 opacity-0' : 'scale-100 opacity-100 hover:scale-105'
              } ${selectedMood && selectedMood !== mood.id ? 'opacity-50' : ''}`}
            >
              <div className={`${styles.moodCard} p-8 h-full min-h-[200px] flex flex-col items-center justify-center text-center`}>
                {/* 背景渐变 */}
                <div className={`absolute inset-0 bg-gradient-to-br ${mood.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-2xl`} />
                
                {/* 图标 */}
                <div className={`text-6xl mb-4 ${mood.iconColor} transition-all duration-300 group-hover:scale-110`}>
                  {mood.emoji}
                </div>
                
                {/* 标题 */}
                <h3 className="text-xl font-medium text-text-primary mb-3">
                  {mood.title}
                </h3>
                
                {/* 描述 */}
                <p className="text-sm text-text-secondary/80 leading-relaxed">
                  {mood.description}
                </p>
                
                {/* 悬停效果 */}
                <div className="absolute inset-0 rounded-2xl border border-border-light/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          ))}
        </div>

        {/* 底部提示 */}
        <div className="text-center">
          <p className="text-sm text-text-tertiary/60 animate-pulse">
            点击卡片，开启你的疗愈之旅
          </p>
        </div>
      </div>

      {/* 过渡动画遮罩 */}
      {isTransitioning && (
        <div className="fixed inset-0 bg-black z-50 animate-fade-in" />
      )}
    </div>
  );
};

export default FlowBotHome;