import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Waves, Zap, Trophy, X } from 'lucide-react';

interface SurfingGameProps {
  onComplete: (score: number) => void;
  onClose: () => void;
}

export default function SurfingGame({ onComplete, onClose }: SurfingGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);

  const playerRef = useRef({ x: 50, y: 150, width: 40, height: 20 });
  const obstaclesRef = useRef<{ x: number, y: number, width: number, height: number }[]>([]);
  const frameRef = useRef(0);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseY = e.clientY - rect.top;
      playerRef.current.y = Math.max(0, Math.min(canvas.height - playerRef.current.height, mouseY));
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    const update = () => {
      frameRef.current++;
      
      // Spawn obstacles
      if (frameRef.current % 60 === 0) {
        obstaclesRef.current.push({
          x: canvas.width,
          y: Math.random() * (canvas.height - 30),
          width: 30,
          height: 30
        });
      }

      // Move obstacles
      obstaclesRef.current = obstaclesRef.current.map(obs => ({ ...obs, x: obs.x - 5 }));
      
      // Collision detection
      const player = playerRef.current;
      for (const obs of obstaclesRef.current) {
        if (
          player.x < obs.x + obs.width &&
          player.x + player.width > obs.x &&
          player.y < obs.y + obs.height &&
          player.y + player.height > obs.y
        ) {
          setGameOver(true);
          return;
        }
      }

      // Cleanup off-screen obstacles
      obstaclesRef.current = (obstaclesRef.current || []).filter(obs => obs.x + obs.width > 0);
      
      setScore(prev => prev + 1);

      // Draw
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background waves
      ctx.strokeStyle = 'rgba(0, 224, 255, 0.1)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(0, 50 + i * 50);
        for (let x = 0; x < canvas.width; x++) {
          ctx.lineTo(x, 50 + i * 50 + Math.sin(x * 0.02 + frameRef.current * 0.05) * 10);
        }
        ctx.stroke();
      }

      // Draw player (surfboard)
      ctx.fillStyle = '#00E0FF';
      ctx.beginPath();
      ctx.ellipse(player.x + player.width/2, player.y + player.height/2, player.width/2, player.height/2, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Trail
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#00E0FF';
      ctx.stroke();

      // Draw obstacles (rogue waves/debris)
      ctx.fillStyle = '#FF4444';
      ctx.shadowColor = '#FF4444';
      for (const obs of obstaclesRef.current) {
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
      }

      requestAnimationFrame(update);
    };

    const animId = requestAnimationFrame(update);
    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, [gameStarted, gameOver]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameStarted, gameOver]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4"
    >
      <div className="max-w-3xl w-full space-y-8 text-center">
        {!gameStarted ? (
          <div className="space-y-6">
            <div className="p-6 rounded-full bg-[#00E0FF]/10 w-24 h-24 mx-auto flex items-center justify-center border border-[#00E0FF]/30">
              <Waves size={48} className="text-[#00E0FF]" />
            </div>
            <div className="space-y-2">
              <h2 className="text-4xl font-bold tracking-tighter uppercase italic">Surf the Data Stream</h2>
              <p className="text-white/40 font-mono text-sm uppercase tracking-widest">Avoid rogue waves to earn Sand Dollars</p>
            </div>
            <button
              onClick={() => setGameStarted(true)}
              className="px-12 py-4 bg-[#00E0FF] text-black rounded-2xl font-bold hover:bg-[#00E0FF]/80 transition-all uppercase tracking-tighter text-xl"
            >
              Catch the Wave
            </button>
          </div>
        ) : (
          <div className="space-y-4 relative">
            <div className="flex justify-between items-center px-4 font-mono text-xs uppercase tracking-widest text-[#00E0FF]">
              <div className="flex items-center gap-2">
                <Zap size={14} />
                Score: {score}
              </div>
              <div className="flex items-center gap-2">
                Time: {timeLeft}s
              </div>
            </div>
            
            <canvas
              ref={canvasRef}
              width={800}
              height={400}
              className="w-full bg-black/40 rounded-[32px] border border-white/10 cursor-none"
            />

            {gameOver && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-[32px] flex flex-col items-center justify-center space-y-6"
              >
                <Trophy size={64} className="text-[#FFD700]" />
                <div className="space-y-1">
                  <h3 className="text-3xl font-bold uppercase tracking-tighter">Session Complete</h3>
                  <p className="text-white/40 font-mono text-sm uppercase tracking-widest">You earned {Math.floor(score / 10)} Sand Dollars</p>
                </div>
                <button
                  onClick={() => onComplete(Math.floor(score / 10))}
                  className="px-8 py-3 bg-[#00E0FF] text-black rounded-xl font-bold hover:bg-[#00E0FF]/80 transition-all uppercase text-sm"
                >
                  Claim Rewards
                </button>
              </motion.div>
            )}
          </div>
        )}
        
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 p-3 rounded-full hover:bg-white/5 transition-colors text-white/40"
        >
          <X size={24} />
        </button>
      </div>
    </motion.div>
  );
}
