import React, { useEffect, useState, useRef } from 'react';
import styles from './DynamicBackground.module.css';

interface DynamicBackgroundProps {
  emotion?: string;
  className?: string;
  interactive?: boolean;
}

const DynamicBackground: React.FC<DynamicBackgroundProps> = ({ 
  emotion = 'calm', 
  className = '',
  interactive = true 
}) => {
  const [mounted, setMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    setMounted(true);
    
    if (interactive && canvasRef.current) {
      initCanvas();
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [interactive]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [interactive]);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      color: string;
    }> = [];
    
    // 创建粒子
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
        color: getParticleColor()
      });
    }
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // 更新和绘制粒子
      particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // 边界检测
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        
        // 绘制粒子
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity;
        ctx.fill();
        
        // 连接临近粒子
        particles.forEach((otherParticle, otherIndex) => {
          if (index === otherIndex) return;
          
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = particle.color;
            ctx.globalAlpha = (1 - distance / 100) * 0.2;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });
      
      ctx.globalAlpha = 1;
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
  };

  const getParticleColor = () => {
    const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#60a5fa', '#a78bfa'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const getBackgroundStyle = () => {
    const backgrounds = {
      overthinking: 'radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.15), transparent 50%), radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.1), transparent 50%), #0a0e27',
      heartache: 'radial-gradient(circle at 30% 70%, rgba(236, 72, 153, 0.15), transparent 50%), radial-gradient(circle at 70% 30%, rgba(219, 39, 119, 0.1), transparent 50%), #0a0e27',
      insomnia: 'radial-gradient(circle at 15% 25%, rgba(59, 130, 246, 0.15), transparent 50%), radial-gradient(circle at 85% 75%, rgba(34, 211, 238, 0.1), transparent 50%), #0a0e27',
      sadness: 'radial-gradient(circle at 25% 40%, rgba(107, 114, 128, 0.15), transparent 50%), radial-gradient(circle at 75% 60%, rgba(148, 163, 184, 0.1), transparent 50%), #0a0e27',
      anxiety: 'radial-gradient(circle at 35% 20%, rgba(251, 146, 60, 0.15), transparent 50%), radial-gradient(circle at 65% 80%, rgba(239, 68, 68, 0.1), transparent 50%), #0a0e27',
      exhausted: 'radial-gradient(circle at 40% 60%, rgba(34, 197, 94, 0.15), transparent 50%), radial-gradient(circle at 60% 40%, rgba(20, 184, 166, 0.1), transparent 50%), #0a0e27',
      calm: 'radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.15), transparent 50%), radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.1), transparent 50%), #0a0e27',
      happy: 'radial-gradient(circle at 25% 50%, rgba(240, 147, 251, 0.15), transparent 50%), radial-gradient(circle at 75% 50%, rgba(245, 87, 108, 0.1), transparent 50%), #0a0e27',
      peaceful: 'radial-gradient(circle at 30% 40%, rgba(79, 172, 254, 0.15), transparent 50%), radial-gradient(circle at 70% 60%, rgba(0, 242, 254, 0.1), transparent 50%), #0a0e27'
    };
    
    return backgrounds[emotion as keyof typeof backgrounds] || backgrounds.calm;
  };

  if (!mounted) {
    return <div className={`${styles.background} ${className}`} />;
  }

  return (
    <div 
      className={`${styles.background} ${className}`}
      style={{ 
        background: getBackgroundStyle(),
        backgroundSize: '400% 400%',
        animation: 'gradientShift 20s ease infinite'
      }}
    >
      {/* 互动粒子画布 */}
      {interactive && (
        <canvas
          ref={canvasRef}
          className={styles.canvas}
        />
      )}
      
      {/* 静态粒子层 */}
      <div className={styles.overlay}>
        <div className={styles.particles}>
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className={styles.particle}
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 8}s`,
                animationDuration: `${8 + Math.random() * 6}s`,
              }}
            />
          ))}
        </div>
      </div>
      
      {/* 动态网格背景 */}
      <div className={styles.grid}>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={styles.gridLine}
            style={{
              left: `${(i * 5)}%`,
              animationDelay: `${i * 0.1}s`
            }}
          />
        ))}
      </div>
      
      {/* 光晕效果 */}
      <div className={styles.glowEffects}>
        <div 
          className={styles.glowOrb}
          style={{
            left: `${mousePosition.x}px`,
            top: `${mousePosition.y}px`,
          }}
        />
        <div className={`${styles.glowOrb} ${styles.static}`} style={{ top: '20%', left: '10%' }} />
        <div className={`${styles.glowOrb} ${styles.static}`} style={{ top: '60%', right: '15%' }} />
        <div className={`${styles.glowOrb} ${styles.static}`} style={{ bottom: '20%', left: '30%' }} />
      </div>
      
      {/* 数据流动效果 */}
      <div className={styles.dataStreams}>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={styles.dataStream}
            style={{
              left: `${20 + (i * 15)}%`,
              animationDelay: `${i * 1.5}s`,
              animationDuration: `${10 + Math.random() * 5}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default DynamicBackground;