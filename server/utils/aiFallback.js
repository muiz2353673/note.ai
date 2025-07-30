// Fallback AI responses when OpenAI quota is exceeded
const fallbackResponses = {
  summarize: (content) => {
    // Simple text summarization fallback
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const keyWords = content.toLowerCase().match(/\b\w+\b/g) || [];
    const wordFreq = {};
    
    keyWords.forEach(word => {
      if (word.length > 3) {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      }
    });
    
    const topWords = Object.entries(wordFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([word]) => word);
    
    const summary = sentences.slice(0, 3).join('. ') + '.';
    
    return {
      summary: `📝 **AI Summary (Fallback Mode)**\n\n${summary}\n\n**Key Concepts:** ${topWords.join(', ')}\n\n*Note: This is a simplified summary due to AI service limits. Upgrade your plan for enhanced AI features.*`,
      model: "fallback",
      isFallback: true
    };
  },

  flashcards: (content) => {
    // Generate simple flashcards from content
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
    const flashcards = sentences.slice(0, 5).map((sentence, index) => ({
      question: `What is the main point of statement ${index + 1}?`,
      answer: sentence.trim(),
      difficulty: "medium"
    }));
    
    return {
      flashcards,
      model: "fallback",
      isFallback: true
    };
  },

  assignment: (topic, requirements) => {
    // Provide basic assignment guidance
    const guidance = `📚 **Assignment Help (Fallback Mode)**

**Topic:** ${topic}

**Basic Structure:**
1. Introduction
   - Hook the reader
   - Present your thesis
   - Outline main points

2. Body Paragraphs
   - Topic sentence
   - Supporting evidence
   - Analysis and explanation

3. Conclusion
   - Restate thesis
   - Summarize main points
   - Final thoughts

**Writing Tips:**
- Use clear, concise language
- Support claims with evidence
- Maintain logical flow
- Proofread carefully

*Note: This is basic guidance due to AI service limits. Upgrade your plan for detailed, personalized assistance.*`;

    return {
      assignmentHelp: guidance,
      model: "fallback",
      isFallback: true
    };
  },

  cite: (title, authors, year, style = "APA") => {
    // Generate basic citations
    const citations = {
      APA: `${authors || "Unknown"}. (${year || "n.d."}). ${title}.`,
      MLA: `${authors || "Unknown"}. "${title}." ${year || "n.d."}.`,
      Chicago: `${authors || "Unknown"}. "${title}." ${year || "n.d."}.`,
      Harvard: `${authors || "Unknown"} (${year || "n.d."}) ${title}.`
    };
    
    return {
      citation: citations[style] || citations.APA,
      model: "fallback",
      isFallback: true
    };
  }
};

module.exports = fallbackResponses; 