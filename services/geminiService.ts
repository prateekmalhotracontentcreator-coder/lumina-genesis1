
import { GoogleGenAI, Modality, Type } from "@google/genai";
import { BibleParagraph, SituationResult, GloryInsight, DevotionalContent, KingdomStrategy } from "../types";
import { db, doc, getDoc, setDoc } from "./firebase";

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

// SOVEREIGN REGISTRY: In-Memory Cache for ultra-fast session navigation
const SOVEREIGN_REGISTRY = new Map<string, BibleParagraph[]>();

/**
 * ARCHITECT TOOL: Seed a specific chapter directly to the Archive.
 */
export const seedChapterToArchive = async (book: string, chapter: number, version: string): Promise<BibleParagraph[]> => {
  const cacheKey = `${book}-${chapter}-${version}`.toLowerCase();
  
  const paragraphs = await executeWithGrace(async () => {
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
    
    try { 
      return JSON.parse(response.text || '[]');
    } catch (e) { 
      return []; 
    }
  });

  if (paragraphs.length > 0) {
    try {
      await setDoc(doc(db, "bible_archives", cacheKey), {
        paragraphs,
        lastUpdated: Date.now(),
        verified: true,
        scribesRef: "ARCHITECT_INITIATED"
      });
      SOVEREIGN_REGISTRY.set(cacheKey, paragraphs);
    } catch (dbError: any) {
      SOVEREIGN_REGISTRY.set(cacheKey, paragraphs);
      if (dbError?.message?.includes('permission-denied') || dbError?.code === 'permission-denied') {
        throw dbError;
      }
    }
  }
  
  return paragraphs;
};

/**
 * Bible Paragraph Fetching with Project Manna Optimization.
 */
export const fetchBibleParagraphs = async (book: string, chapter: number, version: string): Promise<{ data: BibleParagraph[], source: 'MEMORY' | 'ARCHIVE' | 'LATTICE' }> => {
  const cacheKey = `${book}-${chapter}-${version}`.toLowerCase();
  
  if (SOVEREIGN_REGISTRY.has(cacheKey)) {
    return { data: SOVEREIGN_REGISTRY.get(cacheKey)!, source: 'MEMORY' };
  }

  try {
    const archiveRef = doc(db, "bible_archives", cacheKey);
    const archiveSnap = await getDoc(archiveRef);
    if (archiveSnap.exists()) {
      const archiveData = archiveSnap.data().paragraphs as BibleParagraph[];
      SOVEREIGN_REGISTRY.set(cacheKey, archiveData);
      return { data: archiveData, source: 'ARCHIVE' };
    }
  } catch (err: any) {
    if (err?.message?.includes('permission-denied')) throw err;
  }

  const result = await seedChapterToArchive(book, chapter, version);
  return { data: result, source: 'LATTICE' };
};

export const getKingdomStrategy = async (careerGoal: string, userName: string): Promise<KingdomStrategy> => {
  return executeWithGrace(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `User ${userName} is pursuing: "${careerGoal}". Generate a 'Kingdom Marketplace Strategy'. Return JSON.`,
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
                properties: { title: { type: Type.STRING }, action: { type: Type.STRING } }
              }
            },
            propheticDeclaration: { type: Type.STRING },
            blueprintPrompt: { type: Type.STRING }
          }
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
      contents: { parts: [{ text: `Architectural blueprint: ${prompt}` }] },
      config: { imageConfig: { aspectRatio: "16:9", imageSize: "1K" } }
    });
    const data = response.candidates[0].content.parts.find(p => p.inlineData)?.inlineData?.data;
    return `data:image/png;base64,${data}`;
  });
};

export const getGloryScroll = async (userName: string): Promise<GloryInsight[]> => {
  return executeWithGrace(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Daily Glory Scroll for ${userName}. Return 3 insights (WORD, WALK, WEALTH) as JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              category: { type: Type.STRING },
              title: { type: Type.STRING },
              content: { type: Type.STRING },
              verse: { type: Type.STRING }
            }
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
      contents: `Situation analysis for: "${situation}". JSON with keys: analysis, miracleStory, narrative.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analysis: { type: Type.STRING },
            miracleStory: { type: Type.STRING },
            narrative: { type: Type.STRING }
          }
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
      contents: `Scriptural confession for: "${category}" for ${name}.`,
    });
    return response.text || "";
  });
};

export const verifyScriptureAccuracy = async (claim: string): Promise<{ isAligned: boolean, reasoning: string, references: string[] }> => {
  return executeWithGrace(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Berean analysis of: "${claim}". JSON response.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isAligned: { type: Type.BOOLEAN },
            reasoning: { type: Type.STRING },
            references: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
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
      prompt: `Cinematic spiritual scene: ${prompt}`,
      config: { numberOfVideos: 1, resolution: '1080p', aspectRatio: '16:9' }
    });
    while (!operation.done) {
      await new Promise(r => setTimeout(r, 10000));
      operation = await ai.operations.getVideosOperation({operation});
    }
    return `${operation.response?.generatedVideos?.[0]?.video?.uri}&key=${process.env.API_KEY}`;
  });
};

export const generateAIPrayer = async (request: string): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Christian prayer for: "${request}".`,
  });
  return response.text || "";
};

export const generatePersonalizedPrayer = async (params: any): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Pray for ${params.userName} regarding ${params.purpose}.`,
  });
  return response.text || "";
};

export const generateSpeech = async (text: string): Promise<string> => {
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
};

export const generateWallpaper = async (verse: string): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [{ text: `Spiritual art: ${verse}` }] },
    config: { imageConfig: { aspectRatio: "9:16" } }
  });
  return `data:image/png;base64,${response.candidates[0].content.parts.find(p => p.inlineData)?.inlineData?.data || ''}`;
};

export const getAIChaplainAdviceExtended = async (q: string, img?: string): Promise<{ text: string; sources?: { title: string; uri: string }[] }> => {
  const ai = getAI();
  const parts: any[] = [{ text: q || "Wisdom." }];
  if (img) parts.push({ inlineData: { data: img.split(',')[1], mimeType: 'image/jpeg' } });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts },
    config: { tools: [{ googleSearch: {} }] }
  });
  const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
    ?.filter(c => c.web)
    .map(c => ({ title: c.web?.title || 'Resource', uri: c.web?.uri || '' })) || [];
  return { text: response.text || "", sources: sources.length > 0 ? sources : undefined };
};

export const getDailyVerseInsights = async (v: string): Promise<DevotionalContent> => {
  return executeWithGrace(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate devotional for: "${v}". JSON response required.`,
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
                properties: { title: { type: Type.STRING }, detail: { type: Type.STRING } },
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
