export interface RealmNode {
  id: string;
  name: string;
  description: string;
  environment: string;
  entities: string[];
  options: RealmOption[];
  lore: string;
  item?: InventoryItem;
  enemy?: Enemy;
  npc?: NPC;
  imageUrl?: string;
}

export interface Enemy {
  id: string;
  name: string;
  description: string;
  health: number;
  maxHealth: number;
  attack: number;
  defense: number;
  abilities: string[];
}

export interface CombatLogEntry {
  message: string;
  type: 'player' | 'enemy' | 'system';
  timestamp: number;
}

export interface CombatState {
  enemy: Enemy;
  playerHealth: number;
  playerMaxHealth: number;
  turn: 'player' | 'enemy';
  logs: CombatLogEntry[];
  isDefending: boolean;
  enemyLearningLevel: number;
  playerActionHistory: string[];
}

export interface RealmOption {
  label: string;
  action: string;
  targetType: 'explore' | 'interact' | 'analyze';
}

export interface BranchingPath {
  id: string;
  title: string;
  consequence: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  potentialReward: string;
}

export type SubscriptionTier = 'none' | 'initiate' | 'automator' | 'architect' | 'omniscient';

export type AIStage = 'Tourist' | 'Weekender' | 'Local' | 'Islander' | 'OBX Legend';

export interface AITrait {
  id: string;
  name: string;
  description: string;
  threshold: number;
  bonus?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  type: 'artifact' | 'tool' | 'data_fragment' | 'material';
  rarity: 'common' | 'rare' | 'exotic' | 'legendary';
  effect?: string;
  passiveBonus?: string;
}

export interface WorldEvent {
  id: string;
  name: string;
  description: string;
  duration: number; // Number of transitions it lasts
  type: 'anomaly' | 'surge' | 'corruption' | 'blessing';
  effect: string;
}

export interface AIResponse {
  id: string;
  type: 'text' | 'image' | 'video' | 'audio' | 'maps';
  content: string;
  timestamp: number;
  metadata?: any;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  reward?: number;
}

export interface CraftingRecipe {
  id: string;
  name: string;
  description: string;
  ingredients: { itemId: string; count: number }[];
  result: InventoryItem;
}

export type WeatherType = 'clear' | 'stormy' | 'foggy' | 'heatwave' | 'hurricane';
export type TideState = 'low' | 'high' | 'incoming' | 'outgoing';

export interface NPC {
  id: string;
  name: string;
  role: string;
  description: string;
  dialogue: string[];
  trades?: { input: string; output: InventoryItem }[];
}

export interface LighthouseUpgrade {
  id: string;
  name: string;
  description: string;
  level: number;
  cost: number;
  bonus: string;
}

export interface LighthouseState {
  level: number;
  upgrades: string[];
  lastVisited: number;
  signalRange: number;
  storageCapacity: number;
  defenseLevel: number;
  energyEfficiency: number;
}

export type FactionType = 'none' | 'preservationist' | 'explorer' | 'reclaimer';

export interface SurfingGameState {
  isActive: boolean;
  score: number;
  multiplier: number;
  distance: number;
}

export interface GameState {
  currentRealm: RealmNode | null;
  history: string[];
  inventory: InventoryItem[];
  activeEvents: WorldEvent[];
  sandDollars: number;
  skills: string[];
  playerStats: {
    health: number;
    maxHealth: number;
    attack: number;
    defense: number;
  };
  combat: CombatState | null;
  pastCombatLogs: CombatLogEntry[][];
  aiStatus: {
    evolution: number;
    stage: AIStage;
    traits: string[]; // IDs of unlocked traits
    memory: string[];
  };
  subscription: {
    tier: SubscriptionTier;
    status: 'active' | 'inactive' | 'pending';
    stripeCustomerId?: string;
  };
  aiResponses: AIResponse[];
  tasks: Task[];
  weather: WeatherType;
  tide: TideState;
  lighthouse: LighthouseState;
  faction: FactionType;
  factionReputation: number;
  surfingGame: SurfingGameState;
  business: {
    revenue: number;
    activeClients: number;
    workflowsSold: number;
    reputation: number;
  };
}
