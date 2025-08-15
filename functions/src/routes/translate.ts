import { Router } from "express";
import { z } from "zod";
import { translateKoreanToEnglish } from "../services/gemini";
import { storage } from "../services/firestore";
import { secureLog, checkRateLimit } from "../middleware/security";
import { getTodayDate, fallbackTranslation, getRandomCuteExhaustedMessage } from "../utils/translation";

const router = Router();

const translateRequestSchema = z.object({
  koreanText: z.string().min(1).max(500)
});

router.post('/', async (req, res) => {
  try {
    // Rate limiting
    const clientIP = req.ip || 'unknown';
    if (!checkRateLimit(clientIP)) {
      return res.status(429).json({ error: "Too many requests" });
    }

    const { koreanText } = translateRequestSchema.parse(req.body);
    
    // Check daily usage capacity
    const today = getTodayDate();
    const dailyUsage = await storage.getDailyUsage(today);
    const usersCount = dailyUsage?.usersCount || 0;
    const maxUsers = dailyUsage?.maxUsers || 125;
    const hasCapacity = usersCount < maxUsers;
    
    let translation;
    let emotionalFocus;
    let heartInterpretation;
    let usedAI = false;
    let capacityExhausted = false;
    
    if (hasCapacity && process.env.GEMINI_API_KEY) {
      try {
        // Use Gemini AI Korean reexpression
        const result = await translateKoreanToEnglish(koreanText);
        
        translation = result.translatedText;
        emotionalFocus = `${result.emotionalAnalysis.emotion} (강도: ${result.emotionalAnalysis.intensity}/10)`;
        heartInterpretation = result.heartInterpretation;
        usedAI = true;
        
        // Increment daily usage count
        await storage.incrementDailyUsage(today);
        
      } catch (aiError) {
        secureLog("Gemini translation failed: Service temporarily unavailable");
        const fallback = fallbackTranslation(koreanText);
        translation = fallback.translation;
        emotionalFocus = fallback.emotionalFocus;
        heartInterpretation = "마음을 이해하려 노력하고 있어요.";
      }
    } else {
      const fallback = fallbackTranslation(koreanText);
      translation = fallback.translation;
      emotionalFocus = fallback.emotionalFocus;
      heartInterpretation = "마음을 이해하려 노력하고 있어요.";
      capacityExhausted = !hasCapacity;
    }
    
    // Save translation
    await storage.createTranslation({
      koreanText,
      englishText: translation,
      emotionalFocus,
      usedAI
    });
    
    const response: any = {
      translation,
      emotionalFocus,
      heartInterpretation,
      usedAI,
      hasCapacity: hasCapacity && !!process.env.GEMINI_API_KEY,
      capacityExhausted,
      currentCount: usersCount,
      maxUsers
    };

    if (capacityExhausted) {
      response.cuteMessage = getRandomCuteExhaustedMessage();
    }

    res.json(response);
    
  } catch (error) {
    secureLog("Translation error: Service temporarily unavailable");
    res.status(500).json({ error: "Translation service temporarily unavailable" });
  }
});

export { router as translateRoutes };