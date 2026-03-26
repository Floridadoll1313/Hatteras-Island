import { GoogleGenAI, VideoGenerationReferenceType } from "@google/genai";
import { Contestant, SurvivorChallenge } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateCampImage(
  contestants: Contestant[],
  day: number,
  phase: string,
  village: string
): Promise<string | null> {
  try {
    const activeContestants = contestants.filter(c => c.status === 'active').map(c => c.name).join(", ");
    const prompt = `A cinematic, high-quality photo of a survivor camp on Hatteras Island, North Carolina. 
    Location: ${village}. 
    Time of day: ${phase === 'day' ? 'Bright midday sun' : 'Dusk with a glowing orange sunset'}. 
    Day ${day} of the survival challenge. 
    The camp features a rough shelter made of driftwood and palm fronds. 
    Contestants present: ${activeContestants}. 
    Atmosphere: ${phase === 'day' ? 'Productive and intense' : 'Quiet and reflective around a small campfire'}. 
    Background: The iconic black-and-white spiral-striped Cape Hatteras Lighthouse is visible in the distance. 
    Style: Realistic, National Geographic style photography.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-image-preview',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9",
          imageSize: "1K"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Error generating camp image:", error);
    return null;
  }
}

export async function generateChallengeVideo(
  challenge: SurvivorChallenge,
  playerStats: any
): Promise<string | null> {
  try {
    const prompt = `A 5-second high-action cinematic video of a survival challenge on Hatteras Island. 
    Challenge: ${challenge.title} - ${challenge.description}. 
    Environment: Coastal dunes and rough Atlantic surf. 
    Action: A group of diverse survivors are intensely competing, ${challenge.type === 'physical' ? 'pushing their physical limits' : 'intense focus on a complex task'}. 
    The black-and-white spiral Cape Hatteras Lighthouse stands tall in the background under a dramatic sky. 
    Style: High-end reality TV production, dynamic camera movement, slow-motion highlights.`;

    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9'
      }
    });

    // Poll for completion (simplified for this context, usually handled with state in UI)
    let attempts = 0;
    while (!operation.done && attempts < 30) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
      attempts++;
    }

    if (operation.done && operation.response?.generatedVideos?.[0]?.video?.uri) {
      const downloadLink = operation.response.generatedVideos[0].video.uri;
      const response = await fetch(downloadLink, {
        method: 'GET',
        headers: {
          'x-goog-api-key': process.env.GEMINI_API_KEY || '',
        },
      });
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    }
    return null;
  } catch (error) {
    console.error("Error generating challenge video:", error);
    return null;
  }
}
