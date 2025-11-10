import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";

const parseDataUrl = (dataUrl: string): { mimeType: string; data: string } => {
  const matches = dataUrl.match(/^data:(.+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error("Invalid data URL format");
  }
  return { mimeType: matches[1], data: matches[2] };
};

export const generateImageMontage = async (
  image1DataUrl: string,
  image2DataUrl: string,
  prompt: string
): Promise<string> => {
  // Assume process.env.API_KEY is available
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const imagePart1 = {
      inlineData: parseDataUrl(image1DataUrl),
    };

    const imagePart2 = {
      inlineData: parseDataUrl(image2DataUrl),
    };
    
    const textPart = {
      text: prompt,
    };

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [imagePart1, imagePart2, textPart],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });
    
    // Find the first part that is an image
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData && part.inlineData.mimeType.startsWith('image/')) {
        return part.inlineData.data;
      }
    }

    throw new Error("No image was generated in the response.");

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate image: ${error.message}`);
    }
    throw new Error("An unexpected error occurred while generating the image.");
  }
};