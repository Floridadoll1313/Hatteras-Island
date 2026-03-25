import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateLegendImages() {
  const legends = [
    {
      name: "Bull Hooper",
      prompt: "A legendary, strong islander man with a weathered face, standing on a Hatteras beach at sunset, wearing a classic fisherman's sweater, looking out at the Atlantic Ocean, cinematic lighting, realistic style, Outer Banks atmosphere."
    },
    {
      name: "The Keeper of the Light",
      prompt: "A ghostly, ethereal figure of an old lighthouse keeper in a 19th-century uniform, holding a glowing lantern, standing on the balcony of the black-and-white striped Cape Hatteras Lighthouse during a storm, lightning in the background, atmospheric, mystical."
    },
    {
      name: "The Ghost of the Lost Colony",
      prompt: "A mysterious, translucent figure of an Elizabethan-era settler woman walking through a dense, mossy maritime forest on Roanoke Island, dappled sunlight, eerie but beautiful, historical fantasy style."
    }
  ];

  for (const legend of legends) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: legend.prompt }]
        },
        config: {
          imageConfig: {
            aspectRatio: "16:9",
            imageSize: "1K"
          }
        }
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          console.log(`IMAGE_DATA:${legend.name}:${part.inlineData.data}`);
        }
      }
    } catch (error) {
      console.error(`Error generating image for ${legend.name}:`, error);
    }
  }
}

generateLegendImages();
