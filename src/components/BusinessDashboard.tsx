import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  TrendingUp, 
  DollarSign, 
  Briefcase, 
  BarChart3, 
  Users, 
  CheckCircle2, 
  ArrowRight,
  Zap,
  Shield,
  Globe
} from 'lucide-react';
import { GameState } from '../types';

interface BusinessDashboardProps {
  gameState: GameState;
  onClose: () => void;
  onUpdateBusiness: (update: Partial<GameState['business']>) => void;
  onLog: (message: string) => void;
}

const CLIENT_TYPES = [
  { id: 'local_shop', name: 'Local Surf Shop', industry: 'Retail', baseValue: 500, icon: Globe },
  { id: 'real_estate', name: 'OBX Real Estate', industry: 'Property', baseValue: 1200, icon: Shield },
  { id: 'tech_startup', name: 'Neural Drift', industry: 'Tech', baseValue: 2500, icon: Zap },
  { id: 'enterprise', name: 'Atlantic Data Corp', industry: 'Enterprise', baseValue: 7500, icon: Briefcase }
];

export default function BusinessDashboard({ gameState, onClose, onUpdateBusiness, onLog }: BusinessDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'marketplace' | 'clients'>('overview');

  const handleSellWorkflow = (clientType: typeof CLIENT_TYPES[0]) => {
    if (!gameState.currentRealm) return;
    
    const saleValue = clientType.baseValue * (1 + (gameState.aiStatus.evolution / 10));
    onUpdateBusiness({
      revenue: gameState.business.revenue + saleValue,
      workflowsSold: gameState.business.workflowsSold + 1,
      activeClients: gameState.business.activeClients + 1,
      reputation: gameState.business.reputation + 5
    });
    onLog(`Workflow Sold: ${clientType.name} purchased ${gameState.currentRealm.name} neural data for $${saleValue.toLocaleString()}.`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[150] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-4 md:p-8"
    >
      <div className="max-w-6xl w-full h-full max-h-[800px] bg-black border border-[#00FF00]/20 rounded-[40px] overflow-hidden flex flex-col shadow-[0_0_100px_rgba(0,255,0,0.1)]">
        {/* Header */}
        <div className="p-8 border-b border-[#00FF00]/10 flex items-center justify-between bg-[#00FF00]/5">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-[#00FF00]/20 text-[#00FF00]">
              <TrendingUp size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-bold uppercase tracking-tighter text-white">Commercial Operations</h2>
              <p className="text-[10px] font-mono text-[#00FF00]/60 uppercase tracking-widest">Neural Workflow Monetization Hub</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-3 rounded-full hover:bg-white/5 text-white/40 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex border-b border-[#00FF00]/10">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'marketplace', label: 'Workflow Marketplace', icon: Globe },
            { id: 'clients', label: 'Active Clients', icon: Users }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 p-4 flex items-center justify-center gap-3 transition-all ${
                activeTab === tab.id 
                ? 'bg-[#00FF00]/10 text-[#00FF00] border-b-2 border-[#00FF00]' 
                : 'text-white/40 hover:text-white/60'
              }`}
            >
              <tab.icon size={18} />
              <span className="text-xs font-bold uppercase tracking-widest">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-2">
                    <div className="flex items-center gap-2 text-[#00FF00]">
                      <DollarSign size={16} />
                      <span className="text-[10px] font-mono uppercase tracking-widest">Total Revenue</span>
                    </div>
                    <div className="text-5xl font-bold tracking-tighter">${gameState.business.revenue.toLocaleString()}</div>
                    <div className="text-[10px] font-mono text-white/20 uppercase">Projected Annual: ${(gameState.business.revenue * 12).toLocaleString()}</div>
                  </div>
                  <div className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-2">
                    <div className="flex items-center gap-2 text-[#00E0FF]">
                      <Users size={16} />
                      <span className="text-[10px] font-mono uppercase tracking-widest">Active Clients</span>
                    </div>
                    <div className="text-5xl font-bold tracking-tighter">{gameState.business.activeClients}</div>
                    <div className="text-[10px] font-mono text-white/20 uppercase">Retention: 98.4%</div>
                  </div>
                  <div className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-2">
                    <div className="flex items-center gap-2 text-[#FFD700]">
                      <Zap size={16} />
                      <span className="text-[10px] font-mono uppercase tracking-widest">Workflows Sold</span>
                    </div>
                    <div className="text-5xl font-bold tracking-tighter">{gameState.business.workflowsSold}</div>
                    <div className="text-[10px] font-mono text-white/20 uppercase">Avg Value: ${(gameState.business.revenue / (gameState.business.workflowsSold || 1)).toFixed(0)}</div>
                  </div>
                </div>

                {/* Growth Chart Placeholder */}
                <div className="p-8 rounded-[40px] bg-white/5 border border-white/10 h-64 flex flex-col justify-end gap-4 relative overflow-hidden">
                  <div className="absolute top-8 left-8">
                    <h3 className="text-xl font-bold uppercase tracking-tighter">Revenue Velocity</h3>
                    <p className="text-[10px] font-mono text-white/40 uppercase">Real-time Neural Monetization Stream</p>
                  </div>
                  <div className="flex items-end gap-2 h-32">
                    {[40, 65, 45, 90, 75, 100, 85, 120, 110, 150].map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ delay: i * 0.1 }}
                        className="flex-1 bg-gradient-to-t from-[#00FF00]/40 to-[#00FF00] rounded-t-lg"
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'marketplace' && (
              <motion.div
                key="marketplace"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="p-6 rounded-3xl bg-[#00FF00]/5 border border-[#00FF00]/20 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-[#00FF00]/20 text-[#00FF00]">
                      <Globe size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold uppercase tracking-tighter">Active Realm: {gameState.currentRealm?.name || 'No Data'}</h3>
                      <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Available for Neural Workflow Packaging</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-[#00FF00]">+{gameState.aiStatus.evolution.toFixed(1)}x</div>
                    <div className="text-[10px] font-mono text-white/20 uppercase">Evolution Multiplier</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {CLIENT_TYPES.map((client) => (
                    <button
                      key={client.id}
                      onClick={() => handleSellWorkflow(client)}
                      disabled={!gameState.currentRealm}
                      className="group p-8 rounded-[32px] bg-white/5 border border-white/10 hover:border-[#00FF00]/50 hover:bg-[#00FF00]/5 transition-all text-left relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-20 transition-opacity">
                        <client.icon size={120} />
                      </div>
                      <div className="relative z-10 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="p-3 rounded-2xl bg-white/5 text-white/60 group-hover:text-[#00FF00] transition-colors">
                            <client.icon size={24} />
                          </div>
                          <div className="text-[10px] font-mono text-white/20 uppercase tracking-widest">{client.industry}</div>
                        </div>
                        <div>
                          <h4 className="text-2xl font-bold uppercase tracking-tighter">{client.name}</h4>
                          <p className="text-xs text-white/40 italic">Seeking automated {gameState.currentRealm?.environment || 'island'} workflows.</p>
                        </div>
                        <div className="pt-4 flex items-center justify-between border-t border-white/5">
                          <div className="text-2xl font-bold text-[#00FF00]">${(client.baseValue * (1 + (gameState.aiStatus.evolution / 10))).toLocaleString()}</div>
                          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-[#00FF00] opacity-0 group-hover:opacity-100 transition-opacity">
                            Sell Workflow
                            <ArrowRight size={14} />
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'clients' && (
              <motion.div
                key="clients"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                {gameState.business.activeClients === 0 ? (
                  <div className="h-64 flex flex-col items-center justify-center text-white/20 space-y-4">
                    <Users size={48} />
                    <p className="text-xs font-mono uppercase tracking-widest">No Active Client Contracts</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {Array.from({ length: gameState.business.activeClients }).map((_, i) => (
                      <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00FF00]/20 to-[#00E0FF]/20 flex items-center justify-center text-[#00FF00]">
                            <Briefcase size={20} />
                          </div>
                          <div>
                            <div className="text-sm font-bold uppercase tracking-tight">Client #{1000 + i}</div>
                            <div className="text-[10px] font-mono text-white/40 uppercase">Contract Active • Recurring Revenue</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <div className="text-sm font-bold text-[#00FF00]">+$1,250</div>
                            <div className="text-[10px] font-mono text-white/20 uppercase">Monthly Payout</div>
                          </div>
                          <div className="p-2 rounded-lg bg-[#00FF00]/10 text-[#00FF00]">
                            <CheckCircle2 size={16} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-6 bg-white/5 border-t border-[#00FF00]/10 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#00FF00] animate-pulse" />
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Market Status: Bullish</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#00E0FF]" />
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Neural Link: Stable</span>
            </div>
          </div>
          <div className="text-[10px] font-mono text-white/20 uppercase tracking-widest">
            © 2026 Hatteras Digital Ecosystems
          </div>
        </div>
      </div>
    </motion.div>
  );
}
