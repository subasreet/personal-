import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google GenAI client lazily if key is available
let genAiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!genAiClient) {
    genAiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAiClient;
}

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    aiConfigured: Boolean(process.env.GEMINI_API_KEY),
  });
});

// AI Chatbot endpoint
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { messages, userContext } = req.body;
    const ai = getGenAI();

    const systemInstruction = `You are "Aura", an empathetic, expert, and proactive AI Personal Care Manager.
Your role is to help users holistically manage their personal care, daily wellness routines, health habits, medications, mental well-being, and work-life harmony.
Always be encouraging, calm, practical, and structured.

User Context:
- Active Tasks: ${JSON.stringify(userContext?.tasks || [])}
- Care Projects/Pillars: ${JSON.stringify(userContext?.projects || [])}
- Today's Completion Rate: ${userContext?.completionRate || 0}%
- Current User Focus: ${userContext?.currentEnergy || "Normal"} energy level

Guidelines:
1. Provide actionable advice for personal care and wellness routines.
2. If the user asks to add or organize tasks, suggest clear structured task items with title, project name, priority (Urgent, High, Medium, Low), estimated duration (in minutes), and timeOfDay (Morning, Afternoon, Evening, Anytime).
3. If they ask for prioritization, explain how to sequence care actions without overwhelm.
4. If they ask for a summary, celebrate their small wins and offer gentle guidance.
5. Keep responses concise, well-formatted with markdown bullet points, and free of medical disclaimers unless discussing serious clinical symptoms.`;

    if (!ai) {
      // Intelligent fallback when API key is pending configuration
      const lastUserMsg = messages[messages.length - 1]?.content || "";
      let fallbackReply = `I'm here as your Personal Care Assistant! `;
      
      if (lastUserMsg.toLowerCase().includes("prioriti") || lastUserMsg.toLowerCase().includes("urgent")) {
        fallbackReply += `Here is a recommended priority flow for your day:\n\n1. **Essential Self-Care**: Start with hydration, morning medication, or mindful breathing.\n2. **High-Impact Habits**: Focus on your core movement or high-priority care task while energy is steady.\n3. **Rest & Recovery**: Reserve evening time for wind-down hygiene and screen-free unwinding.`;
      } else if (lastUserMsg.toLowerCase().includes("summar") || lastUserMsg.toLowerCase().includes("progress")) {
        fallbackReply += `Here is your current care overview:\n\n- You have ${userContext?.tasks?.length || 4} active care tasks tracked across ${userContext?.projects?.length || 3} pillars.\n- Consistent routines build long-term momentum! Focus on closing one task in your highest priority bracket today.`;
      } else {
        fallbackReply += `To help you organize today, try identifying your top non-negotiable self-care item (e.g. 20 min walk, medication, or hydration). Would you like me to suggest a balanced daily routine for your morning or evening?`;
      }

      return res.json({
        reply: fallbackReply,
        source: "local-fallback",
      });
    }

    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || "I'm here to support your self-care journey. What would you like to focus on next?";
    return res.json({ reply, source: "gemini" });
  } catch (error: any) {
    console.error("AI Chat error:", error);
    return res.status(500).json({
      error: "Unable to process AI request",
      details: error?.message || "Unknown error",
    });
  }
});

// AI Auto-Prioritize Tasks
app.post("/api/ai/prioritize", async (req, res) => {
  try {
    const { tasks, energyLevel, availableTime } = req.body;
    const ai = getGenAI();

    if (!ai) {
      // Fallback smart prioritization
      const prioritized = (tasks || []).map((task: any, index: number) => {
        let recommendedPriority = task.priority;
        let reasoning = "Balanced priority based on standard self-care cadence.";
        if (task.timeOfDay === "Morning" || task.tags?.includes("health") || task.tags?.includes("medication")) {
          recommendedPriority = "Urgent";
          reasoning = "Morning health and vital routines take highest precedence.";
        } else if (energyLevel === "Low" && (task.durationMinutes || 15) > 30) {
          recommendedPriority = "Low";
          reasoning = "Deferred to match your lower energy window today.";
        } else if (index % 2 === 0) {
          recommendedPriority = "High";
          reasoning = "Great middle-of-the-day grounding action.";
        }
        return {
          id: task.id,
          priority: recommendedPriority,
          reasoning,
        };
      });

      return res.json({
        prioritized,
        overview: `Adjusted priorities for ${energyLevel || "standard"} energy level and ${availableTime || "open"} time budget. High-leverage self-care actions are anchored first.`,
        source: "local-fallback",
      });
    }

    const prompt = `Analyze these personal care tasks and re-prioritize them based on user energy level: "${energyLevel || "Normal"}" and available time: "${availableTime || "Normal"}".
Tasks to evaluate:
${JSON.stringify(tasks, null, 2)}

Return a valid JSON response with this exact structure:
{
  "overview": "A 2-sentence encouraging summary of the prioritization strategy",
  "prioritized": [
    {
      "id": "task_id_here",
      "priority": "Urgent" | "High" | "Medium" | "Low",
      "reasoning": "1 short sentence explaining why"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.3,
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({
      ...parsed,
      source: "gemini",
    });
  } catch (error: any) {
    console.error("AI Prioritize error:", error);
    return res.status(500).json({ error: "Failed to prioritize tasks", details: error?.message });
  }
});

// AI Progress Summary
app.post("/api/ai/summarize", async (req, res) => {
  try {
    const { stats, completedTasks, pendingTasks, streakDays } = req.body;
    const ai = getGenAI();

    if (!ai) {
      return res.json({
        summary: `Great work maintaining a **${streakDays || 1}-day self-care consistency streak**! You have completed **${completedTasks?.length || 0}** care items recently, with **${pendingTasks?.length || 0}** remaining in your plan.`,
        keyWins: [
          "Maintained regular routine adherence",
          "Dedicated time to physical and mental wellness",
          "Kept health tracking up to date",
        ],
        nextSteps: [
          "Complete your evening wind-down routine 45 mins before sleep",
          "Log your hydration and check tomorrow's morning medication",
          "Celebrate today's consistent care momentum",
        ],
        careScore: 88,
        source: "local-fallback",
      });
    }

    const prompt = `You are an executive personal care analyst. Evaluate the following personal care metrics and generate an inspiring, polished progress summary.
Stats: ${JSON.stringify(stats)}
Streak Days: ${streakDays}
Completed Tasks: ${JSON.stringify(completedTasks)}
Pending Tasks: ${JSON.stringify(pendingTasks)}

Return a valid JSON response with this exact schema:
{
  "summary": "2-3 sentences praising effort and highlighting care consistency",
  "keyWins": ["Win 1", "Win 2", "Win 3"],
  "nextSteps": ["Action step 1", "Action step 2", "Action step 3"],
  "careScore": number (0-100 score reflecting balance and completion)
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.4,
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({
      ...parsed,
      source: "gemini",
    });
  } catch (error: any) {
    console.error("AI Summarize error:", error);
    return res.status(500).json({ error: "Failed to summarize progress", details: error?.message });
  }
});

// AI Generate Routine / New Tasks
app.post("/api/ai/generate-routine", async (req, res) => {
  try {
    const { goal, targetPillar } = req.body;
    const ai = getGenAI();

    if (!ai) {
      return res.json({
        projectName: targetPillar || "Mindful Wellness Ritual",
        description: `Custom curated routine designed for: "${goal || "General Well-being"}"`,
        tasks: [
          {
            title: "Morning Sunlight & Hydration",
            description: "Drink 500ml water and get 10 minutes of direct morning sunlight.",
            priority: "High",
            durationMinutes: 10,
            timeOfDay: "Morning",
            tags: ["Hydration", "Sunlight", "Circadian"],
          },
          {
            title: "Mid-day Neck & Spine Mobility",
            description: "5 minutes of neck rolls, shoulder shrugs, and gentle back extensions.",
            priority: "Medium",
            durationMinutes: 5,
            timeOfDay: "Afternoon",
            tags: ["Movement", "Ergonomics"],
          },
          {
            title: "Evening Digital Sunset",
            description: "Dim lights and stow away blue-light screens 45 minutes before sleep.",
            priority: "High",
            durationMinutes: 45,
            timeOfDay: "Evening",
            tags: ["Sleep", "Recovery"],
          },
        ],
        source: "local-fallback",
      });
    }

    const prompt = `Generate a realistic, highly effective self-care routine for the goal: "${goal}" in pillar: "${targetPillar || "Self-Care"}".
Return valid JSON:
{
  "projectName": "Name of the routine/care project",
  "description": "Brief description of the health/care benefits",
  "tasks": [
    {
      "title": "Clear action title",
      "description": "Short explanation",
      "priority": "Urgent" | "High" | "Medium" | "Low",
      "durationMinutes": number,
      "timeOfDay": "Morning" | "Afternoon" | "Evening" | "Anytime",
      "tags": ["Tag1", "Tag2"]
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.5,
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({
      ...parsed,
      source: "gemini",
    });
  } catch (error: any) {
    console.error("AI Routine error:", error);
    return res.status(500).json({ error: "Failed to generate routine", details: error?.message });
  }
});

// Vite middleware & Static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Personal Care Manager server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
