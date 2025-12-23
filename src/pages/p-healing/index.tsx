import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.css';
import PageTransition from '../../components/PageTransition';
import DynamicBackground from '../../components/DynamicBackground';
import { useAudio } from '../../audio/AudioManager';
import { fetchHealingText, HealingTextResponse } from '../../services/aiService';

interface MoodInfo {
  mood: string;
  title: string;
  emoji: string;
}

const HealingPage: React.FC = () => {
  const navigate = useNavigate();
  const { toggleAudio, isAudioPlaying } = useAudio();
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [showInputOption, setShowInputOption] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [healingText, setHealingText] = useState<string>('正在接收来自星空的信号...');
  const [isLoadingText, setIsLoadingText] = useState(true);
  const [aiError, setAiError] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  // 根据心情获取显示信息
  const getMoodInfo = (moodId: string) => {
    const moodMap: Record<string, { mood: string; title: string; emoji: string }> = {
      overthinking: {
        mood: '大脑停不下来',
        title: '让思绪缓缓流淌',
        emoji: '🤯'
      },
      heartbroken: {
        mood: '心里有点难受',
        title: '让温暖拥抱你的心',
        emoji: '💔'
      },
      insomnia: {
        mood: '失眠/睡不着',
        title: '与月光一同入眠',
        emoji: '😵‍💫'
      },
      sad: {
        mood: '莫名低落',
        title: '让情绪自然流淌',
        emoji: '🌧️'
      }
    };

    return moodMap[moodId] || moodMap.overthinking;
  };

  const selectedMood = sessionStorage.getItem('selectedMood') || 'overthinking';
  const selectedReason = sessionStorage.getItem('selectedReason') || '';
  const moodInfo = getMoodInfo(selectedMood);

  useEffect(() => {
    const originalTitle = document.title;
    document.title = '疗愈空间 - 正在为你温柔陪伴';
    
    // 延迟显示内容，营造沉浸感
    setTimeout(() => {
      setIsContentVisible(true);
    }, 800);

    return () => { document.title = originalTitle; };
  }, []);

  // AI 文案获取效果
  useEffect(() => {
    const fetchAIContent = async () => {
      setIsLoadingText(true);
      setAiError(null);
      
      try {
        const response: HealingTextResponse = await fetchHealingText({
          mood: selectedMood,
          reason: selectedReason,
        });
        
        if (response.success) {
          setHealingText(response.text);
        } else {
          setHealingText(response.text);
          setAiError(response.error || null);
        }
      } catch (error) {
        console.error('Failed to fetch healing text:', error);
        setHealingText('深夜的星光，正温柔地注视着你。');
        setAiError('网络连接出现问题');
      } finally {
        setIsLoadingText(false);
      }
    };

    fetchAIContent();
  }, [selectedMood, selectedReason]);

  const handleBackToMoods = () => {
    navigate('/home');
  };

  const handleSubmitInput = async () => {
    if (userInput.trim()) {
      // 立即关闭模态框
      setShowInputOption(false);
      const inputText = userInput.trim();
      setUserInput('');
      
      // 更新UI状态为等待中
      setHealingText('正在倾听星空的回响...');
      setIsLoadingText(true);
      setAiError(null);

      try {
        const response: HealingTextResponse = await fetchHealingText({
          mood: selectedMood,
          reason: selectedReason,
          userInput: inputText,
        });
        
        if (response.success) {
          // 使用打字机效果显示结果
          await typewriterEffect(response.text);
        } else {
          setHealingText(response.text);
          setAiError(response.error || null);
        }
      } catch (error) {
        console.error('Failed to fetch healing response:', error);
        setHealingText('星空似乎有点拥挤，请稍后再试...');
        setAiError('网络连接出现问题');
      } finally {
        setIsLoadingText(false);
      }
    }
  };

  // 打字机效果
  const typewriterEffect = async (text: string) => {
    setIsTyping(true);
    setHealingText('');
    
    for (let i = 0; i <= text.length; i++) {
      setHealingText(text.substring(0, i));
      await new Promise(resolve => setTimeout(resolve, 50)); // 50ms per character
    }
    
    setIsTyping(false);
    setIsLoadingText(false);
  };

  return (
    <PageTransition>
      <div className={`${styles.healingWrapper} min-h-screen relative overflow-hidden`}>
        {/* 动态背景 */}
        <DynamicBackground variant="aurora" />

        {/* 音频控制按钮 */}
        <button
          onClick={toggleAudio}
          className={`${styles.audioControl} ${isAudioPlaying ? styles.playing : ''}`}
          aria-label={isAudioPlaying ? '暂停音乐' : '播放音乐'}
        >
          <i className={`fas ${isAudioPlaying ? 'fa-pause' : 'fa-play'}`}></i>
        </button>

        {/* 返回按钮 */}
        <button
          onClick={handleBackToMoods}
          className={styles.backButton}
          aria-label="返回心情选择"
        >
          <i className="fas fa-arrow-left"></i>
        </button>

        {/* 主内容区域 */}
        <main className={styles.mainContent}>
          <div className={styles.contentContainer}>
            {/* 标题 */}
            <div className={`${styles.title} ${isContentVisible ? styles.visible : ''}`}>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                {moodInfo.title}
              </h1>
              <div className={`${styles.moodBadge} ${isContentVisible ? styles.visible : ''}`}>
                <span className="text-2xl mr-2">{moodInfo.emoji}</span>
                <span className="text-white/90">{moodInfo.mood}</span>
                {selectedReason && (
                  <span className="text-white/70 ml-2">· {selectedReason}</span>
                )}
              </div>
            </div>

            {/* AI 生成的疗愈文案 - 墨水晕染效果 */}
            <div className={styles.textContent}>
              <p
                className={`${styles.textParagraph} ${isLoadingText ? styles.loading : ''} ${isTyping ? styles.typing : ''} ${isContentVisible ? styles.visible : ''}`}
              >
                {healingText}
                {isTyping && <span className={styles.cursor}>|</span>}
              </p>
              {aiError && (
                <p className="text-white/50 text-sm mt-2 text-center">
                  <i className="fas fa-wifi mr-1"></i>
                  {aiError}
                </p>
              )}
            </div>

            {/* 底部操作区域 */}
            <div className={`${styles.bottomActions} ${isContentVisible ? styles.visible : ''}`}>
              {/* 我想多说两句 按钮 */}
              {!showInputOption ? (
                <button
                  onClick={() => setShowInputOption(true)}
                  className={styles.talkMoreButton}
                >
                  <i className="fas fa-comment-dots mr-2"></i>
                  我想多说两句
                </button>
              ) : (
                <div className={styles.inputContainer}>
                  <textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="在这里告诉我更多你的想法..."
                    className={styles.textInput}
                    rows={3}
                    maxLength={300}
                  />
                  <div className={styles.inputActions}>
                    <button
                      onClick={() => {
                        setShowInputOption(false);
                        setUserInput('');
                      }}
                      className={styles.cancelButton}
                    >
                      取消
                    </button>
                    <button
                      onClick={handleSubmitInput}
                      disabled={!userInput.trim()}
                      className={styles.submitButton}
                    >
                      发送
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* 装饰性元素 */}
        <div className={styles.decorativeElements}>
          <div className={`${styles.floatingOrb} ${styles.orb1}`}></div>
          <div className={`${styles.floatingOrb} ${styles.orb2}`}></div>
          <div className={`${styles.floatingOrb} ${styles.orb3}`}></div>
        </div>
      </div>
    </PageTransition>
  );
};

export default HealingPage;