import { Router } from "express";
import { storage } from "../services/firestore";
import { secureLog } from "../middleware/security";
import { getTodayDate, getRandomCuteMessage } from "../utils/translation";

const router = Router();

router.get('/check', async (req, res) => {
  try {
    const today = getTodayDate();
    const dailyUsage = await storage.getDailyUsage(today);
    const usersCount = dailyUsage?.usersCount || 0;
    const maxUsers = dailyUsage?.maxUsers || 125;
    const hasCapacity = usersCount < maxUsers;

    res.json({
      hasCapacity: hasCapacity && !!process.env.GEMINI_API_KEY,
      usersCount,
      maxUsers,
      remaining: maxUsers - usersCount
    });
  } catch (error) {
    secureLog("Failed to check usage: Service temporarily unavailable");
    res.status(500).json({ error: "Service temporarily unavailable" });
  }
});

router.get('/cute-message', async (req, res) => {
  try {
    const message = getRandomCuteMessage();
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: "Failed to get cute message" });
  }
});

export { router as usageRoutes };