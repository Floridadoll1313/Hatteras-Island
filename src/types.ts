import { User } from 'firebase/auth';

export type AIStage = 'nascent' | 'aware' | 'sentient' | 'transcendent' | 'singularity';

export interface AITrait {
  id: string;
  name: string;
  description: string;
  bonus: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  type: 'resource' | 'tool' | 'artifact' | 'consumable';
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  icon: string;
}

export interface BranchingPath {
  id: string;
  label: string;
  description: string;
  risk: 'low' | 'medium' | 'high' | 'extreme';
  riskLevel?: 'low' | 'medium' | 'high' | 'extreme'; // Compatibility
  title?: string; // Compatibility
  consequence?: string; // Compatibility
  requirement?: string;
}

export interface Realm {
  id: string;
  name: string;
  description: string;
  lore: string;
  entities: string[];
  options: string[];
  paths: BranchingPath[];
  discoveredItems: string[];
  threats: string[];
  npcs: string[];
}

export type RealmNode = Realm; // Compatibility

export interface CombatLogEntry {
  timestamp: number;
  type: 'player' | 'enemy' | 'system';
  message: string;
}

export interface CombatState {
  turn: 'player' | 'enemy';
  playerHealth: number;
  playerMaxHealth: number;
  enemy: {
    name: string;
    health: number;
    maxHealth: number;
    abilities: string[];
  };
  logs: CombatLogEntry[];
  isDefending: boolean;
  victory?: boolean;
  defeat?: boolean;
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
  signalRange: number;
  storageCapacity: number;
  defenseLevel: number;
  upgrades: string[];
  lastVisited?: number;
  energyEfficiency?: number;
}

export type SocialPhase = 'day' | 'accusation' | 'voting' | 'night' | 'dawn';
export type VotingToken = 1 | 0 | -1 | string;

export interface BDILogic {
  beliefs: string[];
  desires: string[];
  intentions: string[];
}

export type ContestantStatus = 'active' | 'voted_out' | 'medevac' | 'eliminated';

export interface Contestant {
  id: string;
  name: string;
  archetype: string;
  threatLevel: number;
  loyalty: number;
  strategicAbility: number;
  physicalAbility: number;
  status: ContestantStatus;
  isPlayer: boolean;
  aiModel?: string;
  impressions?: Record<string, number>; // Theory of Mind impressions of other villagers
  persona?: {
    traitScales: { stubbornVsAgreeable: number; cooperationVsInitiative: number };
    archetype: string;
  };
  memoryStream?: string[];
  strategicGoals?: string[];
  role?: 'villager' | 'wolf';
  bdi?: BDILogic;
}

export interface Alliance {
  id: string;
  name: string;
  members: string[]; // contestant IDs
  strength: number;
  trust: number;
}

export interface SurvivorChallenge {
  id: string;
  title: string;
  type: 'physical' | 'strategic' | 'social' | 'reward' | 'immunity';
  description: string;
  difficulty: number;
  reward: number;
}

export interface AIKnowledgePiece {
  id: string;
  title: string;
  description: string;
  category: 'social' | 'technical' | 'strategic' | 'survival';
  timestamp: number;
}

export interface BusinessAIChallenge {
  id: string;
  title: string;
  problem: string;
  solutionHint: string;
  category: 'marketing' | 'operations' | 'customer_service' | 'finance';
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface HiddenIdol {
  id: string;
  location: string;
  isFound: boolean;
  challengeId: string;
}

export interface SurvivorState {
  day: number;
  tribe: string;
  contestants: Contestant[];
  alliances: Alliance[];
  challenges: SurvivorChallenge[];
  aiLearningProgress: number;
  eliminatedCount: number;
  eliminated?: number; // Compatibility
  immunityIdolFound: boolean;
  idols: HiddenIdol[];
  currentBusinessChallenge: BusinessAIChallenge | null;
  aiPiecesCollected: string[];
  aiKnowledgeBank: AIKnowledgePiece[];
  campMorale: number;
  campInfrastructure: number;
  tribeLevel: number;
  sandDollars: number;
  fullness: number;
  hitPoints: number;
  foodSupply: number;
  phase: SocialPhase;
  votingHistory: Record<string, Record<string, VotingToken>>; // day_phase -> voterId -> token/targetId
  metrics: {
    majorityWinRate: number;
    tieIndicator: number;
    coordinationEfficiency: number;
  };
}

export type FactionType = 'surfers' | 'keepers' | 'pirates' | null;

export interface WorldEvent {
  id: string;
  name: string;
  description: string;
  duration: number;
  effect: string;
}

export interface BusinessState {
  revenue: number;
  expenses: number;
  users: number;
  growth: number;
}

export interface GameState {
  day: number;
  vitality: number;
  sandDollars: number;
  aiStage: AIStage;
  evolution: number;
  discoveredRealms: string[];
  currentRealm: Realm;
  currentVillage?: string;
  currentZone?: string;
  inventory: string[];
  skills: string[];
  traits: string[];
  memory: string[];
  activeEvents: WorldEvent[];
  faction: FactionType;
  lighthouse: LighthouseState;
  survivor: SurvivorState;
  business?: BusinessState;
  history?: string[]; // Compatibility
  tasks?: any[]; // Compatibility
  isParadiseMember?: boolean; // For members area logic
  villageId?: string;
  role?: 'TRIBE_LEADER' | 'VILLAGER';
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: any;
}

export interface Tier {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
}

export interface Faction {
  id: string;
  name: string;
  description: string;
  bonuses: string[];
}

export interface SalesItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  category?: 'survival' | 'workflow' | 'package' | 'implementation' | 'monitoring';
  isMemberOnly?: boolean;
}
