import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Waves, X, Trophy, Zap, Heart, Wind, Skull } from 'lucide-react';

interface SurfingGameProps {
  onComplete: (score: number) => void;
  onClose: () => void;
}

const SurfingGame: React.FC<SurfingGameProps> = ({ onComplete, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameOver'>('start');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lives, setLives] = useState(3);

  // Game constants
  const playerWidth = 40;
  const playerHeight = 60;
  const obstacleWidth = 30;
  const obstacleHeight = 30;
  const gravity = 0.5;
  const jumpStrength = -10;

  useEffect(() => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let playerY = canvas.height / 2;
    let playerVelocity = 0;
    let obstacles: { x: number; y: number; type: 'shark' | 'rock' | 'trash' }[] = [];
    let frameCount = 0;
    let currentScore = 0;
    let currentLives = 3;

    const handleInput = (e: KeyboardEvent | MouseEvent | TouchEvent) => {
      if (e.type === 'keydown' && (e as KeyboardEvent).code !== 'Space') return;
      playerVelocity = jumpStrength;
    };

    window.addEventListener('keydown', handleInput);
    canvas.addEventListener('mousedown', handleInput);
    canvas.addEventListener('touchstart', handleInput);

    const gameLoop = () => {
      frameCount++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background - Waves effect
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.2)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(0, 100 + i * 50 + Math.sin(frameCount * 0.05 + i) * 20);
        ctx.lineTo(canvas.width, 100 + i * 50 + Math.sin(frameCount * 0.05 + i) * 20);
        ctx.stroke();
      }

      // Player physics
      playerVelocity += gravity;
      playerY += playerVelocity;

      // Boundaries
      if (playerY < 0) {
        playerY = 0;
        playerVelocity = 0;
      }
      if (playerY > canvas.height - playerHeight) {
        playerY = canvas.height - playerHeight;
        playerVelocity = 0;
      }

      // Draw Player (Surfer)
      ctx.fillStyle = '#f97316'; // Orange
      ctx.beginPath();
      ctx.roundRect(50, playerY, playerWidth, playerHeight, 10);
      ctx.fill();
      
      // Surfboard detail
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(45, playerY + playerHeight - 10, playerWidth + 10, 5);

      // Spawn obstacles
      if (frameCount % 100 === 0) {
        obstacles.push({
          x: canvas.width,
          y: Math.random() * (canvas.height - obstacleHeight),
          type: Math.random() > 0.5 ? 'shark' : 'rock'
        });
      }

      // Update and draw obstacles
      obstacles.forEach((obs, index) => {
        obs.x -= 5 + (currentScore / 100); // Speed up over time

        ctx.fillStyle = obs.type === 'shark' ? '#ef4444' : '#9ca3af';
        ctx.beginPath();
        ctx.arc(obs.x + obstacleWidth / 2, obs.y + obstacleHeight / 2, obstacleWidth / 2, 0, Math.PI * 2);
        ctx.fill();

        // Collision detection
        if (
          50 < obs.x + obstacleWidth &&
          50 + playerWidth > obs.x &&
          playerY < obs.y + obstacleHeight &&
          playerY + playerHeight > obs.y
        ) {
          obstacles.splice(index, 1);
          currentLives--;
          setLives(currentLives);
          if (currentLives <= 0) {
            setGameState('gameOver');
            onComplete(currentScore);
          }
        }

        // Remove off-screen obstacles
        if (obs.x < -obstacleWidth) {
          obstacles.splice(index, 1);
          currentScore += 10;
          setScore(currentScore);
        }
      });

      if (gameState === 'playing') {
        animationFrameId = requestAnimationFrame(gameLoop);
      }
    };

    gameLoop();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('keydown', handleInput);
      canvas.removeEventListener('mousedown', handleInput);
      canvas.removeEventListener('touchstart', handleInput);
    };
  }, [gameState]);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setLives(3);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4"
    >
      <div className="relative w-full max-w-4xl bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-blue-500/10">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-blue-500/10 to-transparent">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 rounded-2xl border border-blue-500/30">
              <Waves className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tighter uppercase italic">Hatteras Surf Break</h2>
              <p className="text-[10px] font-mono text-blue-400/60 uppercase tracking-widest">Master the AI Waves</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Game Area */}
        <div className="relative aspect-video bg-[#050505] overflow-hidden">
          <canvas 
            ref={canvasRef}
            width={800}
            height={450}
            className="w-full h-full cursor-pointer"
          />

          {/* HUD */}
          <div className="absolute top-6 left-6 right-6 flex justify-between items-start pointer-events-none">
            <div className="flex gap-4">
              <div className="px-4 py-2 bg-black/60 backdrop-blur-md rounded-xl border border-white/10">
                <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">Score</div>
                <div className="text-xl font-black text-blue-400">{score}</div>
              </div>
              <div className="px-4 py-2 bg-black/60 backdrop-blur-md rounded-xl border border-white/10">
                <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">Lives</div>
                <div className="flex gap-1">
                  {[...Array(3)].map((_, i) => (
                    <Heart 
                      key={i} 
                      className={`w-4 h-4 ${i < lives ? 'text-red-500 fill-red-500' : 'text-gray-800'}`} 
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="px-4 py-2 bg-black/60 backdrop-blur-md rounded-xl border border-white/10">
              <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">High Score</div>
              <div className="text-xl font-black text-orange-500">{highScore}</div>
            </div>
          </div>

          {/* Overlays */}
          <AnimatePresence>
            {gameState === 'start' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm"
              >
                <div className="text-center space-y-8 max-w-md px-6">
                  <div className="space-y-2">
                    <h3 className="text-4xl font-black tracking-tighter uppercase italic">Ready to Shred?</h3>
                    <p className="text-gray-400 text-sm">
                      Dodge the sharks and rocks to earn Sand Dollars. Use [SPACE] or [CLICK] to catch air.
                    </p>
                  </div>
                  <button
                    onClick={startGame}
                    className="group relative px-12 py-4 bg-blue-500 text-black font-black uppercase tracking-widest rounded-full hover:bg-blue-400 transition-all overflow-hidden"
                  >
                    <span className="relative z-10">Drop In</span>
                    <motion.div 
                      className="absolute inset-0 bg-white/20"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.5 }}
                    />
                  </button>
                </div>
              </motion.div>
            )}

            {gameState === 'gameOver' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md"
              >
                <div className="text-center space-y-8">
                  <div className="p-6 bg-red-500/20 rounded-full border border-red-500/30 inline-block">
                    <Skull className="w-12 h-12 text-red-500" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-5xl font-black tracking-tighter uppercase italic text-red-500">Wiped Out!</h3>
                    <p className="text-gray-400">The ocean was too rough this time.</p>
                  </div>
                  <div className="flex gap-8 justify-center">
                    <div className="text-center">
                      <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">Final Score</div>
                      <div className="text-4xl font-black text-white">{score}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">Earned</div>
                      <div className="text-4xl font-black text-blue-400">{Math.floor(score / 10)} SD</div>
                    </div>
                  </div>
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={startGame}
                      className="px-8 py-3 bg-white text-black font-black uppercase tracking-widest rounded-full hover:bg-gray-200 transition-all"
                    >
                      Try Again
                    </button>
                    <button
                      onClick={onClose}
                      className="px-8 py-3 border border-white/20 text-white font-black uppercase tracking-widest rounded-full hover:bg-white/5 transition-all"
                    >
                      Return to Island
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-6 bg-white/5 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-gray-500">
              <Wind className="w-4 h-4" />
              <span className="text-[10px] font-mono uppercase tracking-widest">Wind: 15kts NE</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span className="text-[10px] font-mono uppercase tracking-widest">AI Wave: Level 1</span>
            </div>
          </div>
          <div className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">
            Powered by Hatteras AI Core
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SurfingGame;
