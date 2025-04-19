import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';

interface Meteor {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
  angle: number;
  size: number;
}

const MeteorBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const meteors = useRef<Meteor[]>([]);
  const animationFrameId = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createMeteor = (): Meteor => {
      const angle = Math.random() * Math.PI / 4 + Math.PI / 4;
      const length = Math.random() * 150 + 100;
      return {
        x: Math.random() * canvas.width,
        y: -length,
        length,
        speed: Math.random() * 8 + 5,
        opacity: Math.random() * 0.7 + 0.3,
        angle,
        size: Math.random() * 2 + 1,
      };
    };

    const updateMeteors = () => {
      meteors.current = meteors.current.filter(meteor => {
        meteor.x += Math.cos(meteor.angle) * meteor.speed;
        meteor.y += Math.sin(meteor.angle) * meteor.speed;
        return meteor.y < canvas.height + meteor.length;
      });

      if (Math.random() < 0.05) {
        meteors.current.push(createMeteor());
      }
    };

    const drawMeteors = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      meteors.current.forEach(meteor => {
        // 绘制流星头部
        ctx.beginPath();
        ctx.arc(meteor.x, meteor.y, meteor.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = '#00FFB8';
        ctx.fill();

        // 绘制流星尾部
        const gradient = ctx.createLinearGradient(
          meteor.x,
          meteor.y,
          meteor.x - Math.cos(meteor.angle) * meteor.length,
          meteor.y - Math.sin(meteor.angle) * meteor.length
        );
        
        gradient.addColorStop(0, `rgba(0, 255, 184, ${meteor.opacity})`);
        gradient.addColorStop(0.5, `rgba(0, 255, 184, ${meteor.opacity * 0.5})`);
        gradient.addColorStop(1, 'transparent');
        
        ctx.beginPath();
        ctx.moveTo(meteor.x, meteor.y);
        ctx.lineTo(
          meteor.x - Math.cos(meteor.angle) * meteor.length,
          meteor.y - Math.sin(meteor.angle) * meteor.length
        );
        ctx.strokeStyle = gradient;
        ctx.lineWidth = meteor.size;
        ctx.stroke();

        // 添加发光效果
        ctx.shadowBlur = 15;
        ctx.shadowColor = 'rgba(0, 255, 184, 0.8)';
      });
    };

    const animate = () => {
      updateMeteors();
      drawMeteors();
      animationFrameId.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <Box
      component="canvas"
      ref={canvasRef}
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        background: 'transparent',
      }}
    />
  );
};

export default MeteorBackground; 