
import { GoogleGenAI, Modality, Type } from "@google/genai";
import { BibleParagraph, SituationResult, GloryInsight, DevotionalContent, KingdomStrategy } from "../types";

// Helper to handle retries and specific API errors (429/500s)
const executeWithGrace = async <T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> => {
  try {
    return await fn();
  } catch (error: any) {
    const isQuotaError = error?.message?.includes('429') || 
                         error?.message?.includes('RESOURCE_EXHAUSTED') ||
                         error?.status === 429;
    
    if (isQuotaError) {
      console.warn("Sanctuary Quota Exhausted. Entering Sacred Rest.");
      throw new Error("QUOTA_EXHAUSTED");
    }

    if (retries > 0 && (error?.status === 500 || error?.status === 503)) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return executeWithGrace(fn, retries - 1, delay * 2);
    }
    throw error;
  }
};

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getKingdomStrategy = async (careerGoal: string, userName: string): Promise<KingdomStrategy> => {
  return executeWithGrace(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `User ${userName} is a professional/entrepreneur pursuing: "${careerGoal}". 
      Generate a 'Kingdom Marketplace Strategy' based on Joseph/Daniel principles.
      Return JSON with:
      1. mandate: A high-level vision statement.
      2. pillars: Array of 3 objects {title, action} representing the strategic implementation.
      3. propheticDeclaration: A bold scriptural confession for the marketplace.
      4. blueprintPrompt: A detailed prompt for an image generator to create a "Sacred Architectural Blueprint" of this vision.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            mandate: { type: Type.STRING },
            pillars: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  action: { type: Type.STRING }
                }
              }
            },
            propheticDeclaration: { type: Type.STRING },
            blueprintPrompt: { type: Type.STRING }
          },
          required: ["mandate", "pillars", "propheticDeclaration", "blueprintPrompt"]
        }
      }
    });
    return JSON.parse(response.text || '{}');
  });
};

export const generateBlueprintImage = async (prompt: string): Promise<string> => {
  return executeWithGrace(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [
          { text: `A high-end architectural blueprint in ethereal white ink on a deep navy parchment, cinematic lighting, sacred geometry, marketplace success concept, 4K resolution: ${prompt}` }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9",
          imageSize: "1K"
        }
      }
    });
    
    const imagePart = response.candidates[0].content.parts.find(p => p.inlineData);
    if (!imagePart) throw new Error("Divine Image failed to manifest.");
    return `data:image/png;base64,${imagePart.inlineData.data}`;
  });
};

export const getGloryScroll = async (userName: string): Promise<GloryInsight[]> => {
  return executeWithGrace(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Generate a 'Daily Glory Scroll' for ${userName}. 
      Return exactly 3 insights in a JSON array:
      1. WORD: A deep scriptural revelation.
      2. WALK: A practical daily challenge for spiritual growth.
      3. WEALTH: A marketplace mandate regarding career, integrity, or financial stewardship.
      Format as JSON array with keys: 'category', 'title', 'content', 'verse'.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              category: { type: Type.STRING, enum: ['WORD', 'WALK', 'WEALTH'] },
              title: { type: Type.STRING },
              content: { type: Type.STRING },
              verse: { type: Type.STRING }
            },
            required: ["category", "title", "content", "verse"]
          }
        }
      }
    });
    return JSON.parse(response.text || '[]');
  });
};

export const getSituationMotivation = async (situation: string): Promise<SituationResult> => {
  return executeWithGrace(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `The user is facing this situation: "${situation}". 
      1. Analysis: How God views this struggle (3 sentences).
      2. Miracle Story: A credible modern or biblical testimony (150 words).
      3. Narrative: A compelling, immersive short story (300 words) that simulates a character going through this and finding a miracle. Use vivid, cinematic descriptions.
      Format as JSON with keys 'analysis', 'miracleStory', and 'narrative'.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analysis: { type: Type.STRING },
            miracleStory: { type: Type.STRING },
            narrative: { type: Type.STRING }
          },
          required: ["analysis", "miracleStory", "narrative"]
        }
      }
    });
    return JSON.parse(response.text || '{}');
  });
};

export const generateConfession = async (category: string, name: string): Promise<string> => {
  return executeWithGrace(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Create a first-person biblical confession based on Charles Capps' 'Creative Power of Words' theology for the category: "${category}". 
      Personalize it for: "${name}". Focus on speaking the Word over reality to release faith.`,
    });
    return response.text || "";
  });
};

export const verifyScriptureAccuracy = async (claim: string): Promise<{ isAligned: boolean, reasoning: string, references: string[] }> => {
  return executeWithGrace(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Acting as a Berean scholar, analyze this theological claim: "${claim}". Compare it with biblical text. 
      Format as JSON with keys 'isAligned' (boolean), 'reasoning' (string), and 'references' (array of strings).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isAligned: { type: Type.BOOLEAN },
            reasoning: { type: Type.STRING },
            references: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["isAligned", "reasoning", "references"]
        }
      }
    });
    return JSON.parse(response.text || '{}');
  });
};

export const generateInstanceVideo = async (prompt: string): Promise<string> => {
  return executeWithGrace(async () => {
    const ai = getAI();
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: `A cinematic, spiritually uplifting simulation of this scene: ${prompt}. High resolution, 1080p, slow motion, ethereal lighting, holy atmosphere.`,
      config: {
        numberOfVideos: 1,
        resolution: '1080p',
        aspectRatio: '16:9'
      }
    });

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({operation: operation});
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) throw new Error("Video generation failed.");
    return `${downloadLink}&key=${process.env.API_KEY}`;
  });
};

export const fetchBibleParagraphs = async (book: string, chapter: number, version: string): Promise<BibleParagraph[]> => {
  return executeWithGrace(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide the full text of ${book} Chapter ${chapter} in the ${version} version. Group the verses into logical "paragraphs". Provide a short 2-sentence interpretation for each. Format as JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              verses: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    ref: { type: Type.STRING },
                    text: { type: Type.STRING }
                  },
                  required: ["ref", "text"]
                }
              },
              interpretation: { type: Type.STRING }
            },
            required: ["verses", "interpretation"]
          }
        }
      },
    });
    try { return JSON.parse(response.text || '[]'); } catch (e) { return []; }
  });
};

export const generateAIPrayer = async (request: string): Promise<string> => {
  return executeWithGrace(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a heartfelt, scripture-based Christian prayer for: "${request}".`,
    });
    return response.text || "";
  });
};

export const generatePersonalizedPrayer = async (params: any): Promise<string> => {
  return executeWithGrace(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Pastor AI: Pray for ${params.userName} regarding ${params.purpose}. Context: ${params.familyDetails || 'General'}. Intended for: ${params.intendedFor || 'Self'}.`,
    });
    return response.text || "";
  });
};

export const generateSpeech = async (text: string): Promise<string> => {
  return executeWithGrace(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || "";
  });
};

export const generateWallpaper = async (verse: string): Promise<string> => {
  return executeWithGrace(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: `Spiritual wallpaper: ${verse}` }] },
      config: { imageConfig: { aspectRatio: "9:16" } }
    });
    return `data:image/png;base64,${response.candidates[0].content.parts.find(p => p.inlineData)?.inlineData?.data || ''}`;
  });
};

export const getAIChaplainAdviceExtended = async (q: string, imageBase64?: string): Promise<{ text: string; sources?: { title: string; uri: string }[] }> => {
  return executeWithGrace(async () => {
    const ai = getAI();
    const parts: any[] = [{ text: q || "Share your wisdom with me." }];

    if (imageBase64) {
      parts.push({
        inlineData: {
          data: imageBase64.split(',')[1],
          mimeType: 'image/jpeg'
        }
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts },
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.filter(chunk => chunk.web)
      .map(chunk => ({ title: chunk.web?.title || 'Resource', uri: chunk.web?.uri || '' })) || [];

    return {
      text: response.text || "",
      sources: sources.length > 0 ? sources : undefined
    };
  });
};

export const getDailyVerseInsights = async (v: string): Promise<DevotionalContent> => {
  return executeWithGrace(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a highly structured, high-authority Christian devotional for this verse: "${v}". 
      Return JSON with these exact keys:
      1. opening: A concise 2-sentence context.
      2. pillars: An array of 3 objects with {title, detail} (Speak It, Think It, Do It).
      3. promise: A single powerful sentence on the result.
      4. application: An array of 2 punchy action items.
      5. prayer: A short 2-sentence sealing prayer.
      Keep language sophisticated and evocative.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            opening: { type: Type.STRING },
            pillars: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  detail: { type: Type.STRING }
                },
                required: ["title", "detail"]
              }
            },
            promise: { type: Type.STRING },
            application: { type: Type.ARRAY, items: { type: Type.STRING } },
            prayer: { type: Type.STRING }
          },
          required: ["opening", "pillars", "promise", "application", "prayer"]
        }
      }
    });
    return JSON.parse(response.text || '{}');
  });
};
