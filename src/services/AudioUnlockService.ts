/**
 * 全局音频解锁服务
 * 实现用户交互解锁音频播放的策略
 */

class AudioUnlockService {
  private audioContext: AudioContext | null = null;
  private unlocked: boolean = false;
  private pendingAudioTrack: string | null = null;

  constructor() {
    // 初始化 AudioContext
    this.initAudioContext();
  }

  private initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }
  }

  /**
   * 用户交互解锁音频
   * 必须在用户交互事件中调用（如 onClick）
   */
  async unlockAudio(): Promise<boolean> {
    if (this.unlocked) return true;

    try {
      // 方法1: 解锁 AudioContext
      if (this.audioContext && this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      // 方法2: 播放静音音频解锁 HTMLAudioElement
      const silentAudio = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAAAQAEAAEAfAAAQAQABAAgAZGF0YQAAAAA=');
      silentAudio.volume = 0;
      await silentAudio.play();
      silentAudio.pause();

      this.unlocked = true;
      console.log('Audio unlocked successfully');
      return true;
    } catch (error) {
      console.error('Failed to unlock audio:', error);
      return false;
    }
  }

  /**
   * 检查音频是否已解锁
   */
  isUnlocked(): boolean {
    return this.unlocked;
  }

  /**
   * 设置待播放的音频轨道
   */
  setPendingAudioTrack(trackId: string) {
    this.pendingAudioTrack = trackId;
  }

  /**
   * 获取待播放的音频轨道
   */
  getPendingAudioTrack(): string | null {
    const track = this.pendingAudioTrack;
    this.pendingAudioTrack = null; // 获取后清除
    return track;
  }

  /**
   * 获取 AudioContext 实例
   */
  getAudioContext(): AudioContext | null {
    return this.audioContext;
  }

  /**
   * 创建一个音量渐入的效果
   */
  createFadeIn(audioElement: HTMLAudioElement, duration: number = 2000): Promise<void> {
    return new Promise((resolve) => {
      if (!audioElement) {
        resolve();
        return;
      }

      audioElement.volume = 0;
      const targetVolume = 0.7;
      const steps = 60; // 60 steps for smooth fade
      const stepDuration = duration / steps;
      let currentStep = 0;

      const fadeInterval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        audioElement.volume = targetVolume * progress;

        if (currentStep >= steps) {
          clearInterval(fadeInterval);
          resolve();
        }
      }, stepDuration);
    });
  }
}

// 创建全局单例实例
export const audioUnlockService = new AudioUnlockService();