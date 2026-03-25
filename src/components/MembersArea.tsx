import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, ShoppingBag, CheckCircle2, Shield, Zap, Anchor } from 'lucide-react';
import { GameState, SalesItem } from '../types';
import { SALES_ITEMS } from '../gameConstants';

interface MembersAreaProps {
  gameState: GameState;
  onPurchase: (itemId: string) => void;
  onClose: () => void;
}

const MembersArea: React.FC<MembersAreaProps> = ({ gameState, onPurchase, onClose }) => {
  const [purchaseFeedback, setPurchaseFeedback] = useState<string | null>(null);

  const handlePurchase = (item: SalesItem) => {
    if (gameState.survivor.sandDollars >= item.cost) {
      onPurchase(item.id);
      setPurchaseFeedback(`Successfully purchased ${item.name}!`);
      setTimeout(() => setPurchaseFeedback(null), 3000);
    } else {
      setPurchaseFeedback(`Not enough Sand Dollars for ${item.name}.`);
      setTimeout(() => setPurchaseFeedback(null), 3000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#0a0a0a] border border-purple-500/30 rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 bg-purple-500/20 rounded-2xl border border-purple-500/30">
            <ShoppingBag className="w-8 h-8 text-purple-400" />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight uppercase text-purple-400">Members Area</h2>
            <p className="text-sm font-mono text-gray-400 uppercase tracking-widest mt-1">Digital Tool Store</p>
          </div>
        </div>

        <div className="mb-8 p-6 rounded-2xl border border-purple-500/20 bg-purple-500/5 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Pick Your Tools</h3>
            <p className="text-sm text-gray-400">Exclusive survival gear for Paradise Members.</p>
          </div>
          <div className="text-right">
            <div className="text-sm font-mono text-gray-500 uppercase tracking-widest mb-1">Available Funds</div>
            <div className="text-3xl font-bold text-orange-400">{gameState.survivor.sandDollars} SD</div>
          </div>
        </div>

        {purchaseFeedback && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-green-500/20 border border-green-500/30 flex items-center gap-3 text-green-400"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-bold">{purchaseFeedback}</span>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SALES_ITEMS.filter(item => ['branded_machete', 'pro_fishing_rod', 'strategy_auditor'].includes(item.id)).map((item) => (
            <div key={item.id} className="p-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                  {item.id === 'branded_machete' ? <Shield className="w-6 h-6 text-red-400" /> :
                   item.id === 'pro_fishing_rod' ? <Anchor className="w-6 h-6 text-blue-400" /> :
                   <Zap className="w-6 h-6 text-yellow-400" />}
                </div>
                <div className="text-xl font-bold text-orange-400">{item.cost} SD</div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{item.name}</h3>
              <p className="text-sm text-gray-400 flex-grow mb-6">{item.description}</p>
              <button
                onClick={() => handlePurchase(item)}
                disabled={gameState.survivor.sandDollars < item.cost}
                className={`w-full py-3 rounded-xl font-bold uppercase tracking-widest text-sm transition-all ${
                  gameState.survivor.sandDollars >= item.cost
                    ? 'bg-purple-500 hover:bg-purple-400 text-white'
                    : 'bg-white/5 text-gray-500 cursor-not-allowed'
                }`}
              >
                Purchase Tool
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default MembersArea;
