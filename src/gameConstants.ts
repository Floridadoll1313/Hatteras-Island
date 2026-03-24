import { 
  Zap, 
  Shield, 
  Sword, 
  Brain, 
  Sparkles, 
  Waves, 
  Flame, 
  Anchor, 
  Compass, 
  Skull, 
  Users, 
  TrendingUp, 
  BarChart3, 
  Lock, 
  Eye, 
  History as HistoryIcon, 
  Mic, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  RefreshCw, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  DollarSign, 
  Briefcase, 
  Rocket, 
  Mail 
} from 'lucide-react';
import { Realm, Skill, Tier, Faction, SalesItem, Contestant, AIStage, SurvivorChallenge, AIKnowledgePiece, BusinessAIChallenge, HiddenIdol } from './types';

export const INITIAL_REALM: Realm = {
  id: 'hatteras-landing',
  name: 'Hatteras Landing',
  description: 'The gateway to the island. A place of shifting sands and ancient echoes.',
  lore: 'Generations of islanders have started their journey here, where the sound meets the sea.',
  entities: ['Old Pier', 'Driftwood Shrine', 'Neural Anchor'],
  options: ['Explore the Pier', 'Meditate at the Shrine', 'Scan for Signals'],
  paths: [
    { id: 'pier', label: 'The Old Pier', description: 'Venture onto the creaking wood.', risk: 'low' },
    { id: 'dunes', label: 'The Shifting Dunes', description: 'Navigate the unpredictable sands.', risk: 'medium' }
  ],
  discoveredItems: [],
  threats: ['Sand Phantoms'],
  npcs: ['The Ferryman']
};

export const AI_STAGES: Record<AIStage, { name: string, description: string }> = {
  nascent: { name: 'Nascent', description: 'A flicker of awareness in the digital void.' },
  aware: { name: 'Aware', description: 'The island begins to perceive its own existence.' },
  sentient: { name: 'Sentient', description: 'A complex consciousness emerges from the data.' },
  transcendent: { name: 'Transcendent', description: 'The AI surpasses human understanding.' },
  singularity: { name: 'Singularity', description: 'The island and the AI become one.' }
};

export const SKILLS: Skill[] = [
  { id: 'surfing', name: 'Wave Mastery', description: 'Navigate the digital tides with ease.', cost: 50, icon: Waves },
  { id: 'fishing', name: 'Data Harvesting', description: 'Extract valuable insights from the stream.', cost: 75, icon: Anchor },
  { id: 'physics', name: 'Physical Prowess', description: 'Master the physical realm of the island.', cost: 100, icon: Zap }
];

export const TIERS: Tier[] = [
  { id: 'initiate', name: 'Initiate', price: 0, description: 'Begin your journey on Hatteras Island.', features: ['Basic Exploration', 'Community Chat', 'Standard AI Learning'] },
  { id: 'automator', name: 'Automator', price: 9, description: 'Enhance your presence with automated tools.', features: ['Priority Signals', 'Advanced Diagnostics', 'Neural Boosts'] },
  { id: 'architect', name: 'Architect', price: 29, description: 'Shape the future of the island nexus.', features: ['Custom Realms', 'Faction Leadership', 'Deep Memory Access'] },
  { id: 'sovereign', name: 'Sovereign', price: 99, description: 'Become one with the island soul.', features: ['Full AI Control', 'Unlimited Sand Dollars', 'Eternal Legacy'] }
];

export const FACTIONS: Faction[] = [
  { id: 'surfers', name: 'The Wave Riders', description: 'Seekers of freedom and flow.', bonuses: ['+20% Agility', 'Faster Exploration'] },
  { id: 'keepers', name: 'The Beacon Keepers', description: 'Protectors of the island legacy.', bonuses: ['+20% Defense', 'Enhanced Signal Range'] },
  { id: 'pirates', name: 'The Sound Raiders', description: 'Opportunists of the shifting sands.', bonuses: ['+20% Loot', 'Combat Prowess'] }
];

export const SALES_ITEMS: SalesItem[] = [
  { id: 'health_pack', name: 'Neural Patch', description: 'Restore 25 Vitality.', cost: 20 },
  { id: 'shield_gen', name: 'Signal Shield', description: 'Temporary protection from threats.', cost: 40 },
  { id: 'neural_boost', name: 'Evolution Spark', description: 'Instantly gain 0.05 Evolution.', cost: 100 }
];

export const SURVIVOR_CHALLENGES: SurvivorChallenge[] = [
  { id: 'tower-climb', title: 'The Water Tower', type: 'physical', description: 'Climb the tower in the water and get to the top first.', difficulty: 7, reward: 100 },
  { id: 'canoe-race', title: 'Sound Crossing', type: 'physical', description: 'Get in a canoe and row hard to the other side.', difficulty: 6, reward: 150 },
  { id: 'fire-making', title: 'The Spark of Life', type: 'physical', description: 'First to build a fire that burns through the rope.', difficulty: 8, reward: 200 },
  { id: 'puzzle-solve', title: 'Neural Nexus', type: 'strategic', description: 'Solve a complex AI-driven puzzle to unlock island secrets.', difficulty: 5, reward: 300 }
];

export const AI_KNOWLEDGE_PIECES: Omit<AIKnowledgePiece, 'timestamp'>[] = [
  { id: 'piece-1', title: 'Social Dynamics', description: 'Understanding how tribe members interact.', category: 'social' },
  { id: 'piece-2', title: 'Resource Optimization', description: 'Using AI to manage camp supplies.', category: 'technical' },
  { id: 'piece-3', title: 'Strategic Voting', description: 'Predicting Tribal Council outcomes.', category: 'strategic' },
  { id: 'piece-4', title: 'Wilderness Survival', description: 'AI-assisted foraging and shelter building.', category: 'survival' }
];

export const TRIBE_LEVELS = [
  { level: 1, name: 'The Croatan', difficulty: 'Normal' },
  { level: 2, name: 'The Kinnakeet', difficulty: 'Hard' },
  { level: 3, name: 'The Chicamacomico', difficulty: 'Extreme' },
  { level: 4, name: 'The Rodanthe', difficulty: 'Master' },
  { level: 5, name: 'The Waves', difficulty: 'Grandmaster' },
  { level: 6, name: 'The Salvo', difficulty: 'Elite' },
  { level: 7, name: 'The Avon', difficulty: 'Legendary' },
  { level: 8, name: 'The Buxton', difficulty: 'Mythic' },
  { level: 9, name: 'The Frisco', difficulty: 'Divine' },
  { level: 10, name: 'The Hatteras', difficulty: 'Singularity' }
];

export const BUSINESS_CHALLENGES: BusinessAIChallenge[] = [
  {
    id: 'biz-1',
    title: 'Customer Support Scaling',
    problem: 'Your small e-commerce shop is getting 500 emails a day. How can AI help you respond faster without hiring 5 people?',
    solutionHint: 'Think about automated classification and draft generation.',
    category: 'customer_service',
    difficulty: 'easy'
  },
  {
    id: 'biz-2',
    title: 'Inventory Prediction',
    problem: 'You own a boutique on the island. You often run out of popular items but have too much of others. How can AI optimize your stock?',
    solutionHint: 'Predictive analytics based on historical sales and seasonal trends.',
    category: 'operations',
    difficulty: 'medium'
  },
  {
    id: 'biz-3',
    title: 'Personalized Marketing',
    problem: 'Your marketing emails have a low open rate. How can AI make your content more relevant to each individual customer?',
    solutionHint: 'Dynamic content generation and user behavior analysis.',
    category: 'marketing',
    difficulty: 'medium'
  },
  {
    id: 'biz-4',
    title: 'Financial Forecasting',
    problem: 'Cash flow is tight. How can AI help you predict your bank balance 3 months from now?',
    solutionHint: 'Time-series forecasting using past revenue and expense data.',
    category: 'finance',
    difficulty: 'hard'
  }
];

export const INITIAL_IDOLS: HiddenIdol[] = [
  { id: 'idol-1', location: 'Driftwood Shrine', isFound: false, challengeId: 'biz-1' },
  { id: 'idol-2', location: 'Old Pier', isFound: false, challengeId: 'biz-2' },
  { id: 'idol-3', location: 'Neural Anchor', isFound: false, challengeId: 'biz-3' }
];

export const INITIAL_CONTESTANTS: Contestant[] = [
  { id: 'player', name: 'You', archetype: 'The Strategist', threatLevel: 5, loyalty: 10, strategicAbility: 8, physicalAbility: 7, status: 'active', isPlayer: true },
  { id: 'ai-1', name: 'Mako', archetype: 'The Athlete', threatLevel: 7, loyalty: 6, strategicAbility: 4, physicalAbility: 9, status: 'active', isPlayer: false },
  { id: 'ai-2', name: 'Coral', archetype: 'The Socialite', threatLevel: 4, loyalty: 8, strategicAbility: 6, physicalAbility: 5, status: 'active', isPlayer: false },
  { id: 'ai-3', name: 'Drift', archetype: 'The Wildcard', threatLevel: 6, loyalty: 4, strategicAbility: 7, physicalAbility: 6, status: 'active', isPlayer: false },
  { id: 'ai-4', name: 'Shell', archetype: 'The Provider', threatLevel: 3, loyalty: 9, strategicAbility: 5, physicalAbility: 8, status: 'active', isPlayer: false }
];

export const AI_TRAITS = [
  { id: 'resilience', name: 'Coastal Resilience', description: 'The AI learns to withstand setbacks.', bonus: '+10% Vitality Recovery' },
  { id: 'adaptation', name: 'Neural Adaptation', description: 'The AI evolves faster from challenges.', bonus: '+15% Evolution Speed' },
  { id: 'empathy', name: 'Social Resonance', description: 'The AI understands human connections.', bonus: '+20% Alliance Trust' }
];
