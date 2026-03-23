import { AITrait, AIStage, SubscriptionTier } from './types';
import { Globe, Eye, Sword, Layers, Anchor } from 'lucide-react';

export const getAIStage = (evolution: number): AIStage => {
  if (evolution < 2.0) return 'Tourist';
  if (evolution < 5.0) return 'Weekender';
  if (evolution < 10.0) return 'Local';
  if (evolution < 20.0) return 'Islander';
  return 'OBX Legend';
};

export const AI_TRAITS: AITrait[] = [
  { id: 'beachcomber', name: 'Beachcomber', description: 'You have a keen eye for finding treasures in the sand.', threshold: 1.5, bonus: '+2 Attack' },
  { id: 'sea_legs', name: 'Sea Legs', description: 'You have grown accustomed to the shifting tides.', threshold: 2.5, bonus: '+10 Max Health' },
  { id: 'navigator', name: 'Navigator', description: 'You can read the stars and the currents with ease.', threshold: 4.0, bonus: '+10% Legacy Speed' },
  { id: 'salt_in_veins', name: 'Salt in Veins', description: 'The Atlantic is now part of your soul.', threshold: 6.0, bonus: '+5 Defense' },
  { id: 'lore_keeper', name: 'Lore Keeper', description: 'You know the stories of every shipwreck and lighthouse.', threshold: 8.5, bonus: '+20% Sand Dollar gain' },
  { id: 'tide_caller', name: 'Tide Caller', description: 'The ocean responds to your presence.', threshold: 12.0, bonus: '+30 Max Health' },
  { id: 'storm_rider', name: 'Storm Rider', description: 'You can navigate even the fiercest Nor\'easters.', threshold: 16.0, bonus: '+10 Attack, +10 Defense' },
  { id: 'island_soul', name: 'Island Soul', description: 'You are one with Hatteras Island.', threshold: 20.0, bonus: 'All stats significantly boosted' }
];

export const TIERS = [
  {
    id: 'initiate',
    name: 'Navigator (SMB)',
    price: 499,
    description: 'The essential toolkit for small business automation.',
    features: ['50,000 AI Workflow Runs/mo', 'Full API Access & Webhooks', '5 Team Seats Included', 'Standard Support SLA'],
    color: '#00E0FF'
  },
  {
    id: 'automator',
    name: 'Lighthouse (Growth)',
    price: 1299,
    description: 'Scale your operations with advanced neural processing.',
    features: ['250,000 AI Workflow Runs/mo', 'Priority Neural Processing', '20 Team Seats Included', 'Custom Model Fine-tuning'],
    color: '#0080FF'
  },
  {
    id: 'architect',
    name: 'Neural Nexus (Scale)',
    price: 3499,
    description: 'Enterprise-grade power for high-volume island networks.',
    features: ['1,000,000 AI Workflow Runs/mo', 'Dedicated Infrastructure', 'Unlimited Team Seats', '24/7 Priority Support'],
    color: '#FFD700'
  },
  {
    id: 'omniscient',
    name: 'Island Sovereign (Elite)',
    price: 7999,
    description: 'Total mastery over the Outer Banks digital ecosystem.',
    features: ['Unlimited AI Workflow Runs', 'On-Premise Deployment Options', 'White-labeling & Custom Branding', 'Dedicated Success Manager'],
    color: '#FFFFFF'
  }
];

export const SKILLS = [
  { id: 'explorer', name: 'Path of the Beachcomber', description: 'Unlocks deeper, more distant island reaches.', cost: 5, icon: Globe },
  { id: 'analyst', name: 'Path of the Lore Keeper', description: 'Reveals hidden island history and secret markers.', cost: 8, icon: Eye },
  { id: 'warrior', name: 'Path of the Storm Rider', description: 'Increases Attack power by 100%.', cost: 10, icon: Sword },
  { id: 'architect', name: 'Path of the Lighthouse Keeper', description: 'Boosts legacy gain from items by 50%.', cost: 12, icon: Layers },
  { id: 'survivor', name: 'Path of the Islander', description: 'Increases Island Harmony by 50 points.', cost: 15, icon: Anchor }
];

export const SAVE_KEY = 'ai_surfer_realm_save';
