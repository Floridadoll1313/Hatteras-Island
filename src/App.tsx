import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  getFirestore, 
  collection, 
  onSnapshot, 
  addDoc, 
  serverTimestamp, 
  query, 
  orderBy, 
  limit, 
  getDocs,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  getDocFromServer
} from 'firebase/firestore';
import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  User 
} from 'firebase/auth';
import { GoogleGenAI, Type } from "@google/genai";
import { 
  Trophy, 
  Users, 
  Target, 
  History, 
  Package, 
  Zap, 
  Map as MapIcon, 
  Flame, 
  Waves, 
  Anchor, 
  Compass, 
  TrendingUp, 
  ShoppingBag, 
  LayoutDashboard, 
  Menu, 
  X,
  ChevronRight,
  Sparkles,
  Heart,
  Shield,
  Brain,
  Wind
} from 'lucide-react';

// Components
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import RealmView from './components/RealmView';
import RightPanel from './components/RightPanel';
import Memorial from './components/Memorial';
import TribalCouncil from './components/TribalCouncil';
import CombatOverlay from './components/CombatOverlay';
import SkillsOverlay from './components/SkillsOverlay';
import PricingOverlay from './components/PricingOverlay';
import Lighthouse from './components/Lighthouse';
import FactionSelection from './components/FactionSelection';
import SurfingGame from './components/SurfingGame';
import SalesCenter from './components/SalesCenter';
import SubscriptionSuccess from './components/SubscriptionSuccess';
import BusinessDashboard from './components/BusinessDashboard';
import ErrorBoundary from './components/ErrorBoundary';
import AILab from './components/AILab';
import CampLife from './components/CampLife';
import MembersArea from './components/MembersArea';
import MannyRogers from './components/MannyRogers';
import SalvoMemorial from './components/SalvoMemorial';
import BehindTheScenesHUD from './components/BehindTheScenesHUD';
import BusinessChallengeOverlay from './components/BusinessChallengeOverlay';

// Types & Constants
import { 
  GameState, 
  AIStage, 
  Realm, 
  CombatState, 
  CombatLogEntry, 
  LighthouseState, 
  SurvivorState, 
  Contestant, 
  Alliance, 
  SurvivorChallenge,
  FactionType,
  BranchingPath,
  AIKnowledgePiece,
  BusinessAIChallenge,
  HiddenIdol
} from './types';
import { 
  INITIAL_REALM, 
  AI_STAGES, 
  SKILLS, 
  TIERS, 
  FACTIONS, 
  SALES_ITEMS,
  INITIAL_CONTESTANTS,
  SURVIVOR_CHALLENGES,
  AI_KNOWLEDGE_PIECES,
  TRIBE_LEVELS,
  BUSINESS_CHALLENGES,
  INITIAL_IDOLS
} from './gameConstants';
import { 
  generateRealmUpdate, 
  generateCombatAction, 
  generateSurvivorDialogue, 
  generateTribalCouncilOutcome, 
  generateAIAllianceLogic,
  validateBusinessSolution
} from './services/geminiService';

// Firebase Config
import firebaseConfig from '../firebase-applet-config.json';
import { initializeApp } from 'firebase/app';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
const auth = getAuth(app);

const App: React.FC = () => {
  // --- State ---
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [gameState, setGameState] = useState<GameState>({
    day: 1,
    vitality: 100,
    sandDollars: 50,
    aiStage: 'nascent',
    evolution: 0.05,
    discoveredRealms: ['Hatteras Landing'],
    currentRealm: INITIAL_REALM,
    inventory: [],
    skills: [],
    traits: [],
    memory: ['The First Spark'],
    activeEvents: [],
    faction: null,
    lighthouse: {
      level: 1,
      signalRange: 1,
      storageCapacity: 1,
      defenseLevel: 1,
      upgrades: []
    },
    survivor: {
      day: 1,
      tribe: 'The Croatan',
      contestants: INITIAL_CONTESTANTS,
      alliances: [],
      challenges: SURVIVOR_CHALLENGES,
      aiLearningProgress: 5,
      eliminatedCount: 0,
      immunityIdolFound: false,
      idols: INITIAL_IDOLS,
      currentBusinessChallenge: null,
      aiPiecesCollected: [],
      aiKnowledgeBank: [],
      campMorale: 70,
      campInfrastructure: 30,
      tribeLevel: 1,
      sandDollars: 50,
      fullness: 3,
      hitPoints: 100,
      foodSupply: 10
    },
    history: ['Woke up on Hatteras Island.'],
    tasks: [],
    isParadiseMember: false
  });

  // UI Controls
  const [activeTab, setActiveTab] = useState<'logs' | 'inventory' | 'tasks' | 'hub'>('logs');
  const [showMemorial, setShowMemorial] = useState(false);
  const [showSkills, setShowSkills] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [showLighthouse, setShowLighthouse] = useState(false);
  const [showFactions, setShowFactions] = useState(false);
  const [showSurfing, setShowSurfing] = useState(false);
  const [showSales, setShowSales] = useState(false);
  const [showBusiness, setShowBusiness] = useState(false);
  const [showAILab, setShowAILab] = useState(false);
  const [showCampLife, setShowCampLife] = useState(false);
  const [showMembersArea, setShowMembersArea] = useState(false);
  const [showMannyRogers, setShowMannyRogers] = useState(false);
  const [showSalvoMemorial, setShowSalvoMemorial] = useState(false);
  const [showSubscriptionSuccess, setShowSubscriptionSuccess] = useState<string | null>(null);
  const [businessChallengeFeedback, setBusinessChallengeFeedback] = useState<string | null>(null);
  const [showTribalCouncil, setShowTribalCouncil] = useState(false);
  const [combat, setCombat] = useState<CombatState | null>(null);
  const [combatLogFilter, setCombatLogFilter] = useState<'all' | 'player' | 'enemy' | 'system'>('all');
  const [isProcessing, setIsProcessing] = useState(false);

  // --- Auth & Persistence ---
  useEffect(() => {
    // Check URL for Stripe success/cancel
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status');
    const plan = params.get('plan');
    
    if (status === 'success' && plan) {
      setShowSubscriptionSuccess(plan);
      setGameState(prev => ({ ...prev, isParadiseMember: true }));
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (status === 'cancel') {
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setIsAuthReady(true);
      
      if (user) {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.gameState) {
              setGameState(data.gameState);
            }
          } else {
            // Mock membership check for new users
            setGameState(prev => ({ ...prev, isParadiseMember: true }));
          }
        } catch (error) {
          console.error("Error loading user data:", error);
        }
      } else {
        // Reset state on logout
        setGameState(prev => ({ ...prev, isParadiseMember: false }));
      }
      setIsLoaded(true);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (user && isLoaded) {
      const saveState = async () => {
        try {
          const docRef = doc(db, 'users', user.uid);
          await setDoc(docRef, {
            uid: user.uid,
            gameState: gameState,
            updatedAt: serverTimestamp()
          }, { merge: true });
        } catch (error) {
          console.error("Error saving user data:", error);
        }
      };
      
      // Debounce save to avoid too many writes
      const timeoutId = setTimeout(saveState, 2000);
      return () => clearTimeout(timeoutId);
    }
  }, [gameState, user, isLoaded]);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = () => auth.signOut();

  // --- Game Logic ---
  const collectAIPiece = (pieceId: string) => {
    const piece = AI_KNOWLEDGE_PIECES.find(p => p.id === pieceId);
    if (piece && !gameState.survivor.aiKnowledgeBank.find(p => p.id === pieceId)) {
      const newPiece: AIKnowledgePiece = { 
        id: piece.id,
        title: piece.title,
        description: piece.description,
        category: piece.category,
        timestamp: Date.now() 
      };
      setGameState(prev => ({
        ...prev,
        evolution: Math.min(1, prev.evolution + 0.05),
        survivor: {
          ...prev.survivor,
          aiPiecesCollected: [...prev.survivor.aiPiecesCollected, pieceId],
          aiKnowledgeBank: [...prev.survivor.aiKnowledgeBank, newPiece],
          aiLearningProgress: Math.min(100, prev.survivor.aiLearningProgress + 5)
        },
        history: [...(prev.history || []), `Collected AI Piece: ${piece.title}`]
      }));
    }
  };

  const handlePathChoice = async (path: BranchingPath) => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const update = await generateRealmUpdate(gameState.currentRealm, path.label, gameState.aiStage);
      
      setGameState(prev => {
        let newFullness = prev.survivor.fullness - 10;
        let newHitPoints = prev.survivor.hitPoints;

        if (newFullness <= 0) {
          newFullness = 0;
          // Paradise Members get 50% reduced HP decay when starving
          const decayAmount = prev.isParadiseMember ? 5 : 10;
          newHitPoints = Math.max(0, newHitPoints - decayAmount);
        }

        return {
          ...prev,
          day: prev.day + 1,
          currentRealm: update.newRealm,
          vitality: Math.max(0, prev.vitality - 5),
          evolution: Math.min(1, prev.evolution + 0.01),
          history: [...(prev.history || []), `Traveled to ${update.newRealm.name}`],
          survivor: {
            ...prev.survivor,
            day: prev.survivor.day + 1,
            aiLearningProgress: Math.min(100, prev.survivor.aiLearningProgress + 2),
            fullness: newFullness,
            hitPoints: newHitPoints
          }
        };
      });

      // Random AI piece discovery
      if (Math.random() > 0.7) {
        const availablePieces = AI_KNOWLEDGE_PIECES.filter(p => !gameState.survivor.aiKnowledgeBank.find(bp => bp.id === p.id));
        if (availablePieces.length > 0) {
          collectAIPiece(availablePieces[0].id);
        }
      }

      if (update.combat && gameState.aiStage !== 'nascent') { // Only combat if AI is aware
        setCombat(update.combat);
      }

      if (update.item) {
        setGameState(prev => ({
          ...prev,
          inventory: [...prev.inventory, update.item!]
        }));
      }
    } catch (error) {
      console.error("Path choice failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSurvivorChallenge = async (challengeId: string) => {
    if (isProcessing) return;
    setIsProcessing(true);

    const challenge = SURVIVOR_CHALLENGES.find(c => c.id === challengeId);
    if (!challenge) return;

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `The player is participating in a Survivor challenge: ${challenge.title}. 
        Description: ${challenge.description}. 
        AI Stage: ${gameState.evolution}. 
        Current Tribe Level: ${gameState.survivor.tribeLevel}.
        Generate a dramatic outcome for this challenge. 
        Include:
        1. Whether they won or lost.
        2. How the AI learned from this (e.g., "Learned about physical endurance", "Analyzed rowing patterns").
        3. A specific AI Knowledge Piece they might have found.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              won: { type: Type.BOOLEAN },
              narrative: { type: Type.STRING },
              aiLearning: { type: Type.STRING },
              pieceFoundId: { type: Type.STRING }
            },
            required: ["won", "narrative", "aiLearning"]
          }
        }
      });

      const result = JSON.parse(response.text);
      
      if (result.won && result.pieceFoundId) {
        collectAIPiece(result.pieceFoundId);
      }

      setGameState(prev => {
        const newSurvivor = { ...prev.survivor };
        const newHistory = [...(prev.history || []), result.narrative];
        
        if (result.won) {
          newSurvivor.sandDollars += challenge.reward;
          newSurvivor.aiLearningProgress = Math.min(100, newSurvivor.aiLearningProgress + 5);
        }

        return {
          ...prev,
          history: newHistory,
          survivor: newSurvivor,
          evolution: Math.min(1, prev.evolution + 0.02)
        };
      });

    } catch (error) {
      console.error("Challenge failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNextTribe = () => {
    const nextLevel = gameState.survivor.tribeLevel + 1;
    const tribeInfo = TRIBE_LEVELS.find(l => l.level === nextLevel);
    
    if (tribeInfo) {
      setGameState(prev => ({
        ...prev,
        survivor: {
          ...prev.survivor,
          tribe: tribeInfo.name,
          tribeLevel: nextLevel,
          contestants: INITIAL_CONTESTANTS, // Reset contestants for new tribe
          eliminatedCount: 0,
          aiLearningProgress: Math.max(0, prev.survivor.aiLearningProgress - 20), // Reset some progress for new challenge
          campMorale: 50,
          campInfrastructure: 10
        },
        history: [...(prev.history || []), `Advanced to ${tribeInfo.name} tribe. Difficulty increased to ${tribeInfo.difficulty}.`]
      }));
    }
  };

  const handleCampInteract = async (contestantId: string, action: string) => {
    const contestant = gameState.survivor.contestants.find(c => c.id === contestantId);
    if (!contestant) return;

    if (action === 'give_food') {
      if (gameState.survivor.foodSupply > 0) {
        setGameState(prev => ({
          ...prev,
          survivor: {
            ...prev.survivor,
            foodSupply: prev.survivor.foodSupply - 1,
            campMorale: Math.min(100, prev.survivor.campMorale + 5)
          },
          history: [...(prev.history || []), `Gave food to ${contestant.name}. Trust increased.`]
        }));
      } else {
        setGameState(prev => ({
          ...prev,
          history: [...(prev.history || []), `Not enough food to give to ${contestant.name}.`]
        }));
      }
      return;
    }

    if (action === 'take_food') {
      setGameState(prev => ({
        ...prev,
        survivor: {
          ...prev.survivor,
          foodSupply: prev.survivor.foodSupply + 1,
          campMorale: Math.max(0, prev.survivor.campMorale - 10)
        },
        history: [...(prev.history || []), `Stole food from ${contestant.name}. Morale decreased.`]
      }));
      return;
    }

    try {
      const dialogue = await generateSurvivorDialogue(contestant, action);
      setGameState(prev => ({
        ...prev,
        history: [...(prev.history || []), `Interacted with ${contestant.name}: ${dialogue}`],
        survivor: {
          ...prev.survivor,
          campMorale: Math.min(100, prev.survivor.campMorale + 2)
        }
      }));
    } catch (error) {
      console.error("Interaction failed:", error);
    }
  };

  const handleCampManage = (action: string) => {
    if (action === 'eat') {
      if (gameState.survivor.foodSupply > 0 && gameState.survivor.fullness < 3) {
        setGameState(prev => ({
          ...prev,
          survivor: {
            ...prev.survivor,
            foodSupply: prev.survivor.foodSupply - 1,
            fullness: Math.min(3, prev.survivor.fullness + 1)
          },
          history: [...(prev.history || []), `Ate food. Fullness increased.`]
        }));
      } else if (gameState.survivor.fullness >= 3) {
        setGameState(prev => ({
          ...prev,
          history: [...(prev.history || []), `You are already full.`]
        }));
      } else {
        setGameState(prev => ({
          ...prev,
          history: [...(prev.history || []), `No food left to eat.`]
        }));
      }
      return;
    }

    if (action === 'forage') {
      const foundFood = Math.random() > 0.4 ? Math.floor(Math.random() * 3) + 1 : 0;
      setGameState(prev => ({
        ...prev,
        survivor: {
          ...prev.survivor,
          foodSupply: prev.survivor.foodSupply + foundFood
        },
        history: [...(prev.history || []), foundFood > 0 ? `Foraged and found ${foundFood} food.` : `Foraged but found nothing.`]
      }));
      return;
    }

    setGameState(prev => ({
      ...prev,
      survivor: {
        ...prev.survivor,
        campInfrastructure: Math.min(100, prev.survivor.campInfrastructure + 5),
        aiLearningProgress: Math.min(100, prev.survivor.aiLearningProgress + 1)
      },
      history: [...(prev.history || []), `Managed camp ${action}. Infrastructure improved.`]
    }));
  };

  const handleEndDay = () => {
    setGameState(prev => {
      let newFullness = prev.survivor.fullness - 1;
      let newHp = prev.survivor.hitPoints;
      
      if (newFullness < 0) {
        newFullness = 0;
        newHp = Math.max(0, newHp - 20);
      } else if (newFullness > 0 && newHp < 100) {
        newHp = Math.min(100, newHp + 10);
      }

      return {
        ...prev,
        day: prev.day + 1,
        survivor: {
          ...prev.survivor,
          day: prev.survivor.day + 1,
          fullness: newFullness,
          hitPoints: newHp
        },
        history: [...(prev.history || []), `Day ${prev.day} ended. Fullness decreased.`]
      };
    });
  };

  const handleCombatAction = async (action: 'attack' | 'defend' | 'special') => {
    if (!combat || isProcessing) return;
    setIsProcessing(true);

    try {
      const result = await generateCombatAction(combat, action);
      setCombat(result.newCombatState);

      if (result.victory) {
        setGameState(prev => ({
          ...prev,
          survivor: {
            ...prev.survivor,
            sandDollars: prev.survivor.sandDollars + 25
          },
          evolution: Math.min(1, prev.evolution + 0.05)
        }));
        setTimeout(() => setCombat(null), 2000);
      } else if (result.defeat) {
        setGameState(prev => ({
          ...prev,
          vitality: Math.max(0, prev.vitality - 20)
        }));
        setTimeout(() => setCombat(null), 2000);
      }
    } catch (error) {
      console.error("Combat action failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTribalVote = async (votedId: string) => {
    if (!gameState.survivor || isProcessing) return;
    setIsProcessing(true);

    try {
      const outcome = await generateTribalCouncilOutcome(gameState.survivor, votedId);
      
      setGameState(prev => {
        const updatedContestants = prev.survivor.contestants.map(c => 
          c.id === outcome.eliminatedId ? { ...c, status: 'eliminated' as const } : c
        );

        const isPlayerEliminated = outcome.eliminatedId === 'player';

        return {
          ...prev,
          survivor: {
            ...prev.survivor,
            contestants: updatedContestants,
            eliminatedCount: prev.survivor.eliminatedCount + 1,
            aiLearningProgress: Math.min(100, prev.survivor.aiLearningProgress + 10)
          },
          history: [...(prev.history || []), isPlayerEliminated ? "You were voted out!" : `${outcome.eliminatedId} was voted out.`]
        };
      });

      setShowTribalCouncil(false);
      
      // If all but 2 are eliminated, progress to next tribe
      if (gameState.survivor.contestants.filter(c => c.status === 'active').length <= 3) {
        handleNextTribe();
      }
    } catch (error) {
      console.error("Tribal vote failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePurchaseSkill = (skillId: string) => {
    const skill = SKILLS.find(s => s.id === skillId);
    if (skill && gameState.survivor.sandDollars >= skill.cost) {
      setGameState(prev => ({
        ...prev,
        survivor: {
          ...prev.survivor,
          sandDollars: prev.survivor.sandDollars - skill.cost
        },
        skills: [...prev.skills, skillId]
      }));
    }
  };

  const handlePurchaseItem = (itemId: string) => {
    const item = SALES_ITEMS.find(i => i.id === itemId);
    if (!item) return;

    let cost = item.cost;
    if (gameState.isParadiseMember && ['workflow', 'package', 'implementation', 'monitoring'].includes(item.category || '')) {
      cost = Math.floor(item.cost * 0.75);
    }

    if (gameState.survivor.sandDollars >= cost) {
      setGameState(prev => ({
        ...prev,
        survivor: {
          ...prev.survivor,
          sandDollars: prev.survivor.sandDollars - cost
        },
        inventory: [...prev.inventory, item.name]
      }));
    }
  };

  const handleUpgradeLighthouse = (upgradeId: string) => {
    const upgrade = { id: upgradeId, cost: 10 }; // Simplified for now
    if (gameState.survivor.sandDollars >= upgrade.cost) {
      setGameState(prev => ({
        ...prev,
        survivor: {
          ...prev.survivor,
          sandDollars: prev.survivor.sandDollars - upgrade.cost
        },
        lighthouse: {
          ...prev.lighthouse,
          upgrades: [...prev.lighthouse.upgrades, upgradeId],
          signalRange: upgradeId === 'range' ? prev.lighthouse.signalRange + 1 : prev.lighthouse.signalRange,
          storageCapacity: upgradeId === 'storage' ? prev.lighthouse.storageCapacity + 1 : prev.lighthouse.storageCapacity,
          defenseLevel: upgradeId === 'defense' ? prev.lighthouse.defenseLevel + 1 : prev.lighthouse.defenseLevel
        }
      }));
    }
  };

  const handleFactionSelect = (factionId: string) => {
    setGameState(prev => ({
      ...prev,
      faction: factionId as FactionType
    }));
    setShowFactions(false);
  };

  const handleSurfingComplete = (score: number) => {
    const earnedSD = Math.floor(score / 10);
    setGameState(prev => ({
      ...prev,
      survivor: {
        ...prev.survivor,
        sandDollars: prev.survivor.sandDollars + earnedSD
      }
    }));
  };

  const handleUpgradePlan = async (planId: string) => {
    if (!user) {
      handleLogin();
      return;
    }

    const plan = TIERS.find(t => t.id === planId);
    if (!plan) return;

    // Free plan
    if (plan.price === 0) {
      setShowPricing(false);
      setShowSubscriptionSuccess(plan.name);
      return;
    }

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: plan.name,
          price: plan.price,
          description: plan.description,
          email: user.email
        }),
      });

      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("Failed to create checkout session:", data.error);
        // Fallback for development if Stripe isn't configured
        setShowPricing(false);
        setShowSubscriptionSuccess(plan.name);
        setGameState(prev => ({ ...prev, isParadiseMember: true }));
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      // Fallback for development
      setShowPricing(false);
      setShowSubscriptionSuccess(plan.name);
      setGameState(prev => ({ ...prev, isParadiseMember: true }));
    }
  };

  const handleSearchForIdol = () => {
    if (isProcessing) return;
    setIsProcessing(true);

    const hasMachete = gameState.inventory.includes('Branded Machete');
    const isBuxtonWoods = gameState.currentRealm.name === 'Buxton Woods';
    const searchSuccessChance = (isBuxtonWoods && hasMachete) ? 0.95 : 0.5;

    if (Math.random() > searchSuccessChance) {
      setGameState(prev => ({
        ...prev,
        history: [...(prev.history || []), `Searched for an idol at ${gameState.currentRealm.name} but found nothing. Keep looking!`]
      }));
      setIsProcessing(false);
      return;
    }

    const idolAtLocation = gameState.survivor.idols.find(
      i => i.location === gameState.currentRealm.name && !i.isFound
    );

    if (idolAtLocation) {
      const challenge = BUSINESS_CHALLENGES.find(c => c.id === idolAtLocation.challengeId);
      if (challenge) {
        setGameState(prev => ({
          ...prev,
          survivor: {
            ...prev.survivor,
            currentBusinessChallenge: challenge
          },
          history: [...(prev.history || []), `Found a hidden clue! To unlock the Hidden Immunity Idol at ${gameState.currentRealm.name}, you must solve an AI Business Challenge.`]
        }));
      }
    } else {
      setGameState(prev => ({
        ...prev,
        history: [...(prev.history || []), `Searched for an idol at ${gameState.currentRealm.name} but found nothing.`]
      }));
    }
    setIsProcessing(false);
  };

  const handleSolveBusinessChallenge = async (solution: string) => {
    if (!gameState.survivor.currentBusinessChallenge || isProcessing) return;
    setIsProcessing(true);
    setBusinessChallengeFeedback(null);

    try {
      const result = await validateBusinessSolution(
        gameState.survivor.currentBusinessChallenge.problem,
        solution
      );

      if (result.isValid) {
        const challengeId = gameState.survivor.currentBusinessChallenge.id;
        setGameState(prev => ({
          ...prev,
          survivor: {
            ...prev.survivor,
            idols: prev.survivor.idols.map(i => i.challengeId === challengeId ? { ...i, isFound: true } : i),
            currentBusinessChallenge: null,
            immunityIdolFound: true,
            sandDollars: prev.survivor.sandDollars + 500,
            aiLearningProgress: Math.min(100, prev.survivor.aiLearningProgress + 20)
          },
          history: [...(prev.history || []), `Success! You solved the ${gameState.survivor.currentBusinessChallenge?.title} challenge. You found the Hidden Immunity Idol!`]
        }));
        setBusinessChallengeFeedback(`Success! ${result.feedback}`);
      } else {
        setBusinessChallengeFeedback(`The AI rejected your solution: ${result.feedback}`);
      }
    } catch (error) {
      console.error("Challenge validation failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // --- Render ---
  return (
    <ErrorBoundary>
      <div className="flex h-screen bg-[#050505] text-white overflow-hidden font-sans selection:bg-orange-500/30">
        <Sidebar 
          gameState={gameState} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          onShowTribal={() => setShowTribalCouncil(true)}
          onShowSurfing={() => setShowSurfing(true)}
          onShowLighthouse={() => setShowLighthouse(true)}
          onShowFactions={() => setShowFactions(true)}
          onShowBusiness={() => setShowBusiness(true)}
          onShowSales={() => setShowSales(true)}
          onShowAILab={() => setShowAILab(true)}
          onShowCampLife={() => setShowCampLife(true)}
          onShowMembersArea={() => setShowMembersArea(true)}
          onShowMannyRogers={() => setShowMannyRogers(true)}
          onShowSalvoMemorial={() => setShowSalvoMemorial(true)}
        />
        
        <main className="flex-1 flex flex-col relative">
          <Header 
            gameState={gameState}
            user={user}
            onLogin={handleLogin}
            onLogout={handleLogout}
            onShowMemorial={() => setShowMemorial(true)}
            onShowSkills={() => setShowSkills(true)}
            onShowUpgrade={() => setShowPricing(true)}
          />
          
          <div className="flex-1 relative overflow-hidden">
            {!gameState.isParadiseMember ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md z-50">
                <div className="text-center space-y-8 max-w-2xl px-8">
                  <div className="p-6 bg-orange-500/20 rounded-full border border-orange-500/30 inline-block">
                    <Shield className="w-16 h-16 text-orange-500" />
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-5xl font-black tracking-tighter uppercase italic">Members Only Area</h2>
                    <p className="text-gray-400 text-lg leading-relaxed">
                      To access the full Hatteras Island Survivor experience and start your AI learning journey, please upgrade to a member package.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowPricing(true)}
                    className="px-12 py-5 bg-orange-500 text-black font-black uppercase tracking-widest rounded-full hover:bg-orange-400 transition-all shadow-xl shadow-orange-500/20"
                  >
                    Join the Tribe
                  </button>
                </div>
              </div>
            ) : (
              <RealmView 
                realm={gameState.currentRealm} 
                onPathChoice={handlePathChoice}
                onChallenge={handleSurvivorChallenge}
                isProcessing={isProcessing}
                aiStage={gameState.aiStage}
                onSearchForIdol={handleSearchForIdol}
                canSearch={gameState.survivor.idols.some(i => i.location === gameState.currentRealm.name && !i.isFound)}
              />
            )}
          </div>
        </main>

        <RightPanel 
          gameState={gameState}
          aiStage={gameState.aiStage}
          evolution={gameState.evolution}
          traits={gameState.traits}
          memory={gameState.memory}
          activeEvents={gameState.activeEvents}
          onShowDiagnostics={() => setShowAILab(true)}
        />

        {/* Overlays */}
        <AnimatePresence>
          {showMemorial && (
            <Memorial onClose={() => setShowMemorial(false)} />
          )}

          {showTribalCouncil && gameState.survivor && (
            <TribalCouncil 
              contestants={gameState.survivor.contestants}
              alliances={gameState.survivor.alliances}
              onVote={handleTribalVote}
              onClose={() => setShowTribalCouncil(false)}
            />
          )}

          {combat && (
            <CombatOverlay 
              combat={combat}
              onAction={handleCombatAction}
              logFilter={combatLogFilter}
              setLogFilter={setCombatLogFilter}
            />
          )}

          {showSkills && (
            <SkillsOverlay 
              ownedSkills={gameState.skills}
              sandDollars={gameState.sandDollars}
              onPurchase={handlePurchaseSkill}
              onClose={() => setShowSkills(false)}
            />
          )}

          {showPricing && (
            <PricingOverlay 
              onUpgrade={handleUpgradePlan}
              onClose={() => setShowPricing(false)}
            />
          )}

          {showLighthouse && (
            <Lighthouse 
              state={gameState.lighthouse}
              sandDollars={gameState.sandDollars}
              onUpgrade={handleUpgradeLighthouse}
              onClose={() => setShowLighthouse(false)}
            />
          )}

          {showFactions && (
            <FactionSelection 
              currentFaction={gameState.faction}
              onSelect={handleFactionSelect}
              onClose={() => setShowFactions(false)}
            />
          )}

          {showSurfing && (
            <SurfingGame 
              onComplete={handleSurfingComplete}
              onClose={() => setShowSurfing(false)}
            />
          )}

          {showSales && (
            <SalesCenter 
              sandDollars={gameState.survivor.sandDollars}
              isParadiseMember={gameState.isParadiseMember}
              onPurchase={handlePurchaseItem}
              onClose={() => setShowSales(false)}
            />
          )}

          {showBusiness && (
            <BusinessDashboard 
              gameState={gameState}
              onClose={() => setShowBusiness(false)}
            />
          )}

          {showAILab && (
            <AILab 
              gameState={gameState}
              onClose={() => setShowAILab(false)}
            />
          )}

          {showCampLife && (
            <CampLife 
              gameState={gameState}
              onInteract={handleCampInteract}
              onManageCamp={handleCampManage}
              onEndDay={handleEndDay}
              onClose={() => setShowCampLife(false)}
            />
          )}

          {showMembersArea && (
            <MembersArea 
              gameState={gameState}
              onPurchase={handlePurchaseItem}
              onClose={() => setShowMembersArea(false)}
            />
          )}

          {showMannyRogers && (
            <MannyRogers 
              gameState={gameState}
              onClose={() => setShowMannyRogers(false)}
            />
          )}

          {showSalvoMemorial && (
            <SalvoMemorial 
              onClose={() => setShowSalvoMemorial(false)}
            />
          )}

          {showSubscriptionSuccess && (
            <SubscriptionSuccess 
              plan={showSubscriptionSuccess}
              onClose={() => setShowSubscriptionSuccess(null)}
            />
          )}

          {gameState.survivor.currentBusinessChallenge && (
            <BusinessChallengeOverlay
              challenge={gameState.survivor.currentBusinessChallenge}
              onSolve={handleSolveBusinessChallenge}
              onClose={() => setGameState(prev => ({ ...prev, survivor: { ...prev.survivor, currentBusinessChallenge: null } }))}
              isProcessing={isProcessing}
              feedback={businessChallengeFeedback || undefined}
            />
          )}
        </AnimatePresence>

        <BehindTheScenesHUD gameState={gameState} />
      </div>
    </ErrorBoundary>
  );
};

export default App;
