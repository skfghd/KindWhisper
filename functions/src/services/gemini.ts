import { GoogleGenAI } from "@google/genai";

// API Key 보안 검증
function validateApiKey(): string {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }
  
  if (apiKey.length < 10) {
    throw new Error("Invalid GEMINI_API_KEY format");
  }
  
  console.log("Gemini API initialized with key: " + "*".repeat(8) + "..." + apiKey.slice(-4));
  
  return apiKey;
}

const ai = new GoogleGenAI({ apiKey: validateApiKey() });

export interface EmotionalAnalysis {
  emotion: string;
  intensity: number;
  context: string;
}

export interface TranslationResult {
  translatedText: string;
  emotionalAnalysis: EmotionalAnalysis;
  heartInterpretation: string;
}

export async function analyzeEmotion(koreanText: string): Promise<EmotionalAnalysis> {
  try {
    const systemPrompt = `You are an expert in Korean emotional analysis. 
Analyze the emotional tone and context of the Korean text.
Respond with JSON in this format:
{
  "emotion": "specific emotion in Korean (e.g., 기쁨, 슬픔, 화남, 걱정, 애정, 고마움)",
  "intensity": number between 1-10,
  "context": "brief description of emotional context in Korean"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            emotion: { type: "string" },
            intensity: { type: "number" },
            context: { type: "string" },
          },
          required: ["emotion", "intensity", "context"],
        },
      },
      contents: koreanText,
    });

    const rawJson = response.text;
    if (rawJson) {
      const data: EmotionalAnalysis = JSON.parse(rawJson);
      return data;
    } else {
      throw new Error("Empty response from Gemini");
    }
  } catch (error) {
    console.error("Emotion analysis failed: Service temporarily unavailable");
    return {
      emotion: "중립",
      intensity: 5,
      context: "감정 분석을 수행할 수 없습니다",
    };
  }
}

export async function translateWithEmotion(
  koreanText: string,
  emotionalAnalysis: EmotionalAnalysis
): Promise<string> {
  try {
    const prompt = `다음 한국어 문장을 부드럽고 다정한 표현으로 한 문장으로 바꿔주세요.

원본: "${koreanText}"
감정: ${emotionalAnalysis.emotion} (강도: ${emotionalAnalysis.intensity}/10)

규칙:
- 거친 말은 따뜻한 말로 바꾸기
- 화내는 말은 걱정하는 말로 바꾸기  
- 명령하는 말은 부탁하는 말로 바꾸기
- 설명이나 옵션 없이 오직 한 문장만 답변

예시:
입력: "그렇게밖에 못하겠냐?"
출력: 네 능력이라면 더 잘할 수 있을 텐데

입력: "짜증나"  
출력: 마음이 많이 힘들구나

다정한 한 문장으로만 답변하세요:`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text || "Translation failed";
  } catch (error) {
    console.error("Translation failed: Service temporarily unavailable");
    return "Translation service is currently unavailable";
  }
}

async function generateHeartInterpretation(koreanText: string, emotionalAnalysis: EmotionalAnalysis): Promise<string> {
  try {
    const prompt = `다음 한국어 문장의 마음을 한 줄로 해석해주세요.
표면적인 말이 아닌, 그 말 속에 담긴 진정한 마음과 감정을 따뜻하게 해석해주세요.

원본 문장: "${koreanText}"
감지된 감정: ${emotionalAnalysis.emotion} (강도: ${emotionalAnalysis.intensity}/10)

예시:
- "지친 마음이 내게 쏟아졌지만, 그 말이 곧 진심은 아니에요."
- "힘든 하루를 보낸 마음이 잠깐 거칠어진 것 같아요."
- "사랑하는 마음이 걱정으로 표현된 것 같네요."

한 줄로 마음의 해석만 제공해주세요.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text || "마음을 이해하려 노력하고 있어요.";
  } catch (error) {
    console.error("Heart interpretation failed: Service temporarily unavailable");
    return "마음을 이해하려 노력하고 있어요.";
  }
}

export async function translateKoreanToEnglish(koreanText: string): Promise<TranslationResult> {
  const emotionalAnalysis = await analyzeEmotion(koreanText);
  const translatedText = await translateWithEmotion(koreanText, emotionalAnalysis);
  const heartInterpretation = await generateHeartInterpretation(koreanText, emotionalAnalysis);
  
  return {
    translatedText,
    emotionalAnalysis,
    heartInterpretation,
  };
}