import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, 
  Map as MapIcon, 
  Shield, 
  Zap, 
  Skull, 
  Info, 
  AlertTriangle, 
  ArrowRight,
  Sparkles,
  Wind,
  Waves,
  Trophy,
  Brain,
  Anchor,
  Search,
  Flame,
  Users,
  Briefcase
} from 'lucide-react';
import { Realm, BranchingPath, AIStage, SurvivorChallenge } from '../types';

interface RealmViewProps {
  realm: Realm;
  onPathChoice: (path: BranchingPath) => void;
  onChallenge: (challengeId: string) => void;
  isProcessing: boolean;
  aiStage: AIStage;
  onSearchForIdol?: () => void;
  canSearch?: boolean;
}

const ChallengeButton: React.FC<{
  id: string;
  icon: any;
  title: string;
  description: string;
  onChallenge: (id: string) => void;
  isProcessing: boolean;
}> = ({ id, icon: Icon, title, description, onChallenge, isProcessing }) => (
  <motion.button
    whileHover={{ scale: 1.02, y: -2 }}
    whileTap={{ scale: 0.98 }}
    onClick={() => onChallenge(id)}
    disabled={isProcessing}
    className="group relative p-6 rounded-2xl border border-yellow-500/30 bg-yellow-500/5 text-left transition-all hover:border-yellow-500/50 hover:bg-yellow-500/10 disabled:opacity-50"
  >
    <div className="flex items-start gap-4">
      <div className="p-3 rounded-xl bg-yellow-500/20 text-yellow-400">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-yellow-100 group-hover:text-yellow-400 transition-colors">{title}</h3>
        <p className="text-sm text-yellow-100/60 mt-1">{description}</p>
      </div>
    </div>
    <div className="mt-4 flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-yellow-500/60">
      <span>AI Learning Opportunity</span>
      <Sparkles className="w-3 h-3 animate-pulse" />
    </div>
  </motion.button>
);

const RealmView: React.FC<RealmViewProps> = ({ 
  realm, 
  onPathChoice, 
  onChallenge, 
  isProcessing, 
  aiStage,
  onSearchForIdol,
  canSearch
}) => {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
      case 'medium': return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10';
      case 'high': return 'text-orange-400 border-orange-500/30 bg-orange-500/10';
      case 'extreme': return 'text-red-400 border-red-500/30 bg-red-500/10';
      default: return 'text-blue-400 border-blue-500/30 bg-blue-500/10';
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'low': return <Shield className="w-4 h-4" />;
      case 'medium': return <Zap className="w-4 h-4" />;
      case 'high': return <Skull className="w-4 h-4" />;
      case 'extreme': return <AlertTriangle className="w-4 h-4" />;
      default: return <Compass className="w-4 h-4" />;
    }
  };

  return (
    <div className="h-full w-full flex flex-col p-8 overflow-y-auto custom-scrollbar">
      {/* Realm Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        key={realm.id}
        className="max-w-4xl mx-auto w-full space-y-8"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-orange-500/80">
            <MapIcon className="w-5 h-5" />
            <span className="text-xs font-mono tracking-[0.3em] uppercase">Current Location</span>
          </div>
          
          <h1 className="text-6xl font-black tracking-tighter uppercase italic leading-none">
            {realm.name}
          </h1>
          
          <div className="flex flex-wrap gap-2">
            {realm.threats.map((threat, i) => (
              <span key={i} className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-mono uppercase tracking-wider rounded-full">
                {threat}
              </span>
            ))}
            {realm.npcs.map((npc, i) => (
              <span key={i} className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-mono uppercase tracking-wider rounded-full">
                {npc}
              </span>
            ))}
          </div>
        </div>

        {/* Description & Lore */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="relative">
              <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-500 to-transparent opacity-50" />
              <p className="text-xl text-gray-300 leading-relaxed font-light italic">
                "{realm.description}"
              </p>
            </div>
            
            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-3 text-gray-400">
                <Info className="w-4 h-4" />
                <span className="text-[10px] font-mono uppercase tracking-widest">Island Lore</span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                {realm.lore}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 border border-white/10 rounded-2xl bg-white/5">
              <h3 className="text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-4">Entities Present</h3>
              <div className="space-y-3">
                {realm.entities.map((entity, i) => (
                  <div key={i} className="flex items-center gap-3 group">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 group-hover:scale-150 transition-transform" />
                    <span className="text-sm text-gray-300">{entity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 border border-white/10 rounded-2xl bg-white/5">
              <h3 className="text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-4">Discovered Items</h3>
              <div className="flex flex-wrap gap-2">
                {realm.discoveredItems.length > 0 ? (
                  realm.discoveredItems.map((item, i) => (
                    <span key={i} className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded border border-white/5">
                      {item}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-gray-600 italic">No items found yet...</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Branching Paths */}
        <div className="space-y-6 pt-8 border-t border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Compass className="w-5 h-5 text-orange-500" />
              <h2 className="text-2xl font-bold tracking-tight uppercase">Choose Your Path</h2>
            </div>
            {isProcessing && (
              <div className="flex items-center gap-2 text-orange-500">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-4 h-4" />
                </motion.div>
                <span className="text-[10px] font-mono uppercase tracking-widest animate-pulse">AI is evolving the narrative...</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {realm.paths.map((path) => (
              <motion.button
                key={path.id}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onPathChoice(path)}
                disabled={isProcessing}
                className={`group relative p-6 rounded-2xl border text-left transition-all duration-300 ${
                  isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:border-orange-500/50 hover:bg-orange-500/5'
                } ${getRiskColor(path.risk)}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2 rounded-lg border ${getRiskColor(path.risk)}`}>
                    {getRiskIcon(path.risk)}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono uppercase tracking-widest opacity-60">Risk:</span>
                    <span className="text-[10px] font-mono uppercase tracking-widest font-bold">{path.risk}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-2 group-hover:text-white transition-colors">
                  {path.label}
                </h3>
                <p className="text-sm opacity-70 leading-relaxed mb-4">
                  {path.description}
                </p>

                {path.requirement && (
                  <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest opacity-50 mb-4">
                    <Zap className="w-3 h-3" />
                    <span>Req: {path.requirement}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-current/10">
                  <span className="text-[10px] font-mono uppercase tracking-widest opacity-60">Proceed Path</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-current to-transparent opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none" />
              </motion.button>
            ))}
          </div>
        </div>

        {/* Camp Activities & Idol Search */}
        <div className="space-y-6 pt-8 border-t border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Flame className="w-5 h-5 text-orange-500" />
              <h2 className="text-2xl font-bold tracking-tight uppercase">Beach Camp Activities</h2>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30">
              <Users className="w-3 h-3 text-orange-400" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-orange-400 italic">Learning AI Together</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={onSearchForIdol}
              disabled={isProcessing}
              className={`p-6 rounded-2xl border transition-all flex flex-col items-center justify-center gap-3 text-center ${
                canSearch 
                  ? 'border-blue-500/30 bg-blue-500/5 hover:border-blue-500/50 hover:bg-blue-500/10' 
                  : 'border-white/5 bg-white/5 opacity-50 cursor-not-allowed'
              }`}
            >
              <div className={`p-3 rounded-xl ${canSearch ? 'bg-blue-500/20 text-blue-400' : 'bg-white/10 text-gray-500'}`}>
                <Anchor className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white uppercase italic tracking-tight">Search for Idol</h3>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Scan the Sands</p>
              </div>
            </motion.button>

            <div className="p-6 rounded-2xl border border-white/10 bg-white/5 flex flex-col items-center justify-center gap-3 text-center">
              <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400">
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white uppercase italic tracking-tight">AI Strategy Session</h3>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Learn SMB AI Hacks</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-white/10 bg-white/5 flex flex-col items-center justify-center gap-3 text-center">
              <div className="p-3 rounded-xl bg-green-500/20 text-green-400">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white uppercase italic tracking-tight">Business Workshop</h3>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Apply AI to Real World</p>
              </div>
            </div>
          </div>
        </div>

        {/* Survivor Challenges Section */}
        <div className="space-y-6 pt-8 border-t border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <h2 className="text-2xl font-bold tracking-tight uppercase">Survivor Challenges</h2>
            </div>
            <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center gap-2">
              <Brain className="w-3 h-3 text-blue-400" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-blue-400">AI Pieces Available</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ChallengeButton 
              id="tower-climb"
              icon={Anchor}
              title="The Water Tower"
              description="Climb the tower in the water and get to the top first."
              onChallenge={onChallenge}
              isProcessing={isProcessing}
            />
            <ChallengeButton 
              id="canoe-race"
              icon={Waves}
              title="Sound Crossing"
              description="Get in a canoe and row hard to the other side."
              onChallenge={onChallenge}
              isProcessing={isProcessing}
            />
          </div>
        </div>

        {/* Environmental Effects */}
        <div className="grid grid-cols-3 gap-4 pt-8">
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
            <Wind className="w-5 h-5 text-blue-400" />
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-gray-500">Wind Speed</div>
              <div className="text-sm font-bold">14 knots NE</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
            <Waves className="w-5 h-5 text-cyan-400" />
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-gray-500">Tide Status</div>
              <div className="text-sm font-bold">Incoming</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
            <Sparkles className="w-5 h-5 text-orange-400" />
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-gray-500">AI Resonance</div>
              <div className="text-sm font-bold">Stable</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(249,115,22,0.1),transparent_70%)]" />
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-orange-500/10 blur-[120px] rounded-full" 
        />
      </div>
    </div>
  );
};

export default RealmView;
