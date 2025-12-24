import React, { createContext, useContext, useRef, useState, useEffect } from 'react';
import { audioUnlockService } from '../services/AudioUnlockService';

export interface AudioTrack {
  id: string;
  name: string;
  url: string;
  duration?: number;
}

export interface AudioManagerContextType {
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  isMuted: boolean;
  tracks: AudioTrack[];
  play: (trackId: string) => void;
  pause: () => void;
  toggleMute: () => void;
  setVolume: (volume: number) => void;
  seek: (progress: number) => void;
  loadTracks: (tracks: AudioTrack[]) => void;
  unlockAndPlay: (trackId: string) => Promise<boolean>;
  fadeInPlay: (trackId: string, duration?: number) => Promise<void>;
}

const AudioManagerContext = createContext<AudioManagerContextType | null>(null);

export const useAudioManager = () => {
  const context = useContext(AudioManagerContext);
  if (!context) {
    throw new Error('useAudioManager must be used within AudioManagerProvider');
  }
  return context;
};

export const AudioManagerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [tracks, setTracks] = useState<AudioTrack[]>([
    {
      id: 'rain-ambient',
      name: '雨声环境音',
      url: '/audio/rain.mp3', // 优先使用本地文件
    },
    {
      id: 'soft-piano',
      name: '柔和钢琴曲',
      url: 'https://actions.google.com/sounds/v1/ambiences/magical_chime.ogg',
    },
    {
      id: 'sleep-music',
      name: '睡眠音乐',
      url: 'https://actions.google.com/sounds/v1/ambiences/overnight_silence.ogg',
    },
    {
      id: 'nature-sounds',
      name: '自然声音',
      url: 'https://actions.google.com/sounds/v1/weather/thunder_crack.ogg',
    },
    {
      id: 'meditation',
      name: '冥想音乐',
      url: 'https://actions.google.com/sounds/v1/ambiences/rolling_brook.ogg',
    },
    {
      id: 'relaxing-nature',
      name: '放松自然音',
      url: 'https://actions.google.com/sounds/v1/weather/wind.ogg',
    }
  ]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio();
      audioRef.current.preload = 'auto';
      
      const audio = audioRef.current;
      
      const updateTime = () => {
        if (audio.duration) {
          setProgress((audio.currentTime / audio.duration) * 100);
        }
      };

      const handleEnded = () => {
        setIsPlaying(false);
        setProgress(0);
      };

      audio.addEventListener('timeupdate', updateTime);
      audio.addEventListener('ended', handleEnded);
      audio.volume = volume;

      return () => {
        audio.removeEventListener('timeupdate', updateTime);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const play = (trackId: string) => {
    const track = tracks.find(t => t.id === trackId);
    if (!track || !audioRef.current) return;

    const attemptPlay = async (url: string, fallbackUrl?: string) => {
      try {
        if (currentTrack?.id !== trackId) {
          audioRef.current!.src = url;
          setCurrentTrack(track);
          setProgress(0);
        }

        await audioRef.current!.play();
        setIsPlaying(true);
        return true;
      } catch (error) {
        console.warn(`Failed to play ${url}:`, error);
        
        if (fallbackUrl && url.includes('/audio/')) {
          console.log('Attempting fallback to online resource...');
          return attemptPlay(fallbackUrl);
        }
        
        console.error('Audio play failed:', error);
        setIsPlaying(false);
        return false;
      }
    };

    // 为本地音频设置降级URL
    const fallbackUrls: Record<string, string> = {
      'rain-ambient': 'https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg',
      'soft-piano': 'https://actions.google.com/sounds/v1/ambiences/magical_chime.ogg',
      'sleep-music': 'https://actions.google.com/sounds/v1/ambiences/overnight_silence.ogg',
      'nature-sounds': 'https://actions.google.com/sounds/v1/weather/thunder_crack.ogg',
      'meditation': 'https://actions.google.com/sounds/v1/ambiences/rolling_brook.ogg',
      'relaxing-nature': 'https://actions.google.com/sounds/v1/weather/wind.ogg'
    };

    const fallbackUrl = fallbackUrls[trackId];
    attemptPlay(track.url, fallbackUrl);
  };

  // 解锁并播放音频 - 用于用户交互触发
  const unlockAndPlay = async (trackId: string): Promise<boolean> => {
    try {
      // 首先解锁音频
      const unlocked = await audioUnlockService.unlockAudio();
      if (!unlocked) {
        console.error('Failed to unlock audio');
        return false;
      }

      // 然后播放音频
      play(trackId);
      return true;
    } catch (error) {
      console.error('Error in unlockAndPlay:', error);
      return false;
    }
  };

  // 音量渐入播放
  const fadeInPlay = async (trackId: string, duration: number = 2000): Promise<void> => {
    const track = tracks.find(t => t.id === trackId);
    if (!track || !audioRef.current) return;

    if (currentTrack?.id !== trackId) {
      audioRef.current.src = track.url;
      setCurrentTrack(track);
      setProgress(0);
    }

    try {
      // 开始播放（音量为0）
      audioRef.current.volume = 0;
      await audioRef.current.play();
      setIsPlaying(true);

      // 渐入音量
      await audioUnlockService.createFadeIn(audioRef.current, duration);
    } catch (error) {
      console.error('Error in fadeInPlay:', error);
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      const newMutedState = !isMuted;
      audioRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
    }
  };

  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume);
  };

  const seek = (newProgress: number) => {
    if (audioRef.current && audioRef.current.duration) {
      const time = (newProgress / 100) * audioRef.current.duration;
      audioRef.current.currentTime = time;
      setProgress(newProgress);
    }
  };

  const loadTracks = (newTracks: AudioTrack[]) => {
    setTracks(newTracks);
  };

  const value: AudioManagerContextType = {
    currentTrack,
    isPlaying,
    volume,
    progress,
    isMuted,
    tracks,
    play,
    pause,
    toggleMute,
    setVolume,
    seek,
    loadTracks,
    unlockAndPlay,
    fadeInPlay,
  };

  return (
    <AudioManagerContext.Provider value={value}>
      {children}
    </AudioManagerContext.Provider>
  );
};