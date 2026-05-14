/* agents/chatAgent.js */
/**
 * Smart Chatbot – Powered by Google Gemini API with free AI fallback.
 * Tries Gemini first. If key is missing or invalid, falls back to free Pollinations AI.
 * Handles queries in ALL languages.
 */
const mongoose = require('mongoose');
const Product = require('../models/Product');
const https = require('https');

// Try to load Google Gemini SDK
let genAI = null;
try {
  const { GoogleGenerativeAI } = require('@google/generative-ai');
  if (process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    console.log('[ChatAgent] Google Gemini API key detected.');
  }
} catch (e) {
  console.log('[ChatAgent] Google Gemini SDK not available, using free fallback.');
}

// ---- METHOD 1: Google Gemini API ----
async function fetchFromGemini(message) {
  if (!genAI) return null;
  
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const systemInstruction = "You are a helpful and wise spiritual guide for the Rudrakrit e-commerce platform that sells Rudraksha malas, Sphatik malas, Parad items etc. Answer in the SAME language the user writes in. Keep answers concise (under 150 words), respectful, and helpful.";
    
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: `${systemInstruction}\n\nUser: ${message}` }] }]
    });
    const response = await result.response;
    const text = response.text();
    if (text && text.trim().length > 0) return text;
    return null;
  } catch (error) {
    console.error("[ChatAgent] Gemini failed:", error.message);
    return null; // Fall through to free fallback
  }
}

// ---- METHOD 2: Free Pollinations AI Fallback (no key needed) ----
function fetchFromFreeAI(message) {
  return new Promise((resolve) => {
    const systemPrompt = "You are a helpful spiritual guide for Rudrakrit e-commerce (sells Rudraksha, Sphatik malas, Parad items). Answer in the SAME language the user writes in. Keep answers concise (under 150 words).";
    const url = `https://text.pollinations.ai/${encodeURIComponent(message)}?system=${encodeURIComponent(systemPrompt)}&model=openai`;
    
    const req = https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (data && data.trim().length > 0) {
          resolve(data.trim());
        } else {
          resolve(null);
        }
      });
    });
    req.on('error', () => resolve(null));
    // Timeout after 15 seconds
    req.setTimeout(15000, () => { req.destroy(); resolve(null); });
  });
}

/**
 * Main public API – processes a user message and returns a response string.
 */
async function processMessage(message, sessionId) {
  // Log interaction (fire and forget)
  try {
    const Feedback = require('../agents/feedbackAgent');
    Feedback.logInteraction('chat', null, sessionId, { message });
  } catch (e) { /* ignore logging errors */ }

  const lower = message.toLowerCase().trim();

  // 1. Direct Product Search Intent
  if (lower.includes('show') || lower.includes('buy') || lower.includes('product') || lower.match(/(\d+)\s*mukhi/)) {
    const mukhiMatch = message.match(/(\d+)\s*mukhi/i);
    const query = mukhiMatch ? { name: new RegExp(mukhiMatch[1], 'i') } : {};
    const products = await Product.find(query).limit(5);
    if (products.length) {
      const list = products.map(p => `• ${p.name} – ₹${p.price}`).join('\n');
      return `Here are some sacred items we have:\n${list}\n\nClick 'Shop' to see more!`;
    }
  }

  // 2. Try Google Gemini first
  const geminiAnswer = await fetchFromGemini(message);
  if (geminiAnswer) {
    console.log('[ChatAgent] Replied via Google Gemini');
    return geminiAnswer;
  }

  // 3. Free AI Fallback (always works, no key needed)
  console.log('[ChatAgent] Gemini unavailable, using free AI fallback...');
  const freeAnswer = await fetchFromFreeAI(message);
  if (freeAnswer) {
    return freeAnswer;
  }

  // 4. Ultimate static fallback
  return "Namaste! I'm currently experiencing high traffic. Please try asking your question again in a moment. 🙏";
}

module.exports = { processMessage };
