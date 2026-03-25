import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { Realm, CombatState, SurvivorState, Contestant, AIStage } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateRealmUpdate(currentRealm: Realm, choice: string, aiStage: AIStage) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `The player is in ${currentRealm.name} on Hatteras Island. They chose to: ${choice}. The AI is currently at the ${aiStage} stage. Generate the next realm state, including a new description, lore, and potential combat or items.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          newRealm: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING },
              description: { type: Type.STRING },
              lore: { type: Type.STRING },
              entities: { type: Type.ARRAY, items: { type: Type.STRING } },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              paths: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    label: { type: Type.STRING },
                    description: { type: Type.STRING },
                    risk: { type: Type.STRING, enum: ['low', 'medium', 'high', 'extreme'] }
                  }
                }
              },
              discoveredItems: { type: Type.ARRAY, items: { type: Type.STRING } },
              threats: { type: Type.ARRAY, items: { type: Type.STRING } },
              npcs: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["id", "name", "description", "lore", "entities", "options", "paths", "discoveredItems", "threats", "npcs"]
          },
          combat: {
            type: Type.OBJECT,
            properties: {
              turn: { type: Type.STRING, enum: ['player', 'enemy'] },
              playerHealth: { type: Type.NUMBER },
              playerMaxHealth: { type: Type.NUMBER },
              enemy: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  health: { type: Type.NUMBER },
                  maxHealth: { type: Type.NUMBER },
                  abilities: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              },
              logs: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    timestamp: { type: Type.NUMBER },
                    type: { type: Type.STRING, enum: ['player', 'enemy', 'system'] },
                    message: { type: Type.STRING }
                  }
                }
              },
              isDefending: { type: Type.BOOLEAN }
            }
          },
          item: { type: Type.STRING }
        },
        required: ["newRealm"]
      }
    }
  });

  const jsonStr = response.text?.replace(/```json\n?|\n?```/g, '') || '{}';
  return JSON.parse(jsonStr);
}

export async function generateCombatAction(combat: CombatState, action: 'attack' | 'defend' | 'special') {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Combat in progress. Player action: ${action}. Current state: ${JSON.stringify(combat)}. Generate the result of this turn, including damage dealt/received and updated logs.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          newCombatState: {
            type: Type.OBJECT,
            properties: {
              turn: { type: Type.STRING, enum: ['player', 'enemy'] },
              playerHealth: { type: Type.NUMBER },
              playerMaxHealth: { type: Type.NUMBER },
              enemy: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  health: { type: Type.NUMBER },
                  maxHealth: { type: Type.NUMBER },
                  abilities: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["name", "health", "maxHealth", "abilities"]
              },
              logs: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    timestamp: { type: Type.NUMBER },
                    type: { type: Type.STRING, enum: ['player', 'enemy', 'system'] },
                    message: { type: Type.STRING }
                  },
                  required: ["timestamp", "type", "message"]
                }
              },
              isDefending: { type: Type.BOOLEAN }
            },
            required: ["turn", "playerHealth", "playerMaxHealth", "enemy", "logs", "isDefending"]
          },
          victory: { type: Type.BOOLEAN },
          defeat: { type: Type.BOOLEAN }
        },
        required: ["newCombatState", "victory", "defeat"]
      }
    }
  });

  const jsonStr = response.text?.replace(/```json\n?|\n?```/g, '') || '{}';
  return JSON.parse(jsonStr);
}

export async function generateSurvivorDialogue(contestant: Contestant, context: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate dialogue for a Survivor contestant named ${contestant.name} (${contestant.archetype}). Context: ${context}. Keep it thematic to Hatteras Island and the Survivor TV show.`,
  });
  return response.text;
}

export async function generateTribalCouncilOutcome(survivor: SurvivorState, votedId: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Tribal Council on Hatteras Island. 
    The player voted for contestant ID: ${votedId}. 
    Current phase: ${survivor.phase}.
    Current tribe: ${survivor.tribe}. 
    Contestants (with BDI logic): ${JSON.stringify(survivor.contestants)}. 
    Voting History: ${JSON.stringify(survivor.votingHistory)}.
    Generate the outcome of the vote, including who is eliminated, a dramatic reason, and the individual votes of all active contestants.
    The AI contestants should use their BDI logic (beliefs, desires, intentions) to decide their vote. 
    Wolves should try to coordinate to eliminate villagers without being detected.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          eliminatedId: { type: Type.STRING },
          reason: { type: Type.STRING },
          drama: { type: Type.STRING },
          votes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                voterId: { type: Type.STRING },
                targetId: { type: Type.STRING }
              },
              required: ["voterId", "targetId"]
            }
          }
        },
        required: ["eliminatedId", "reason", "drama", "votes"]
      }
    }
  });
  const jsonStr = response.text?.replace(/```json\n?|\n?```/g, '') || '{}';
  return JSON.parse(jsonStr);
}

export async function generateSocialDeductionMetrics(survivor: SurvivorState) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze the voting history and current state of the Hatteras Realm social deduction game: ${JSON.stringify(survivor)}. 
    Calculate the following metrics:
    1. Majority Win Rate: How often the majority of the tribe (or the wolf pack) successfully eliminated their target.
    2. Tie Indicator: Frequency of split votes or ties.
    3. Coordination Efficiency: How well the factions (Villagers vs Wolves) are coordinating their trust signals and final votes.
    Return these as values between 0 and 1.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          majorityWinRate: { type: Type.NUMBER },
          tieIndicator: { type: Type.NUMBER },
          coordinationEfficiency: { type: Type.NUMBER }
        },
        required: ["majorityWinRate", "tieIndicator", "coordinationEfficiency"]
      }
    }
  });
  const jsonStr = response.text?.replace(/```json\n?|\n?```/g, '') || '{}';
  return JSON.parse(jsonStr);
}

export async function generateAIAllianceLogic(survivor: SurvivorState) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze the current Survivor state: ${JSON.stringify(survivor)}. Generate logic for AI contestants forming or breaking alliances based on their archetypes and threat levels.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          newAlliances: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                members: { type: Type.ARRAY, items: { type: Type.STRING } },
                strength: { type: Type.NUMBER },
                trust: { type: Type.NUMBER }
              },
              required: ["id", "name", "members", "strength", "trust"]
            }
          },
          logs: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["newAlliances", "logs"]
      }
    }
  });
  const jsonStr = response.text?.replace(/```json\n?|\n?```/g, '') || '{}';
  return JSON.parse(jsonStr);
}

export async function generateRealmImage(realmName: string) {
  // Placeholder for image generation if needed
  return `https://picsum.photos/seed/${realmName}/1920/1080`;
}

export async function validateBusinessSolution(problem: string, solution: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Problem: ${problem}. Proposed Solution: ${solution}. Is this a valid, practical way to use AI to solve this small business issue? Respond with a JSON object containing a boolean 'isValid' and a string 'feedback'.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          isValid: { type: Type.BOOLEAN },
          feedback: { type: Type.STRING }
        },
        required: ["isValid", "feedback"]
      }
    }
  });
  const jsonStr = response.text?.replace(/```json\n?|\n?```/g, '') || '{}';
  return JSON.parse(jsonStr);
}
