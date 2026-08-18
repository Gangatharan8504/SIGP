const Groq = require("groq-sdk");

let groqClient = null;

const getGroqClient = () => {
  if (!groqClient && process.env.GROQ_API_KEY) {
    try {
      groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
    } catch (e) {
      console.warn("Groq init failed:", e.message);
    }
  }
  return groqClient;
};

module.exports = {
  getGroqClient,
};
