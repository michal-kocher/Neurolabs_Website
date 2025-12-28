import { useEffect, useRef, useState } from 'react';
import { Maximize2, Minimize2, Zap, RotateCcw, Download, Brain } from 'lucide-react';

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 60;
const BALL_SIZE = 10;
const PADDLE_SPEED = 6;
const ALPHA = 0.1;
const GAMMA = 0.95;
const EPSILON_DECAY = 0.995;
const MIN_EPSILON = 0.01;
const GRID_X = 12;
const GRID_Y = 12;
const GRID_PADDLE = 12;

class QBrain {
  constructor() {
    this.qTable = {};
    this.actions = [-1, 0, 1];
  }

  getState(ballX, ballY, ballDX, ballDY, paddleY, normalizeX = false) {
    let bx = normalizeX ? (CANVAS_WIDTH - ballX) : ballX;
    let bdx = normalizeX ? -ballDX : ballDX;
    const xGrid = Math.floor((bx / CANVAS_WIDTH) * GRID_X);
    const yGrid = Math.floor((ballY / CANVAS_HEIGHT) * GRID_Y);
    const pGrid = Math.floor((paddleY / (CANVAS_HEIGHT - PADDLE_HEIGHT)) * GRID_PADDLE);
    const vy = ballDY > 0 ? 1 : (ballDY < 0 ? -1 : 0);
    const vx = bdx > 0 ? 1 : -1;
    return `${xGrid}_${yGrid}_${vx}_${vy}_${pGrid}`;
  }

  getQ(state) {
    if (!this.qTable[state]) {
      this.qTable[state] = [0, 0, 0];
    }
    return this.qTable[state];
  }

  chooseAction(state, epsilon) {
    if (Math.random() < epsilon) {
      return this.actions[Math.floor(Math.random() * this.actions.length)];
    }
    const qValues = this.getQ(state);
    let maxQ = -Infinity;
    let bestIndices = [];
    for (let i = 0; i < qValues.length; i++) {
      if (qValues[i] > maxQ) {
        maxQ = qValues[i];
        bestIndices = [i];
      } else if (qValues[i] === maxQ) {
        bestIndices.push(i);
      }
    }
    const chosenIdx = bestIndices[Math.floor(Math.random() * bestIndices.length)];
    return this.actions[chosenIdx];
  }

  learn(state, action, reward, nextState) {
    const qValues = this.getQ(state);
    const nextQValues = this.getQ(nextState);
    const actionIdx = action + 1;
    const maxNextQ = Math.max(...nextQValues);
    const currentQ = qValues[actionIdx];
    const newQ = currentQ + ALPHA * (reward + GAMMA * maxNextQ - currentQ);
    this.qTable[state][actionIdx] = newQ;
  }

  size() {
    return Object.keys(this.qTable).length;
  }
}

const PongSandbox = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const brainRef = useRef(new QBrain());
  const ballRef = useRef({ x: 300, y: 200, dx: 4, dy: 4, speed: 5 });
  const leftPaddleRef = useRef({ y: 170, score: 0, lastState: null, lastAction: 0 });
  const rightPaddleRef = useRef({ y: 170, score: 0, lastState: null, lastAction: 0 });
  const episodesRef = useRef(0);
  const currentRallyRef = useRef(0);
  const maxRallyRef = useRef(0);
  const isTurboRef = useRef(false);
  const animationIdRef = useRef(null);
  const epsilonRef = useRef(0.2);

  const [episodes, setEpisodes] = useState(0);
  const [epsilon, setEpsilon] = useState(0.2);
  const [maxRally, setMaxRally] = useState(0);
  const [qSize, setQSize] = useState(0);
  const [isTurbo, setIsTurbo] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const resetBall = () => {
    ballRef.current.x = CANVAS_WIDTH / 2;
    ballRef.current.y = CANVAS_HEIGHT / 2;
    ballRef.current.speed = 5;
    ballRef.current.dx = (Math.random() > 0.5 ? 1 : -1) * ballRef.current.speed;
    ballRef.current.dy = (Math.random() * 2 - 1) * ballRef.current.speed;
    if (epsilonRef.current > MIN_EPSILON) {
      epsilonRef.current *= EPSILON_DECAY;
      setEpsilon(epsilonRef.current);
    }
    episodesRef.current++;
    setEpisodes(episodesRef.current);
    setQSize(brainRef.current.size());
  };

  const updateStats = () => {
    if (isTurboRef.current && episodesRef.current % 100 !== 0) return;
    setEpisodes(episodesRef.current);
    setEpsilon(epsilonRef.current);
    setMaxRally(maxRallyRef.current);
    setQSize(brainRef.current.size());
  };

  const gameStep = () => {
    const ball = ballRef.current;
    const leftPaddle = leftPaddleRef.current;
    const rightPaddle = rightPaddleRef.current;
    const brain = brainRef.current;

    const stateL = brain.getState(ball.x, ball.y, ball.dx, ball.dy, leftPaddle.y, false);
    const stateR = brain.getState(ball.x, ball.y, ball.dx, ball.dy, rightPaddle.y, true);

    const actionL = brain.chooseAction(stateL, epsilonRef.current);
    const actionR = brain.chooseAction(stateR, epsilonRef.current);

    leftPaddle.lastState = stateL;
    leftPaddle.lastAction = actionL;
    rightPaddle.lastState = stateR;
    rightPaddle.lastAction = actionR;

    leftPaddle.y += actionL * PADDLE_SPEED;
    rightPaddle.y += actionR * PADDLE_SPEED;

    leftPaddle.y = Math.max(0, Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, leftPaddle.y));
    rightPaddle.y = Math.max(0, Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, rightPaddle.y));

    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.y <= 0 || ball.y + BALL_SIZE >= CANVAS_HEIGHT) {
      ball.dy *= -1;
    }

    let rewardL = 0;
    let rewardR = 0;

    if (ball.x <= PADDLE_WIDTH &&
      ball.y + BALL_SIZE >= leftPaddle.y &&
      ball.y <= leftPaddle.y + PADDLE_HEIGHT) {
      ball.dx *= -1;
      ball.speed += 0.2;
      ball.dx = ball.dx > 0 ? ball.speed : -ball.speed;
      ball.dy += (Math.random() - 0.5) * 2;
      rewardL = 0.5;
      currentRallyRef.current++;
    }

    if (ball.x + BALL_SIZE >= CANVAS_WIDTH - PADDLE_WIDTH &&
      ball.y + BALL_SIZE >= rightPaddle.y &&
      ball.y <= rightPaddle.y + PADDLE_HEIGHT) {
      ball.dx *= -1;
      ball.speed += 0.2;
      ball.dx = ball.dx > 0 ? ball.speed : -ball.speed;
      ball.dy += (Math.random() - 0.5) * 2;
      rewardR = 0.5;
      currentRallyRef.current++;
    }

    if (currentRallyRef.current > maxRallyRef.current) {
      maxRallyRef.current = currentRallyRef.current;
      setMaxRally(maxRallyRef.current);
    }

    let done = false;

    if (ball.x < 0) {
      rewardL = -10;
      rewardR = 10;
      rightPaddle.score++;
      currentRallyRef.current = 0;
      done = true;
    } else if (ball.x > CANVAS_WIDTH) {
      rewardR = -10;
      rewardL = 10;
      leftPaddle.score++;
      currentRallyRef.current = 0;
      done = true;
    }

    const nextStateL = brain.getState(ball.x, ball.y, ball.dx, ball.dy, leftPaddle.y, false);
    const nextStateR = brain.getState(ball.x, ball.y, ball.dx, ball.dy, rightPaddle.y, true);

    brain.learn(leftPaddle.lastState, leftPaddle.lastAction, rewardL, nextStateL);
    brain.learn(rightPaddle.lastState, rightPaddle.lastAction, rewardR, nextStateR);

    if (done) resetBall();
  };

  const draw = (ctx) => {
    const ball = ballRef.current;
    const leftPaddle = leftPaddleRef.current;
    const rightPaddle = rightPaddleRef.current;

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.strokeStyle = '#333';
    ctx.setLineDash([10, 15]);
    ctx.beginPath();
    ctx.moveTo(CANVAS_WIDTH / 2, 0);
    ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#e94560';
    ctx.fillRect(0, leftPaddle.y, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.fillRect(CANVAS_WIDTH - PADDLE_WIDTH, rightPaddle.y, PADDLE_WIDTH, PADDLE_HEIGHT);

    ctx.fillStyle = '#fff';
    ctx.fillRect(ball.x, ball.y, BALL_SIZE, BALL_SIZE);

    ctx.font = '40px monospace';
    ctx.fillStyle = '#555';
    ctx.fillText(leftPaddle.score, CANVAS_WIDTH / 4, 50);
    ctx.fillText(rightPaddle.score, 3 * CANVAS_WIDTH / 4, 50);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const loop = () => {
      if (isTurboRef.current) {
        for (let i = 0; i < 1000; i++) {
          gameStep();
        }
      } else {
        gameStep();
      }
      draw(ctx);
      updateStats();
      animationIdRef.current = requestAnimationFrame(loop);
    };

    resetBall();
    loop();

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, []);

  const toggleTurbo = () => {
    isTurboRef.current = !isTurboRef.current;
    setIsTurbo(isTurboRef.current);
  };

  const resetTraining = () => {
    brainRef.current.qTable = {};
    episodesRef.current = 0;
    epsilonRef.current = 0.2;
    maxRallyRef.current = 0;
    currentRallyRef.current = 0;
    leftPaddleRef.current.score = 0;
    rightPaddleRef.current.score = 0;
    setEpsilon(0.2);
    setEpisodes(0);
    setMaxRally(0);
    resetBall();
  };

  const downloadBrain = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(brainRef.current.qTable));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "pong_brain.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if (containerRef.current.webkitRequestFullscreen) {
        containerRef.current.webkitRequestFullscreen();
      } else if (containerRef.current.msRequestFullscreen) {
        containerRef.current.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`relative bg-[#050505] border border-[#3E065F]/50 overflow-hidden shadow-2xl group transition-all flex flex-col ${
        isFullscreen 
          ? 'fixed inset-0 z-[9999] rounded-none m-0 p-0 w-screen h-screen' 
          : 'w-full max-w-full rounded-3xl'
      }`}
      style={isFullscreen ? { margin: 0, padding: 0 } : {}}
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-6 bg-black/40 backdrop-blur-md border-b border-[#3E065F]/30 z-20 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#8E05C2] rounded-lg">
            <Brain size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-white font-bold text-sm leading-tight uppercase tracking-tight italic">Q-Learning Engine v1.0</h3>
            <p className="text-[9px] font-mono text-gray-500 uppercase tracking-widest mt-0.5">Multi-Agent Reinforcement Learning</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleFullscreen} 
            className="p-2.5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all"
            title={isFullscreen ? "Wyjdź z pełnego ekranu" : "Pełny ekran"}
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
          <button 
            onClick={resetTraining} 
            className="p-2.5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`${isFullscreen ? 'flex-1 pt-24' : 'pt-20'} flex flex-col lg:flex-row gap-4 p-4`}>
        {/* Canvas Area */}
        <div className="flex-1 flex items-center justify-center relative">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className={`bg-black border-2 border-[#8E05C2]/50 shadow-[0_0_20px_rgba(142,5,194,0.3)] rounded-lg transition-all ${
              isFullscreen ? 'h-[80vh] w-auto' : 'w-full h-auto'
            }`}
          />
        </div>

        {/* Stats Panel */}
        <div className="lg:w-64 flex flex-col gap-3 shrink-0">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-black/40 backdrop-blur-sm p-3 rounded-xl border border-white/5">
              <div className="text-[9px] font-mono text-gray-400 uppercase tracking-widest mb-1">Epoka</div>
              <div className="text-[#8E05C2] font-bold text-xl">{episodes}</div>
            </div>
            <div className="bg-black/40 backdrop-blur-sm p-3 rounded-xl border border-white/5">
              <div className="text-[9px] font-mono text-gray-400 uppercase tracking-widest mb-1">Epsilon</div>
              <div className="text-[#8E05C2] font-bold text-xl">{epsilon.toFixed(3)}</div>
            </div>
            <div className="bg-black/40 backdrop-blur-sm p-3 rounded-xl border border-white/5">
              <div className="text-[9px] font-mono text-gray-400 uppercase tracking-widest mb-1">Max Odbić</div>
              <div className="text-[#8E05C2] font-bold text-xl">{maxRally}</div>
            </div>
            <div className="bg-black/40 backdrop-blur-sm p-3 rounded-xl border border-white/5">
              <div className="text-[9px] font-mono text-gray-400 uppercase tracking-widest mb-1">Q-Table</div>
              <div className="text-[#8E05C2] font-bold text-xl">{qSize}</div>
            </div>
          </div>

          <button
            onClick={toggleTurbo}
            className={`px-6 py-3 rounded-xl font-black transition-all text-xs tracking-widest uppercase ${
              isTurbo 
                ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 animate-pulse' 
                : 'bg-[#8E05C2] text-white shadow-[0_0_20px_#8E05C2]'
            }`}
          >
            {isTurbo ? '⚡ ZATRZYMAJ TURBO' : '🚀 TRYB TURBO'}
          </button>

          <button
            onClick={downloadBrain}
            className="px-6 py-3 bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl font-bold text-xs uppercase tracking-widest text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2"
          >
            <Download size={16} />
            Eksportuj Mózg
          </button>

          <div className="bg-black/40 backdrop-blur-sm border border-white/5 rounded-xl p-4 text-[9px] text-gray-400 space-y-2">
            <p className="font-bold text-white uppercase">Jak to działa?</p>
            <p>Dwa algorytmy uczą się grać od zera. Dzielą ten sam "Mózg" (Q-Table), co przyspiesza naukę 2x.</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li><strong className="text-[#8E05C2]">+10:</strong> Wygranie punktu</li>
              <li><strong className="text-red-500">-10:</strong> Strata punktu</li>
              <li><strong className="text-[#8E05C2]">+0.2:</strong> Odbicie piłki</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PongSandbox;

