import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './styles.module.css';
import { useAudioManager } from '../../audio/AudioManager';
import { fetchHealingText, HealingTextResponse } from '../../services/aiService';
import DynamicBackground from '../../components/DynamicBackground';

// 子标签映射表
const subTagMapping: Record<string, string> = {
  'work-stress': '工作/学业压力',
  'replaying-moments': '反复回想囧事',
  'future-worry': '担忧未来',
  'random-thoughts': '停不下来的胡思乱想',
  'overanalysis': '过度分析细节',
  'decision-paralysis': '选择困难',
  'breakup': '分手失恋',
  'loneliness': '感到孤单',
  'betrayal': '被背叛伤害',
  'missing-someone': '想念某人',
  'unrequited': '单恋苦涩',
  'friendship-hurt': '友情伤害',
  'anxious-sleep': '焦虑性失眠',
  'irregular-schedule': '作息紊乱',
  'screen-addiction': '睡前刷手机',
  'nightmare': '噩梦困扰',
  'early-awake': '凌晨早醒',
  'racing-mind': '思绪奔涌难眠',
  'no-reason': '莫名的忧伤',
  'weather-influence': '天气影响心情',
  'hormonal': '荷尔蒙波动',
  'past-memories': '触景生情',
  'disappointed': '感到失望',
  'empty-feeling': '内心空洞',
  'social-anxiety': '社交恐惧',
  'performance-pressure': '表现压力',
  'health-worry': '健康焦虑',
  'financial-stress': '经济压力',
  'panic-attack': '恐慌发作',
  'overwhelmed': '感到不知所措',
  'physical-fatigue': '身体疲惫',
  'mental-burnout': '精神倦怠',
  'emotional-drain': '情绪耗竭',
  'overworked': '过度劳累',
  'lack-rest': '缺乏休息',
  'chronic-tired': '慢性疲劳'
};

const moodConfig: Record<string, { title: string; emoji: string; bgVideo: string; audioTrack: string }> = {
  overthinking: {
    title: '让思绪缓缓流淌',
    emoji: '🤯',
    bgVideo: 'rain-window',
    audioTrack: 'rain-ambient'
  },
  heartache: {
    title: '让温暖拥抱你的心',
    emoji: '💔',
    bgVideo: 'fireplace',
    audioTrack: 'soft-piano'
  },
  insomnia: {
    title: '与月光一同入眠',
    emoji: '😵‍💫',
    bgVideo: 'night-sky',
    audioTrack: 'sleep-music'
  },
  sadness: {
    title: '让情绪自然流淌',
    emoji: '🌧️',
    bgVideo: 'gentle-rain',
    audioTrack: 'nature-sounds'
  },
  anxiety: {
    title: '在平静中找到安宁',
    emoji: '😰',
    bgVideo: 'calm-lake',
    audioTrack: 'meditation'
  },
  exhausted: {
    title: '让身心慢慢恢复',
    emoji: '🫠',
    bgVideo: 'forest-breeze',
    audioTrack: 'relaxing-nature'
  }
};

const ImmersiveHealingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { play, pause, isPlaying, isMuted, toggleMute, fadeInPlay } = useAudioManager();
  
  const [moodId] = useState(searchParams.get('mood') || 'overthinking');
  const [subTagId] = useState(searchParams.get('subTag') || '');
  const [displayedText, setDisplayedText] = useState('');
  const [showInputOption, setShowInputOption] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const moodInfo = moodConfig[moodId] || moodConfig.overthinking;

  useEffect(() => {
    const originalTitle = document.title;
    document.title = '深夜疗愈空间 - 月光在等你';

    setTimeout(() => {
      setIsContentVisible(true);
    }, 1000);

    return () => {
      document.title = originalTitle;
      pause();
    };
  }, [pause]);

  useEffect(() => {
    const fetchAndDisplayText = async () => {
      await typewriterEffect('正在倾听你的心声...');
      
      try {
        const reason = subTagId ? subTagMapping[subTagId] || '' : '';
        
        // 使用Promise.race实现超时控制（8秒超时）
        const timeoutPromise = new Promise<{ success: false; error: string }>((_, reject) => {
          setTimeout(() => reject(new Error('Request timeout after 8 seconds')), 8000);
        });
        
        const apiPromise = fetchHealingText({
          mood: moodId,
          reason: reason,
        });
        
        const response = await Promise.race([apiPromise, timeoutPromise]) as HealingTextResponse;
        
        console.log('API Response:', JSON.stringify(response, null, 2));
        
        await new Promise(resolve => setTimeout(resolve, 500));
        setDisplayedText('');
        
        if (response.success && response.text && response.text.trim()) {
          await typewriterEffect(response.text);
        } else {
          // 降级文案
          const fallbackTexts = [
            '星空太安静了，但我在这里陪着你...',
            '今晚的月色很温柔，就像我对你的陪伴。',
            '让所有的思绪都随着星光慢慢消散吧。',
            '在这个安静的夜晚，你不是一个人。',
            '把烦恼交给星空，把美好留给自己。',
          ];
          await typewriterEffect(fallbackTexts[Math.floor(Math.random() * fallbackTexts.length)]);
        }
      } catch (error) {
        console.error('Failed to fetch healing text:', error);
        setDisplayedText('');
        // 错误降级文案
        const errorFallbackTexts = [
          '星空太安静了，但我在这里陪着你...',
          '今晚的月色很温柔，就像我对你的陪伴。',
          '把烦恼交给星空，把美好留给自己。',
        ];
        await typewriterEffect(errorFallbackTexts[Math.floor(Math.random() * errorFallbackTexts.length)]);
      }
    };

    fetchAndDisplayText();
  }, [moodId, subTagId]);

  const typewriterEffect = async (text: string) => {
    setIsTyping(true);
    setDisplayedText('');
    
    for (let i = 0; i <= text.length; i++) {
      setDisplayedText(text.substring(0, i));
      await new Promise(resolve => setTimeout(resolve, 60));
    }
    
    setIsTyping(false);
  };

  const handleBackToMoods = () => {
    navigate('/home');
  };

  // 语音识别初始化
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'zh-CN';

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setUserInput(prev => prev + (prev ? ' ' : '') + transcript);
          setIsListening(false);
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const handleSubmitInput = async () => {
    if (userInput.trim()) {
      setShowInputOption(false);
      const inputText = userInput.trim();
      setUserInput('');
      
      setDisplayedText('');
      setIsTyping(false);

      try {
        const reason = subTagId ? subTagMapping[subTagId] || '' : '';
        const response: HealingTextResponse = await fetchHealingText({
          mood: moodId,
          reason: reason,
          userInput: inputText,
        });
        
        if (response.success) {
          await typewriterEffect(response.text);
        } else {
          await typewriterEffect('星星正在眨眼...');
        }
      } catch (error) {
        console.error('Failed to fetch healing response:', error);
        await typewriterEffect('星星正在眨眼...');
      }
    }
  };

  const handleAudioToggle = () => {
    console.log('🎧 音频按钮被点击, isPlaying:', isPlaying);

    if (isPlaying) {
      console.log('⏸️ 暂停播放');
      pause();
    } else {
      console.log('▶️ 开始播放');
      play(moodInfo.audioTrack);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 高科技动态背景 */}
      <DynamicBackground emotion={moodId} interactive={true} />
      
      {/* 粒子效果层 */}
      <div className="particle-container">
        {[...Array(60)].map((_, i) => (
          <div 
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${10 + Math.random() * 8}s`
            }}
          />
        ))}
      </div>

      {/* 音频控制按钮 */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleAudioToggle();
        }}
        className={`fixed top-24 right-8 z-50 w-14 h-14 tech-card flex items-center justify-center group transition-all duration-300 hover:scale-110 ${isPlaying ? 'glow-border' : ''}`}
        aria-label={isPlaying ? '暂停' : '播放'}
      >
        <i className={`fas text-lg ${isPlaying ? 'fa-pause text-green-400' : 'fa-play text-blue-400'} group-hover:scale-110 transition-all`}></i>
      </button>

      {/* 返回按钮 */}
      <button
        onClick={handleBackToMoods}
        className="fixed top-24 left-8 z-50 w-12 h-12 tech-card flex items-center justify-center group transition-all duration-300 hover:scale-110"
        aria-label="返回心情选择"
      >
        <i className="fas fa-arrow-left text-blue-400 group-hover:text-purple-400 group-hover:scale-110 transition-all"></i>
      </button>

      {/* 主内容区域 */}
      <main className="relative z-10 flex items-center justify-center min-h-screen px-6">
        <div className={`max-w-5xl mx-auto text-center ${isContentVisible ? 'animate-in slide-in-from-bottom duration-1000' : 'opacity-0'}`}>
          {/* 情绪状态显示 */}
          <div className="tech-card p-8 mb-12 relative overflow-hidden">
            <div className="absolute inset-0 data-stream opacity-30"></div>
            <div className="relative z-10">
              <div className="w-24 h-24 mx-auto mb-6 relative">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-sm flex items-center justify-center tech-card">
                  <span className="text-5xl">{moodInfo.emoji}</span>
                </div>
                <div className="absolute inset-0 rounded-full border-2 border-blue-400/30 animate-spin-slow"></div>
              </div>
              <h1 className="tech-title text-3xl md:text-4xl mb-3">
                {moodInfo.title}
              </h1>
              <div className="tech-font text-sm text-gray-400 tracking-wider uppercase">
                深夜疗愈时刻
              </div>
            </div>
          </div>

          {/* AI 生成的疗愈文案 */}
          <div className="tech-card p-10 mb-12 relative">
            <div className="absolute top-4 right-4 flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs tech-font text-green-400">正在倾听</span>
            </div>
            
            <div className="relative z-10">
              {isTyping && (
                <div className="flex items-center justify-center mb-6">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                  </div>
                </div>
              )}
              
              <p className={`text-lg md:text-xl text-gray-200 leading-relaxed font-light ${isTyping ? 'animate-pulse' : ''} relative`}>
                <span className="absolute inset-0 text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text blur-sm -z-10">
                  {displayedText}
                </span>
                {displayedText}
                {isTyping && <span className="text-purple-400 animate-pulse">_</span>}
              </p>
            </div>
          </div>

          {/* 底部操作区域 */}
          <div className={`${isContentVisible ? 'animate-in slide-in-from-bottom duration-1000 delay-300' : 'opacity-0'}`}>
            {!showInputOption ? (
              <button
                onClick={() => setShowInputOption(true)}
                className="tech-button group"
              >
                <i className="fas fa-comment-dots mr-2 group-hover:animate-pulse"></i>
                我想和你聊聊
              </button>
            ) : (
              <div className="tech-card p-6 max-w-2xl mx-auto">
                <div className="relative mb-4">
                  <textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="告诉我你的想法..."
                    className="tech-input min-h-[120px] resize-none pr-12"
                    maxLength={300}
                    autoFocus
                  />
                  {/* 语音输入按钮 */}
                  <button
                    onMouseDown={startListening}
                    onMouseUp={stopListening}
                    onMouseLeave={stopListening}
                    onTouchStart={(e) => { e.preventDefault(); startListening(); }}
                    onTouchEnd={(e) => { e.preventDefault(); stopListening(); }}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isListening 
                        ? 'bg-red-500/20 text-red-400 animate-pulse scale-110' 
                        : 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 hover:scale-110'
                    }`}
                    title="按住说话"
                  >
                    <i className={`fas ${isListening ? 'fa-microphone-slash' : 'fa-microphone'} text-sm`}></i>
                  </button>
                </div>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => {
                      setShowInputOption(false);
                      setUserInput('');
                    }}
                    className="px-6 py-3 border border-gray-600 text-gray-300 rounded-xl hover:border-gray-500 hover:text-gray-200 transition-all duration-300 hover:scale-105"
                  >
                    <i className="fas fa-times mr-2"></i>
                    取消
                  </button>
                  <button
                    onClick={handleSubmitInput}
                    disabled={!userInput.trim()}
                    className="tech-button disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <i className="fas fa-paper-plane mr-2"></i>
                    发送
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ImmersiveHealingPage;