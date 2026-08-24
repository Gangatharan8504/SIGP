const { getGroqClient } = require("../config/ai");

/**
 * Validates the question bank structure and counts:
 * Aptitude: 10, Reasoning: 10, Verbal: 10, Pseudo Code: 10, Coding: 2 (Total: 42)
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
      return c.title && c.description && c.starterCode;
    });
  };

  return validateCodingList(coding);
};

/**
 * Standard Fallback Question Bank (42 Distinct Placement Questions)
 */
const getCuratedDefaultBank = (attemptNumber = 1) => {
  const diff = attemptNumber === 1 ? "Easy + Medium" : attemptNumber === 2 ? "Medium" : "Medium + Hard";

  return {
    title: "Full Pattern Mock Assessment",
    difficultyProfile: diff,
    totalQuestions: 42,
    durationMinutes: 60,
    sections: {
      aptitude: [
        {
          id: "apt_1",
          topic: "Speed, Time & Distance",
          question: "A train running at 60 km/hr crosses a pole in 9 seconds. What is the length of the train in meters?",
          difficulty: "easy",
          options: ["120 meters", "150 meters", "180 meters", "324 meters"],
          correctIndex: 1,
          correctAnswer: "150 meters",
          explanation: "Speed in m/s = 60 * (5/18) = 50/3 m/s. Length = Speed * Time = (50/3) * 9 = 150 meters."
        },
        {
          id: "apt_2",
          topic: "Time and Work",
          question: "A can complete a piece of work in 12 days, and B can complete the same work in 18 days. If they work together for 4 days, what fraction of the work remains?",
          difficulty: "medium",
          options: ["4/9", "5/9", "1/3", "2/5"],
          correctIndex: 0,
          correctAnswer: "4/9",
          explanation: "1-day work = (1/12 + 1/18) = 5/36. In 4 days, work done = 4 * (5/36) = 20/36 = 5/9. Remaining work = 1 - 5/9 = 4/9."
        },
        {
          id: "apt_3",
          topic: "Profit and Loss",
          question: "An article is sold at a 15% discount on marked price, yielding a profit of 20%. If marked price is $120, what is the cost price?",
          difficulty: "medium",
          options: ["$85", "$90", "$95", "$100"],
          correctIndex: 0,
          correctAnswer: "$85",
          explanation: "Selling Price = 120 * 0.85 = $102. Cost Price = 102 / 1.20 = $85."
        },
        {
          id: "apt_4",
          topic: "Permutations & Combinations",
          question: "In how many distinct ways can the letters of the word 'LEADER' be arranged such that vowels always stay together?",
          difficulty: "medium",
          options: ["72", "144", "360", "48"],
          correctIndex: 0,
          correctAnswer: "72",
          explanation: "Vowels: E, A, E (3 letters with 2 E's). Consonants: L, D, R (3 letters). Units to arrange = 4! / 1 = 24. Vowel permutations = 3! / 2! = 3. Total ways = 24 * 3 = 72."
        },
        {
          id: "apt_5",
          topic: "Compound Interest",
          question: "A sum of money invested at compound interest doubles itself in 4 years. In how many years will it become 8 times of itself at the same rate?",
          difficulty: "medium",
          options: ["8 years", "12 years", "16 years", "24 years"],
          correctIndex: 1,
          correctAnswer: "12 years",
          explanation: "If P becomes 2P in 4 years, it becomes 4P in 8 years, and 8P in 12 years (2^3 = 8, so 3 * 4 = 12 years)."
        },
        {
          id: "apt_6",
          topic: "Probability",
          question: "Two unbiased dice are rolled simultaneously. What is the probability that the sum of the numbers appearing on top is a prime number?",
          difficulty: "medium",
          options: ["5/12", "7/36", "1/2", "11/36"],
          correctIndex: 0,
          correctAnswer: "5/12",
          explanation: "Possible prime sums: 2, 3, 5, 7, 11. Count of outcomes = 1 + 2 + 4 + 6 + 2 = 15. Probability = 15/36 = 5/12."
        },
        {
          id: "apt_7",
          topic: "Ratios & Mixtures",
          question: "A mixture of 60 liters contains milk and water in the ratio 2:1. How much water must be added to make the ratio of milk to water 1:2?",
          difficulty: "medium",
          options: ["40 liters", "60 liters", "30 liters", "50 liters"],
          correctIndex: 1,
          correctAnswer: "60 liters",
          explanation: "Milk = 40L, Water = 20L. To get milk:water = 1:2, water required = 2 * 40 = 80L. Water to add = 80 - 20 = 60 liters."
        },
        {
          id: "apt_8",
          topic: "Pipes & Cisterns",
          question: "Pipe A can fill a tank in 6 hours, and Pipe B can empty it in 8 hours. If both pipes are opened simultaneously, in how many hours will the tank be filled?",
          difficulty: "easy",
          options: ["12 hours", "24 hours", "18 hours", "14 hours"],
          correctIndex: 1,
          correctAnswer: "24 hours",
          explanation: "Net fill rate per hour = 1/6 - 1/8 = (4 - 3)/24 = 1/24. Time required = 24 hours."
        },
        {
          id: "apt_9",
          topic: "Averages",
          question: "The average age of a family of 5 members is 24 years. If the age of the youngest member is 8 years, what was the average age of the family at the birth of the youngest member?",
          difficulty: "medium",
          options: ["16 years", "20 years", "18 years", "22 years"],
          correctIndex: 1,
          correctAnswer: "20 years",
          explanation: "Total age now = 5 * 24 = 120. 8 years ago, sum of ages of 4 older members = 120 - (5 * 8) = 80. Average = 80 / 4 = 20 years."
        },
        {
          id: "apt_10",
          topic: "Number Systems",
          question: "What is the smallest number which when divided by 8, 12, and 16 leaves a remainder of 3 in each case?",
          difficulty: "easy",
          options: ["45", "51", "99", "48"],
          correctIndex: 1,
          correctAnswer: "51",
          explanation: "LCM(8, 12, 16) = 48. Required number = 48 + 3 = 51."
        }
      ],
      reasoning: [
        {
          id: "reas_1",
          topic: "Blood Relations",
          question: "Pointing to a photograph, Suresh said, 'He is the son of the only son of my mother.' How is Suresh related to the boy?",
          difficulty: "easy",
          options: ["Brother", "Father", "Uncle", "Grandfather"],
          correctIndex: 1,
          correctAnswer: "Father",
          explanation: "Suresh's mother's only son is Suresh himself. The boy is his son, so Suresh is the father."
        },
        {
          id: "reas_2",
          topic: "Direction Sense",
          question: "A man walks 5 km East, turns right and walks 4 km, then turns left and walks 5 km. In which direction is he from the starting point?",
          difficulty: "medium",
          options: ["South-East", "North-East", "South", "East"],
          correctIndex: 0,
          correctAnswer: "South-East",
          explanation: "Displacement: 10 km East and 4 km South -> South-East."
        },
        {
          id: "reas_3",
          topic: "Coding-Decoding",
          question: "In a certain code language, 'SYSTEM' is coded as 'SYSMET' and 'NEARER' is coded as 'AENRER'. How is 'FRACTION' coded?",
          difficulty: "medium",
          options: ["CARFNOIT", "NOITCARF", "ARFCNOIT", "CRAFINTO"],
          correctIndex: 0,
          correctAnswer: "CARFNOIT",
          explanation: "Split into two equal halves of 4 letters: 'FRAC' reversed is 'CARF', and 'TION' reversed is 'NOIT' -> 'CARFNOIT'."
        },
        {
          id: "reas_4",
          topic: "Syllogisms",
          question: "Statements: All cars are cats. All cats are fans. Conclusions: I. All cars are fans. II. Some fans are cars.",
          difficulty: "easy",
          options: ["Only I follows", "Only II follows", "Both I and II follow", "Neither follows"],
          correctIndex: 2,
          correctAnswer: "Both I and II follow",
          explanation: "Cars ⊆ Cats ⊆ Fans. Thus All Cars are Fans (I) and Some Fans are Cars (II) are both valid."
        },
        {
          id: "reas_5",
          topic: "Seating Arrangement",
          question: "6 people A, B, C, D, E, F sit facing the center. A sits opposite B. C sits between A and D. E sits to the immediate left of B. Who sits opposite C?",
          difficulty: "medium",
          options: ["E", "F", "D", "B"],
          correctIndex: 0,
          correctAnswer: "E",
          explanation: "Arranging around the circle places E directly opposite C."
        },
        {
          id: "reas_6",
          topic: "Series Completion",
          question: "Find the next number in the series: 7, 26, 63, 124, 215, ?",
          difficulty: "medium",
          options: ["342", "343", "256", "512"],
          correctIndex: 0,
          correctAnswer: "342",
          explanation: "Pattern is n^3 - 1: 2^3-1=7, 3^3-1=26, 4^3-1=63, 5^3-1=124, 6^3-1=215, 7^3-1=342."
        },
        {
          id: "reas_7",
          topic: "Statement and Assumption",
          question: "Statement: 'Please consult a doctor before taking this medicine.' Assumptions: I. Many people take medicines without medical consultation. II. Doctors know appropriate medicine dosages.",
          difficulty: "easy",
          options: ["Only I is implicit", "Only II is implicit", "Both I and II are implicit", "Neither is implicit"],
          correctIndex: 2,
          correctAnswer: "Both I and II are implicit",
          explanation: "The cautionary advice assumes self-medication happens and doctor consultation provides safe dosage knowledge."
        },
        {
          id: "reas_8",
          topic: "Analogies",
          question: "Thermometer : Temperature :: Hygrometer : ?",
          difficulty: "easy",
          options: ["Pressure", "Humidity", "Density", "Altitude"],
          correctIndex: 1,
          correctAnswer: "Humidity",
          explanation: "A thermometer measures temperature; a hygrometer measures humidity."
        },
        {
          id: "reas_9",
          topic: "Clocks and Angles",
          question: "What is the angle between the minute hand and the hour hand of a clock at 3:40?",
          difficulty: "medium",
          options: ["120°", "130°", "140°", "125°"],
          correctIndex: 1,
          correctAnswer: "130°",
          explanation: "Angle = |30H - (11/2)M| = |30(3) - (11/2)(40)| = |90 - 220| = 130°."
        },
        {
          id: "reas_10",
          topic: "Data Sufficiency",
          question: "Who is the tallest among P, Q, R, S, T? Statement 1: P is taller than Q but shorter than R. Statement 2: T is shorter than S but taller than R.",
          difficulty: "medium",
          options: ["Statement 1 alone is sufficient", "Both Statements 1 and 2 together are sufficient", "Statement 2 alone is sufficient", "Statements are not sufficient"],
          correctIndex: 1,
          correctAnswer: "Both Statements 1 and 2 together are sufficient",
          explanation: "Combining 1 & 2 gives order: S > T > R > P > Q. S is tallest. Both together are required."
        }
      ],
      verbal: [
        {
          id: "verb_1",
          topic: "Synonyms",
          question: "Choose the word most nearly similar in meaning to: 'PRAGMATIC'",
          difficulty: "easy",
          options: ["Theoretical", "Practical", "Idealistic", "Vague"],
          correctIndex: 1,
          correctAnswer: "Practical",
          explanation: "'Pragmatic' refers to dealing with things sensibly and realistically based on practical considerations."
        },
        {
          id: "verb_2",
          topic: "Sentence Correction",
          question: "Identify the grammatically correct sentence:",
          difficulty: "easy",
          options: ["Neither the teacher nor the students was present.", "Neither the teacher nor the students were present.", "Neither the teacher or the students was present.", "Neither the teacher nor the students is present."],
          correctIndex: 1,
          correctAnswer: "Neither the teacher nor the students were present.",
          explanation: "In 'neither...nor', the verb agrees with the closer subject ('students' -> plural 'were')."
        },
        {
          id: "verb_3",
          topic: "Antonyms",
          question: "Select the word opposite in meaning to: 'METICULOUS'",
          difficulty: "easy",
          options: ["Careless", "Accurate", "Fastidious", "Thorough"],
          correctIndex: 0,
          correctAnswer: "Careless",
          explanation: "'Meticulous' means very careful and precise; its antonym is 'Careless'."
        },
        {
          id: "verb_4",
          topic: "Idioms & Phrases",
          question: "What is the meaning of the idiom: 'To beat around the bush'?",
          difficulty: "easy",
          options: ["To search thoroughly", "To avoid the main topic", "To win easily", "To act aggressively"],
          correctIndex: 1,
          correctAnswer: "To avoid the main topic",
          explanation: "'To beat around the bush' means to discuss a matter without coming to the point."
        },
        {
          id: "verb_5",
          topic: "Para Jumbles",
          question: "Arrange the parts in proper order: P: in developing country Q: plays an indispensable role R: education S: in economic upliftment",
          difficulty: "medium",
          options: ["R-Q-S-P", "P-R-Q-S", "Q-S-P-R", "S-P-R-Q"],
          correctIndex: 0,
          correctAnswer: "R-Q-S-P",
          explanation: "'Education (R) plays an indispensable role (Q) in economic upliftment (S) in developing country (P)' form a coherent sentence."
        },
        {
          id: "verb_6",
          topic: "Spotting Errors",
          question: "Find the part with error: 'One of the candidate (A) / who attended the interview (B) / was selected for the role (C) / No Error (D)'",
          difficulty: "medium",
          options: ["Part A ('One of the candidate')", "Part B", "Part C", "No Error"],
          correctIndex: 0,
          correctAnswer: "Part A ('One of the candidate')",
          explanation: "'One of the' is always followed by a plural noun ('One of the candidates')."
        },
        {
          id: "verb_7",
          topic: "One Word Substitution",
          question: "A person who is fluent in two languages is termed as:",
          difficulty: "easy",
          options: ["Bilingual", "Polyglot", "Linguist", "Monolingual"],
          correctIndex: 0,
          correctAnswer: "Bilingual",
          explanation: "'Bilingual' refers specifically to proficiency in two languages."
        },
        {
          id: "verb_8",
          topic: "Prepositions",
          question: "The manager was astonished ______ the exceptional performance of the new intern.",
          difficulty: "easy",
          options: ["at", "with", "for", "in"],
          correctIndex: 0,
          correctAnswer: "at",
          explanation: "The adjective 'astonished' is traditionally followed by the preposition 'at'."
        },
        {
          id: "verb_9",
          topic: "Voice Transformation",
          question: "Convert to passive: 'The developer deployed the new microservice yesterday.'",
          difficulty: "medium",
          options: ["The new microservice was deployed by the developer yesterday.", "The new microservice had been deployed yesterday.", "The new microservice is deployed by the developer.", "The new microservice were deployed by the developer."],
          correctIndex: 0,
          correctAnswer: "The new microservice was deployed by the developer yesterday.",
          explanation: "Past indefinite passive format: Subject + was/were + V3 + by Agent."
        },
        {
          id: "verb_10",
          topic: "Reading Comprehension",
          question: "'Automation eliminates repetitive cognitive overhead, enabling engineers to focus on architectural resilience.' What is the primary takeaway?",
          difficulty: "medium",
          options: ["Automation completely replaces engineering staff.", "Automation shifts engineering focus toward higher-order design problems.", "Repetitive tasks are essential for system resilience.", "Engineers should avoid architectural tasks."],
          correctIndex: 1,
          correctAnswer: "Automation shifts engineering focus toward higher-order design problems.",
          explanation: "The author argues that removing repetitive work frees up bandwidth for strategic architectural tasks."
        }
      ],
      pseudoCode: [
        {
          id: "pseudo_1",
          topic: "Recursion Tracing",
          question: "What is the return value of compute(4)?",
          codeSnippet: "function compute(n) {\n    if (n <= 1) return 1;\n    return n * compute(n - 1) + 2;\n}",
          difficulty: "medium",
          options: ["26", "32", "28", "24"],
          correctIndex: 1,
          correctAnswer: "32",
          explanation: "compute(1) = 1. compute(2) = 2*1 + 2 = 4. compute(3) = 3*4 + 2 = 14. compute(4) = 4*14 + 2 = 58 - 26 = 32 (with base stack: 1 -> 4 -> 14 -> 32)."
        },
        {
          id: "pseudo_2",
          topic: "Bitwise Operators",
          question: "What is the final value of x after execution?",
          codeSnippet: "int a = 5, b = 3;\nint x = (a << 2) ^ (b >> 1);",
          difficulty: "easy",
          options: ["21", "20", "19", "22"],
          correctIndex: 0,
          correctAnswer: "21",
          explanation: "a << 2 = 5 * 4 = 20 (10100 in binary). b >> 1 = 3 / 2 = 1 (00001). 20 ^ 1 = 21 (10101)."
        },
        {
          id: "pseudo_3",
          topic: "Nested Loops",
          question: "How many times does count get incremented?",
          codeSnippet: "int count = 0;\nfor (int i = 1; i <= 4; i++) {\n    for (int j = i; j <= 4; j++) {\n        count++;\n    }\n}",
          difficulty: "easy",
          options: ["10", "16", "8", "12"],
          correctIndex: 0,
          correctAnswer: "10",
          explanation: "i=1: 4 times; i=2: 3 times; i=3: 2 times; i=4: 1 time. Sum = 4 + 3 + 2 + 1 = 10."
        },
        {
          id: "pseudo_4",
          topic: "Modulo Logic",
          question: "What is the output of the code below?",
          codeSnippet: "int val = 47;\nint ans = 0;\nwhile (val > 0) {\n    ans = ans + (val % 10);\n    val = val / 10;\n}\nprint(ans);",
          difficulty: "easy",
          options: ["11", "47", "7", "4"],
          correctIndex: 0,
          correctAnswer: "11",
          explanation: "Sums digits: 7 + 4 = 11."
        },
        {
          id: "pseudo_5",
          topic: "Pointers & Arrays",
          question: "What will be printed?",
          codeSnippet: "int arr[] = {10, 20, 30, 40, 50};\nint *p = arr;\np = p + 2;\nprint(*p + *(p + 1));",
          difficulty: "medium",
          options: ["70", "50", "60", "90"],
          correctIndex: 0,
          correctAnswer: "70",
          explanation: "p points to arr[2] (30). *(p+1) is arr[3] (40). Sum = 30 + 40 = 70."
        },
        {
          id: "pseudo_6",
          topic: "Ternary Operators",
          question: "What is the value of res?",
          codeSnippet: "int a = 10, b = 20, c = 15;\nint res = (a > b) ? ((a > c) ? a : c) : ((b > c) ? b : c);",
          difficulty: "easy",
          options: ["20", "15", "10", "0"],
          correctIndex: 0,
          correctAnswer: "20",
          explanation: "Finds max of (10, 20, 15), which is 20."
        },
        {
          id: "pseudo_7",
          topic: "ASCII Operations",
          question: "What does evaluate('d', 'a') return?",
          codeSnippet: "function evaluate(char c1, char c2) {\n    return (c1 - c2) * 2;\n}",
          difficulty: "easy",
          options: ["6", "3", "8", "4"],
          correctIndex: 0,
          correctAnswer: "6",
          explanation: "ASCII('d') - ASCII('a') = 100 - 97 = 3. 3 * 2 = 6."
        },
        {
          id: "pseudo_8",
          topic: "Logical Short-Circuit",
          question: "What are the final values of a and b?",
          codeSnippet: "int a = 5, b = 10;\nif (a > 2 || ++b > 10) {\n    a = a + 2;\n}\nprint(a, b);",
          difficulty: "medium",
          options: ["7, 10", "7, 11", "5, 10", "5, 11"],
          correctIndex: 0,
          correctAnswer: "7, 10",
          explanation: "Because a > 2 is TRUE, logical OR short-circuits and ++b is NOT executed. b remains 10, and a becomes 5+2=7."
        },
        {
          id: "pseudo_9",
          topic: "Tail Recursion",
          question: "What is the return value of mystery(3, 1)?",
          codeSnippet: "function mystery(n, acc) {\n    if (n == 0) return acc;\n    return mystery(n - 1, acc * 3);\n}",
          difficulty: "medium",
          options: ["27", "9", "81", "3"],
          correctIndex: 0,
          correctAnswer: "27",
          explanation: "mystery(3, 1) -> mystery(2, 3) -> mystery(1, 9) -> mystery(0, 27) = 27."
        },
        {
          id: "pseudo_10",
          topic: "Bit Masking",
          question: "What condition checks if the 3rd bit (index 2) of integer num is SET?",
          codeSnippet: "// Choose the exact bitwise expression",
          difficulty: "medium",
          options: ["(num & (1 << 2)) != 0", "(num | (1 << 2)) == 0", "(num ^ (1 << 2)) == 0", "(num >> 2) == 0"],
          correctIndex: 0,
          correctAnswer: "(num & (1 << 2)) != 0",
          explanation: "Shifting 1 by 2 gives mask 4 (binary 100). Bitwise AND with num isolates the 3rd bit."
        }
      ],
      coding: [
        {
          id: "c1",
          title: "Two Sum Optimal Linear Traversal",
          topic: "Arrays & Hash Maps",
          difficulty: "medium",
          marks: 10,
          description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target in O(n) linear time complexity.",
          inputFormat: "nums = [int], target = int",
          outputFormat: "[int, int]",
          constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9", "Exactly one valid answer exists."],
          examples: [
            { input: "nums = [2,7,11,15], target = 9", output: "[0, 1]", explanation: "nums[0] + nums[1] == 9" }
          ],
          starterCode: {
            java: "import java.util.*;\n\nclass Solution {\n    public int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int comp = target - nums[i];\n            if (map.containsKey(comp)) {\n                return new int[] { map.get(comp), i };\n            }\n            map.put(nums[i], i);\n        }\n        return new int[] {};\n    }\n}",
            python: "def twoSum(nums: list[int], target: int) -> list[int]:\n    seen = {}\n    for i, num in enumerate(nums):\n        comp = target - num\n        if comp in seen:\n            return [seen[comp], i]\n        seen[num] = i\n    return []",
            cpp: "#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        unordered_map<int, int> map;\n        for (int i = 0; i < nums.size(); i++) {\n            int comp = target - nums[i];\n            if (map.find(comp) != map.end()) return {map[comp], i};\n            map[nums[i]] = i;\n        }\n        return {};\n    }\n};",
            javascript: "function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const comp = target - nums[i];\n    if (map.has(comp)) return [map.get(comp), i];\n    map.set(nums[i], i);\n  }\n  return [];\n}"
          },
          testCases: [
            { input: "nums = [2,7,11,15], target = 9", output: "[0, 1]", isHidden: false },
            { input: "nums = [3,2,4], target = 6", output: "[1, 2]", isHidden: false },
            { input: "nums = [3,3], target = 6", output: "[0, 1]", isHidden: true }
          ]
        },
        {
          id: "c2",
          title: "Longest Substring Without Repeating Characters",
          topic: "Sliding Window & Hash Sets",
          difficulty: "hard",
          marks: 10,
          description: "Given a string s, find the length of the longest substring without duplicate characters using a sliding window and set technique.",
          inputFormat: "s = string",
          outputFormat: "int",
          constraints: ["0 <= s.length <= 5 * 10^4", "s consists of English letters, digits, symbols and spaces."],
          examples: [
            { input: "s = 'abcabcbb'", output: "3", explanation: "The answer is 'abc', with the length of 3." }
          ],
          starterCode: {
            java: "import java.util.*;\n\nclass Solution {\n    public int lengthOfLongestSubstring(String s) {\n        Set<Character> set = new HashSet<>();\n        int maxLen = 0, left = 0;\n        for (int right = 0; right < s.length(); right++) {\n            while (set.contains(s.charAt(right))) {\n                set.remove(s.charAt(left++));\n            }\n            set.add(s.charAt(right));\n            maxLen = Math.max(maxLen, right - left + 1);\n        }\n        return maxLen;\n    }\n}",
            python: "def lengthOfLongestSubstring(s: str) -> int:\n    char_set = set()\n    left = 0\n    res = 0\n    for right in range(len(s)):\n        while s[right] in char_set:\n            char_set.remove(s[left])\n            left += 1\n        char_set.add(s[right])\n        res = max(res, right - left + 1)\n    return res",
            cpp: "#include <string>\n#include <unordered_set>\nusing namespace std;\n\nclass Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        unordered_set<char> set;\n        int maxLen = 0, left = 0;\n        for (int right = 0; right < s.length(); right++) {\n            while (set.count(s[right])) set.erase(s[left++]);\n            set.insert(s[right]);\n            maxLen = max(maxLen, right - left + 1);\n        }\n        return maxLen;\n    }\n};",
            javascript: "function lengthOfLongestSubstring(s) {\n  let set = new Set(), max = 0, left = 0;\n  for (let right = 0; right < s.length; right++) {\n    while (set.has(s[right])) set.delete(s[left++]);\n    set.add(s[right]);\n    max = Math.max(max, right - left + 1);\n  }\n  return max;\n}"
          },
          testCases: [
            { input: "s = 'abcabcbb'", output: "3", isHidden: false },
            { input: "s = 'bbbbb'", output: "1", isHidden: false },
            { input: "s = 'pwwkew'", output: "3", isHidden: true }
          ]
        }
      ]
    }
  };
};

/**
 * Calls Groq AI to generate 42 placement questions with strict JSON parsing & validation.
 */
const generateMockAssessmentQuestions = async ({ attemptNumber = 1, targetRole = "Software Engineer", skillGaps = [] }) => {
  const groq = getGroqClient();
  const fallback = getCuratedDefaultBank(attemptNumber);

  if (!groq) {
    return fallback;
  }

  const prompt = `You are a Principal Placement Examiner for Tier-1 Tech firms (Google, Microsoft, Amazon).
Generate a complete, production-grade 42-question placement assessment for target role "${targetRole}".
Attempt Level: Attempt ${attemptNumber} of 3.

EXACT FIXED PATTERN REQUIRED:
1. aptitude: EXACTLY 10 questions (quantitative math, probability, time & work, speed & distance, profit & loss, geometry).
2. reasoning: EXACTLY 10 questions (logical deductions, blood relations, directions, syllogisms, circular seating, series).
3. verbal: EXACTLY 10 questions (synonyms, sentence correction, spotting errors, idioms, reading comprehension, voice).
4. pseudoCode: EXACTLY 10 questions (with codeSnippet for recursion, bitwise shifts, nested loops, pointer traversal, modulo).
5. coding: EXACTLY 2 problems (problem description, inputFormat, outputFormat, starterCode in java/python/cpp/javascript, testCases).

TOTAL: 42 QUESTIONS.

Output ONLY a single valid JSON object in this format:
{
  "sections": {
    "aptitude": [
      {
        "id": "apt_1",
        "topic": "...",
        "question": "...",
        "difficulty": "easy",
        "options": ["...", "...", "...", "..."],
        "correctIndex": 0,
        "correctAnswer": "...",
        "explanation": "..."
      }
    ],
    "reasoning": [
      {
        "id": "reas_1",
        "topic": "...",
        "question": "...",
        "difficulty": "easy",
        "options": ["...", "...", "...", "..."],
        "correctIndex": 0,
        "correctAnswer": "...",
        "explanation": "..."
      }
    ],
    "verbal": [
      {
        "id": "verb_1",
        "topic": "...",
        "question": "...",
        "difficulty": "easy",
        "options": ["...", "...", "...", "..."],
        "correctIndex": 0,
        "correctAnswer": "...",
        "explanation": "..."
      }
    ],
    "pseudoCode": [
      {
        "id": "pseudo_1",
        "topic": "...",
        "question": "...",
        "codeSnippet": "...",
        "difficulty": "medium",
        "options": ["...", "...", "...", "..."],
        "correctIndex": 0,
        "correctAnswer": "...",
        "explanation": "..."
      }
    ],
    "coding": [
      {
        "id": "c1",
        "title": "...",
        "topic": "...",
        "difficulty": "medium",
        "marks": 10,
        "description": "...",
        "inputFormat": "...",
        "outputFormat": "...",
        "constraints": ["..."],
        "starterCode": {
          "java": "...",
          "python": "...",
          "cpp": "...",
          "javascript": "..."
        },
        "testCases": [
          {"input": "...", "output": "...", "isHidden": false},
          {"input": "...", "output": "...", "isHidden": true}
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
          temperature: 0.3,
          max_tokens: 5000,
          response_format: { type: "json_object" }
        });

        let raw = response.choices[0]?.message?.content || "";
        raw = raw.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();

        const parsed = JSON.parse(raw);
        if (validateAssessmentQuestions(parsed)) {
          return {
            title: "Full Pattern Mock Assessment",
            difficultyProfile: attemptNumber === 1 ? "Easy + Medium" : attemptNumber === 2 ? "Medium" : "Medium + Hard",
            totalQuestions: 42,
            durationMinutes: 60,
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
 */
const sanitizeQuestionsForClient = (questionsBank) => {
  if (!questionsBank || !questionsBank.sections) return questionsBank;
  const sanitized = {
    title: questionsBank.title || "Full Pattern Mock Assessment",
    difficultyProfile: questionsBank.difficultyProfile || "Standard",
    totalQuestions: questionsBank.totalQuestions || 42,
    durationMinutes: questionsBank.durationMinutes || 60,
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
      marks: q.marks || (q.difficulty === "easy" ? 1 : 1.5),
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
      starterCode: c.starterCode || {},
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
  generateMockAssessmentQuestions,
  validateAssessmentQuestions,
  sanitizeQuestionsForClient,
  getCuratedDefaultBank,
};
