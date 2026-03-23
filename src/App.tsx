/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal, 
  Anchor, 
  Globe, 
  Waves, 
  Database, 
  Activity, 
  ChevronRight, 
  Loader2,
  Layers,
  Compass,
  Eye,
  CreditCard,
  Lock,
  Check,
  ArrowRight,
  X,
  Save,
  RotateCcw,
  Download,
  Volume2,
  Sword,
  Heart,
  Zap,
  Shield,
  Package,
  History as HistoryIcon,
  Skull,
  Users,
  MessageSquare,
  Image as ImageIcon,
  Video,
  Mic,
  MapPin,
  Brain,
  Sparkles,
  Search,
  Upload,
  Play,
  Pause,
  VolumeX,
  RefreshCw,
  Trash2,
  CheckCircle2,
  Circle,
  TrendingUp,
  DollarSign,
  Briefcase,
  BarChart3,
  Rocket,
  Mail
} from 'lucide-react';
import { 
  RealmNode, 
  GameState, 
  SubscriptionTier, 
  BranchingPath, 
  WorldEvent, 
  CombatState, 
  Enemy, 
  AIStage, 
  AITrait, 
  CombatLogEntry, 
  AIResponse,
  WeatherType,
  TideState,
  LighthouseUpgrade,
  FactionType
} from './types';
import { 
  generateInitialRealm, 
  generateNextRealm, 
  generateDetailedLore, 
  generateBranchingPaths, 
  generateWorldEvent, 
  generateCombatReward,
  generateVideoFromImage,
  generateImageFromText,
  analyzeImage,
  analyzeVideo,
  transcribeAudio,
  generateSpeech,
  getThinkingResponse,
  getMapsGroundingResponse,
  getFastResponse,
  getSearchGroundingResponse,
  editImage,
  getLiveAudioSession
} from './services/geminiService';
import { getAIStage, AI_TRAITS, TIERS, SKILLS, SAVE_KEY } from './gameConstants';
import Markdown from 'react-markdown';
import { db, auth, signIn, signOut, handleFirestoreError, OperationType } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import Memorial from './components/Memorial';
import AmbientAudio from './components/AmbientAudio';
import ApiKeySelector from './components/ApiKeySelector';
import AILab from './components/AILab';
import Lighthouse from './components/Lighthouse';
import FactionSelection from './components/FactionSelection';
import SurfingGame from './components/SurfingGame';
import Founders from './components/Founders';
import BusinessDashboard from './components/BusinessDashboard';
import SalesCenter from './components/SalesCenter';
import SubscriptionSuccess from './components/SubscriptionSuccess';
import EmailIntake from './components/EmailIntake';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import RealmView from './components/RealmView';
import RightPanel from './components/RightPanel';
import CombatOverlay from './components/CombatOverlay';
import SkillsOverlay from './components/SkillsOverlay';
import PricingOverlay from './components/PricingOverlay';

export default function App() {
  const [gameState, setGameState] = useState<GameState>({
    currentRealm: null,
    history: [],
    inventory: [],
    activeEvents: [],
    sandDollars: 0,
    skills: [],
    playerStats: {
      health: 100,
      maxHealth: 100,
      attack: 10,
      defense: 5
    },
    combat: null,
    pastCombatLogs: [],
    aiStatus: {
      evolution: 1.0,
      stage: 'Tourist',
      traits: [],
      memory: []
    },
    subscription: {
      tier: 'none',
      status: 'inactive'
    },
    aiResponses: [],
    tasks: [
      { id: 'arrival', title: 'Island Arrival', description: 'Reach your first destination on Hatteras Island.', completed: false, reward: 50 },
      { id: 'neural', title: 'Neural Link', description: 'Establish a connection with the island\'s AI.', completed: false, reward: 100 },
      { id: 'scavenger', title: 'Scavenger', description: 'Find your first piece of gear.', completed: false, reward: 75 }
    ],
    weather: 'clear',
    tide: 'low',
    lighthouse: {
      level: 1,
      upgrades: [],
      lastVisited: Date.now(),
      signalRange: 1,
      storageCapacity: 1,
      defenseLevel: 1,
      energyEfficiency: 1
    },
    faction: 'none',
    factionReputation: 0,
    surfingGame: {
      isActive: false,
      score: 0,
      multiplier: 1,
      distance: 0
    },
    business: {
      revenue: 0,
      activeClients: 0,
      workflowsSold: 0,
      reputation: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [transitioning, setTransitioning] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [showSkills, setShowSkills] = useState(false);
  const [showFounders, setShowFounders] = useState(false);
  const [showMemorial, setShowMemorial] = useState(false);
  const [showAILab, setShowAILab] = useState(false);
  const [showLighthouse, setShowLighthouse] = useState(false);
  const [showFactionSelection, setShowFactionSelection] = useState(false);
  const [showSurfingGame, setShowSurfingGame] = useState(false);
  const [showApiKeySelector, setShowApiKeySelector] = useState(false);
  const [showBusinessDashboard, setShowBusinessDashboard] = useState(false);
  const [showSalesCenter, setShowSalesCenter] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [showSubscriptionSuccess, setShowSubscriptionSuccess] = useState<{ plan: string } | null>(null);
  const [hasPaidKey, setHasPaidKey] = useState(false);

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio?.hasSelectedApiKey) {
        try {
          const has = await window.aistudio.hasSelectedApiKey();
          setHasPaidKey(has);
        } catch (error) {
          console.error("Error checking API key:", error);
        }
      }
    };
    checkKey();
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState(prev => {
        const weathers: WeatherType[] = ['clear', 'stormy', 'foggy', 'heatwave', 'hurricane'];
        const tides: TideState[] = ['low', 'high', 'incoming', 'outgoing'];
        
        const nextWeather = Math.random() < 0.1 ? weathers[Math.floor(Math.random() * weathers.length)] : prev.weather;
        
        // Cycle tides
        let nextTide = prev.tide;
        if (prev.tide === 'low') nextTide = 'incoming';
        else if (prev.tide === 'incoming') nextTide = 'high';
        else if (prev.tide === 'high') nextTide = 'outgoing';
        else if (prev.tide === 'outgoing') nextTide = 'low';

        if (nextWeather !== prev.weather || nextTide !== prev.tide) {
          return {
            ...prev,
            weather: nextWeather,
            tide: nextTide,
            history: [`ENVIRONMENT_UPDATE: Weather is now ${nextWeather}, Tide is ${nextTide}.`, ...prev.history]
          };
        }
        return prev;
      });
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const [aiLabTab, setAiLabTab] = useState<'chat' | 'generate' | 'analyze' | 'maps' | 'craft'>('chat');
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [imagePrompt, setImagePrompt] = useState('');
  const [videoPrompt, setVideoPrompt] = useState('');
  const [genLoading, setGenLoading] = useState(false);
  const [analysisInput, setAnalysisInput] = useState('');
  const [analysisFile, setAnalysisFile] = useState<string | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [mapsInput, setMapsInput] = useState('');
  const [mapsLoading, setMapsLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [imageEditPrompt, setImageEditPrompt] = useState('');
  const [thinkingMode, setThinkingMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [transcribing, setTranscribing] = useState(false);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [liveSession, setLiveSession] = useState<any>(null);
  const [liveTranscript, setLiveTranscript] = useState<string[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [combatLogFilter, setCombatLogFilter] = useState<'all' | 'player' | 'enemy' | 'system'>('all');
  const [showPastLogs, setShowPastLogs] = useState(false);
  const [activeTab, setActiveTab] = useState<'logs' | 'inventory' | 'tasks' | 'hub'>('logs');
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [loreData, setLoreData] = useState<string | null>(null);
  const [loreLoading, setLoreLoading] = useState(false);
  const [branchingPaths, setBranchingPaths] = useState<BranchingPath[] | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status');
    const plan = params.get('plan');
    const sessionId = params.get('session_id');

    if (status === 'success' && plan) {
      setShowSubscriptionSuccess({ plan });
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Update state and Firestore
      if (user) {
        const updateSubscription = async () => {
          try {
            let customerId = '';
            if (sessionId) {
              const res = await fetch(`/api/checkout-session/${sessionId}`);
              const data = await res.json();
              customerId = data.customer;
            }

            const userRef = doc(db, 'users', user.uid);
            const subData = {
              tier: plan,
              status: 'active',
              stripeCustomerId: customerId,
              updatedAt: new Date().toISOString()
            };
            
            await updateDoc(userRef, {
              subscription: subData,
              updatedAt: serverTimestamp()
            });

            setGameState(prev => ({
              ...prev,
              subscription: {
                tier: plan as SubscriptionTier,
                status: 'active',
                stripeCustomerId: customerId
              },
              history: [`SUBSCRIPTION_ACTIVATED: ${plan} plan is now active.`, ...prev.history]
            }));
          } catch (error) {
            handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
          }
        };
        updateSubscription();
      }
    }
  }, [user]);

  // Load game on mount
  useEffect(() => {
    async function init() {
      try {
        let savedData: string | null = null;
        
        if (user) {
          const path = `users/${user.uid}`;
          try {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
              const data = userDoc.data();
              savedData = JSON.stringify(data.gameState);
              if (data.subscription) {
                setGameState(prev => ({
                  ...prev,
                  subscription: {
                    tier: data.subscription.tier,
                    status: data.subscription.status,
                    stripeCustomerId: data.subscription.stripeCustomerId
                  }
                }));
              }
            }
          } catch (error) {
            handleFirestoreError(error, OperationType.GET, path);
          }
        }

        if (!savedData) {
          savedData = localStorage.getItem(SAVE_KEY);
        }

        if (savedData) {
          const parsed = JSON.parse(savedData);
          // Ensure activeEvents, playerStats, and aiStatus.stage exist for backward compatibility
          setGameState({
            ...parsed,
            sandDollars: parsed.sandDollars ?? parsed.neuralPoints ?? 0,
            activeEvents: parsed.activeEvents || [],
            inventory: parsed.inventory || [],
            tasks: parsed.tasks || [],
            playerStats: parsed.playerStats || {
              health: 100,
              maxHealth: 100,
              attack: 10,
              defense: 5
            },
            combat: parsed.combat || null,
            aiStatus: {
              ...parsed.aiStatus,
              stage: parsed.aiStatus.stage || getAIStage(parsed.aiStatus.evolution),
              traits: parsed.aiStatus.traits || []
            },
            aiResponses: parsed.aiResponses || []
          });
          setGameState(prev => ({
            ...prev,
            history: [...prev.history, "System Alert: Consciousness restored."]
          }));
        } else {
          const initial = await generateInitialRealm();
          setGameState(prev => {
            const newInventory = [...prev.inventory];
            if (initial.item) {
              newInventory.push(initial.item);
            }
            return {
              ...prev,
              currentRealm: initial,
              inventory: newInventory,
              sandDollars: 0,
              skills: [],
              history: [`System Initialized: ${initial.name}`, ...(initial.item ? [`Discovered: ${initial.item.name}`] : [])]
            };
          });
        }
      } catch (error) {
        console.error("Failed to initialize realm:", error);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [user]);

  // Auto-save whenever gameState changes
  useEffect(() => {
    if (gameState.currentRealm) {
      localStorage.setItem(SAVE_KEY, JSON.stringify(gameState));
      
      if (user) {
        const path = `users/${user.uid}`;
        const saveToFirestore = async () => {
          try {
            await setDoc(doc(db, 'users', user.uid), {
              uid: user.uid,
              email: user.email,
              gameState: gameState,
              subscription: {
                tier: gameState.subscription.tier,
                status: gameState.subscription.status,
                stripeCustomerId: gameState.subscription.stripeCustomerId || '',
                updatedAt: new Date().toISOString()
              },
              updatedAt: serverTimestamp()
            });
          } catch (error) {
            handleFirestoreError(error, OperationType.WRITE, path);
          }
        };
        saveToFirestore();
      }
    }
  }, [gameState, user]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [gameState.history]);

  const handleManualSave = () => {
    setSaveStatus('saving');
    localStorage.setItem(SAVE_KEY, JSON.stringify(gameState));
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 500);
  };

  const handleReset = async () => {
    if (confirm("Are you sure you want to reset your journey? All progress on the island will be lost.")) {
      setLoading(true);
      localStorage.removeItem(SAVE_KEY);
      try {
        const initial = await generateInitialRealm();
        setGameState({
          currentRealm: initial,
          history: [`System Reset: ${initial.name}`],
          inventory: [],
          activeEvents: [],
          sandDollars: 0,
          skills: [],
          playerStats: {
            health: 100,
            maxHealth: 100,
            attack: 10,
            defense: 5
          },
          combat: null,
          pastCombatLogs: [],
          aiStatus: {
            evolution: 1.0,
            stage: 'Tourist',
            traits: [],
            memory: []
          },
          subscription: gameState.subscription, // Keep subscription
          aiResponses: [],
          tasks: [
            { id: 'arrival', title: 'Island Arrival', description: 'Reach your first destination on Hatteras Island.', completed: false, reward: 50 },
            { id: 'neural', title: 'Neural Link', description: 'Establish a connection with the island\'s AI.', completed: false, reward: 100 },
            { id: 'scavenger', title: 'Scavenger', description: 'Find your first piece of gear.', completed: false, reward: 75 }
          ],
          weather: 'clear',
          tide: 'low',
          lighthouse: {
            level: 1,
            upgrades: [],
            lastVisited: Date.now(),
            signalRange: 1,
            storageCapacity: 1,
            defenseLevel: 1,
            energyEfficiency: 1
          },
          faction: 'none',
          factionReputation: 0,
          surfingGame: {
            isActive: false,
            score: 0,
            multiplier: 1,
            distance: 0
          },
          business: {
            revenue: 0,
            activeClients: 0,
            workflowsSold: 0,
            reputation: 0
          }
        });
      } catch (error) {
        console.error("Reset failed:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleTask = (taskId: string) => {
    setGameState(prev => {
      const task = prev.tasks.find(t => t.id === taskId);
      if (task && !task.completed) {
        // Add reward if completing for the first time
        return {
          ...prev,
          sandDollars: prev.sandDollars + (task.reward || 0),
          history: [`> OBJECTIVE_COMPLETE: ${task.title} (+${task.reward} SD)`, ...prev.history],
          tasks: prev.tasks.map(t => 
            t.id === taskId ? { ...t, completed: true } : t
          )
        };
      }
      return {
        ...prev,
        tasks: prev.tasks.map(t => 
          t.id === taskId ? { ...t, completed: !t.completed } : t
        )
      };
    });
  };

  const handleAction = async (option: { label: string, action: string }) => {
    if (!gameState.currentRealm || transitioning) return;

    setTransitioning(true);
    setGameState(prev => ({
      ...prev,
      history: [...prev.history, `> ${option.label}`]
    }));

    try {
      const paths = await generateBranchingPaths(gameState.currentRealm, option.action, gameState.inventory, gameState.activeEvents, gameState.aiStatus.stage);
      setBranchingPaths(paths);
      setTransitioning(false);
    } catch (error) {
      console.error("Branching failed:", error);
      // Fallback to direct generation if branching fails
      const next = await generateNextRealm(gameState.currentRealm, option.action, gameState.inventory, gameState.activeEvents, gameState.aiStatus.stage);
      setGameState(prev => {
        const newMemory = [...prev.aiStatus.memory];
        if (!newMemory.includes(next.name)) {
          newMemory.push(next.name);
          if (newMemory.length > 10) newMemory.shift();
        }

        // Update events: decrement duration and filter out expired
        const updatedEvents = (prev.activeEvents || [])
          .map(e => ({ ...e, duration: e.duration - 1 }))
          .filter(e => e.duration > 0);

        // Calculate evolution bonus
        let evolutionBonus = 0.1;
        prev.inventory.forEach(item => {
          if (item.type === 'artifact') evolutionBonus += 0.05;
          if (item.passiveBonus?.toLowerCase().includes('evolution')) evolutionBonus += 0.02;
        });

        // Trait bonuses: Data Compression
        if (prev.aiStatus.traits.includes('data_compression')) evolutionBonus *= 1.1;

        // Event effects
        updatedEvents.forEach(e => {
          if (e.type === 'surge') evolutionBonus *= 1.5;
          if (e.type === 'corruption') evolutionBonus *= 0.5;
        });

        const newEvolution = prev.aiStatus.evolution + evolutionBonus;
        const newStage = getAIStage(newEvolution);
        
        // Check for new traits
        const newTraits = [...prev.aiStatus.traits];
        let newPlayerStats = { ...prev.playerStats };
        let newSandDollars = prev.sandDollars + 1;

        // Trait: Lore Keeper
        if (prev.aiStatus.traits.includes('lore_keeper')) newSandDollars += 0.2;

        AI_TRAITS.forEach(trait => {
          if (newEvolution >= trait.threshold && !newTraits.includes(trait.id)) {
            newTraits.push(trait.id);
            prev.history.push(`MILESTONE REACHED: Unlocked Trait - ${trait.name}. ${trait.description}`);
            
            // Apply immediate stat bonuses
            if (trait.id === 'beachcomber') newPlayerStats.attack += 2;
            if (trait.id === 'sea_legs') {
              newPlayerStats.maxHealth += 10;
              newPlayerStats.health += 10;
            }
            if (trait.id === 'salt_in_veins') newPlayerStats.defense += 5;
            if (trait.id === 'tide_caller') {
              newPlayerStats.maxHealth += 30;
              newPlayerStats.health += 30;
            }
            if (trait.id === 'storm_rider') {
              newPlayerStats.attack += 10;
              newPlayerStats.defense += 10;
            }
            if (trait.id === 'island_soul') {
              newPlayerStats.maxHealth += 50;
              newPlayerStats.health += 50;
              newPlayerStats.attack += 20;
              newPlayerStats.defense += 20;
            }
          }
        });

        if (newStage !== prev.aiStatus.stage) {
          prev.history.push(`LEGACY EVOLVED: You are now recognized as a ${newStage}.`);
        }

        return {
          ...prev,
          currentRealm: next,
          activeEvents: updatedEvents,
          sandDollars: newSandDollars,
          history: [
            ...prev.history, 
            `Arrived at: ${next.name}`,
            ...(next.enemy ? [`CHALLENGE: ${next.enemy.name} encountered!`] : []),
            `Earned ${newSandDollars - prev.sandDollars} Sand Dollar(s).`
          ],
          playerStats: newPlayerStats,
          aiStatus: {
            ...prev.aiStatus,
            evolution: newEvolution,
            stage: newStage,
            traits: newTraits,
            memory: newMemory
          }
        };
      });

      if (next.enemy) {
        setTimeout(() => {
          startCombat(next.enemy!);
        }, 1000);
      }

      setTransitioning(false);
    }
  };

  const startCombat = (enemy: Enemy) => {
    setGameState(prev => ({
      ...prev,
      combat: {
        enemy,
        playerHealth: prev.playerStats.health,
        playerMaxHealth: prev.playerStats.maxHealth,
        turn: 'player',
        logs: [{
          message: `A hostile entity detected: ${enemy.name}. Initializing combat protocols.`,
          type: 'system',
          timestamp: Date.now()
        }],
        isDefending: false,
        enemyLearningLevel: 0,
        playerActionHistory: []
      }
    }));
  };

  const handleCombatAction = async (action: 'attack' | 'defend' | 'special') => {
    if (!gameState.combat || gameState.combat.turn !== 'player') return;

    let victory = false;
    let defeatedEnemy: Enemy | null = null;
    let finalLogs: CombatLogEntry[] = [];

    setGameState(prev => {
      if (!prev.combat) return prev;
      const { enemy, logs, playerActionHistory } = prev.combat;
      const { attack } = prev.playerStats;
      
      let newEnemyHealth = enemy.health;
      let newLogs = [...logs];
      let newIsDefending = false;
      const timestamp = Date.now();

      if (action === 'attack') {
        const damage = Math.max(1, attack - enemy.defense + Math.floor(Math.random() * 5));
        newEnemyHealth = Math.max(0, enemy.health - damage);
        newLogs.push({
          message: `You strike the ${enemy.name} for ${damage} harmony disruption.`,
          type: 'player',
          timestamp
        });
      } else if (action === 'defend') {
        newIsDefending = true;
        newLogs.push({
          message: `You reinforce your island protection.`,
          type: 'player',
          timestamp
        });
      } else if (action === 'special') {
        const damage = Math.max(5, attack * 2 - enemy.defense);
        newEnemyHealth = Math.max(0, enemy.health - damage);
        newLogs.push({
          message: `You unleash a synaptic surge! ${enemy.name} takes ${damage} damage.`,
          type: 'player',
          timestamp
        });
      }

      const newPlayerActionHistory = [...playerActionHistory, action];

      if (newEnemyHealth <= 0) {
        victory = true;
        defeatedEnemy = enemy;
        finalLogs = newLogs;
        return {
          ...prev,
          combat: null,
          pastCombatLogs: [newLogs, ...prev.pastCombatLogs].slice(0, 10), // Keep last 10 battles
          history: [...prev.history, `Combat Victory: ${enemy.name} has been de-rezzed.`]
        };
      }

      return {
        ...prev,
        combat: {
          ...prev.combat,
          enemy: { ...enemy, health: newEnemyHealth },
          logs: newLogs,
          isDefending: newIsDefending,
          playerActionHistory: newPlayerActionHistory,
          turn: 'enemy' as const
        }
      };
    });

    if (victory && defeatedEnemy) {
      try {
        const reward = await generateCombatReward(defeatedEnemy, gameState.aiStatus.stage);
        setGameState(prev => ({
          ...prev,
          sandDollars: prev.sandDollars + reward.sandDollars,
          inventory: reward.item ? [...prev.inventory, reward.item] : prev.inventory,
          activeEvents: reward.event ? [...prev.activeEvents, reward.event] : prev.activeEvents,
          history: [
            ...prev.history, 
            `Reward: ${reward.message}`,
            `Gained ${reward.sandDollars} Sand Dollars.`,
            ...(reward.item ? [`Acquired: ${reward.item.name}`] : []),
            ...(reward.event ? [`Island Status: ${reward.event.name} active.`] : [])
          ]
        }));
      } catch (error) {
        console.error("Reward generation failed:", error);
        // Fallback reward
        setGameState(prev => ({
          ...prev,
          sandDollars: prev.sandDollars + 10,
          history: [...prev.history, "Gained 10 Sand Dollars from the challenge."]
        }));
      }
      return;
    }

    // Trigger enemy turn after a delay
    setTimeout(() => {
      enemyTurn();
    }, 1500);
  };

  const enemyTurn = () => {
    setGameState(prev => {
      if (!prev.combat) return prev;
      const { enemy, playerHealth, isDefending, playerActionHistory, enemyLearningLevel, logs } = prev.combat;
      const { defense } = prev.playerStats;

      // Enhanced AI Logic
      const recentActions = (playerActionHistory || []).slice(-3);
      const attackCount = recentActions.filter(a => a === 'attack').length;
      const defendCount = recentActions.filter(a => a === 'defend').length;
      
      let damageMultiplier = 1;
      let aiMessage = `${enemy.name} attacks!`;
      let newLearningLevel = enemyLearningLevel + 0.1;

      // Learning from player patterns
      if (defendCount >= 2) {
        // Player is defending a lot, use a piercing attack
        damageMultiplier = 1.5;
        aiMessage = `${enemy.name} anticipates your defense and uses a Piercing Strike!`;
      } else if (attackCount >= 2) {
        // Player is aggressive, enemy becomes more cautious (harder to hit)
        aiMessage = `${enemy.name} adapts to your aggression, becoming harder to track.`;
        // In a real system we might modify enemy defense here, but let's keep it simple for now
      }

      const baseDamage = Math.max(1, enemy.attack - defense + Math.floor(Math.random() * 4));
      let damage = Math.floor(baseDamage * damageMultiplier);
      if (isDefending && damageMultiplier === 1) {
        damage = Math.floor(damage / 2);
      }
      
      const newPlayerHealth = Math.max(0, playerHealth - damage);
      const newLogs = [...logs, {
        message: `${aiMessage} You take ${damage} damage.`,
        type: 'enemy' as const,
        timestamp: Date.now()
      }];

      if (newPlayerHealth <= 0) {
        return {
          ...prev,
          combat: null,
          pastCombatLogs: [newLogs, ...prev.pastCombatLogs].slice(0, 10),
          history: [...prev.history, `CRITICAL FAILURE: Consciousness fragmented by ${enemy.name}. System reboot required.`],
          playerStats: { ...prev.playerStats, health: 0 }
        };
      }

      return {
        ...prev,
        combat: {
          ...prev.combat,
          playerHealth: newPlayerHealth,
          logs: newLogs,
          turn: 'player',
          isDefending: false,
          enemyLearningLevel: newLearningLevel
        },
        playerStats: { ...prev.playerStats, health: newPlayerHealth }
      };
    });
  };

  const handleSelectPath = async (path: BranchingPath) => {
    if (!gameState.currentRealm || transitioning) return;
    
    setTransitioning(true);
    setBranchingPaths(null);
    try {
      const next = await generateNextRealm(gameState.currentRealm, path.title, gameState.inventory, gameState.activeEvents, gameState.aiStatus.stage, path);
      
      // Potential for new world event (15% chance)
      let newEvent: WorldEvent | null = null;
      if (Math.random() < 0.15) {
        try {
          newEvent = await generateWorldEvent(next, gameState.history, gameState.aiStatus.stage);
        } catch (e) {
          console.error("Event generation failed:", e);
        }
      }

      setGameState(prev => {
        const newMemory = [...prev.aiStatus.memory];
        if (!newMemory.includes(next.name)) {
          newMemory.push(next.name);
          if (newMemory.length > 10) newMemory.shift();
        }

        const newInventory = [...prev.inventory];
        if (next.item) {
          newInventory.push(next.item);
        }

        // Update events: decrement duration and filter out expired
        let updatedEvents = (prev.activeEvents || [])
          .map(e => ({ ...e, duration: e.duration - 1 }))
          .filter(e => e.duration > 0);
        
        if (newEvent) {
          updatedEvents.push(newEvent);
        }

        // Calculate evolution bonus
        let evolutionBonus = 0.1;
        prev.inventory.forEach(item => {
          if (item.type === 'artifact') evolutionBonus += 0.05;
          if (item.passiveBonus?.toLowerCase().includes('evolution')) evolutionBonus += 0.02;
        });

        // Trait bonuses: Data Compression
        if (prev.aiStatus.traits.includes('data_compression')) evolutionBonus *= 1.1;

        // Event effects
        updatedEvents.forEach(e => {
          if (e.type === 'surge') evolutionBonus *= 1.5;
          if (e.type === 'corruption') evolutionBonus *= 0.5;
        });

        const newEvolution = prev.aiStatus.evolution + evolutionBonus;
        const newStage = getAIStage(newEvolution);

        // Check for new traits
        const newTraits = [...prev.aiStatus.traits];
        let newPlayerStats = { ...prev.playerStats };
        let newSandDollars = prev.sandDollars + 1;

        // Trait: Lore Keeper
        if (prev.aiStatus.traits.includes('lore_keeper')) newSandDollars += 0.2;

        AI_TRAITS.forEach(trait => {
          if (newEvolution >= trait.threshold && !newTraits.includes(trait.id)) {
            newTraits.push(trait.id);
            prev.history.push(`MILESTONE REACHED: Unlocked Trait - ${trait.name}. ${trait.description}`);
            
            // Apply immediate stat bonuses
            if (trait.id === 'beachcomber') newPlayerStats.attack += 2;
            if (trait.id === 'sea_legs') {
              newPlayerStats.maxHealth += 10;
              newPlayerStats.health += 10;
            }
            if (trait.id === 'salt_in_veins') newPlayerStats.defense += 5;
            if (trait.id === 'tide_caller') {
              newPlayerStats.maxHealth += 30;
              newPlayerStats.health += 30;
            }
            if (trait.id === 'storm_rider') {
              newPlayerStats.attack += 10;
              newPlayerStats.defense += 10;
            }
            if (trait.id === 'island_soul') {
              newPlayerStats.maxHealth += 50;
              newPlayerStats.health += 50;
              newPlayerStats.attack += 20;
              newPlayerStats.defense += 20;
            }
          }
        });

        if (newStage !== prev.aiStatus.stage) {
          prev.history.push(`LEGACY EVOLVED: You are now recognized as a ${newStage}.`);
        }

        return {
          ...prev,
          currentRealm: next,
          inventory: newInventory,
          activeEvents: updatedEvents,
          sandDollars: newSandDollars,
          history: [
            ...prev.history, 
            `Path: ${path.title}`,
            ...(newEvent ? [`ALERT: ${newEvent.name} detected! ${newEvent.description}`] : []),
            `Arrived at: ${next.name}`,
            ...(next.item ? [`Discovered: ${next.item.name}`] : []),
            ...(next.enemy ? [`CHALLENGE: ${next.enemy.name} encountered!`] : []),
            `Earned ${newSandDollars - prev.sandDollars} Sand Dollar(s).`
          ],
          playerStats: newPlayerStats,
          aiStatus: {
            ...prev.aiStatus,
            evolution: newEvolution,
            stage: newStage,
            traits: newTraits,
            memory: newMemory
          }
        };
      });

      if (next.enemy) {
        setTimeout(() => {
          startCombat(next.enemy!);
        }, 1000);
      }
    } catch (error) {
      console.error("Transition failed:", error);
    } finally {
      setTransitioning(false);
      setLoreData(null);
    }
  };

  const handleListen = async (text: string) => {
    if (playingAudio) {
      if (audioRef.current) {
        audioRef.current.pause();
        setPlayingAudio(null);
      }
      return;
    }

    try {
      const audioUrl = await generateSpeech(text);
      setPlayingAudio(text);
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
        audioRef.current.onended = () => setPlayingAudio(null);
      }
    } catch (error) {
      console.error("Speech generation failed:", error);
    }
  };

  const handleGenerateLore = async () => {
    if (!gameState.currentRealm || loreLoading) return;
    
    setLoreLoading(true);
    try {
      const lore = await generateDetailedLore(gameState.currentRealm);
      setLoreData(lore);
      setGameState(prev => ({
        ...prev,
        history: [...prev.history, `System: Lore decryption complete for ${gameState.currentRealm?.name}.`]
      }));
    } catch (error) {
      console.error("Lore generation failed:", error);
    } finally {
      setLoreLoading(false);
    }
  };

  const useItem = (itemId: string) => {
    const item = gameState.inventory.find(i => i.id === itemId);
    if (!item) return;

    setGameState(prev => {
      let newPlayerStats = { ...prev.playerStats };
      if (item.type === 'data_fragment') {
        newPlayerStats.health = Math.min(newPlayerStats.maxHealth, newPlayerStats.health + 20);
      }
      return {
        ...prev,
        inventory: (prev.inventory || []).filter(i => i.id !== itemId),
        playerStats: newPlayerStats,
        history: [...prev.history, `Used: ${item.name}. ${item.effect || 'The artifact hums with island energy.'}${item.type === 'data_fragment' ? ' Restored 20 Island Harmony.' : ''}`],
        aiStatus: {
          ...prev.aiStatus,
          evolution: prev.aiStatus.evolution + 0.05
        }
      };
    });
  };

  const dropItem = (itemId: string) => {
    const item = gameState.inventory.find(i => i.id === itemId);
    if (!item) return;

    setGameState(prev => ({
      ...prev,
      inventory: (prev.inventory || []).filter(i => i.id !== itemId),
      history: [...prev.history, `Dropped: ${item.name}. It dissolves into the digital void.`]
    }));
  };

  const purchaseSkill = (skillId: string, cost: number) => {
    if (gameState.sandDollars < cost || gameState.skills.includes(skillId)) return;

    setGameState(prev => {
      const newSkills = [...prev.skills, skillId];
      let newPlayerStats = { ...prev.playerStats };

      if (skillId === 'warrior') {
        newPlayerStats.attack *= 2;
      } else if (skillId === 'survivor') {
        newPlayerStats.maxHealth += 50;
        newPlayerStats.health = Math.min(newPlayerStats.maxHealth, newPlayerStats.health + 50);
      }

      return {
        ...prev,
        sandDollars: prev.sandDollars - cost,
        skills: newSkills,
        playerStats: newPlayerStats,
        history: [...prev.history, `Skill Unlocked: ${SKILLS.find(s => s.id === skillId)?.name}`]
      };
    });
  };

  const handleUpgrade = async (tier: typeof TIERS[0]) => {
    setCheckoutLoading(tier.id);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setGameState(prev => ({
        ...prev,
        subscription: {
          tier: tier.id as SubscriptionTier,
          status: 'active'
        },
        history: [...prev.history, `Subscription Initialized: ${tier.name} Tier Active.`]
      }));
      
      setShowPricing(false);
    } catch (error) {
      console.error("Upgrade failed:", error);
    } finally {
      setCheckoutLoading(null);
    }
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    setChatLoading(true);
    const userMsg: AIResponse = {
      id: Date.now().toString(),
      type: 'text',
      content: chatInput,
      timestamp: Date.now(),
      metadata: { sender: 'user' }
    };
    setGameState(prev => ({ ...prev, aiResponses: [...prev.aiResponses, userMsg] }));
    setChatInput('');

    try {
      let responseText = '';
      if (thinkingMode) {
        responseText = await getThinkingResponse(chatInput);
      } else {
        responseText = await getFastResponse(chatInput);
      }

      const aiMsg: AIResponse = {
        id: (Date.now() + 1).toString(),
        type: 'text',
        content: responseText,
        timestamp: Date.now(),
        metadata: { sender: 'ai' }
      };
      setGameState(prev => ({ ...prev, aiResponses: [...prev.aiResponses, aiMsg] }));
    } catch (error) {
      console.error("Chat failed:", error);
    } finally {
      setChatLoading(false);
    }
  };

  const handleImageGen = async (aspectRatio: any = '1:1') => {
    if (!imagePrompt.trim() || genLoading) return;
    
    if (!hasPaidKey) {
      setShowApiKeySelector(true);
      return;
    }

    setGenLoading(true);
    try {
      const imageUrl = await generateImageFromText(imagePrompt, aspectRatio);
      const aiMsg: AIResponse = {
        id: Date.now().toString(),
        type: 'image',
        content: imageUrl,
        timestamp: Date.now(),
        metadata: { prompt: imagePrompt, sender: 'ai' }
      };
      setGameState(prev => ({ ...prev, aiResponses: [...prev.aiResponses, aiMsg] }));
      setImagePrompt('');
    } catch (error) {
      console.error("Image gen failed:", error);
    } finally {
      setGenLoading(false);
    }
  };

  const handleVideoGen = async () => {
    if (!videoPrompt.trim() || !analysisFile || genLoading) return;
    
    if (!hasPaidKey) {
      setShowApiKeySelector(true);
      return;
    }

    setGenLoading(true);
    try {
      const videoUrl = await generateVideoFromImage(analysisFile, videoPrompt);
      const aiMsg: AIResponse = {
        id: Date.now().toString(),
        type: 'video',
        content: videoUrl,
        timestamp: Date.now(),
        metadata: { prompt: videoPrompt, sender: 'ai' }
      };
      setGameState(prev => ({ ...prev, aiResponses: [...prev.aiResponses, aiMsg] }));
      setVideoPrompt('');
    } catch (error) {
      console.error("Video gen failed:", error);
    } finally {
      setGenLoading(false);
    }
  };

  const handleAnalysis = async () => {
    if (!analysisInput.trim() || !analysisFile || analysisLoading) return;
    setAnalysisLoading(true);
    try {
      const result = await analyzeImage(analysisFile, analysisInput);
      const aiMsg: AIResponse = {
        id: Date.now().toString(),
        type: 'text',
        content: result,
        timestamp: Date.now(),
        metadata: { sender: 'ai', analysis: true }
      };
      setGameState(prev => ({ ...prev, aiResponses: [...prev.aiResponses, aiMsg] }));
      setAnalysisInput('');
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setAnalysisLoading(false);
    }
  };

  const handleSearchGrounding = async () => {
    if (!mapsInput.trim() || searchLoading) return;
    setSearchLoading(true);
    try {
      const { text, links } = await getSearchGroundingResponse(mapsInput);
      const aiMsg: AIResponse = {
        id: Date.now().toString(),
        type: 'maps',
        content: text,
        timestamp: Date.now(),
        metadata: { sender: 'ai', links, search: true }
      };
      setGameState(prev => ({ ...prev, aiResponses: [...prev.aiResponses, aiMsg] }));
      setMapsInput('');
    } catch (error) {
      console.error("Search grounding failed:", error);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleEditImage = async () => {
    if (!imageEditPrompt.trim() || !analysisFile || genLoading) return;
    
    if (!hasPaidKey) {
      setShowApiKeySelector(true);
      return;
    }

    setGenLoading(true);
    try {
      const imageUrl = await editImage(analysisFile, imageEditPrompt);
      const aiMsg: AIResponse = {
        id: Date.now().toString(),
        type: 'image',
        content: imageUrl,
        timestamp: Date.now(),
        metadata: { prompt: imageEditPrompt, sender: 'ai', edited: true }
      };
      setGameState(prev => ({ ...prev, aiResponses: [...prev.aiResponses, aiMsg] }));
      setImageEditPrompt('');
    } catch (error) {
      console.error("Image edit failed:", error);
    } finally {
      setGenLoading(false);
    }
  };

  const handleLiveAudio = async () => {
    if (liveSession) {
      liveSession.close();
      setLiveSession(null);
      return;
    }

    if (!hasPaidKey) {
      setShowApiKeySelector(true);
      return;
    }

    try {
      const session = await getLiveAudioSession({
        onopen: () => {
          console.log("Live session opened");
          setLiveTranscript(prev => [...prev, "System: Live Neural Link Established."]);
        },
        onmessage: (message: any) => {
          if (message.serverContent?.modelTurn?.parts?.[0]?.text) {
            const text = message.serverContent.modelTurn.parts[0].text;
            setLiveTranscript(prev => [...prev, `AI: ${text}`]);
          }
          if (message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data) {
            const base64Audio = message.serverContent.modelTurn.parts[0].inlineData.data;
            // Play audio logic here
          }
        },
        onclose: () => {
          console.log("Live session closed");
          setLiveTranscript(prev => [...prev, "System: Live Neural Link Terminated."]);
          setLiveSession(null);
        },
        onerror: (error: any) => {
          console.error("Live session error:", error);
          setLiveSession(null);
        }
      });
      setLiveSession(session);
    } catch (error) {
      console.error("Failed to connect to Live API:", error);
    }
  };

  const handleMapsGrounding = async () => {
    if (!mapsInput.trim() || mapsLoading) return;
    setMapsLoading(true);
    try {
      const { text, links } = await getMapsGroundingResponse(mapsInput);
      const aiMsg: AIResponse = {
        id: Date.now().toString(),
        type: 'maps',
        content: text,
        timestamp: Date.now(),
        metadata: { sender: 'ai', links }
      };
      setGameState(prev => ({ ...prev, aiResponses: [...prev.aiResponses, aiMsg] }));
      setMapsInput('');
    } catch (error) {
      console.error("Maps failed:", error);
    } finally {
      setMapsLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(blob);
        handleTranscription(blob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Recording failed:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleTranscription = async (blob: Blob) => {
    setTranscribing(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(',')[1];
        const text = await transcribeAudio(base64Audio);
        setChatInput(text);
      };
    } catch (error) {
      console.error("Transcription failed:", error);
    } finally {
      setTranscribing(false);
    }
  };

  const handleTTS = async (text: string) => {
    try {
      const audioUrl = await generateSpeech(text);
      setPlayingAudio(audioUrl);
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
      }
    } catch (error) {
      console.error("TTS failed:", error);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAnalysisFile(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-[#00FF00] font-mono p-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 size={48} />
        </motion.div>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 text-xl tracking-[0.2em] uppercase"
        >
          Initializing REALM...
        </motion.p>
      </div>
    );
  }

  return (
    <ErrorBoundary>
    <div className="min-h-screen bg-[#050505] text-[#E0E0E0] font-sans selection:bg-[#00E0FF] selection:text-black overflow-hidden flex flex-col">
      {showMemorial ? (
        <Memorial onBack={() => setShowMemorial(false)} />
      ) : (
        <>
          {/* Background Atmosphere */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#00E0FF]/5 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#0080FF]/10 blur-[120px] rounded-full" />
            <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-[#FFD700]/5 blur-[150px] rounded-full" />
          </div>

          {/* Header / HUD */}
      <header className="relative z-10 border-b border-[#00E0FF]/20 bg-black/40 backdrop-blur-md p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#00E0FF]/10 rounded-lg border border-[#00E0FF]/30">
            <Anchor className="text-[#00E0FF]" size={20} />
          </div>
          <div>
            <h1 className="text-xs font-mono uppercase tracking-widest text-[#00E0FF]/70">Hatteras Island</h1>
            <h2 className="text-xl font-bold tracking-tight">OBX ODYSSEY <span className="text-[#00E0FF] font-mono text-sm ml-2">v{gameState.aiStatus.evolution.toFixed(1)}</span></h2>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Health Bar */}
          <div className="hidden lg:flex items-center gap-3 px-4 border-r border-[#00E0FF]/20">
            <div className="text-right">
              <div className="text-[8px] font-mono text-white/30 uppercase">Island Harmony</div>
              <div className="text-xs font-bold text-[#00E0FF]">{gameState.playerStats.health}%</div>
            </div>
            <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/10">
              <motion.div 
                animate={{ width: `${gameState.playerStats.health}%` }}
                className="h-full bg-[#00E0FF]"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 border-r border-[#00E0FF]/20 pr-4 mr-2">
            <button 
              onClick={() => setShowAILab(true)}
              className="p-2 rounded-lg bg-[#00E0FF]/10 border border-[#00E0FF]/30 hover:bg-[#00E0FF]/20 transition-all text-[#00E0FF]"
              title="AI Lab"
            >
              <Brain size={16} />
            </button>
            <button 
              onClick={() => setShowFounders(true)}
              className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-[#00E0FF]/10 hover:border-[#00E0FF]/30 transition-all text-[#00E0FF]/70 hover:text-[#00E0FF] flex items-center gap-2"
              title="The Founders"
            >
              <Users size={16} />
              <span className="text-[10px] font-mono hidden md:inline">Founders</span>
            </button>
            <button 
              onClick={() => setShowSkills(true)}
              className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-[#00E0FF]/10 hover:border-[#00E0FF]/30 transition-all text-[#00E0FF]/70 hover:text-[#00E0FF] flex items-center gap-2"
              title="Island Skill Tree"
            >
              <Compass size={16} />
              <span className="text-[10px] font-mono">{gameState.sandDollars.toFixed(0)} SD</span>
            </button>
            <button 
              onClick={handleManualSave}
              disabled={saveStatus === 'saving'}
              className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-[#00E0FF]/10 hover:border-[#00E0FF]/30 transition-all text-[#00E0FF]/70 hover:text-[#00E0FF]"
              title="Manual Save"
            >
              {saveStatus === 'saving' ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            </button>
            <button 
              onClick={handleReset}
              className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-red-500/10 hover:border-red-500/30 transition-all text-red-500/70 hover:text-red-500"
              title="Reset Journey"
            >
              <RotateCcw size={16} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {user ? (
              <button 
                onClick={() => signOut()}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-white/60 hover:text-white"
              >
                <div className="w-5 h-5 rounded-full bg-[#00E0FF]/20 flex items-center justify-center text-[10px] font-bold text-[#00E0FF]">
                  {user.displayName?.[0] || user.email?.[0] || '?'}
                </div>
                <span className="text-[10px] font-mono uppercase hidden md:inline">Sign Out</span>
              </button>
            ) : (
              <button 
                onClick={() => signIn()}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white text-black hover:bg-[#00E0FF] transition-all"
              >
                <Users size={14} />
                <span className="text-[10px] font-mono uppercase font-bold">Sign In</span>
              </button>
            )}

            <button 
              onClick={() => setShowPricing(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#00E0FF]/10 border border-[#00E0FF]/30 hover:bg-[#00E0FF]/20 transition-all text-xs font-mono uppercase text-[#00E0FF]"
            >
              <Waves size={14} />
              {gameState.subscription.tier === 'none' ? 'Upgrade Legacy' : `${gameState.subscription.tier} Active`}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 relative z-10 flex flex-col md:flex-row overflow-hidden">
        {/* Left Panel: Log & Inventory */}
        <aside className="w-full md:w-80 border-r border-[#00E0FF]/10 bg-black/20 flex flex-col">
          <div className="flex border-b border-[#00E0FF]/10">
            <button 
              onClick={() => setActiveTab('logs')}
              className={`flex-1 p-4 flex items-center justify-center gap-2 transition-colors ${activeTab === 'logs' ? 'bg-[#00E0FF]/10 text-[#00E0FF]' : 'text-white/40 hover:text-white/60'}`}
            >
              <HistoryIcon size={14} />
              <span className="text-[10px] font-mono uppercase tracking-wider">Ship's Log</span>
            </button>
            <button 
              onClick={() => setActiveTab('inventory')}
              className={`flex-1 p-4 flex items-center justify-center gap-2 transition-colors ${activeTab === 'inventory' ? 'bg-[#00E0FF]/10 text-[#00E0FF]' : 'text-white/40 hover:text-white/60'}`}
            >
              <Package size={14} />
              <span className="text-[10px] font-mono uppercase tracking-wider">Gear ({gameState.inventory.length})</span>
            </button>
            <button 
              onClick={() => setActiveTab('tasks')}
              className={`flex-1 p-4 flex items-center justify-center gap-2 transition-colors ${activeTab === 'tasks' ? 'bg-[#00E0FF]/10 text-[#00E0FF]' : 'text-white/40 hover:text-white/60'}`}
            >
              <CheckCircle2 size={14} />
              <span className="text-[10px] font-mono uppercase tracking-wider">Tasks ({(gameState.tasks || []).filter(t => !t.completed).length})</span>
            </button>
            <button 
              onClick={() => setActiveTab('hub')}
              className={`flex-1 p-4 flex items-center justify-center gap-2 transition-colors ${activeTab === 'hub' ? 'bg-[#00E0FF]/10 text-[#00E0FF]' : 'text-white/40 hover:text-white/60'}`}
            >
              <Globe size={14} />
              <span className="text-[10px] font-mono uppercase tracking-wider">Hub</span>
            </button>
          </div>

          <div className="flex-1 overflow-hidden flex flex-col">
            <AnimatePresence mode="wait">
              {activeTab === 'logs' ? (
                <motion.div 
                  key="logs"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto p-4 font-mono text-[11px] space-y-2 scrollbar-hide"
                >
                  {gameState.history.map((entry, i) => (
                    <div key={i} className={entry.startsWith('>') ? 'text-[#00FF00]' : 'text-white/60'}>
                      {entry}
                    </div>
                  ))}
                  {transitioning && (
                    <div className="text-[#00FF00] animate-pulse">
                      _ PROCESSING_REALM_DATA...
                    </div>
                  )}
                </motion.div>
              ) : activeTab === 'inventory' ? (
                <motion.div 
                  key="inventory"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide"
                >
                  {gameState.inventory.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-white/20 text-center p-8">
                      <Database size={32} className="mb-4 opacity-20" />
                      <p className="text-[10px] font-mono uppercase tracking-widest">Storage Empty</p>
                    </div>
                  ) : (
                    gameState.inventory.map((item) => (
                      <div 
                        key={item.id}
                        className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-3 group hover:border-[#00FF00]/30 transition-all"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="text-xs font-bold group-hover:text-[#00FF00] transition-colors">{item.name}</div>
                            <div className="text-[8px] font-mono uppercase text-[#00FF00]/60">{item.rarity} {item.type}</div>
                          </div>
                          <div className="p-1.5 rounded bg-black/40">
                            {item.type === 'artifact' && <Shield size={12} className="text-[#00FF00]" />}
                            {item.type === 'tool' && <Zap size={12} className="text-[#00FF00]" />}
                            {item.type === 'data_fragment' && <Database size={12} className="text-[#00FF00]" />}
                          </div>
                        </div>
                        <p className="text-[10px] text-white/50 leading-relaxed">{item.description}</p>
                        
                        {item.passiveBonus && (
                          <div className="p-2 rounded bg-[#00FF00]/5 border border-[#00FF00]/10 flex items-center gap-2">
                            <Activity size={10} className="text-[#00FF00]" />
                            <span className="text-[9px] font-mono text-[#00FF00]/80 uppercase tracking-tighter">Passive: {item.passiveBonus}</span>
                          </div>
                        )}

                        <div className="flex gap-2 pt-1">
                          <button 
                            onClick={() => useItem(item.id)}
                            className="flex-1 py-1.5 rounded-lg bg-[#00FF00]/10 border border-[#00FF00]/20 text-[9px] font-mono uppercase text-[#00FF00] hover:bg-[#00FF00]/20 transition-all"
                          >
                            Integrate
                          </button>
                          <button 
                            onClick={() => dropItem(item.id)}
                            className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[9px] font-mono uppercase text-white/40 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-all"
                          >
                            Purge
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </motion.div>
              ) : activeTab === 'hub' ? (
                <motion.div 
                  key="hub"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase text-white/20 tracking-widest block">Commercial Operations</span>
                    <button 
                      onClick={() => setShowBusinessDashboard(true)}
                      className="w-full p-4 rounded-2xl bg-[#00FF00]/5 border border-[#00FF00]/20 hover:border-[#00FF00]/50 hover:bg-[#00FF00]/10 transition-all flex items-center gap-4 group"
                    >
                      <div className="p-3 rounded-xl bg-[#00FF00]/10 text-[#00FF00] group-hover:scale-110 transition-transform">
                        <TrendingUp size={20} />
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-bold text-white uppercase tracking-wider">Business Dashboard</div>
                        <div className="text-[10px] font-mono text-[#00FF00]/60 uppercase">Revenue: ${gameState.business.revenue.toLocaleString()}</div>
                      </div>
                    </button>
                    <button 
                      onClick={() => setShowSalesCenter(true)}
                      className={`w-full p-4 rounded-2xl transition-all flex items-center gap-4 group relative overflow-hidden ${
                        gameState.subscription.status === 'active'
                        ? 'bg-[#00E0FF]/10 border border-[#00E0FF]/40 hover:border-[#00E0FF]/60'
                        : 'bg-[#00E0FF]/5 border border-[#00E0FF]/20 hover:border-[#00E0FF]/50 hover:bg-[#00E0FF]/10'
                      }`}
                    >
                      {gameState.subscription.status === 'active' && (
                        <motion.div
                          animate={{ 
                            scale: [1, 1.2, 1],
                            opacity: [0.1, 0.2, 0.1]
                          }}
                          transition={{ duration: 4, repeat: Infinity }}
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00E0FF]/20 to-transparent"
                        />
                      )}
                      <div className={`p-3 rounded-xl transition-transform group-hover:scale-110 ${
                        gameState.subscription.status === 'active' ? 'bg-[#00E0FF]/20 text-[#00E0FF]' : 'bg-[#00E0FF]/10 text-[#00E0FF]'
                      }`}>
                        {gameState.subscription.status === 'active' ? <Shield size={20} /> : <Rocket size={20} />}
                      </div>
                      <div className="text-left relative z-10">
                        <div className="text-xs font-bold text-white uppercase tracking-wider">
                          {gameState.subscription.status === 'active' ? 'Neural Infrastructure' : 'Sales & Infrastructure'}
                        </div>
                        <div className={`text-[10px] font-mono uppercase ${
                          gameState.subscription.status === 'active' ? 'text-[#00E0FF]' : 'text-[#00E0FF]/60'
                        }`}>
                          {gameState.subscription.status === 'active' ? `Active Plan: ${gameState.subscription.tier}` : 'View Plans & Features'}
                        </div>
                      </div>
                      {gameState.subscription.status === 'active' && (
                        <div className="ml-auto">
                          <CheckCircle2 size={16} className="text-[#00FF00]" />
                        </div>
                      )}
                    </button>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase text-white/20 tracking-widest block">Island Infrastructure</span>
                    <button 
                      onClick={() => setShowLighthouse(true)}
                      className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#00E0FF]/30 hover:bg-[#00E0FF]/5 transition-all flex items-center gap-4 group"
                    >
                      <div className="p-3 rounded-xl bg-[#00E0FF]/10 text-[#00E0FF] group-hover:scale-110 transition-transform">
                        <Anchor size={20} />
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-bold text-white uppercase tracking-wider">The Lighthouse</div>
                        <div className="text-[10px] font-mono text-white/40 uppercase">Base Operations & Upgrades</div>
                      </div>
                    </button>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase text-white/20 tracking-widest block">Neural Alignment</span>
                    <button 
                      onClick={() => setShowFactionSelection(true)}
                      className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#FF4444]/30 hover:bg-[#FF4444]/5 transition-all flex items-center gap-4 group"
                    >
                      <div className="p-3 rounded-xl bg-[#FF4444]/10 text-[#FF4444] group-hover:scale-110 transition-transform">
                        <Shield size={20} />
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-bold text-white uppercase tracking-wider">Faction Alignment</div>
                        <div className="text-[10px] font-mono text-white/40 uppercase">
                          {gameState.faction ? `Aligned: ${gameState.faction.toUpperCase()}` : 'No Alignment Detected'}
                        </div>
                      </div>
                    </button>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase text-white/20 tracking-widest block">Island Recreation</span>
                    <button 
                      onClick={() => setShowSurfingGame(true)}
                      className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#00FF00]/30 hover:bg-[#00FF00]/5 transition-all flex items-center gap-4 group"
                    >
                      <div className="p-3 rounded-xl bg-[#00FF00]/10 text-[#00FF00] group-hover:scale-110 transition-transform">
                        <Waves size={20} />
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-bold text-white uppercase tracking-wider">Surf the Data Stream</div>
                        <div className="text-[10px] font-mono text-white/40 uppercase">Earn Sand Dollars</div>
                      </div>
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase text-white/40 tracking-widest">Environment Status</span>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#00E0FF] animate-pulse" />
                        <span className="text-[10px] font-mono text-[#00E0FF] uppercase">Live</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="text-[8px] font-mono uppercase text-white/20">Current Weather</div>
                        <div className="text-xs font-bold text-white uppercase tracking-wider">{gameState.weather}</div>
                      </div>
                      <div className="space-y-1 text-right">
                        <div className="text-[8px] font-mono uppercase text-white/20">Tide Level</div>
                        <div className="text-xs font-bold text-white uppercase tracking-wider">{gameState.tide}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="tasks"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide"
                >
                  {gameState.tasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-white/20 text-center p-8">
                      <CheckCircle2 size={32} className="mb-4 opacity-20" />
                      <p className="text-[10px] font-mono uppercase tracking-widest">No Objectives</p>
                    </div>
                  ) : (
                    gameState.tasks.map((task) => (
                      <button 
                        key={task.id}
                        onClick={() => toggleTask(task.id)}
                        className={`w-full p-4 rounded-xl border transition-all text-left space-y-2 group ${
                          task.completed 
                            ? 'bg-[#00FF00]/5 border-[#00FF00]/20 opacity-60' 
                            : 'bg-white/5 border-white/10 hover:border-[#00E0FF]/30'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className={`text-xs font-bold transition-colors ${task.completed ? 'text-[#00FF00] line-through' : 'text-white group-hover:text-[#00E0FF]'}`}>
                              {task.title}
                            </div>
                            <p className={`text-[10px] leading-relaxed ${task.completed ? 'text-[#00FF00]/40' : 'text-white/40'}`}>
                              {task.description}
                            </p>
                          </div>
                          <div className={`mt-0.5 transition-colors ${task.completed ? 'text-[#00FF00]' : 'text-white/20 group-hover:text-[#00E0FF]/50'}`}>
                            {task.completed ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                          </div>
                        </div>
                        {task.reward && !task.completed && (
                          <div className="text-[8px] font-mono text-[#FFD700]/60 uppercase tracking-widest">
                            Reward: {task.reward} Sand Dollars
                          </div>
                        )}
                      </button>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email Intake Form */}
            <div className="p-4 pt-0">
              <div className="p-6 rounded-3xl bg-[#00E0FF]/5 border border-[#00E0FF]/10 space-y-4">
                <div className="flex items-center gap-3 text-[#00E0FF]">
                  <Mail size={18} />
                  <h4 className="text-xs font-bold uppercase tracking-widest">Neural Updates</h4>
                </div>
                <EmailIntake source="sidebar_main" />
              </div>
            </div>
          </div>
        </aside>

        {/* Center: Realm View */}
        <section className="flex-1 overflow-y-auto p-6 md:p-12 flex flex-col items-center">
          <AnimatePresence mode="wait">
            {gameState.currentRealm && (
              <motion.div
                key={gameState.currentRealm.id}
                initial={{ opacity: 0, x: 20, filter: 'blur(10px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-3xl w-full space-y-8"
              >
                {/* Branching Paths Overlay */}
            <AnimatePresence>
              {branchingPaths && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-20 bg-black/80 backdrop-blur-md p-8 flex flex-col items-center justify-center"
                >
                  <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    className="max-w-2xl w-full space-y-8"
                  >
                    <div className="text-center space-y-2">
                      <h3 className="text-2xl font-bold text-[#00E0FF] tracking-tighter uppercase">Island Divergence Detected</h3>
                      <p className="text-white/60 text-sm font-mono italic">Choose your narrative consequence...</p>
                    </div>

                    <div className="grid gap-4">
                      {branchingPaths.map((path, i) => (
                        <motion.button
                          key={path.id}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: i * 0.1 }}
                          onClick={() => handleSelectPath(path)}
                          disabled={transitioning}
                          className="group relative p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#00E0FF]/50 hover:bg-[#00E0FF]/5 text-left transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-3">
                              {transitioning && (
                                <Loader2 size={16} className="text-[#00E0FF] animate-spin" />
                              )}
                              <h4 className="text-lg font-bold text-white group-hover:text-[#00E0FF] transition-colors uppercase tracking-tight">{path.title}</h4>
                            </div>
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                              path.riskLevel === 'critical' ? 'border-red-500 text-red-500 bg-red-500/10' :
                              path.riskLevel === 'high' ? 'border-orange-500 text-orange-500 bg-orange-500/10' :
                              'border-[#00E0FF]/40 text-[#00E0FF]/60 bg-[#00E0FF]/5'
                            } uppercase tracking-widest`}>
                              Risk: {path.riskLevel}
                            </span>
                          </div>
                          <p className="text-sm text-white/60 leading-relaxed mb-4">{path.consequence}</p>
                          <div className="flex items-center gap-2 text-[10px] font-mono text-[#00E0FF] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                            <Waves size={12} />
                            <span>Potential Reward: {path.potentialReward}</span>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Realm Image */}
                {gameState.currentRealm.imageUrl && (
                  <div className="w-full aspect-video rounded-3xl overflow-hidden border border-white/10 relative group">
                    <img 
                      src={gameState.currentRealm.imageUrl} 
                      alt={gameState.currentRealm.name}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                    <div className="absolute bottom-4 left-6 flex items-center gap-3">
                      <div className="w-2 h-2 bg-[#00E0FF] rounded-full animate-pulse" />
                      <span className="text-[10px] font-mono text-white/60 tracking-widest uppercase">Island Connection Established</span>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[#00E0FF]/60">
                    <Waves size={14} />
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em]">{gameState.currentRealm.environment}</span>
                  </div>
                  <h3 className="text-4xl md:text-6xl font-bold tracking-tighter leading-none">
                    {gameState.currentRealm.name}
                  </h3>
                  {gameState.currentRealm.name.toLowerCase().includes('salvo') && (
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => setShowMemorial(true)}
                      className="mt-4 flex items-center gap-3 px-6 py-3 rounded-2xl bg-[#00E0FF]/10 border border-[#00E0FF]/30 hover:bg-[#00E0FF]/20 transition-all group"
                    >
                      <div className="p-2 rounded-lg bg-[#00E0FF]/20">
                        <Anchor size={18} className="text-[#00E0FF]" />
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-bold text-white uppercase tracking-widest">Visit Bull Hooper Memorial</div>
                        <div className="text-[10px] font-mono text-[#00E0FF]/60 uppercase">A Salvo Landmark</div>
                      </div>
                      <ChevronRight size={16} className="text-[#00E0FF]/40 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  )}
                </div>

                <div className="relative group/desc">
                  <div className="absolute -left-8 top-0 opacity-0 group-hover/desc:opacity-100 transition-opacity duration-500">
                    <Sparkles size={20} className="text-[#00E0FF] animate-pulse" />
                  </div>
                  <p className="text-lg md:text-xl text-white/80 leading-relaxed font-light italic pr-12 group-hover/desc:text-white transition-colors duration-500">
                    "{gameState.currentRealm.description}"
                  </p>
                  <div className="absolute -right-4 bottom-0 opacity-0 group-hover/desc:opacity-100 transition-opacity duration-500 delay-100">
                    <Activity size={16} className="text-[#00E0FF]/40" />
                  </div>
                  <button
                    onClick={() => handleListen(gameState.currentRealm!.description)}
                    className={`absolute right-0 top-1/2 -translate-y-1/2 p-3 rounded-full transition-all ${
                      playingAudio === gameState.currentRealm.description
                        ? 'bg-[#00E0FF] text-black animate-pulse'
                        : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-[#00E0FF]'
                    }`}
                    title="Listen to Island Soul"
                  >
                    {playingAudio === gameState.currentRealm.description ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>
                </div>

                <div className="pt-8 space-y-4">
                  {gameState.currentRealm.npc && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-6 rounded-3xl bg-[#00E0FF]/5 border border-[#00E0FF]/20 space-y-6"
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-4 rounded-2xl bg-black/40 border border-[#00E0FF]/20 text-[#00E0FF]">
                          <Users size={24} />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xl font-bold text-white uppercase tracking-tighter">{gameState.currentRealm.npc.name}</h4>
                            <span className="text-[10px] font-mono text-[#00E0FF] uppercase tracking-widest px-2 py-0.5 rounded border border-[#00E0FF]/30 bg-[#00E0FF]/5">
                              {gameState.currentRealm.npc.role}
                            </span>
                          </div>
                          <p className="text-sm text-white/60 leading-relaxed italic">
                            "{gameState.currentRealm.npc.description}"
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <span className="text-[10px] font-mono uppercase text-white/20 tracking-widest block">Dialogue Stream</span>
                        <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-sm text-white/80 italic leading-relaxed relative group/dialogue">
                          "{gameState.currentRealm.npc.dialogue[0]}"
                          <button
                            onClick={() => handleListen(gameState.currentRealm!.npc!.dialogue[0])}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/5 text-white/40 hover:bg-[#00E0FF]/10 hover:text-[#00E0FF] transition-all opacity-0 group-hover/dialogue:opacity-100"
                          >
                            <Volume2 size={16} />
                          </button>
                        </div>
                      </div>

                      {gameState.currentRealm.npc.trades && gameState.currentRealm.npc.trades.length > 0 && (
                        <div className="space-y-3">
                          <span className="text-[10px] font-mono uppercase text-white/20 tracking-widest block">Available Exchanges</span>
                          <div className="grid grid-cols-1 gap-2">
                            {gameState.currentRealm.npc.trades.map((trade, i) => (
                              <button
                                key={i}
                                onClick={() => {
                                  const hasItem = gameState.inventory.some(item => item.id === trade.input || item.name === trade.input);
                                  if (hasItem) {
                                    setGameState(prev => ({
                                      ...prev,
                                      inventory: [...(prev.inventory || []).filter(item => item.id !== trade.input && item.name !== trade.input), trade.output],
                                      history: [...prev.history, `Trade: Exchanged ${trade.input} for ${trade.output.name} with ${gameState.currentRealm!.npc!.name}.`]
                                    }));
                                  }
                                }}
                                className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:border-[#00E0FF]/40 hover:bg-[#00E0FF]/5 transition-all group"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="text-[10px] font-mono text-white/40 uppercase">Give: <span className="text-white">{trade.input}</span></div>
                                  <ArrowRight size={12} className="text-white/20 group-hover:text-[#00E0FF] transition-colors" />
                                  <div className="text-[10px] font-mono text-white/40 uppercase">Receive: <span className="text-[#00E0FF]">{trade.output.name}</span></div>
                                </div>
                                <ChevronRight size={14} className="text-white/20 group-hover:text-[#00E0FF] transition-transform" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  <span className="text-[10px] font-mono uppercase text-[#00E0FF]/50 tracking-widest block">Available Pathways</span>
                  <div className="grid grid-cols-1 gap-3">
                    {gameState.currentRealm.options.map((option, i) => (
                      <button
                        key={i}
                        onClick={() => handleAction(option)}
                        disabled={transitioning}
                        className="group relative flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-[#00E0FF]/10 hover:border-[#00E0FF]/40 transition-all duration-300 text-left disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-2 rounded-lg bg-black/40 group-hover:bg-[#00E0FF]/20 transition-colors">
                            {transitioning ? (
                              <Loader2 size={18} className="text-[#00E0FF] animate-spin" />
                            ) : (
                              <>
                                {option.targetType === 'explore' && <Compass size={18} className="text-[#00E0FF]" />}
                                {option.targetType === 'interact' && <Waves size={18} className="text-[#00E0FF]" />}
                                {option.targetType === 'analyze' && <Anchor size={18} className="text-[#00E0FF]" />}
                              </>
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-bold group-hover:text-[#00E0FF] transition-colors">{option.label}</div>
                            <div className="text-[10px] font-mono uppercase text-white/40">{option.targetType} pathway</div>
                          </div>
                        </div>
                        <ChevronRight size={18} className="text-white/20 group-hover:text-[#00E0FF] group-hover:translate-x-1 transition-all" />
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Right Panel: Island Soul & Island Diagnostics */}
        <aside className="hidden lg:flex w-80 border-l border-[#00E0FF]/10 bg-black/40 flex-col overflow-y-auto scrollbar-hide">
          <div className="p-6 space-y-8">
            {/* Island Soul Visual */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#00E0FF]">
                  <Anchor size={16} />
                  <span className="text-xs font-mono uppercase tracking-wider">Island Soul</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1 h-1 bg-[#00E0FF] rounded-full animate-ping" />
                  <span className="text-[10px] font-mono text-[#00E0FF]">ANCHORED</span>
                </div>
              </div>
              
              <div className="aspect-square rounded-3xl border border-[#00E0FF]/20 bg-black/60 flex items-center justify-center relative overflow-hidden group">
                <motion.div
                  animate={{ 
                    scale: [1, 1.05, 1],
                    rotate: [0, 90, 180, 270, 360]
                  }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 opacity-10"
                >
                  <div className="absolute inset-0 border-[4px] border-dashed border-[#00E0FF] rounded-full m-4" />
                  <div className="absolute inset-0 border-[2px] border-dotted border-[#00E0FF] rounded-full m-12" />
                </motion.div>
                
                {/* Pulse Rings */}
                <motion.div 
                  animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute w-32 h-32 border border-[#00E0FF]/30 rounded-full"
                />
                
                <Compass size={64} className="text-[#00E0FF] relative z-10 drop-shadow-[0_0_20px_rgba(0,224,255,0.6)] group-hover:scale-110 transition-transform duration-500" />
                
                {/* Data Stream Particles */}
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ y: "100%", opacity: 0 }}
                      animate={{ y: "-100%", opacity: [0, 1, 0] }}
                      transition={{ 
                        duration: 2 + Math.random() * 2, 
                        repeat: Infinity, 
                        delay: Math.random() * 2 
                      }}
                      className="absolute w-[1px] h-8 bg-[#00E0FF]/40"
                      style={{ left: `${20 * i + 10}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Evolution Metrics */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-[#00E0FF]/50 tracking-widest">Island Legacy Stage</span>
                <span className="text-xs font-bold font-mono text-[#00E0FF] uppercase tracking-wider">{gameState.aiStatus.stage}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-[#00E0FF]/50 tracking-widest">Legacy Multiplier</span>
                <span className="text-xs font-mono text-[#00E0FF]">{gameState.aiStatus.evolution.toFixed(1)}x</span>
              </div>
              <div className="space-y-2">
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-[#00E0FF] to-[#0080FF]"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (gameState.aiStatus.evolution - 1) * 10)}%` }}
                    transition={{ type: "spring", stiffness: 50 }}
                  />
                </div>
                <div className="flex justify-between text-[9px] font-mono text-white/30 uppercase">
                  <span>Tourist</span>
                  <span>OBX Legend</span>
                </div>
              </div>
            </div>

            {/* Island Metrics Grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Maritime Knowledge', value: `${(gameState.aiStatus.evolution * 142).toFixed(0)}`, unit: 'PTS' },
                { label: 'Coastal Harmony', value: '99.9', unit: '%' },
                { label: 'Island Intuition', value: 'High', unit: '' },
                { label: 'Tide Level', value: '0.04', unit: 'ft' }
              ].map((metric, i) => (
                <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <div className="text-[9px] font-mono uppercase text-white/40 leading-none">{metric.label}</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-bold text-[#00E0FF]">{metric.value}</span>
                    <span className="text-[8px] font-mono text-white/20">{metric.unit}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Island Traits Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[#00E0FF]/60">
                <Layers size={14} />
                <span className="text-[10px] font-mono uppercase tracking-widest">Island Traits</span>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-hide pr-1">
                {gameState.aiStatus.traits.length === 0 ? (
                  <div className="text-[10px] font-mono text-white/20 italic p-4 border border-dashed border-white/10 rounded-xl text-center">
                    No traits unlocked. Explore to gain new capabilities.
                  </div>
                ) : (
                  gameState.aiStatus.traits.map((traitId) => {
                    const trait = AI_TRAITS.find(t => t.id === traitId);
                    if (!trait) return null;
                    return (
                      <motion.div
                        key={trait.id}
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="p-3 rounded-xl border border-[#00E0FF]/20 bg-[#00E0FF]/5 space-y-1"
                      >
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] font-bold uppercase tracking-tight text-[#00E0FF]">{trait.name}</span>
                          <span className="text-[8px] font-mono text-[#00E0FF]/40 uppercase">Unlocked</span>
                        </div>
                        <p className="text-[9px] text-white/60 leading-tight">{trait.description}</p>
                        {trait.bonus && (
                          <div className="text-[8px] font-mono text-[#00E0FF] uppercase tracking-tighter pt-1 border-t border-[#00E0FF]/10">
                            Bonus: {trait.bonus}
                          </div>
                        )}
                      </motion.div>
                    );
                  })
                )}
              </div>
            </div>

            {/* World Events Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[#00E0FF]/60">
                <Waves size={14} className="animate-pulse" />
                <span className="text-[10px] font-mono uppercase tracking-widest">Active Island Events</span>
              </div>
              <div className="space-y-2">
                {gameState.activeEvents.length === 0 ? (
                  <div className="text-[10px] font-mono text-white/20 italic p-4 border border-dashed border-white/10 rounded-xl text-center">
                    Island calm. No events detected.
                  </div>
                ) : (
                  gameState.activeEvents.map((event) => (
                    <motion.div
                      key={event.id}
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className={`p-3 rounded-xl border ${
                        event.type === 'corruption' ? 'bg-red-500/5 border-red-500/20' :
                        event.type === 'surge' ? 'bg-[#00E0FF]/5 border-[#00E0FF]/20' :
                        event.type === 'blessing' ? 'bg-[#00E0FF]/5 border-[#00E0FF]/20' :
                        'bg-white/5 border-white/10'
                      } space-y-1 relative overflow-hidden group`}
                    >
                      <div className="flex justify-between items-start">
                        <span className={`text-[10px] font-bold uppercase tracking-tight ${
                          event.type === 'corruption' ? 'text-red-400' :
                          event.type === 'surge' ? 'text-[#00E0FF]' :
                          event.type === 'blessing' ? 'text-[#00E0FF]' :
                          'text-white'
                        }`}>{event.name}</span>
                        <span className="text-[8px] font-mono text-white/30 uppercase">Dur: {event.duration}</span>
                      </div>
                      <p className="text-[9px] text-white/60 leading-tight">{event.description}</p>
                      <div className="text-[8px] font-mono text-[#00E0FF]/60 uppercase tracking-tighter pt-1 border-t border-white/5">
                        Effect: {event.effect}
                      </div>
                      
                      {/* Glitch Effect for Corruption */}
                      {event.type === 'corruption' && (
                        <motion.div 
                          animate={{ opacity: [0, 0.2, 0] }}
                          transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3 }}
                          className="absolute inset-0 bg-red-500/10 pointer-events-none"
                        />
                      )}
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            {/* Lore Decryption Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#00FF00]/60">
                  <Activity size={14} />
                  <span className="text-[10px] font-mono uppercase tracking-widest">Lore Decryption</span>
                </div>
                <button 
                  onClick={handleGenerateLore}
                  disabled={loreLoading || !gameState.currentRealm}
                  className="text-[9px] font-mono uppercase px-2 py-1 rounded bg-[#00FF00]/10 border border-[#00FF00]/20 text-[#00FF00] hover:bg-[#00FF00]/20 disabled:opacity-50 transition-all"
                >
                  {loreLoading ? 'Decrypting...' : 'Decrypt Deep Data'}
                </button>
              </div>
              
              <AnimatePresence mode="wait">
                {loreData ? (
                  <motion.div
                    key="lore-content"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 rounded-xl bg-[#00FF00]/5 border border-[#00FF00]/10 overflow-hidden"
                  >
                    <div className="markdown-body text-[10px] font-mono text-white/80 leading-relaxed max-h-48 overflow-y-auto scrollbar-hide">
                      <Markdown>{loreData}</Markdown>
                    </div>
                  </motion.div>
                ) : loreLoading ? (
                  <motion.div
                    key="lore-loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-8 border border-dashed border-[#00FF00]/20 rounded-xl flex flex-col items-center justify-center gap-3"
                  >
                    <Loader2 size={24} className="text-[#00FF00] animate-spin" />
                    <span className="text-[9px] font-mono text-[#00E0FF]/60 uppercase animate-pulse">Accessing Island Archives...</span>
                  </motion.div>
                ) : (
                  <div className="text-[9px] font-mono text-white/20 italic text-center p-4 border border-dashed border-white/10 rounded-xl">
                    Deep lore fragments available for decryption.
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Memory Logs */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[#00FF00]/60">
                <Database size={14} />
                <span className="text-[10px] font-mono uppercase tracking-widest">Memory Banks</span>
              </div>
              <div className="space-y-2">
                {gameState.aiStatus.memory.length === 0 ? (
                  <div className="text-[10px] font-mono text-white/20 italic p-4 border border-dashed border-white/10 rounded-xl text-center">
                    No significant data recorded.
                  </div>
                ) : (
                  gameState.aiStatus.memory.map((mem, i) => (
                    <motion.div
                      key={i}
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className="p-2 rounded-lg bg-white/5 border-l-2 border-[#00FF00]/40 flex items-center justify-between group hover:bg-[#00FF00]/5 transition-colors"
                    >
                      <span className="text-[10px] font-mono text-white/70 truncate pr-2">{mem}</span>
                      <div className="w-1 h-1 bg-[#00FF00] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            {/* Subsystems Status */}
            <div className="pt-4 border-t border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-white/30">Subsystem Integrity</span>
                <div className="flex items-center gap-1">
                  <span className="text-[9px] font-mono text-[#00FF00] animate-pulse">3,412 SURFERS ONLINE</span>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Island Link', status: 'Optimal', color: '#00E0FF' },
                  { label: 'Data Stream', status: 'Stable', color: '#00FF00' },
                  { label: 'Logic Gate', status: 'Active', color: '#00FF00' },
                  { label: 'Memory Bank', status: 'Syncing', color: '#00E0FF' }
                ].map((sys, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-[11px] text-white/50">{sys.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono uppercase" style={{ color: sys.color }}>{sys.status}</span>
                      <div className="w-1 h-1 rounded-full" style={{ backgroundColor: sys.color }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-6 space-y-3">
                <button
                  onClick={() => setShowFounders(true)}
                  className="w-full p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-[#00E0FF]/10 hover:border-[#00E0FF]/20 transition-all group flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Users size={16} className="text-[#00E0FF]" />
                    <span className="text-[10px] font-mono uppercase tracking-widest">Island Founders</span>
                  </div>
                  <ChevronRight size={14} className="text-white/20 group-hover:text-[#00E0FF] transition-colors" />
                </button>

                <button
                  onClick={() => setShowMemorial(true)}
                  className="w-full p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-[#00E0FF]/10 hover:border-[#00E0FF]/20 transition-all group flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Heart size={16} className="text-[#00E0FF]" />
                    <span className="text-[10px] font-mono uppercase tracking-widest">Bull Hooper Memorial</span>
                  </div>
                  <ChevronRight size={14} className="text-white/20 group-hover:text-[#00E0FF] transition-colors" />
                </button>

                <button
                  onClick={() => setShowPastLogs(true)}
                  className="w-full p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-[#00E0FF]/10 hover:border-[#00E0FF]/20 transition-all group flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <HistoryIcon size={16} className="text-[#00E0FF]" />
                    <span className="text-[10px] font-mono uppercase tracking-widest">Battle Records</span>
                  </div>
                  <ChevronRight size={14} className="text-white/20 group-hover:text-[#00E0FF] transition-colors" />
                </button>
              </div>
            </div>
          </div>
        </aside>
      </main>

      {/* Battle Records Modal */}
      <AnimatePresence>
        {showPastLogs && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPastLogs(false)}
              className="absolute inset-0 bg-black/95 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-3xl max-h-[80vh] bg-[#0A0A0A] border border-[#00E0FF]/20 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,224,255,0.1)] flex flex-col"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#00E0FF]/10">
                    <HistoryIcon size={20} className="text-[#00E0FF]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold tracking-tight">Battle Records</h2>
                    <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Historical Combat Data</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowPastLogs(false)}
                  className="p-2 rounded-full hover:bg-white/5 transition-colors"
                >
                  <X size={20} className="text-white/40" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
                {gameState.pastCombatLogs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-white/20">
                    <Database size={48} className="mb-4 opacity-20" />
                    <p className="text-sm font-mono uppercase tracking-widest">No battle records found</p>
                  </div>
                ) : (
                  gameState.pastCombatLogs.map((battle, bIdx) => (
                    <div key={bIdx} className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-white/40 uppercase">
                          Battle #{gameState.pastCombatLogs.length - bIdx}
                        </div>
                        <div className="h-px flex-1 bg-white/5" />
                        <div className="text-[10px] font-mono text-white/20">
                          {new Date(battle[0]?.timestamp).toLocaleString()}
                        </div>
                      </div>
                      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                        {battle.map((log, lIdx) => (
                          <div 
                            key={lIdx} 
                            className={`text-[11px] font-mono ${log.type === 'player' ? 'text-[#00FF00]/60' : log.type === 'enemy' ? 'text-red-400/60' : 'text-blue-400/60'}`}
                          >
                            <span className="opacity-30 mr-2">[{new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' })}]</span>
                            {log.message}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showSkills && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSkills(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-[#0A0A0A] border border-[#00E0FF]/20 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,224,255,0.1)]"
            >
              <div className="p-8 border-b border-[#00E0FF]/10 flex items-center justify-between bg-[#00E0FF]/5">
                <div className="flex items-center gap-3">
                  <Compass size={24} className="text-[#00E0FF]" />
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight text-[#00E0FF]">Island Skill Tree</h2>
                    <p className="text-white/40 text-[10px] uppercase tracking-widest mt-1">Available Sand Dollars: {gameState.sandDollars.toFixed(0)} SD</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowSkills(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                {SKILLS.map((skill) => {
                  const isUnlocked = gameState.skills.includes(skill.id);
                  const canAfford = gameState.sandDollars >= skill.cost;
                  const Icon = skill.icon;

                  return (
                    <button
                      key={skill.id}
                      disabled={isUnlocked || !canAfford}
                      onClick={() => purchaseSkill(skill.id, skill.cost)}
                      className={`p-6 rounded-2xl border text-left transition-all duration-300 group relative overflow-hidden ${
                        isUnlocked 
                        ? 'bg-[#00E0FF]/10 border-[#00E0FF]/40' 
                        : canAfford 
                          ? 'bg-white/5 border-white/10 hover:border-[#00E0FF]/30 hover:bg-[#00E0FF]/5' 
                          : 'bg-white/5 border-white/5 opacity-40 grayscale'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-xl ${isUnlocked ? 'bg-[#00E0FF]/20' : 'bg-white/5'}`}>
                          <Icon size={20} className={isUnlocked ? 'text-[#00E0FF]' : 'text-white/40'} />
                        </div>
                        {isUnlocked ? (
                          <span className="text-[8px] font-mono uppercase text-[#00E0FF] bg-[#00E0FF]/10 px-2 py-1 rounded">Unlocked</span>
                        ) : (
                          <span className="text-[10px] font-mono text-white/60">{skill.cost} SD</span>
                        )}
                      </div>
                      <h3 className={`text-sm font-bold mb-1 ${isUnlocked ? 'text-[#00E0FF]' : 'text-white'}`}>{skill.name}</h3>
                      <p className="text-[10px] text-white/40 leading-relaxed">{skill.description}</p>
                      
                      {isUnlocked && (
                        <motion.div 
                          layoutId="active-glow"
                          className="absolute inset-0 bg-gradient-to-br from-[#00E0FF]/5 to-transparent pointer-events-none"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
              
              <div className="p-6 bg-black/40 border-t border-white/5 text-center">
                <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest">Sand dollars are earned by successfully navigating the island's mysteries.</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Pricing Modal */}
      <AnimatePresence>
        {showPricing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPricing(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-5xl bg-[#0A0A0A] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-white/10 flex items-center justify-between bg-black/40">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight text-[#00E0FF]">Enhance Your Legacy</h2>
                  <p className="text-white/50 text-sm mt-1">Select a tier to unlock advanced island capabilities.</p>
                </div>
                <button 
                  onClick={() => setShowPricing(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {TIERS.map((tier) => (
                    <div 
                      key={tier.id}
                      className={`relative flex flex-col p-6 rounded-2xl border transition-all duration-300 ${
                        gameState.subscription.tier === tier.id 
                        ? 'bg-[#00E0FF]/5 border-[#00E0FF]/40 ring-1 ring-[#00E0FF]/20' 
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                      }`}
                    >
                      {gameState.subscription.tier === tier.id && (
                        <div className="absolute top-4 right-4 text-[#00E0FF]">
                          <Check size={20} />
                        </div>
                      )}
                      
                      <div className="mb-6">
                        <h3 className="text-xl font-bold" style={{ color: tier.color }}>{tier.name}</h3>
                        <div className="flex items-baseline gap-1 mt-2">
                          <span className="text-3xl font-bold">${tier.price}</span>
                          <span className="text-white/40 text-sm">/mo</span>
                        </div>
                        <p className="text-xs text-white/50 mt-4 leading-relaxed">{tier.description}</p>
                      </div>

                      <div className="flex-1 space-y-3 mb-8">
                        {tier.features.map((feature, i) => (
                          <div key={i} className="flex items-start gap-2 text-[11px] text-white/70">
                            <div className="mt-1 shrink-0">
                              <Check size={12} className="text-[#00FF00]" />
                            </div>
                            {feature}
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => handleUpgrade(tier)}
                        disabled={!!checkoutLoading || gameState.subscription.tier === tier.id}
                        className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                          gameState.subscription.tier === tier.id
                          ? 'bg-[#00FF00]/20 text-[#00FF00] cursor-default'
                          : 'bg-white text-black hover:bg-[#00FF00] hover:text-black'
                        }`}
                      >
                        {checkoutLoading === tier.id ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : gameState.subscription.tier === tier.id ? (
                          'Current Tier'
                        ) : (
                          <>
                            Initialize
                            <ArrowRight size={16} />
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-12 p-6 rounded-2xl bg-[#00FF00]/5 border border-[#00FF00]/20 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-[#00FF00]/10">
                      <Lock size={24} className="text-[#00FF00]" />
                    </div>
                    <div>
                      <h4 className="font-bold">Fair Market Value Guarantee</h4>
                      <p className="text-xs text-white/50">Our pricing is dynamically adjusted to ensure sustainable AI processing and continuous realm expansion.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono text-[#00FF00]">
                    <CreditCard size={16} />
                    SECURE_STRIPE_ENCRYPTION_ACTIVE
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer / Status Bar */}
      <footer className="relative z-10 border-t border-[#00FF00]/10 bg-black/60 backdrop-blur-md px-4 py-2 flex items-center justify-between text-[10px] font-mono text-white/40">
        <div className="flex gap-6">
          <span>LATENCY: 14MS</span>
          <span>SECURE_TUNNEL: ESTABLISHED</span>
          <span className="text-[#00FF00]/60">TIER: {gameState.subscription.tier.toUpperCase()}</span>
          <a 
            href="https://otdaisurfer.surf" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-[#00FF00] transition-colors flex items-center gap-1"
          >
            <Globe size={10} />
            OTDAISURFER.SURF
          </a>
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-[#00FF00] rounded-full animate-pulse" />
            <span>AI_CONSCIOUSNESS_SYNCED</span>
          </div>
        </div>
      </footer>
      <CombatOverlay 
        gameState={gameState}
        combatLogFilter={combatLogFilter}
        setCombatLogFilter={setCombatLogFilter}
        handleCombatAction={handleCombatAction}
        scrollRef={scrollRef}
      />

      <SkillsOverlay 
        gameState={gameState}
        setShowSkills={setShowSkills}
        purchaseSkill={purchaseSkill}
      />

      <PricingOverlay 
        gameState={gameState}
        setShowPricing={setShowPricing}
        handleUpgrade={handleUpgrade}
        checkoutLoading={checkoutLoading}
      />
        </>
      )}
      <AmbientAudio isMemorialOpen={showMemorial} />
      
      <AnimatePresence>
        {showFounders && (
          <Founders onBack={() => setShowFounders(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSubscriptionSuccess && (
          <SubscriptionSuccess 
            plan={showSubscriptionSuccess.plan}
            onClose={() => setShowSubscriptionSuccess(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSalesCenter && (
          <SalesCenter 
            onClose={() => setShowSalesCenter(false)}
            currentTier={gameState.subscription.tier}
            userEmail={user?.email}
            stripeCustomerId={gameState.subscription.stripeCustomerId}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showBusinessDashboard && (
          <BusinessDashboard 
            gameState={gameState}
            onClose={() => setShowBusinessDashboard(false)}
            onUpdateBusiness={(update) => setGameState(prev => ({
              ...prev,
              business: { ...prev.business, ...update }
            }))}
            onLog={(msg) => setGameState(prev => ({
              ...prev,
              history: [...prev.history, `> ${msg}`]
            }))}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLighthouse && (
          <Lighthouse 
            gameState={gameState}
            onUpgrade={(upgrade) => {
              setGameState(prev => {
                const newLighthouse = { ...prev.lighthouse };
                if (upgrade.id === 'signal') newLighthouse.signalRange += 1;
                if (upgrade.id === 'storage') newLighthouse.storageCapacity += 1;
                if (upgrade.id === 'defense') newLighthouse.defenseLevel += 1;
                if (upgrade.id === 'energy') newLighthouse.energyEfficiency += 1;
                
                return {
                  ...prev,
                  sandDollars: prev.sandDollars - upgrade.cost,
                  lighthouse: newLighthouse,
                  history: [...prev.history, `Lighthouse Upgrade: ${upgrade.name} installed.`]
                };
              });
            }}
            onClose={() => setShowLighthouse(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showFactionSelection && (
          <FactionSelection 
            onSelect={(faction) => {
              setGameState(prev => ({
                ...prev,
                faction,
                showFactionSelection: false,
                history: [...prev.history, `System: Faction alignment set to ${faction.toUpperCase()}.`]
              }));
              setShowFactionSelection(false);
            }}
            onClose={() => setShowFactionSelection(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSurfingGame && (
          <SurfingGame 
            onComplete={(score) => {
              setGameState(prev => ({
                ...prev,
                sandDollars: prev.sandDollars + score,
                history: [...prev.history, `Surfing Session: Earned ${score} Sand Dollars.`]
              }));
              setShowSurfingGame(false);
            }}
            onClose={() => setShowSurfingGame(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAILab && (
          <AILab 
            isOpen={showAILab}
            onClose={() => setShowAILab(false)}
            gameState={gameState}
            setGameState={setGameState}
            aiLabTab={aiLabTab}
            setAiLabTab={setAiLabTab}
            chatInput={chatInput}
            setChatInput={setChatInput}
            chatLoading={chatLoading}
            handleChatSubmit={handleChatSubmit}
            imagePrompt={imagePrompt}
            setImagePrompt={setImagePrompt}
            videoPrompt={videoPrompt}
            setVideoPrompt={setVideoPrompt}
            genLoading={genLoading}
            handleImageGen={handleImageGen}
            handleVideoGen={handleVideoGen}
            analysisInput={analysisInput}
            setAnalysisInput={setAnalysisInput}
            analysisFile={analysisFile}
            analysisLoading={analysisLoading}
            handleAnalysis={handleAnalysis}
            handleFileUpload={handleFileUpload}
            mapsInput={mapsInput}
            setMapsInput={setMapsInput}
            mapsLoading={mapsLoading}
            handleMapsGrounding={handleMapsGrounding}
            handleSearchGrounding={handleSearchGrounding}
            searchLoading={searchLoading}
            imageEditPrompt={imageEditPrompt}
            setImageEditPrompt={setImageEditPrompt}
            handleEditImage={handleEditImage}
            handleLiveAudio={handleLiveAudio}
            liveSession={liveSession}
            liveTranscript={liveTranscript}
            thinkingMode={thinkingMode}
            setThinkingMode={setThinkingMode}
            isRecording={isRecording}
            startRecording={startRecording}
            stopRecording={stopRecording}
            handleTTS={handleTTS}
            playingAudio={playingAudio}
            audioRef={audioRef}
            onOpenApiKeySelector={() => setShowApiKeySelector(true)}
            setAnalysisFile={setAnalysisFile}
            hasPaidKey={hasPaidKey}
          />
        )}
      </AnimatePresence>

      <ApiKeySelector 
        isOpen={showApiKeySelector}
        onClose={() => setShowApiKeySelector(false)}
        onKeySelected={() => {
          setShowApiKeySelector(false);
          setHasPaidKey(true);
        }}
      />
    </div>
    </ErrorBoundary>
  );
}
