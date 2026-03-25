import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Zap, CheckCircle2, Lock, ArrowRight, Brain, DollarSign, Briefcase, Rocket, Mail, Shield, Sword, Heart, Activity, TrendingUp, BarChart3, Eye } from 'lucide-react';
import { SALES_ITEMS } from '../gameConstants';

interface SalesCenterProps {
  sandDollars: number;
  isParadiseMember: boolean;
  onPurchase: (itemId: string) => void;
  onClose: () => void;
}

const SalesCenter: React.FC<SalesCenterProps> = ({
  sandDollars,
  isParadiseMember,
  onPurchase,
  onClose
}) => {
  const [activeCategory, setActiveCategory] = React.useState<string>('all');

  const categories = [
    { id: 'all', name: 'All Items', icon: ShoppingBag },
    { id: 'survival', name: 'Survival', icon: Shield },
    { id: 'workflow', name: 'Workflows', icon: Zap },
    { id: 'package', name: 'Packages', icon: Briefcase },
    { id: 'implementation', name: 'Implementation', icon: Rocket },
    { id: 'monitoring', name: 'Monitoring', icon: Activity },
  ];

  const filteredItems = activeCategory === 'all' 
    ? SALES_ITEMS 
    : SALES_ITEMS.filter(item => item.category === activeCategory);

  const getDiscountedPrice = (item: any) => {
    if (!isParadiseMember) return item.cost;
    // 25% discount for members on business-related items
    if (['workflow', 'package', 'implementation', 'monitoring'].includes(item.category || '')) {
      return Math.floor(item.cost * 0.75);
    }
    return item.cost;
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-black/90 backdrop-blur-2xl"
    >
      <div className="relative w-full max-w-6xl max-h-[80vh] bg-[#0a0a0a] border border-orange-900/30 rounded-[3rem] shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-10 border-b border-orange-900/20 bg-gradient-to-r from-orange-900/10 to-transparent flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-orange-600 flex items-center justify-center shadow-lg shadow-orange-600/20">
              <ShoppingBag className="text-white w-8 h-8" />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-white tracking-tighter uppercase italic">Island Exchange</h2>
              <p className="text-orange-400 font-mono text-xs uppercase tracking-[0.3em] mt-1">Outer Banks • Neural Marketplace</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="px-6 py-3 rounded-2xl bg-orange-900/20 border border-orange-500/30 flex items-center gap-3">
              <Zap className="w-5 h-5 text-orange-400 fill-orange-400" />
              <span className="text-xl font-bold text-white">{sandDollars}</span>
              <span className="text-[10px] text-orange-400/60 font-mono uppercase tracking-widest">Sand Dollars</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-orange-900/20 rounded-full transition-colors text-orange-400"
            >
              <X className="w-8 h-8" />
            </button>
          </div>
        </div>

        {/* Category Navigation */}
        <div className="px-10 py-4 border-b border-orange-900/10 bg-black/20 flex items-center gap-4 overflow-x-auto no-scrollbar">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full border transition-all whitespace-nowrap ${
                  activeCategory === cat.id
                    ? 'bg-orange-600 border-orange-500 text-white shadow-lg shadow-orange-600/20'
                    : 'bg-white/5 border-white/10 text-orange-100/40 hover:border-orange-500/30 hover:text-orange-400'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Items Grid */}
        <div className="flex-1 p-10 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => {
              const discountedPrice = getDiscountedPrice(item);
              const canAfford = sandDollars >= discountedPrice;
              const hasDiscount = discountedPrice < item.cost;

              if (item.isMemberOnly && !isParadiseMember) return null;

              return (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.02 }}
                  className="relative p-8 rounded-[2.5rem] border border-white/10 bg-white/5 hover:border-orange-500/50 hover:bg-white/10 transition-all flex flex-col h-full group"
                >
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-orange-900/20 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                      {item.id === 'health_pack' ? <Heart className="w-7 h-7" /> :
                       item.id === 'shield_gen' ? <Shield className="w-7 h-7" /> :
                       item.id === 'neural_boost' ? <Zap className="w-7 h-7" /> :
                       item.id === 'secret_ai_key' ? <Brain className="w-7 h-7" /> :
                       item.category === 'workflow' ? <Zap className="w-7 h-7" /> :
                       item.category === 'package' ? <Briefcase className="w-7 h-7" /> :
                       item.category === 'implementation' ? <Rocket className="w-7 h-7" /> :
                       item.category === 'monitoring' ? <Activity className="w-7 h-7" /> :
                       <Sword className="w-7 h-7" />}
                    </div>
                    <div className="text-right">
                      {hasDiscount && (
                        <span className="text-[10px] text-gray-500 line-through block mb-1 font-mono">
                          {item.cost} SD
                        </span>
                      )}
                      <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border ${
                        canAfford ? 'bg-orange-900/20 border-orange-500/30 text-orange-400' : 'bg-red-900/20 border-red-500/30 text-red-400 opacity-50'
                      }`}>
                        <Zap className={`w-4 h-4 ${hasDiscount ? 'text-green-400 fill-green-400' : 'fill-current'}`} />
                        <span className={`text-sm font-bold font-mono ${hasDiscount ? 'text-green-400' : ''}`}>
                          {discountedPrice} SD
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <span className="text-[8px] font-mono text-orange-500/60 uppercase tracking-[0.3em] mb-1 block">
                      {item.category || 'General'}
                    </span>
                    <h3 className="text-2xl font-bold text-white uppercase italic tracking-tighter">{item.name}</h3>
                  </div>
                  
                  <p className="text-xs text-orange-100/60 font-mono leading-relaxed mb-10 flex-1">{item.description}</p>

                  <button
                    disabled={!canAfford}
                    onClick={() => onPurchase(item.id)}
                    className={`w-full py-5 rounded-2xl font-bold uppercase italic tracking-widest transition-all flex items-center justify-center gap-3 ${
                      canAfford
                        ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20 hover:bg-orange-500 hover:-translate-y-1'
                        : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
                    }`}
                  >
                    {canAfford ? (
                      <>
                        <ShoppingBag className="w-5 h-5" />
                        {item.category === 'implementation' ? 'Request Service' : 'Purchase Item'}
                      </>
                    ) : (
                      <>
                        <Lock className="w-5 h-5" />
                        Insufficient SD
                      </>
                    )}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 bg-black/40 border-t border-orange-900/20 flex justify-center">
          <div className="flex items-center gap-3 text-orange-500/40 text-[10px] font-mono uppercase tracking-[0.4em]">
            <ArrowRight className="w-3 h-3" />
            <span>Equip for Survival • The Island Provides for the Prepared</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SalesCenter;
