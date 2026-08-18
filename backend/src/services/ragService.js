const RAGDocument = require("../models/RAGDocument");
const RAGChunk = require("../models/RAGChunk");
const { getGroqClient } = require("../config/ai");

/**
 * Ingests a text document, splits into semantically coherent chunks, and indexes them
 */
const ingestDocument = async ({ title, facultyId, courseId, fileName, fileType, textContent, department, subject }) => {
  const cleanText = textContent.replace(/\r\n/g, "\n");
  const paragraphs = cleanText.split("\n\n").filter((p) => p.trim().length > 30);

  const doc = await RAGDocument.create({
    title,
    facultyId,
    courseId,
    fileName,
    fileType: fileType || "PDF",
    totalChunks: paragraphs.length,
    department: department || "Computer Science and Engineering",
    subject: subject || "Data Structures & Algorithms",
  });

  const chunksToInsert = paragraphs.map((para, idx) => {
    // Extract key technical tokens
    const words = para.match(/\b[A-Za-z0-9+#.-]{3,}\b/g) || [];
    const uniqueKeywords = Array.from(new Set(words.slice(0, 15)));

    return {
      documentId: doc._id,
      chunkIndex: idx + 1,
      content: para.trim(),
      keywords: uniqueKeywords,
      sourceCitation: `${title} - Section ${idx + 1}`,
      department: doc.department,
      subject: doc.subject,
    };
  });

  if (chunksToInsert.length > 0) {
    await RAGChunk.insertMany(chunksToInsert);
  }

  return doc;
};

/**
 * Semantic/Text RAG search with grounded LLM generation
 */
const queryRAGKnowledge = async ({ query, department, subject }) => {
  const groq = getGroqClient();

  // Search relevant chunks
  const keywords = query.toLowerCase().split(" ").filter((w) => w.length > 3);
  let filter = {};
  if (keywords.length > 0) {
    filter.$or = [
      { content: { $regex: keywords.join("|"), $options: "i" } },
      { keywords: { $in: keywords } },
    ];
  }

  const matchingChunks = await RAGChunk.find(filter).limit(4);

  if (matchingChunks.length === 0) {
    return {
      answer: "I could not find this information in the approved SGIP learning material.",
      citations: [],
      grounded: false,
    };
  }

  const contextText = matchingChunks
    .map((c, i) => `[Source ${i + 1}: ${c.sourceCitation}]\n${c.content}`)
    .join("\n\n");

  const citations = matchingChunks.map((c) => c.sourceCitation);

  if (groq) {
    const candidateModels = [
      "openai/gpt-oss-120b",
      "openai/gpt-oss-20b",
      "groq/compound-mini",
      "qwen/qwen3.6-27b",
    ];

    const prompt = `You are the SGIP Academic RAG Assistant. Answer the question using ONLY the provided course material chunks.
Do NOT invent facts. If the answer cannot be found in the context, respond strictly: "I could not find this information in the approved SGIP learning material."

Context:
"""
${contextText}
"""

Question: ${query}

Provide a concise, grounded explanation with source citations:`;

    for (const model of candidateModels) {
      try {
        const chatCompletion = await groq.chat.completions.create({
          messages: [
            { role: "system", content: "You are a factual academic AI assistant. Only use the provided context." },
            { role: "user", content: prompt },
          ],
          model,
          temperature: 0.1,
        });

        let answer = chatCompletion.choices[0]?.message?.content || "";
        answer = answer.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();

        if (answer) {
          return {
            answer,
            citations,
            grounded: true,
          };
        }
      } catch (err) {
        console.warn(`[Groq RAG] Model '${model}' failed:`, err.message);
      }
    }
  }

  // Fallback direct extraction
  return {
    answer: `According to course materials (${citations[0]}):\n\n${matchingChunks[0].content}`,
    citations,
    grounded: true,
  };
};

module.exports = {
  ingestDocument,
  queryRAGKnowledge,
};
