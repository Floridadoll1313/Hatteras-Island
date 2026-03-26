import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateAppIcon() {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: 'A modern, minimalist app icon for a Hatteras Island travel app. The icon features a stylized, elegant silhouette of the black-and-white spiral-striped Cape Hatteras Lighthouse. Behind the lighthouse, a single, powerful ocean wave curls gracefully. The color palette uses deep navy blue, crisp white, and a touch of warm sunset orange in the background. High contrast, clean lines, professional design, vector style, rounded corners, centered composition.',
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/png',
        aspectRatio: '1:1',
      },
    });

    const base64Image = response.generatedImages[0].image.imageBytes;
    console.log("Generated Image (Base64):", base64Image.substring(0, 100) + "...");
    // In a real app, we'd save this or return it to the UI.
    return `data:image/png;base64,${base64Image}`;
  } catch (error) {
    console.error("Error generating app icon:", error);
  }
}

generateAppIcon();
