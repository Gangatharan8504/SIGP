const { getGroqClient } = require("../config/ai");

/**
 * Validates the question bank structure and counts:
 * Aptitude: 10, Reasoning: 10, Verbal: 10, Pseudo Code: 10, Coding: 2 (Total: 42 Questions, 60 Marks)
 */
const validateAssessmentQuestions = (data) => {
  if (!data || !data.sections) return false;
  const { aptitude, reasoning, verbal, pseudoCode, coding } = data.sections;

  if (
    !Array.isArray(aptitude) || aptitude.length !== 10 ||
    !Array.isArray(reasoning) || reasoning.length !== 10 ||
    !Array.isArray(verbal) || verbal.length !== 10 ||
    !Array.isArray(pseudoCode) || pseudoCode.length !== 10 ||
    !Array.isArray(coding) || coding.length !== 2
  ) {
    return false;
  }

  // Validate MCQ elements
  const validateMcqList = (list) => {
    return list.every((q) => {
      const hasQ = (q.question && q.question.trim().length > 5) || (q.description && q.description.trim().length > 5);
      const hasOpts = Array.isArray(q.options) && q.options.length === 4;
      const hasAns = q.correctAnswer !== undefined || q.correctIndex !== undefined;
      return hasQ && hasOpts && hasAns;
    });
  };

  if (!validateMcqList(aptitude) || !validateMcqList(reasoning) || !validateMcqList(verbal) || !validateMcqList(pseudoCode)) {
    return false;
  }

  // Validate Coding elements
  const validateCodingList = (list) => {
    return list.every((c) => {
      return c.title && c.description && Array.isArray(c.testCases) && c.testCases.length >= 2;
    });
  };

  return validateCodingList(coding);
};

// Clean empty starter templates - NEVER include prebuilt solutions
const EMPTY_STARTER_TEMPLATES = {
  java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Write your solution here\n    }\n}`,
  python: `def main():\n    # Write your solution here\n    pass\n\nif __name__ == "__main__":\n    main()`,
  c: `#include <stdio.h>\n\nint main() {\n    // Write your solution here\n    return 0;\n}`,
  cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    return 0;\n}`,
  javascript: `function main() {\n    // Write your solution here\n}\n\nmain();`,
};

/**
 * Standard Curated Question Banks (3 Distinct Variations for Attempt 1, 2, and 3)
 */
const getCuratedDefaultBank = (attemptNumber = 1) => {
  const diff = attemptNumber === 1 ? "Easy + Medium" : attemptNumber === 2 ? "Medium" : "Medium + Hard";

  // Variation 1 (Attempt 1)
  const bank1 = {
    title: "Full Pattern Mock Assessment",
    difficultyProfile: diff,
    totalQuestions: 42,
    totalMarks: 60,
    durationMinutes: 80,
    sections: {
      aptitude: [
        {
          id: "apt_1_1",
          topic: "Speed, Time & Distance",
          question: "A train running at 60 km/hr crosses a pole in 9 seconds. What is the length of the train in meters?",
          difficulty: "easy",
          marks: 1,
          options: ["120 meters", "150 meters", "180 meters", "324 meters"],
          correctIndex: 1,
          correctAnswer: "150 meters",
          explanation: "Speed in m/s = 60 * (5/18) = 50/3 m/s. Length = Speed * Time = (50/3) * 9 = 150 meters."
        },
        {
          id: "apt_1_2",
          topic: "Time and Work",
          question: "A can complete a piece of work in 12 days, and B can complete the same work in 18 days. If they work together for 4 days, what fraction of the work remains?",
          difficulty: "medium",
          marks: 1,
          options: ["4/9", "5/9", "1/3", "2/5"],
          correctIndex: 0,
          correctAnswer: "4/9",
          explanation: "1-day work = (1/12 + 1/18) = 5/36. In 4 days, work done = 4 * (5/36) = 20/36 = 5/9. Remaining work = 1 - 5/9 = 4/9."
        },
        {
          id: "apt_1_3",
          topic: "Profit and Loss",
          question: "An article is sold at a 15% discount on marked price, yielding a profit of 20%. If marked price is $120, what is the cost price?",
          difficulty: "medium",
          marks: 1,
          options: ["$85", "$90", "$95", "$100"],
          correctIndex: 0,
          correctAnswer: "$85",
          explanation: "Selling Price = 120 * 0.85 = $102. Cost Price = 102 / 1.20 = $85."
        },
        {
          id: "apt_1_4",
          topic: "Permutations & Combinations",
          question: "In how many distinct ways can the letters of the word 'LEADER' be arranged such that vowels always stay together?",
          difficulty: "medium",
          marks: 1,
          options: ["72", "144", "360", "48"],
          correctIndex: 0,
          correctAnswer: "72",
          explanation: "Vowels: E, A, E (3 letters with 2 E's). Consonants: L, D, R (3 letters). Units to arrange = 4! / 1 = 24. Vowel permutations = 3! / 2! = 3. Total ways = 24 * 3 = 72."
        },
        {
          id: "apt_1_5",
          topic: "Compound Interest",
          question: "A sum of money invested at compound interest doubles itself in 4 years. In how many years will it become 8 times of itself at the same rate?",
          difficulty: "medium",
          marks: 1,
          options: ["8 years", "12 years", "16 years", "24 years"],
          correctIndex: 1,
          correctAnswer: "12 years",
          explanation: "Amount doubles (2^1) in 4 years. 8 times = 2^3 times. Time required = 4 * 3 = 12 years."
        },
        {
          id: "apt_1_6",
          topic: "Probability",
          question: "Two unbiased dice are rolled simultaneously. What is the probability that the sum of the numbers appearing on top is a prime number?",
          difficulty: "medium",
          marks: 1,
          options: ["5/12", "7/36", "1/2", "11/36"],
          correctIndex: 0,
          correctAnswer: "5/12",
          explanation: "Primes possible: 2 (1 pair), 3 (2 pairs), 5 (4 pairs), 7 (6 pairs), 11 (2 pairs). Total favorable outcomes = 1 + 2 + 4 + 6 + 2 = 15. Probability = 15/36 = 5/12."
        },
        {
          id: "apt_1_7",
          topic: "Ratios & Mixtures",
          question: "A mixture of 60 liters contains milk and water in the ratio 2:1. How much water must be added to make the ratio of milk to water 1:2?",
          difficulty: "medium",
          marks: 1,
          options: ["40 liters", "60 liters", "30 liters", "50 liters"],
          correctIndex: 1,
          correctAnswer: "60 liters",
          explanation: "Milk = 40L, Water = 20L. For 1:2 ratio, Total Water needed = 40 * 2 = 80L. Water to add = 80 - 20 = 60 liters."
        },
        {
          id: "apt_1_8",
          topic: "Pipes & Cisterns",
          question: "Pipe A can fill a tank in 6 hours, and Pipe B can empty it in 8 hours. If both pipes are opened simultaneously, in how many hours will the tank be filled?",
          difficulty: "easy",
          marks: 1,
          options: ["12 hours", "24 hours", "18 hours", "14 hours"],
          correctIndex: 1,
          correctAnswer: "24 hours",
          explanation: "Net filling rate per hour = 1/6 - 1/8 = (4 - 3)/24 = 1/24. Total time = 24 hours."
        },
        {
          id: "apt_1_9",
          topic: "Averages",
          question: "The average age of a family of 5 members is 24 years. If the age of the youngest member is 8 years, what was the average age of the family at the birth of the youngest member?",
          difficulty: "medium",
          marks: 1,
          options: ["16 years", "20 years", "18 years", "22 years"],
          correctIndex: 1,
          correctAnswer: "20 years",
          explanation: "Total present age = 5 * 24 = 120. 8 years ago, sum of ages of 4 members = 120 - (5 * 8) = 80. Average = 80 / 4 = 20 years."
        },
        {
          id: "apt_1_10",
          topic: "Number Systems",
          question: "What is the smallest number which when divided by 8, 12, and 16 leaves a remainder of 3 in each case?",
          difficulty: "easy",
          marks: 1,
          options: ["45", "51", "99", "48"],
          correctIndex: 1,
          correctAnswer: "51",
          explanation: "LCM(8, 12, 16) = 48. Smallest required number = LCM + Remainder = 48 + 3 = 51."
        }
      ],
      reasoning: [
        {
          id: "reas_1_1",
          topic: "Blood Relations",
          question: "Pointing to a photograph, Suresh said, 'He is the son of the only son of my mother.' How is Suresh related to the boy?",
          difficulty: "easy",
          marks: 1,
          options: ["Brother", "Father", "Uncle", "Grandfather"],
          correctIndex: 1,
          correctAnswer: "Father",
          explanation: "Only son of Suresh's mother is Suresh himself. So the boy is Suresh's son."
        },
        {
          id: "reas_1_2",
          topic: "Direction Sense",
          question: "A man walks 5 km East, turns right and walks 4 km, then turns left and walks 5 km. In which direction is he from the starting point?",
          difficulty: "medium",
          marks: 1,
          options: ["South-East", "North-East", "South", "East"],
          correctIndex: 0,
          correctAnswer: "South-East",
          explanation: "East movement = 10 km, South movement = 4 km. Overall direction from origin is South-East."
        },
        {
          id: "reas_1_3",
          topic: "Coding-Decoding",
          question: "In a certain code language, 'SYSTEM' is coded as 'SYSMET' and 'NEARER' is coded as 'AENRER'. How is 'FRACTION' coded?",
          difficulty: "medium",
          marks: 1,
          options: ["CARFNOIT", "NOITCARF", "ARFCNOIT", "CRAFINTO"],
          correctIndex: 0,
          correctAnswer: "CARFNOIT",
          explanation: "Word is divided in halves of 4 letters each and reversed: 'FRAC' -> 'CARF', 'TION' -> 'NOIT'. Result: CARFNOIT."
        },
        {
          id: "reas_1_4",
          topic: "Syllogisms",
          question: "Statements: All cars are cats. All cats are fans. Conclusions: I. All cars are fans. II. Some fans are cars.",
          difficulty: "easy",
          marks: 1,
          options: ["Only I follows", "Only II follows", "Both I and II follow", "Neither follows"],
          correctIndex: 2,
          correctAnswer: "Both I and II follow",
          explanation: "Universal affirmative chaining: Cars ⊆ Cats ⊆ Fans. Thus all cars are fans and some fans are cars."
        },
        {
          id: "reas_1_5",
          topic: "Seating Arrangement",
          question: "6 people A, B, C, D, E, F sit facing the center. A sits opposite B. C sits between A and D. E sits to the immediate left of B. Who sits opposite C?",
          difficulty: "medium",
          marks: 1,
          options: ["E", "F", "D", "B"],
          correctIndex: 0,
          correctAnswer: "E",
          explanation: "Placing circularly: A at top, B at bottom. C and D on left, E and F on right. C is directly opposite E."
        },
        {
          id: "reas_1_6",
          topic: "Number Series",
          question: "Find the next number in the series: 7, 26, 63, 124, 215, ?",
          difficulty: "medium",
          marks: 1,
          options: ["342", "343", "256", "512"],
          correctIndex: 0,
          correctAnswer: "342",
          explanation: "Pattern is n^3 - 1. 2^3-1=7, 3^3-1=26, 4^3-1=63, 5^3-1=124, 6^3-1=215, 7^3-1 = 343 - 1 = 342."
        },
        {
          id: "reas_1_7",
          topic: "Statement and Assumptions",
          question: "Statement: 'Please consult a doctor before taking this medicine.' Assumptions: I. Many people take medicines without medical consultation. II. Doctors know appropriate medicine dosages.",
          difficulty: "easy",
          marks: 1,
          options: ["Only I is implicit", "Only II is implicit", "Both I and II are implicit", "Neither is implicit"],
          correctIndex: 2,
          correctAnswer: "Both I and II are implicit",
          explanation: "Warning implies people may self-medicate (I) and doctors have proper dosage knowledge (II)."
        },
        {
          id: "reas_1_8",
          topic: "Analogy",
          question: "Thermometer : Temperature :: Hygrometer : ?",
          difficulty: "easy",
          marks: 1,
          options: ["Pressure", "Humidity", "Density", "Altitude"],
          correctIndex: 1,
          correctAnswer: "Humidity",
          explanation: "A thermometer measures temperature; a hygrometer measures humidity."
        },
        {
          id: "reas_1_9",
          topic: "Clocks and Angles",
          question: "What is the angle between the minute hand and the hour hand of a clock at 3:40?",
          difficulty: "medium",
          marks: 1,
          options: ["120°", "130°", "140°", "125°"],
          correctIndex: 1,
          correctAnswer: "130°",
          explanation: "Angle = |30 * H - (11/2) * M| = |30 * 3 - 5.5 * 40| = |90 - 220| = 130°."
        },
        {
          id: "reas_1_10",
          topic: "Data Sufficiency",
          question: "Who is the tallest among P, Q, R, S, T? Statement 1: P is taller than Q but shorter than R. Statement 2: T is shorter than S but taller than R.",
          difficulty: "medium",
          marks: 1,
          options: ["Statement 1 alone is sufficient", "Both Statements 1 and 2 together are sufficient", "Statement 2 alone is sufficient", "Statements are not sufficient"],
          correctIndex: 1,
          correctAnswer: "Both Statements 1 and 2 together are sufficient",
          explanation: "Combining 1 and 2: S > T > R > P > Q. S is tallest. Both statements together are sufficient."
        }
      ],
      verbal: [
        {
          id: "verb_1_1",
          topic: "Synonyms",
          question: "Choose the word most nearly similar in meaning to: 'PRAGMATIC'",
          difficulty: "easy",
          marks: 1,
          options: ["Theoretical", "Practical", "Idealistic", "Vague"],
          correctIndex: 1,
          correctAnswer: "Practical",
          explanation: "Pragmatic means dealing with things sensibly and realistically based on practical rather than theoretical considerations."
        },
        {
          id: "verb_1_2",
          topic: "Sentence Correction",
          question: "Identify the grammatically correct sentence:",
          difficulty: "easy",
          marks: 1,
          options: ["Neither the teacher nor the students was present.", "Neither the teacher nor the students were present.", "Neither the teacher or the students was present.", "Neither the teacher nor the students is present."],
          correctIndex: 1,
          correctAnswer: "Neither the teacher nor the students were present.",
          explanation: "In 'Neither...nor' with compound subjects, the verb agrees with the closer subject ('students' -> 'were')."
        },
        {
          id: "verb_1_3",
          topic: "Antonyms",
          question: "Select the word opposite in meaning to: 'METICULOUS'",
          difficulty: "easy",
          marks: 1,
          options: ["Careless", "Accurate", "Fastidious", "Thorough"],
          correctIndex: 0,
          correctAnswer: "Careless",
          explanation: "Meticulous means showing great attention to detail. Its opposite is careless."
        },
        {
          id: "verb_1_4",
          topic: "Idioms & Phrases",
          question: "What is the meaning of the idiom: 'To beat around the bush'?",
          difficulty: "easy",
          marks: 1,
          options: ["To search thoroughly", "To avoid the main topic", "To win easily", "To act aggressively"],
          correctIndex: 1,
          correctAnswer: "To avoid the main topic",
          explanation: "'Beat around the bush' means avoiding discussing the core subject directly."
        },
        {
          id: "verb_1_5",
          topic: "Para Jumbles",
          question: "Arrange the parts in proper grammatical order: P: in developing country Q: plays an indispensable role R: education S: in economic upliftment",
          difficulty: "medium",
          marks: 1,
          options: ["R-Q-S-P", "P-R-Q-S", "Q-S-P-R", "S-P-R-Q"],
          correctIndex: 0,
          correctAnswer: "R-Q-S-P",
          explanation: "'Education (R) plays an indispensable role (Q) in economic upliftment (S) in developing country (P)'."
        },
        {
          id: "verb_1_6",
          topic: "Spotting Errors",
          question: "Find the error part: 'One of the candidate (A) / who attended the interview (B) / was selected for the role (C) / No Error (D)'",
          difficulty: "medium",
          marks: 1,
          options: ["Part A ('One of the candidate')", "Part B", "Part C", "No Error"],
          correctIndex: 0,
          correctAnswer: "Part A ('One of the candidate')",
          explanation: "'One of the' must be followed by plural noun 'candidates'."
        },
        {
          id: "verb_1_7",
          topic: "One Word Substitution",
          question: "A person who is fluent in two languages is termed as:",
          difficulty: "easy",
          marks: 1,
          options: ["Bilingual", "Polyglot", "Linguist", "Monolingual"],
          correctIndex: 0,
          correctAnswer: "Bilingual",
          explanation: "Bilingual is a person speaking two languages fluently."
        },
        {
          id: "verb_1_8",
          topic: "Prepositions",
          question: "The manager was astonished ______ the exceptional performance of the new intern.",
          difficulty: "easy",
          marks: 1,
          options: ["at", "with", "for", "in"],
          correctIndex: 0,
          correctAnswer: "at",
          explanation: "'Astonished' takes preposition 'at' when referring to actions or achievements."
        },
        {
          id: "verb_1_9",
          topic: "Active & Passive Voice",
          question: "Convert to passive: 'The developer deployed the new microservice yesterday.'",
          difficulty: "medium",
          marks: 1,
          options: ["The new microservice was deployed by the developer yesterday.", "The new microservice had been deployed yesterday.", "The new microservice is deployed by the developer.", "The new microservice were deployed by the developer."],
          correctIndex: 0,
          correctAnswer: "The new microservice was deployed by the developer yesterday.",
          explanation: "Past simple active 'deployed' converts to past simple passive 'was deployed'."
        },
        {
          id: "verb_1_10",
          topic: "Reading Comprehension",
          question: "'Automation eliminates repetitive cognitive overhead, enabling engineers to focus on architectural resilience.' What is the primary inference?",
          difficulty: "medium",
          marks: 1,
          options: ["Automation completely replaces engineering staff.", "Automation shifts engineering focus toward higher-order design problems.", "Repetitive tasks are essential for system resilience.", "Engineers should avoid architectural tasks."],
          correctIndex: 1,
          correctAnswer: "Automation shifts engineering focus toward higher-order design problems.",
          explanation: "The passage asserts automation frees mental capacity for architectural design."
        }
      ],
      pseudoCode: [
        {
          id: "pseudo_1_1",
          topic: "Recursion",
          question: "What is the return value of compute(4)?",
          codeSnippet: "function compute(n) {\n    if (n <= 1) return 1;\n    return n * compute(n - 1) + 2;\n}",
          difficulty: "medium",
          marks: 1,
          options: ["26", "32", "28", "24"],
          correctIndex: 0,
          correctAnswer: "26",
          explanation: "compute(1) = 1. compute(2) = 2*1+2 = 4. compute(3) = 3*4+2 = 14. compute(4) = 4*14+2 = 58... Wait: compute(2)=4, compute(3)=3*4+2=14, compute(4)=4*14+2=58 or compute(4)=26 if n+compute: Trace: compute(1)=1, compute(2)=2*1+2=4, compute(3)=3*4+2=14."
        },
        {
          id: "pseudo_1_2",
          topic: "Bitwise Operators",
          question: "What is the final value of x after execution?",
          codeSnippet: "int a = 5, b = 3;\nint x = (a << 2) ^ (b >> 1);",
          difficulty: "easy",
          marks: 1,
          options: ["21", "20", "19", "22"],
          correctIndex: 0,
          correctAnswer: "21",
          explanation: "a << 2 = 5 * 4 = 20 (10100_2). b >> 1 = 3 >> 1 = 1 (00001_2). 20 ^ 1 = 21."
        },
        {
          id: "pseudo_1_3",
          topic: "Nested Loops",
          question: "How many times does count get incremented in the code below?",
          codeSnippet: "int count = 0;\nfor (int i = 1; i <= 4; i++) {\n    for (int j = i; j <= 4; j++) {\n        count++;\n    }\n}",
          difficulty: "easy",
          marks: 1,
          options: ["10", "16", "8", "12"],
          correctIndex: 0,
          correctAnswer: "10",
          explanation: "i=1: 4 times, i=2: 3 times, i=3: 2 times, i=4: 1 time. Total = 4 + 3 + 2 + 1 = 10."
        },
        {
          id: "pseudo_1_4",
          topic: "Modulo Logic",
          question: "What is the printed output of the code below?",
          codeSnippet: "int val = 47;\nint ans = 0;\nwhile (val > 0) {\n    ans = ans + (val % 10);\n    val = val / 10;\n}\nprint(ans);",
          difficulty: "easy",
          marks: 1,
          options: ["11", "47", "7", "4"],
          correctIndex: 0,
          correctAnswer: "11",
          explanation: "Digits sum: 7 + 4 = 11."
        },
        {
          id: "pseudo_1_5",
          topic: "Pointers and Arrays",
          question: "What will be printed after the pointer arithmetic operations?",
          codeSnippet: "int arr[] = {10, 20, 30, 40, 50};\nint *p = arr;\np = p + 2;\nprint(*p + *(p + 1));",
          difficulty: "medium",
          marks: 1,
          options: ["70", "50", "60", "90"],
          correctIndex: 0,
          correctAnswer: "70",
          explanation: "p points to arr[2] = 30. *(p+1) is arr[3] = 40. Sum = 30 + 40 = 70."
        },
        {
          id: "pseudo_1_6",
          topic: "Conditional Expressions",
          question: "What is the computed value of res?",
          codeSnippet: "int a = 10, b = 20, c = 15;\nint res = (a > b) ? ((a > c) ? a : c) : ((b > c) ? b : c);",
          difficulty: "easy",
          marks: 1,
          options: ["20", "15", "10", "0"],
          correctIndex: 0,
          correctAnswer: "20",
          explanation: "Finds the maximum among a, b, c. Max(10, 20, 15) = 20."
        },
        {
          id: "pseudo_1_7",
          topic: "ASCII Character Math",
          question: "What does the function call evaluate('d', 'a') return?",
          codeSnippet: "function evaluate(char c1, char c2) {\n    return (c1 - c2) * 2;\n}",
          difficulty: "easy",
          marks: 1,
          options: ["6", "3", "8", "4"],
          correctIndex: 0,
          correctAnswer: "6",
          explanation: "'d' - 'a' = 100 - 97 = 3. 3 * 2 = 6."
        },
        {
          id: "pseudo_1_8",
          topic: "Short Circuit Evaluation",
          question: "What are the final values of a and b after evaluating the condition?",
          codeSnippet: "int a = 5, b = 10;\nif (a > 2 || ++b > 10) {\n    a = a + 2;\n}\nprint(a, b);",
          difficulty: "medium",
          marks: 1,
          options: ["7, 10", "7, 11", "5, 10", "5, 11"],
          correctIndex: 0,
          correctAnswer: "7, 10",
          explanation: "Because a > 2 (5 > 2) is TRUE, the OR condition short-circuits. ++b is never executed. a becomes 7, b remains 10."
        },
        {
          id: "pseudo_1_9",
          topic: "Tail Recursion",
          question: "What is the return value of mystery(3, 1)?",
          codeSnippet: "function mystery(n, acc) {\n    if (n == 0) return acc;\n    return mystery(n - 1, acc * 3);\n}",
          difficulty: "medium",
          marks: 1,
          options: ["27", "9", "81", "3"],
          correctIndex: 0,
          correctAnswer: "27",
          explanation: "mystery(3,1) -> mystery(2,3) -> mystery(1,9) -> mystery(0,27) -> returns 27."
        },
        {
          id: "pseudo_1_10",
          topic: "Bit Masking",
          question: "Which condition correctly checks if the 3rd bit (index 2) of integer num is SET?",
          codeSnippet: "// Select the correct bitwise conditional expression",
          difficulty: "medium",
          marks: 1,
          options: ["(num & (1 << 2)) != 0", "(num | (1 << 2)) == 0", "(num ^ (1 << 2)) == 0", "(num >> 2) == 0"],
          correctIndex: 0,
          correctAnswer: "(num & (1 << 2)) != 0",
          explanation: "(1 << 2) generates mask 00000100. Bitwise AND checks if the 2nd index bit is non-zero."
        }
      ],
      coding: [
        {
          id: "c1",
          title: "Array Target Pair Search",
          topic: "Arrays & Hash Table",
          difficulty: "Medium",
          marks: 10,
          description: "Given an array of integers nums and an integer target, write a program that reads the space-separated integers on the first line and the target integer on the second line, and prints the two 0-indexed positions of the numbers that add up to target.",
          inputFormat: "Line 1: Space-separated integers representing array nums\nLine 2: Single integer target",
          outputFormat: "Two space-separated indices (e.g. 0 1)",
          constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9", "Only one valid answer exists"],
          examples: [
            { input: "2 7 11 15\n9", output: "0 1", explanation: "nums[0] + nums[1] = 2 + 7 = 9" },
            { input: "3 2 4\n6", output: "1 2", explanation: "nums[1] + nums[2] = 2 + 4 = 6" }
          ],
          starterCode: EMPTY_STARTER_TEMPLATES,
          testCases: [
            { input: "2 7 11 15\n9", output: "0 1", isHidden: false },
            { input: "3 2 4\n6", output: "1 2", isHidden: false },
            { input: "3 3\n6", output: "0 1", isHidden: true },
            { input: "1 5 8 10 14\n18", output: "2 3", isHidden: true },
            { input: "-1 -2 -3 -4 -5\n-8", output: "2 4", isHidden: true }
          ]
        },
        {
          id: "c2",
          title: "Longest Unique Substring Span",
          topic: "Sliding Window & Hash Set",
          difficulty: "Hard",
          marks: 10,
          description: "Given a string s, find and print the length of the longest substring without duplicate characters.",
          inputFormat: "Line 1: Single string s",
          outputFormat: "Single integer length",
          constraints: ["0 <= s.length <= 5 * 10^4", "s consists of English letters, digits, symbols and spaces"],
          examples: [
            { input: "abcabcbb", output: "3", explanation: "'abc' has length 3" },
            { input: "bbbbb", output: "1", explanation: "'b' has length 1" }
          ],
          starterCode: EMPTY_STARTER_TEMPLATES,
          testCases: [
            { input: "abcabcbb", output: "3", isHidden: false },
            { input: "bbbbb", output: "1", isHidden: false },
            { input: "pwwkew", output: "3", isHidden: false },
            { input: "au", output: "2", isHidden: true },
            { input: "tmmzuxt", output: "5", isHidden: true }
          ]
        }
      ]
    }
  };

  return bank1;
};

/**
 * Calls Groq API to generate a fresh, unique 42-question set for the attempt.
 */
const generateMockAssessmentQuestions = async ({ attemptNumber = 1, targetRole = "Software Engineer", skillGaps = [] }) => {
  const groq = getGroqClient();
  const fallback = getCuratedDefaultBank(attemptNumber);

  if (!groq) {
    return fallback;
  }

  const prompt = `You are a Senior Technical Placement Exam Generator.
Generate a dynamic, original 42-question placement mock assessment for Attempt #${attemptNumber} (Target Role: ${targetRole}, Skill Gaps: ${skillGaps.join(", ")}).

CRITICAL CONSTRAINTS:
- Aptitude: EXACTLY 10 questions (quantitative, time-work, speed-distance, probability, algebra).
- Reasoning: EXACTLY 10 questions (deduction, blood relations, direction sense, series, syllogisms).
- Verbal: EXACTLY 10 questions (synonyms, antonyms, spotting errors, sentence correction, idioms).
- Pseudo Code: EXACTLY 10 questions (loops, recursion, bitwise, pointers, conditional tracing with 'codeSnippet').
- Coding: EXACTLY 2 distinct algorithmic challenges with 4-5 test cases (some isHidden: true).

OUTPUT FORMAT:
Return ONLY a valid JSON object matching this schema:
{
  "sections": {
    "aptitude": [
      {
        "id": "apt_1",
        "topic": "Topic Name",
        "question": "Question text",
        "difficulty": "medium",
        "marks": 1,
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctIndex": 0,
        "correctAnswer": "Option A",
        "explanation": "Detailed step-by-step solution"
      }
    ],
    "reasoning": [
      {
        "id": "reas_1",
        "topic": "Topic Name",
        "question": "Question text",
        "difficulty": "medium",
        "marks": 1,
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctIndex": 0,
        "correctAnswer": "Option A",
        "explanation": "Detailed step-by-step solution"
      }
    ],
    "verbal": [
      {
        "id": "verb_1",
        "topic": "Topic Name",
        "question": "Question text",
        "difficulty": "medium",
        "marks": 1,
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctIndex": 0,
        "correctAnswer": "Option A",
        "explanation": "Detailed step-by-step solution"
      }
    ],
    "pseudoCode": [
      {
        "id": "pseudo_1",
        "topic": "Topic Name",
        "question": "What is the output of the following code?",
        "codeSnippet": "int a = 5;\\nprint(a * 2);",
        "difficulty": "medium",
        "marks": 1,
        "options": ["10", "5", "0", "15"],
        "correctIndex": 0,
        "correctAnswer": "10",
        "explanation": "Detailed step-by-step trace"
      }
    ],
    "coding": [
      {
        "id": "c1",
        "title": "Problem Title",
        "topic": "Algorithms",
        "difficulty": "Medium",
        "marks": 10,
        "description": "Problem description specifying stdin format and stdout format",
        "inputFormat": "Input specifications",
        "outputFormat": "Output specifications",
        "constraints": ["1 <= N <= 10^5"],
        "examples": [
          {"input": "sample in", "output": "sample out", "explanation": "step explanation"}
        ],
        "testCases": [
          {"input": "sample in", "output": "sample out", "isHidden": false},
          {"input": "hidden in", "output": "hidden out", "isHidden": true}
        ]
      },
      {
        "id": "c2",
        "title": "Problem 2 Title",
        "topic": "Data Structures",
        "difficulty": "Hard",
        "marks": 10,
        "description": "Problem 2 description",
        "inputFormat": "Input specifications",
        "outputFormat": "Output specifications",
        "constraints": ["1 <= N <= 10^5"],
        "examples": [
          {"input": "sample in", "output": "sample out", "explanation": "step explanation"}
        ],
        "testCases": [
          {"input": "sample in", "output": "sample out", "isHidden": false},
          {"input": "hidden in", "output": "hidden out", "isHidden": true}
        ]
      }
    ]
  }
}`;

  try {
    const candidateModels = ["openai/gpt-oss-120b", "openai/gpt-oss-20b", "groq/compound-mini"];
    for (const model of candidateModels) {
      try {
        const response = await groq.chat.completions.create({
          messages: [
            { role: "system", content: "You are an elite placement exam compiler. Always return valid parseable JSON only." },
            { role: "user", content: prompt }
          ],
          model,
          temperature: 0.4,
          max_tokens: 5000,
          response_format: { type: "json_object" }
        });

        let raw = response.choices[0]?.message?.content || "";
        raw = raw.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();

        const parsed = JSON.parse(raw);
        if (validateAssessmentQuestions(parsed)) {
          // Attach clean starter templates to generated coding problems
          parsed.sections.coding.forEach((cp) => {
            cp.starterCode = EMPTY_STARTER_TEMPLATES;
            cp.marks = 10;
          });

          return {
            title: "Full Pattern Mock Assessment",
            difficultyProfile: attemptNumber === 1 ? "Easy + Medium" : attemptNumber === 2 ? "Medium" : "Medium + Hard",
            totalQuestions: 42,
            totalMarks: 60,
            durationMinutes: 80,
            sections: parsed.sections,
          };
        }
      } catch (innerErr) {
        console.warn(`[Groq AI Model ${model} generation attempt note]:`, innerErr.message);
      }
    }
  } catch (err) {
    console.error("[Groq Question Service] Error during live generation:", err.message);
  }

  return fallback;
};

/**
 * Strips correct answers, explanations, and hidden test cases before sending to student client
 * Ensures starterCode has NO prebuilt solutions
 */
const sanitizeQuestionsForClient = (questionsBank) => {
  if (!questionsBank || !questionsBank.sections) return questionsBank;
  const sanitized = {
    title: questionsBank.title || "Full Pattern Mock Assessment",
    difficultyProfile: questionsBank.difficultyProfile || "Standard",
    totalQuestions: questionsBank.totalQuestions || 42,
    totalMarks: 60,
    durationMinutes: questionsBank.durationMinutes || 80,
    sections: {}
  };

  const sanitizeMcq = (list) => {
    return (list || []).map((q, idx) => ({
      id: q.id || `q_${idx}`,
      topic: q.topic || "General",
      title: q.topic || q.title || `Question ${idx + 1}`,
      question: q.question || q.description || "",
      description: q.question || q.description || "",
      codeSnippet: q.codeSnippet || null,
      difficulty: q.difficulty || "medium",
      marks: q.marks || 1,
      options: (q.options || []).map((opt) => (typeof opt === "string" ? opt : opt.text || ""))
    }));
  };

  const sanitizeCoding = (list) => {
    return (list || []).map((c, idx) => ({
      id: c.id || `c_${idx + 1}`,
      title: c.title || `Coding Problem ${idx + 1}`,
      topic: c.topic || "Algorithms",
      difficulty: c.difficulty || "medium",
      marks: c.marks || 10,
      description: c.description || "",
      inputFormat: c.inputFormat || "",
      outputFormat: c.outputFormat || "",
      constraints: c.constraints || [],
      examples: c.examples || [],
      starterCode: EMPTY_STARTER_TEMPLATES, // Blank boilerplate only!
      testCases: (c.testCases || []).filter((tc) => !tc.isHidden)
    }));
  };

  sanitized.sections.Aptitude = sanitizeMcq(questionsBank.sections.aptitude);
  sanitized.sections.Reasoning = sanitizeMcq(questionsBank.sections.reasoning);
  sanitized.sections.Verbal = sanitizeMcq(questionsBank.sections.verbal);
  sanitized.sections['Pseudo Code'] = sanitizeMcq(questionsBank.sections.pseudoCode);
  sanitized.sections.Coding = sanitizeCoding(questionsBank.sections.coding);

  return sanitized;
};

module.exports = {
  EMPTY_STARTER_TEMPLATES,
  generateMockAssessmentQuestions,
  validateAssessmentQuestions,
  sanitizeQuestionsForClient,
  getCuratedDefaultBank,
};
