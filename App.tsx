import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Trophy, User, Hash, X, Circle } from 'lucide-react';

type Player = 'X' | 'O' | null;

export default function App() {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState<Player | 'Draw'>(null);
  const [scores, setScores] = useState({ X: 0, O: 0, Draws: 0 });
  const [winningLine, setWinningLine] = useState<number[] | null>(null);

  const calculateWinner = (squares: Player[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];

    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: [a, b, c] };
      }
    }

    if (squares.every(square => square !== null)) {
      return { winner: 'Draw' as const, line: null };
    }

    return null;
  };

  const handleClick = (i: number) => {
    if (board[i] || winner) return;

    const newBoard = [...board];
    newBoard[i] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);

    const result = calculateWinner(newBoard);
    if (result) {
      setWinner(result.winner);
      setWinningLine(result.line);
      
      if (result.winner === 'X') setScores(s => ({ ...s, X: s.X + 1 }));
      else if (result.winner === 'O') setScores(s => ({ ...s, O: s.O + 1 }));
      else setScores(s => ({ ...s, Draws: s.Draws + 1 }));
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setWinningLine(null);
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex flex-col items-center justify-center p-4 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-5xl font-black tracking-tighter mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          TIC TAC TOE
        </h1>
        <p className="text-slate-400 font-medium uppercase tracking-widest text-xs">
          Classic Strategy Game
        </p>
      </motion.div>

      {/* Score Board */}
      <div className="grid grid-cols-3 gap-4 mb-8 w-full max-w-md">
        <ScoreCard label="Player X" value={scores.X} icon={<X className="w-4 h-4 text-cyan-400" />} active={isXNext && !winner} color="cyan" />
        <ScoreCard label="Draws" value={scores.Draws} icon={<Hash className="w-4 h-4 text-slate-400" />} active={false} color="slate" />
        <ScoreCard label="Player O" value={scores.O} icon={<Circle className="w-4 h-4 text-rose-400" />} active={!isXNext && !winner} color="rose" />
      </div>

      {/* Game Board */}
      <div className="relative">
        <div className="grid grid-cols-3 gap-3 bg-slate-800/50 p-3 rounded-2xl backdrop-blur-sm border border-slate-700/50 shadow-2xl">
          {board.map((square, i) => (
            <Square 
              key={i} 
              value={square} 
              onClick={() => handleClick(i)} 
              isWinning={winningLine?.includes(i) ?? false}
            />
          ))}
        </div>

        {/* Winner Overlay */}
        <AnimatePresence>
          {winner && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-md rounded-2xl z-10 border border-slate-700 shadow-2xl"
            >
              <Trophy className={`w-16 h-16 mb-4 ${winner === 'Draw' ? 'text-slate-400' : winner === 'X' ? 'text-cyan-400' : 'text-rose-400'}`} />
              <h2 className="text-3xl font-bold mb-6">
                {winner === 'Draw' ? "It's a Draw!" : `Player ${winner} Wins!`}
              </h2>
              <button 
                onClick={resetGame}
                className="flex items-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-full font-bold hover:bg-cyan-400 hover:text-white transition-all active:scale-95"
              >
                <RotateCcw className="w-5 h-5" />
                Play Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      {!winner && (
        <motion.button 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={resetGame}
          className="mt-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors uppercase tracking-widest text-xs font-bold"
        >
          <RotateCcw className="w-4 h-4" />
          Reset Match
        </motion.button>
      )}

      <footer className="mt-auto pt-12 text-slate-500 text-[10px] uppercase tracking-[0.2em] font-medium">
        Built with React & Vite &bull; 2026
      </footer>
    </div>
  );
}

function ScoreCard({ label, value, icon, active, color }: { label: string, value: number, icon: React.ReactNode, active: boolean, color: 'cyan' | 'rose' | 'slate' }) {
  const colors = {
    cyan: 'border-cyan-500/50 text-cyan-400 bg-cyan-500/10',
    rose: 'border-rose-500/50 text-rose-400 bg-rose-500/10',
    slate: 'border-slate-500/50 text-slate-400 bg-slate-500/10'
  };

  return (
    <div className={`flex flex-col items-center p-3 rounded-xl border transition-all duration-500 ${active ? colors[color] : 'border-slate-800 bg-slate-900/50 text-slate-500'}`}>
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="text-[10px] uppercase font-bold tracking-wider">{label}</span>
      </div>
      <span className="text-2xl font-black">{value}</span>
    </div>
  );
}

function Square({ value, onClick, isWinning }: { value: Player, onClick: () => void, isWinning: boolean }) {
  return (
    <motion.button
      whileHover={{ scale: value ? 1 : 1.02 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`w-24 h-24 sm:w-28 sm:h-28 rounded-xl flex items-center justify-center text-5xl font-black transition-all duration-300
        ${!value ? 'bg-slate-800/80 hover:bg-slate-700/80 cursor-pointer' : 'bg-slate-700/50 cursor-default'}
        ${isWinning ? 'ring-4 ring-cyan-400 ring-inset bg-cyan-400/20' : ''}
      `}
    >
      <AnimatePresence mode="wait">
        {value === 'X' && (
          <motion.div
            key="X"
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            className="text-cyan-400"
          >
            <X className="w-12 h-12" strokeWidth={3} />
          </motion.div>
        )}
        {value === 'O' && (
          <motion.div
            key="O"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-rose-400"
          >
            <Circle className="w-12 h-12" strokeWidth={3} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

