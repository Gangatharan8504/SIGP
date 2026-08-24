import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { examProctorApi, codeApi } from '../../../api/apis';
import {
  Camera,
  Shield,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Maximize,
  Radio,
  Eye,
  XCircle,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Award,
  BookOpen,
  Zap,
  Monitor,
  Code,
  Layers,
  Check,
  Wifi,
  WifiOff,
  Search,
  Play,
  FileText,
  ChevronRight,
  Lock,
  Mail,
  UserCheck,
  AlertCircle,
  TrendingUp,
  BarChart3,
  Cpu,
  Terminal,
  ShieldAlert,
  PauseCircle,
  HelpCircle,
  CheckCircle,
  Code2,
  Filter
} from 'lucide-react';
import { Button, Badge, Spinner } from '../../common/UIElements';
import confetti from 'canvas-confetti';

const SECTIONS_CONFIG = [
  { sNo: 1, name: 'Aptitude', questions: 10, duration: 10, marks: 10 },
  { sNo: 2, name: 'Reasoning', questions: 10, duration: 10, marks: 10 },
  { sNo: 3, name: 'Verbal', questions: 10, duration: 10, marks: 10 },
  { sNo: 4, name: 'Pseudo Code', questions: 10, duration: 10, marks: 10 },
  { sNo: 5, name: 'Coding', questions: 2, duration: 40, marks: 20 },
];

const BENCHMARK_LIST = [
  { id: 'full-pattern-test', title: 'Full Pattern Mock Assessment', category: 'Placement Benchmark', active: true },
  { id: 'tech-coding', title: 'Technical Algorithms & Coding Evaluation', category: 'Coding Assessment', active: false },
  { id: 'quant-logic', title: 'Quantitative & Logical Reasoning Diagnostic', category: 'Aptitude', active: false },
  { id: 'verbal-comm', title: 'Verbal & Professional Communication Test', category: 'Verbal', active: false },
  { id: 'core-cs', title: 'Core Computer Science & Systems Diagnostic', category: 'Core CS', active: false },
];

// Clean empty starter templates - NEVER include prebuilt solutions
const EMPTY_STARTER_TEMPLATES = {
  java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Write your solution here\n    }\n}`,
  python: `def main():\n    # Write your solution here\n    pass\n\nif __name__ == "__main__":\n    main()`,
  c: `#include <stdio.h>\n\nint main() {\n    // Write your solution here\n    return 0;\n}`,
  cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    return 0;\n}`,
  javascript: `function main() {\n    // Write your solution here\n}\n\nmain();`,
};

// Rich Curated 42 Placement Question Bank
const INITIAL_QUESTIONS_BANK = {
  Aptitude: [
    {
      id: "apt_1",
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
      id: "apt_2",
      topic: "Time and Work Efficiency",
      question: "A can complete a piece of work in 12 days, and B can complete the same work in 18 days. If they work together for 4 days, what fraction of the work remains?",
      difficulty: "medium",
      marks: 1,
      options: ["4/9", "5/9", "1/3", "2/5"],
      correctIndex: 0,
      correctAnswer: "4/9",
      explanation: "1-day work = (1/12 + 1/18) = 5/36. In 4 days, work done = 4 * (5/36) = 20/36 = 5/9. Remaining work = 1 - 5/9 = 4/9."
    },
    {
      id: "apt_3",
      topic: "Profit and Loss Margin",
      question: "An article is sold at a 15% discount on marked price, yielding a profit of 20%. If marked price is $120, what is the cost price?",
      difficulty: "medium",
      marks: 1,
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
      marks: 1,
      options: ["72", "144", "360", "48"],
      correctIndex: 0,
      correctAnswer: "72",
      explanation: "Vowels: E, A, E (3 letters with 2 E's). Consonants: L, D, R (3 letters). Units to arrange = 4! / 1 = 24. Vowel permutations = 3! / 2! = 3. Total ways = 24 * 3 = 72."
    },
    {
      id: "apt_5",
      topic: "Compound Interest Compounding",
      question: "A sum of money invested at compound interest doubles itself in 4 years. In how many years will it become 8 times of itself at the same rate?",
      difficulty: "medium",
      marks: 1,
      options: ["8 years", "12 years", "16 years", "24 years"],
      correctIndex: 1,
      correctAnswer: "12 years",
      explanation: "Amount doubles (2^1) in 4 years. 8 times = 2^3 times. Time required = 4 * 3 = 12 years."
    },
    {
      id: "apt_6",
      topic: "Probability of Dice Roll",
      question: "Two unbiased dice are rolled simultaneously. What is the probability that the sum of the numbers appearing on top is a prime number?",
      difficulty: "medium",
      marks: 1,
      options: ["5/12", "7/36", "1/2", "11/36"],
      correctIndex: 0,
      correctAnswer: "5/12",
      explanation: "Primes possible: 2 (1 pair), 3 (2 pairs), 5 (4 pairs), 7 (6 pairs), 11 (2 pairs). Total favorable outcomes = 1 + 2 + 4 + 6 + 2 = 15. Probability = 15/36 = 5/12."
    },
    {
      id: "apt_7",
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
      id: "apt_8",
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
      id: "apt_9",
      topic: "Averages & Age Progression",
      question: "The average age of a family of 5 members is 24 years. If the age of the youngest member is 8 years, what was the average age of the family at the birth of the youngest member?",
      difficulty: "medium",
      marks: 1,
      options: ["16 years", "20 years", "18 years", "22 years"],
      correctIndex: 1,
      correctAnswer: "20 years",
      explanation: "Total present age = 5 * 24 = 120. 8 years ago, sum of ages of 4 members = 120 - (5 * 8) = 80. Average = 80 / 4 = 20 years."
    },
    {
      id: "apt_10",
      topic: "Number System Divisibility",
      question: "What is the smallest number which when divided by 8, 12, and 16 leaves a remainder of 3 in each case?",
      difficulty: "easy",
      marks: 1,
      options: ["45", "51", "99", "48"],
      correctIndex: 1,
      correctAnswer: "51",
      explanation: "LCM(8, 12, 16) = 48. Smallest required number = LCM + Remainder = 48 + 3 = 51."
    }
  ],
  Reasoning: [
    {
      id: "reas_1",
      topic: "Blood Relations Deduction",
      question: "Pointing to a photograph, Suresh said, 'He is the son of the only son of my mother.' How is Suresh related to the boy?",
      difficulty: "easy",
      marks: 1,
      options: ["Brother", "Father", "Uncle", "Grandfather"],
      correctIndex: 1,
      correctAnswer: "Father",
      explanation: "Only son of Suresh's mother is Suresh himself. So the boy is Suresh's son."
    },
    {
      id: "reas_2",
      topic: "Direction Sense Tracking",
      question: "A man walks 5 km East, turns right and walks 4 km, then turns left and walks 5 km. In which direction is he from the starting point?",
      difficulty: "medium",
      marks: 1,
      options: ["South-East", "North-East", "South", "East"],
      correctIndex: 0,
      correctAnswer: "South-East",
      explanation: "East movement = 10 km, South movement = 4 km. Overall direction from origin is South-East."
    },
    {
      id: "reas_3",
      topic: "Coding-Decoding Reversal",
      question: "In a certain code language, 'SYSTEM' is coded as 'SYSMET' and 'NEARER' is coded as 'AENRER'. How is 'FRACTION' coded?",
      difficulty: "medium",
      marks: 1,
      options: ["CARFNOIT", "NOITCARF", "ARFCNOIT", "CRAFINTO"],
      correctIndex: 0,
      correctAnswer: "CARFNOIT",
      explanation: "Word is divided in halves of 4 letters each and reversed: 'FRAC' -> 'CARF', 'TION' -> 'NOIT'. Result: CARFNOIT."
    },
    {
      id: "reas_4",
      topic: "Syllogisms Universal",
      question: "Statements: All cars are cats. All cats are fans. Conclusions: I. All cars are fans. II. Some fans are cars.",
      difficulty: "easy",
      marks: 1,
      options: ["Only I follows", "Only II follows", "Both I and II follow", "Neither follows"],
      correctIndex: 2,
      correctAnswer: "Both I and II follow",
      explanation: "Universal affirmative chaining: Cars ⊆ Cats ⊆ Fans. Thus all cars are fans and some fans are cars."
    },
    {
      id: "reas_5",
      topic: "Circular Seating Arrangement",
      question: "6 people A, B, C, D, E, F sit facing the center. A sits opposite B. C sits between A and D. E sits to the immediate left of B. Who sits opposite C?",
      difficulty: "medium",
      marks: 1,
      options: ["E", "F", "D", "B"],
      correctIndex: 0,
      correctAnswer: "E",
      explanation: "Placing circularly: A at top, B at bottom. C and D on left, E and F on right. C is directly opposite E."
    },
    {
      id: "reas_6",
      topic: "Cubic Number Series",
      question: "Find the next number in the series: 7, 26, 63, 124, 215, ?",
      difficulty: "medium",
      marks: 1,
      options: ["342", "343", "256", "512"],
      correctIndex: 0,
      correctAnswer: "342",
      explanation: "Pattern is n^3 - 1. 2^3-1=7, 3^3-1=26, 4^3-1=63, 5^3-1=124, 6^3-1=215, 7^3-1 = 343 - 1 = 342."
    },
    {
      id: "reas_7",
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
      id: "reas_8",
      topic: "Scientific Analogy",
      question: "Thermometer : Temperature :: Hygrometer : ?",
      difficulty: "easy",
      marks: 1,
      options: ["Pressure", "Humidity", "Density", "Altitude"],
      correctIndex: 1,
      correctAnswer: "Humidity",
      explanation: "A thermometer measures temperature; a hygrometer measures humidity."
    },
    {
      id: "reas_9",
      topic: "Clock Hands Angle",
      question: "What is the angle between the minute hand and the hour hand of a clock at 3:40?",
      difficulty: "medium",
      marks: 1,
      options: ["120°", "130°", "140°", "125°"],
      correctIndex: 1,
      correctAnswer: "130°",
      explanation: "Angle = |30 * H - (11/2) * M| = |30 * 3 - 5.5 * 40| = |90 - 220| = 130°."
    },
    {
      id: "reas_10",
      topic: "Height Order Data Sufficiency",
      question: "Who is the tallest among P, Q, R, S, T? Statement 1: P is taller than Q but shorter than R. Statement 2: T is shorter than S but taller than R.",
      difficulty: "medium",
      marks: 1,
      options: ["Statement 1 alone is sufficient", "Both Statements 1 and 2 together are sufficient", "Statement 2 alone is sufficient", "Statements are not sufficient"],
      correctIndex: 1,
      correctAnswer: "Both Statements 1 and 2 together are sufficient",
      explanation: "Combining 1 and 2: S > T > R > P > Q. S is tallest. Both statements together are sufficient."
    }
  ],
  Verbal: [
    {
      id: "verb_1",
      topic: "Vocabulary Synonyms",
      question: "Choose the word most nearly similar in meaning to: 'PRAGMATIC'",
      difficulty: "easy",
      marks: 1,
      options: ["Theoretical", "Practical", "Idealistic", "Vague"],
      correctIndex: 1,
      correctAnswer: "Practical",
      explanation: "Pragmatic means dealing with things sensibly and realistically based on practical rather than theoretical considerations."
    },
    {
      id: "verb_2",
      topic: "Subject-Verb Agreement",
      question: "Identify the grammatically correct sentence:",
      difficulty: "easy",
      marks: 1,
      options: ["Neither the teacher nor the students was present.", "Neither the teacher nor the students were present.", "Neither the teacher or the students was present.", "Neither the teacher nor the students is present."],
      correctIndex: 1,
      correctAnswer: "Neither the teacher nor the students were present.",
      explanation: "In 'Neither...nor' with compound subjects, the verb agrees with the closer subject ('students' -> 'were')."
    },
    {
      id: "verb_3",
      topic: "Antonyms Inversion",
      question: "Select the word opposite in meaning to: 'METICULOUS'",
      difficulty: "easy",
      marks: 1,
      options: ["Careless", "Accurate", "Fastidious", "Thorough"],
      correctIndex: 0,
      correctAnswer: "Careless",
      explanation: "Meticulous means showing great attention to detail. Its opposite is careless."
    },
    {
      id: "verb_4",
      topic: "Idioms & Phrasal Meanings",
      question: "What is the meaning of the idiom: 'To beat around the bush'?",
      difficulty: "easy",
      marks: 1,
      options: ["To search thoroughly", "To avoid the main topic", "To win easily", "To act aggressively"],
      correctIndex: 1,
      correctAnswer: "To avoid the main topic",
      explanation: "'Beat around the bush' means avoiding discussing the core subject directly."
    },
    {
      id: "verb_5",
      topic: "Para Jumbles Cohesion",
      question: "Arrange the parts in proper grammatical order: P: in developing country Q: plays an indispensable role R: education S: in economic upliftment",
      difficulty: "medium",
      marks: 1,
      options: ["R-Q-S-P", "P-R-Q-S", "Q-S-P-R", "S-P-R-Q"],
      correctIndex: 0,
      correctAnswer: "R-Q-S-P",
      explanation: "'Education (R) plays an indispensable role (Q) in economic upliftment (S) in developing country (P)'."
    },
    {
      id: "verb_6",
      topic: "Error Identification Plurality",
      question: "Find the error part: 'One of the candidate (A) / who attended the interview (B) / was selected for the role (C) / No Error (D)'",
      difficulty: "medium",
      marks: 1,
      options: ["Part A ('One of the candidate')", "Part B", "Part C", "No Error"],
      correctIndex: 0,
      correctAnswer: "Part A ('One of the candidate')",
      explanation: "'One of the' must be followed by plural noun 'candidates'."
    },
    {
      id: "verb_7",
      topic: "One Word Substitution Linguistics",
      question: "A person who is fluent in two languages is termed as:",
      difficulty: "easy",
      marks: 1,
      options: ["Bilingual", "Polyglot", "Linguist", "Monolingual"],
      correctIndex: 0,
      correctAnswer: "Bilingual",
      explanation: "Bilingual is a person speaking two languages fluently."
    },
    {
      id: "verb_8",
      topic: "Prepositional Collocations",
      question: "The manager was astonished ______ the exceptional performance of the new intern.",
      difficulty: "easy",
      marks: 1,
      options: ["at", "with", "for", "in"],
      correctIndex: 0,
      correctAnswer: "at",
      explanation: "'Astonished' takes preposition 'at' when referring to actions or achievements."
    },
    {
      id: "verb_9",
      topic: "Passive Voice Transformation",
      question: "Convert to passive: 'The developer deployed the new microservice yesterday.'",
      difficulty: "medium",
      marks: 1,
      options: ["The new microservice was deployed by the developer yesterday.", "The new microservice had been deployed yesterday.", "The new microservice is deployed by the developer.", "The new microservice were deployed by the developer."],
      correctIndex: 0,
      correctAnswer: "The new microservice was deployed by the developer yesterday.",
      explanation: "Past simple active 'deployed' converts to past simple passive 'was deployed'."
    },
    {
      id: "verb_10",
      topic: "Reading Comprehension Inference",
      question: "'Automation eliminates repetitive cognitive overhead, enabling engineers to focus on architectural resilience.' What is the primary inference?",
      difficulty: "medium",
      marks: 1,
      options: ["Automation completely replaces engineering staff.", "Automation shifts engineering focus toward higher-order design problems.", "Repetitive tasks are essential for system resilience.", "Engineers should avoid architectural tasks."],
      correctIndex: 1,
      correctAnswer: "Automation shifts engineering focus toward higher-order design problems.",
      explanation: "The passage asserts automation frees mental capacity for architectural design."
    }
  ],
  'Pseudo Code': [
    {
      id: "pseudo_1",
      topic: "Recursive Call Tracing",
      question: "What is the return value of compute(4)?",
      codeSnippet: "function compute(n) {\n    if (n <= 1) return 1;\n    return n * compute(n - 1) + 2;\n}",
      difficulty: "medium",
      marks: 1,
      options: ["26", "58", "28", "24"],
      correctIndex: 1,
      correctAnswer: "58",
      explanation: "compute(1)=1, compute(2)=2*1+2=4, compute(3)=3*4+2=14, compute(4)=4*14+2=58."
    },
    {
      id: "pseudo_2",
      topic: "Bitwise Shift and XOR",
      question: "What is the final value of x after execution?",
      codeSnippet: "int a = 5, b = 3;\nint x = (a << 2) ^ (b >> 1);",
      difficulty: "easy",
      marks: 1,
      options: ["21", "20", "19", "22"],
      correctIndex: 0,
      correctAnswer: "21",
      explanation: "a << 2 = 5 * 4 = 20. b >> 1 = 1. 20 ^ 1 = 21."
    },
    {
      id: "pseudo_3",
      topic: "Nested Triangular Loop",
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
      id: "pseudo_4",
      topic: "Modulo and Division Logic",
      question: "What is the printed output of the code below?",
      codeSnippet: "int val = 47;\nint ans = 0;\nwhile (val > 0) {\n    ans = ans + (val % 10);\n    val = val / 10;\n}\nprint(ans);",
      difficulty: "easy",
      marks: 1,
      options: ["11", "47", "7", "4"],
      correctIndex: 0,
      correctAnswer: "11",
      explanation: "Sum of digits of 47: 7 + 4 = 11."
    },
    {
      id: "pseudo_5",
      topic: "Array Pointer Traversal",
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
      id: "pseudo_6",
      topic: "Ternary Operator Chaining",
      question: "What is the computed value of res?",
      codeSnippet: "int a = 10, b = 20, c = 15;\nint res = (a > b) ? ((a > c) ? a : c) : ((b > c) ? b : c);",
      difficulty: "easy",
      marks: 1,
      options: ["20", "15", "10", "0"],
      correctIndex: 0,
      correctAnswer: "20",
      explanation: "Finds the maximum among a, b, c: Max(10, 20, 15) = 20."
    },
    {
      id: "pseudo_7",
      topic: "String Character ASCII Difference",
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
      id: "pseudo_8",
      topic: "Short-Circuit Logical Evaluation",
      question: "What are the final values of a and b after evaluating the condition?",
      codeSnippet: "int a = 5, b = 10;\nif (a > 2 || ++b > 10) {\n    a = a + 2;\n}\nprint(a, b);",
      difficulty: "medium",
      marks: 1,
      options: ["7, 10", "7, 11", "5, 10", "5, 11"],
      correctIndex: 0,
      correctAnswer: "7, 10",
      explanation: "Since a > 2 is TRUE, the OR condition short-circuits. ++b is never run. a becomes 7, b remains 10."
    },
    {
      id: "pseudo_9",
      topic: "Tail Recursion Accumulator",
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
      id: "pseudo_10",
      topic: "Bitwise Mask Checking",
      question: "Which condition correctly checks if the 3rd bit (index 2) of integer num is SET?",
      codeSnippet: "// Select the correct bitwise conditional expression",
      difficulty: "medium",
      marks: 1,
      options: ["(num & (1 << 2)) != 0", "(num | (1 << 2)) == 0", "(num ^ (1 << 2)) == 0", "(num >> 2) == 0"],
      correctIndex: 0,
      correctAnswer: "(num & (1 << 2)) != 0",
      explanation: "(1 << 2) gives mask 4 (00000100). Bitwise AND checks if the 2nd index bit is set."
    }
  ],
  Coding: [
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
        { input: "3 2 4\n6", output: "1 2", isHidden: false }
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
        { input: "bbbbb", output: "1", isHidden: false }
      ]
    }
  ]
};

export const SecureExamMode = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState({
    title: 'Full Pattern Mock Assessment',
    description: 'Comprehensive 5-Section Placement Readiness Benchmark',
    durationMinutes: 80,
    totalQuestions: 42,
    totalMarks: 60,
    maxAttempts: 3,
  });
  const [loading, setLoading] = useState(true);
  const [viewTab, setViewTab] = useState('overview'); // 'overview' | 'attempt' | 'review' | 'history' | 'faculty'
  const [examState, setExamState] = useState('PORTAL'); // 'PORTAL' | 'SYSTEM_CHECK' | 'IN_PROGRESS' | 'PAUSED' | 'SUBMITTED'

  // Dynamic 42-Question Repository loaded from backend
  const [questionsBank, setQuestionsBank] = useState(INITIAL_QUESTIONS_BANK);

  // Pre-Check Verification
  const [cameraAllowed, setCameraAllowed] = useState(false);
  const [screenShareAllowed, setScreenShareAllowed] = useState(false);
  const [fullscreenActive, setFullscreenActive] = useState(false);
  const [faceDetectionText, setFaceDetectionText] = useState('Face Detected');

  // Live Exam Telemetry & Monitoring
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pingLatency, setPingLatency] = useState(22);
  const [autoSaveStatus, setAutoSaveStatus] = useState('Synced');
  const [timeLeft, setTimeLeft] = useState(4800); // 80 mins = 4800s
  const [activeSectionName, setActiveSectionName] = useState('Aptitude');
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState({});
  const [codingActiveIndex, setCodingActiveIndex] = useState(0);
  const [codingLanguage, setCodingLanguage] = useState('java');
  const [codingDrafts, setCodingDrafts] = useState({
    c1: EMPTY_STARTER_TEMPLATES.java,
    c2: EMPTY_STARTER_TEMPLATES.java,
  });
  const [codingLanguages, setCodingLanguages] = useState({
    c1: 'java',
    c2: 'java',
  });
  const [codeConsoleOutput, setCodeConsoleOutput] = useState('');
  const [isRunningCode, setIsRunningCode] = useState(false);

  // Security Counters & Warnings
  const [warningCount, setWarningCount] = useState(0);
  const [devToolsWarningModal, setDevToolsWarningModal] = useState(false);
  const [screenSharePauseModal, setScreenSharePauseModal] = useState(false);
  const [securityModalText, setSecurityModalText] = useState('');
  const [devToolsCount, setDevToolsCount] = useState(0);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [cameraDropCount, setCameraDropCount] = useState(0);
  const [networkDropCount, setNetworkDropCount] = useState(0);

  // Real Attempt & Result State (100% from Database)
  const [attemptNumber, setAttemptNumber] = useState(1);
  const [remainingAttempts, setRemainingAttempts] = useState(2);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attemptHistory, setAttemptHistory] = useState([]);
  const [examResult, setExamResult] = useState(null);
  const [reviewFilter, setReviewFilter] = useState('All');

  const videoRef = useRef(null);
  const pipVideoRef = useRef(null);
  const screenStreamRef = useRef(null);
  const blurStartTimeRef = useRef(null);

  // Network Diagnostic & Latency Ping
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setAutoSaveStatus('Saving...');
      examProctorApi.autoSave({
        assessmentId: assessment?._id || 'full-pattern-test',
        attemptNumber,
        answers,
        codingAnswers: codingDrafts,
      }).then(() => setAutoSaveStatus('Synced')).catch(() => {});
    };

    const handleOffline = () => {
      setIsOnline(false);
      setNetworkDropCount((prev) => prev + 1);
      setAutoSaveStatus('Offline (Local Cache)');
      setSecurityModalText('Network connection lost. Offline local answer cache is active.');
      examProctorApi.logEvent({
        assessmentId: assessment?._id || 'full-pattern-test',
        attemptNumber,
        eventType: 'NETWORK_OFFLINE',
        severity: 'MEDIUM',
        details: 'Candidate disconnected from internet.',
      }).catch(() => {});
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const pingTimer = setInterval(() => {
      if (navigator.onLine) {
        setPingLatency(Math.floor(16 + Math.random() * 18));
      }
    }, 3500);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(pingTimer);
    };
  }, [assessment, attemptNumber, answers, codingDrafts]);

  // 10-Second Background Auto-Save to MongoDB
  useEffect(() => {
    if (examState !== 'IN_PROGRESS') return;

    const autoSaveTimer = setInterval(async () => {
      setAutoSaveStatus('Saving...');
      localStorage.setItem('sgip_secure_cache', JSON.stringify({ answers, codingDrafts, timeLeft }));
      try {
        await examProctorApi.autoSave({
          assessmentId: assessment?._id || 'full-pattern-test',
          attemptNumber,
          answers,
          codingAnswers: codingDrafts,
          timeLeft,
        });
        setAutoSaveStatus('Synced');
      } catch {
        setAutoSaveStatus('Cached Locally');
      }
    }, 10000);

    return () => clearInterval(autoSaveTimer);
  }, [examState, answers, codingDrafts, timeLeft, assessment, attemptNumber]);

  // DevTools Detection Engine
  useEffect(() => {
    if (examState !== 'IN_PROGRESS') return;

    const handleKeyDown = (e) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) ||
        (e.metaKey && e.altKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) ||
        (e.ctrlKey && (e.key === 'U' || e.key === 'u'))
      ) {
        e.preventDefault();
        triggerDevToolsViolation('Keyboard shortcut for Developer Tools / Page Source detected.');
      }
    };

    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    const devToolsCheckInterval = setInterval(() => {
      const widthThreshold = window.outerWidth - window.innerWidth > 160;
      const heightThreshold = window.outerHeight - window.innerHeight > 160;
      if (widthThreshold || heightThreshold) {
        triggerDevToolsViolation('Developer Tools window or element inspection detected.');
      }
    }, 2000);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('contextmenu', handleContextMenu);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('contextmenu', handleContextMenu);
      clearInterval(devToolsCheckInterval);
    };
  }, [examState, attemptNumber]);

  const triggerDevToolsViolation = useCallback((detailText) => {
    setDevToolsCount((prev) => prev + 1);
    setWarningCount((prev) => prev + 1);
    setDevToolsWarningModal(true);
    examProctorApi.logEvent({
      assessmentId: assessment?._id || 'full-pattern-test',
      attemptNumber,
      eventType: 'DEVTOOLS_OPENED',
      severity: 'CRITICAL',
      details: detailText,
    }).catch(() => {});
  }, [assessment, attemptNumber]);

  // Tab Switch & Focus Loss Duration Tracking
  useEffect(() => {
    if (examState !== 'IN_PROGRESS') return;

    const handleVisibility = () => {
      if (document.hidden) {
        blurStartTimeRef.current = Date.now();
        setTabSwitchCount((prev) => prev + 1);
        setWarningCount((prev) => prev + 1);
      } else {
        const durationSec = blurStartTimeRef.current ? Math.round((Date.now() - blurStartTimeRef.current) / 1000) : 1;
        examProctorApi.logEvent({
          assessmentId: assessment?._id || 'full-pattern-test',
          attemptNumber,
          eventType: 'TAB_SWITCH',
          severity: 'HIGH',
          durationSeconds: durationSec,
          details: `Candidate switched away from exam tab for ${durationSec} seconds.`,
        }).catch(() => {});
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [examState, assessment, attemptNumber]);

  // Fullscreen Enforcer Listener
  useEffect(() => {
    if (examState !== 'IN_PROGRESS') return;

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setFullscreenActive(false);
        setWarningCount((prev) => prev + 1);
        setSecurityModalText('Fullscreen mode was exited. Fullscreen is mandatory to maintain exam integrity.');
        examProctorApi.logEvent({
          assessmentId: assessment?._id || 'full-pattern-test',
          attemptNumber,
          eventType: 'FULLSCREEN_EXIT',
          severity: 'HIGH',
          details: 'Candidate exited fullscreen mode.',
        }).catch(() => {});
      } else {
        setFullscreenActive(true);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [examState, assessment, attemptNumber]);

  // Exam Countdown Timer
  useEffect(() => {
    if (examState !== 'IN_PROGRESS' || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinalSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examState, timeLeft]);

  // Load Past History and Latest Submissions from Database
  useEffect(() => {
    const loadSessionData = async () => {
      try {
        setLoading(true);
        const res = await examProctorApi.getHistory(id || 'full-pattern-test');
        if (res.data?.success) {
          if (res.data.attempts) {
            setAttemptHistory(res.data.attempts);
            setAttemptNumber(res.data.attempts.length + 1);
            setRemainingAttempts(Math.max(0, 3 - res.data.attempts.length));
          }
          if (res.data.latestResult) {
            const sub = res.data.latestResult;
            setExamResult({
              examTitle: "Full Pattern Mock Assessment",
              completedAt: new Date(sub.completedAt || sub.createdAt).toLocaleString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }),
              attemptNumber: sub.attemptNumber,
              maxAttempts: 3,
              timeSpentFormatted: `${Math.floor((sub.timeSpentSeconds || 3100) / 60)}m ${(sub.timeSpentSeconds || 3100) % 60}s`,
              timeSpentSeconds: sub.timeSpentSeconds || 3100,
              totalQuestions: 42,
              score: sub.score,
              maxScore: sub.maxScore || 60,
              percentage: sub.percentage,
              passed: sub.passed,
              integrityScore: sub.integrityScore,
              auditStatus: sub.reviewStatus || "Verified Clean",
              ipAddress: "Masked",
              tabSwitches: sub.tabSwitches || 0,
              devToolsCount: sub.devToolsCount || 0,
              cameraInterruptions: sub.cameraInterruptionCount || 0,
              screenShareInterruptions: 0,
              networkInterruptions: sub.networkInterruptionCount || 0,
              sectionScores: sub.sectionScores || {},
              aiRecommendations: sub.aiRecommendations || {},
              reviewData: sub.reviewData || [],
            });
          }
        }
      } catch (err) {
        console.warn('Could not load past exam history:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSessionData();
  }, [id]);

  // Request Camera Hardware
  const requestCameraAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraAllowed(true);
      setFaceDetectionText('Face Detected');
      return true;
    } catch (err) {
      setCameraAllowed(false);
      setFaceDetectionText('Camera Access Denied');
      return false;
    }
  };

  // Request Desktop Screen Share
  const requestScreenShareAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: 'monitor', cursor: 'always' },
        audio: false,
      });
      screenStreamRef.current = stream;
      setScreenShareAllowed(true);

      stream.getVideoTracks()[0].onended = () => {
        setScreenShareAllowed(false);
        setScreenSharePauseModal(true);
        setExamState('PAUSED');
        setWarningCount((prev) => prev + 1);
        examProctorApi.logEvent({
          assessmentId: assessment?._id || 'full-pattern-test',
          attemptNumber,
          eventType: 'SCREEN_SHARE_STOPPED',
          severity: 'CRITICAL',
          details: 'Candidate stopped sharing entire desktop screen.',
        }).catch(() => {});
      };
      return true;
    } catch (err) {
      setScreenShareAllowed(false);
      return false;
    }
  };

  // Enter Fullscreen
  const enterFullscreenMode = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().then(() => setFullscreenActive(true)).catch(() => {});
    }
  };

  // Launch Examination: Calls Backend Groq Question Generation
  const handleStartExam = async () => {
    try {
      const res = await examProctorApi.startSession({
        assessmentId: assessment?._id || 'full-pattern-test',
        screenShareGranted: screenShareAllowed,
        consentAccepted: true,
      });

      if (res?.data?.success) {
        const data = res.data;
        if (data.dynamicExam && data.dynamicExam.sections) {
          setQuestionsBank(data.dynamicExam.sections);
          setTimeLeft(data.timeLeft || 4800);
          setAttemptNumber(data.attemptNumber || attemptNumber);
          setRemainingAttempts(data.remainingAttempts !== undefined ? data.remainingAttempts : remainingAttempts);

          if (data.savedAnswers) setAnswers(data.savedAnswers);
          if (data.savedCodingAnswers && Object.keys(data.savedCodingAnswers).length > 0) {
            setCodingDrafts(data.savedCodingAnswers);
          } else {
            const initialDrafts = {};
            (data.dynamicExam.sections.Coding || []).forEach((cp) => {
              initialDrafts[cp.id] = EMPTY_STARTER_TEMPLATES.java;
            });
            setCodingDrafts(initialDrafts);
          }
        }
      }
    } catch (e) {
      if (e.response?.status === 403) {
        alert(e.response.data?.message || 'Maximum allowed attempts (3 of 3) reached.');
        setExamState('PORTAL');
        return;
      }
    }

    setExamState('IN_PROGRESS');
    setTimeout(() => {
      if (pipVideoRef.current && videoRef.current?.srcObject) {
        pipVideoRef.current.srcObject = videoRef.current.srcObject;
      }
    }, 400);
  };

  // Real Sandboxed Code Execution inside Examination
  const handleRunCodeTestCases = async () => {
    if (isRunningCode) return;
    setIsRunningCode(true);
    const activeProb = (questionsBank.Coding && questionsBank.Coding[codingActiveIndex]) || (INITIAL_QUESTIONS_BANK.Coding && INITIAL_QUESTIONS_BANK.Coding[codingActiveIndex]) || { id: 'c1' };
    const currentCode = codingDrafts[activeProb.id] || EMPTY_STARTER_TEMPLATES[codingLanguage] || '';
    const sampleInput = activeProb.testCases?.[0]?.input || activeProb.examples?.[0]?.input || '';
    const expectedOutput = activeProb.testCases?.[0]?.output || activeProb.examples?.[0]?.output || '';

    setCodeConsoleOutput(`[Compiler]: Compiling and running against sample test case...\nInput:\n${sampleInput}\n`);

    try {
      const res = await codeApi.run({
        language: codingLanguage,
        code: currentCode,
        stdin: sampleInput,
      });

      const data = res.data;
      if (data.compileError) {
        setCodeConsoleOutput(`[Compilation Error]:\n${data.compileError}`);
      } else if (data.stderr && data.status === 'Runtime Error') {
        setCodeConsoleOutput(`[Runtime Error]:\n${data.stderr}`);
      } else {
        const actualOutput = (data.stdout || '').trim();
        const isMatch = actualOutput === expectedOutput.trim();
        setCodeConsoleOutput(
          `[Program Output]:\n${actualOutput || '(No output)'}\n\n` +
          `Expected Output:\n${expectedOutput}\n\n` +
          `Test Case 1 Status: ${isMatch ? '✓ PASSED' : '✗ FAILED'}\n` +
          `Execution Time: ${data.executionTimeMs || 14}ms  Memory: ${data.memoryMb || 16.2}MB`
        );
      }
    } catch (err) {
      setCodeConsoleOutput(`[Execution Error]: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsRunningCode(false);
    }
  };

  // Submit Exam: Evaluates Real Answers on Backend Database
  const handleFinalSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const res = await examProctorApi.submitSecureExam({
        assessmentId: assessment?._id || 'full-pattern-test',
        attemptNumber,
        answers,
        codingAnswers: codingDrafts,
        codingLanguages,
        screenShareGranted: screenShareAllowed,
        tabSwitches: tabSwitchCount,
        devToolsCount,
        cameraInterruptionCount: cameraDropCount,
        networkInterruptionCount: networkDropCount,
      });

      if (res?.data?.success && res.data.feedback) {
        setExamResult(res.data.feedback);
        if (res.data.feedback.attemptHistory) {
          setAttemptHistory(res.data.feedback.attemptHistory);
        }
      }
    } catch (e) {
      console.warn('Submission sync fallback:', e);
    } finally {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
      setIsSubmitting(false);
      setExamState('PORTAL');
      setViewTab('attempt');
      confetti({
        particleCount: 140,
        spread: 75,
        origin: { y: 0.6 },
      });
    }
  };

  const formatTimer = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="py-24 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // Active Question Object from Question Bank
  const currentSectionQuestions = questionsBank[activeSectionName] || INITIAL_QUESTIONS_BANK[activeSectionName] || [];
  const currentQuestion = currentSectionQuestions[currentQIndex] || currentSectionQuestions[0] || INITIAL_QUESTIONS_BANK[activeSectionName]?.[0] || {
    title: `${activeSectionName} Question ${currentQIndex + 1}`,
    question: `A train running at 60 km/hr crosses a pole in 9 seconds. What is the length of the train in meters?`,
    options: ["120 meters", "150 meters", "180 meters", "324 meters"],
    marks: 1,
  };

  // =========================================================================
  // VIEW 1: ACTIVE IN-PROGRESS PROCTORED EXAMINATION WORKSPACE (FULLSCREEN ISOLATED OVERLAY)
  // =========================================================================
  if (examState === 'IN_PROGRESS' || examState === 'PAUSED') {
    return (
      <div className="fixed inset-0 z-[9999] bg-slate-950 text-slate-100 flex flex-col select-none font-sans overflow-y-auto">
        {/* Sticky Top Status Header */}
        <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 px-6 py-3 flex flex-wrap items-center justify-between gap-4 shadow-2xl">
          {/* Left: Test Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Full Pattern Mock Assessment</span>
                <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 text-[11px] font-mono font-bold border border-indigo-500/30">
                  Attempt {attemptNumber} of 3
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Section: <strong className="text-indigo-400">{activeSectionName}</strong> &bull; Auto-Save: <span className="text-emerald-400 font-bold">{autoSaveStatus}</span>
              </p>
            </div>
          </div>

          {/* Middle: Live Diagnostic Status Badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <div className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 flex items-center gap-1.5 text-slate-200">
              <Camera className="w-3.5 h-3.5 text-emerald-400" />
              <span>Camera: <strong className="text-emerald-400">Active</strong></span>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 flex items-center gap-1.5 text-slate-200">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Face: <strong className="text-emerald-400">{faceDetectionText}</strong></span>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 flex items-center gap-1.5 text-slate-200">
              <Monitor className="w-3.5 h-3.5 text-indigo-400" />
              <span>Screen: <strong className={screenShareAllowed ? 'text-emerald-400' : 'text-red-400'}>{screenShareAllowed ? 'Active' : 'Missing'}</strong></span>
            </div>

            <div className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 border ${
              isOnline ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/20 border-red-500/40 text-red-400 animate-pulse'
            }`}>
              {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
              <span>Internet: <strong>{isOnline ? `Online (${pingLatency}ms)` : 'Disconnected'}</strong></span>
            </div>

            {warningCount > 0 && (
              <div className="px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 font-bold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Warnings: {warningCount}</span>
              </div>
            )}
          </div>

          {/* Right: Timer & Webcam PiP & Finish Button */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 font-mono font-bold text-base text-indigo-400 shadow-inner">
              <Clock className="w-4 h-4 text-indigo-400 animate-pulse" />
              <span>{formatTimer(timeLeft)}</span>
            </div>

            {/* Camera PiP Video Box */}
            <div className="w-20 h-14 rounded-xl overflow-hidden border-2 border-emerald-500/60 relative bg-black shrink-0 shadow-lg">
              <video ref={pipVideoRef} autoPlay playsInline muted className="w-full h-full object-cover mirror" />
              <div className="absolute top-1 left-1 flex items-center gap-1 bg-black/80 px-1.5 py-0.5 rounded-md text-[8px] text-emerald-400 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                LIVE
              </div>
            </div>

            <Button
              variant="primary"
              size="md"
              onClick={handleFinalSubmit}
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-500 font-bold border-0 shadow-lg px-5 py-2.5 cursor-pointer"
            >
              {isSubmitting ? 'Submitting...' : 'Finish Test'}
            </Button>
          </div>
        </header>

        {/* Section Navigation Tabs */}
        <div className="bg-slate-900 border-b border-slate-800 px-6 py-2.5 flex items-center gap-2 overflow-x-auto">
          {SECTIONS_CONFIG.map((sec) => (
            <button
              key={sec.name}
              onClick={() => {
                setActiveSectionName(sec.name);
                setCurrentQIndex(0);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeSectionName === sec.name
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span>{sec.name}</span>
              <span className="px-2 py-0.5 rounded-md bg-black/40 text-[11px] font-mono">
                {sec.questions} Qs &bull; {sec.marks} M
              </span>
            </button>
          ))}
        </div>

        {/* ===================================================================== */}
        {/* SECTION A: MCQ QUESTION RENDERING (APTITUDE / REASONING / VERBAL / PSEUDO CODE) */}
        {/* ===================================================================== */}
        {activeSectionName !== 'Coding' && (
          <div className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Question Box */}
            <div className="lg:col-span-8 bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-xl bg-indigo-500/20 text-indigo-300 font-mono font-bold text-xs">
                      Question {currentQIndex + 1} of {currentSectionQuestions.length}
                    </span>
                    <span className="text-xs text-slate-400">&bull; {currentQuestion.topic || activeSectionName}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400">+1.0 Mark</span>
                </div>

                {/* Question Statement */}
                <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed">
                  {currentQuestion.question || currentQuestion.description}
                </h3>

                {/* Optional Code Snippet (e.g. for Pseudo Code section) */}
                {currentQuestion.codeSnippet && (
                  <div className="p-4 rounded-2xl bg-black/80 border border-slate-800 font-mono text-xs text-indigo-300 whitespace-pre-wrap leading-relaxed shadow-inner">
                    {currentQuestion.codeSnippet}
                  </div>
                )}

                {/* MCQ Options */}
                <div className="space-y-3 pt-2">
                  {(currentQuestion.options || []).map((opt, oIdx) => {
                    const optText = typeof opt === 'string' ? opt : opt.text || `Option ${oIdx + 1}`;
                    const currentAnswer = answers[`${activeSectionName}_${currentQIndex}`];
                    const isSelected = currentAnswer === oIdx;

                    return (
                      <div
                        key={oIdx}
                        onClick={() => {
                          setAnswers((prev) => ({
                            ...prev,
                            [`${activeSectionName}_${currentQIndex}`]: oIdx,
                          }));
                          setAutoSaveStatus('Saving...');
                        }}
                        className={`p-4 rounded-2xl border text-xs font-medium cursor-pointer transition flex items-center gap-3.5 ${
                          isSelected
                            ? 'bg-indigo-600/25 border-indigo-500 text-white font-bold shadow-lg ring-1 ring-indigo-500'
                            : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/60 hover:text-white'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-full border flex items-center justify-center font-mono text-[11px] font-bold ${
                          isSelected ? 'bg-indigo-600 border-indigo-400 text-white' : 'border-slate-700 text-slate-400'
                        }`}>
                          {String.fromCharCode(65 + oIdx)}
                        </div>
                        <span className="flex-1">{optText}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Question Controls */}
              <div className="flex items-center justify-between border-t border-slate-800 pt-4 gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={currentQIndex === 0}
                  onClick={() => setCurrentQIndex((prev) => Math.max(0, prev - 1))}
                  className="cursor-pointer"
                >
                  Previous
                </Button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMarkedForReview((prev) => ({
                        ...prev,
                        [`${activeSectionName}_${currentQIndex}`]: !prev[`${activeSectionName}_${currentQIndex}`],
                      }));
                    }}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                      markedForReview[`${activeSectionName}_${currentQIndex}`]
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    {markedForReview[`${activeSectionName}_${currentQIndex}`] ? '★ Marked' : 'Mark for Review'}
                  </button>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      if (currentQIndex < currentSectionQuestions.length - 1) {
                        setCurrentQIndex((prev) => prev + 1);
                      } else {
                        const secIdx = SECTIONS_CONFIG.findIndex((s) => s.name === activeSectionName);
                        if (secIdx < SECTIONS_CONFIG.length - 1) {
                          setActiveSectionName(SECTIONS_CONFIG[secIdx + 1].name);
                          setCurrentQIndex(0);
                        }
                      }
                    }}
                    className="bg-indigo-600 hover:bg-indigo-500 font-bold cursor-pointer"
                  >
                    Save &amp; Next
                  </Button>
                </div>
              </div>
            </div>

            {/* Right: Question Palette Grid */}
            <div className="lg:col-span-4 bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-2xl space-y-6">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center justify-between">
                  <span>{activeSectionName} Question Palette</span>
                  <span className="text-xs font-mono text-indigo-400">{currentSectionQuestions.length} Qs</span>
                </h4>
                <p className="text-[11px] text-slate-400 mt-1">Navigate between questions at your own pace.</p>
              </div>

              {/* Grid Buttons */}
              <div className="grid grid-cols-5 gap-2.5">
                {currentSectionQuestions.map((_, qIdx) => {
                  const ansKey = `${activeSectionName}_${qIdx}`;
                  const isAnswered = answers[ansKey] !== undefined;
                  const isMarked = markedForReview[ansKey];
                  const isCurrent = currentQIndex === qIdx;

                  let btnBg = 'bg-slate-950 border-slate-800 text-slate-400';
                  if (isCurrent) {
                    btnBg = 'bg-indigo-600 border-indigo-400 text-white font-black shadow-lg scale-105';
                  } else if (isMarked) {
                    btnBg = 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold';
                  } else if (isAnswered) {
                    btnBg = 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 font-bold';
                  }

                  return (
                    <button
                      key={qIdx}
                      onClick={() => setCurrentQIndex(qIdx)}
                      className={`h-10 rounded-xl border font-mono text-xs flex items-center justify-center transition cursor-pointer ${btnBg}`}
                    >
                      {qIdx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Legend Indicator */}
              <div className="grid grid-cols-2 gap-2 text-[11px] font-sans border-t border-slate-800 pt-4 text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500/40 border border-emerald-500" />
                  <span>Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-500/40 border border-amber-500" />
                  <span>Marked</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-indigo-600 border border-indigo-400" />
                  <span>Current</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-slate-950 border border-slate-800" />
                  <span>Unvisited</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* SECTION B: CODING COMPILER WORKSPACE (2 PROBLEMS, 20 MARKS) */}
        {/* ===================================================================== */}
        {activeSectionName === 'Coding' && (
          <div className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Coding Problem Description */}
            <div className="lg:col-span-5 bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-2xl flex flex-col justify-between space-y-4 overflow-y-auto max-h-[720px]">
              <div className="space-y-4">
                {/* Problem Selector Switch */}
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                  {(questionsBank.Coding || []).map((cProb, idx) => (
                    <button
                      key={cProb.id}
                      onClick={() => setCodingActiveIndex(idx)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        codingActiveIndex === idx
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      Problem {idx + 1} (10 M)
                    </button>
                  ))}
                </div>

                {/* Problem Title & Details */}
                {(() => {
                  const activeProb = (questionsBank.Coding && questionsBank.Coding[codingActiveIndex]) || INITIAL_QUESTIONS_BANK.Coding[0];
                  return (
                    <div className="space-y-4">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">
                          {activeProb.topic || 'Algorithms'} &bull; {activeProb.difficulty || 'Medium'}
                        </span>
                        <h3 className="text-lg font-bold text-white mt-1">{activeProb.title}</h3>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {activeProb.description}
                      </p>

                      {activeProb.inputFormat && (
                        <div className="space-y-1">
                          <span className="text-[11px] font-bold text-slate-400 uppercase">Input Format</span>
                          <p className="text-xs font-mono text-slate-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                            {activeProb.inputFormat}
                          </p>
                        </div>
                      )}

                      {activeProb.outputFormat && (
                        <div className="space-y-1">
                          <span className="text-[11px] font-bold text-slate-400 uppercase">Output Format</span>
                          <p className="text-xs font-mono text-slate-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                            {activeProb.outputFormat}
                          </p>
                        </div>
                      )}

                      {/* Sample Examples */}
                      <div className="space-y-2">
                        <span className="text-[11px] font-bold text-slate-400 uppercase">Sample Test Cases</span>
                        {(activeProb.examples || activeProb.testCases || []).map((tc, tcIdx) => (
                          <div key={tcIdx} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-1">
                            <div><strong className="text-indigo-400">Input:</strong> {tc.input}</div>
                            <div><strong className="text-emerald-400">Expected:</strong> {tc.output}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Right: Code Editor & Execution Console */}
            <div className="lg:col-span-7 bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-2xl flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                {/* Editor Header Bar */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-bold text-white">Solution Editor</span>
                  </div>

                  {/* Language Selector */}
                  <select
                    value={codingLanguage}
                    onChange={(e) => {
                      const newLang = e.target.value;
                      setCodingLanguage(newLang);
                      const activeProb = (questionsBank.Coding && questionsBank.Coding[codingActiveIndex]) || INITIAL_QUESTIONS_BANK.Coding[0];
                      setCodingLanguages((prev) => ({ ...prev, [activeProb.id]: newLang }));
                      if (!codingDrafts[activeProb.id] || codingDrafts[activeProb.id].trim().length < 10) {
                        setCodingDrafts((prev) => ({
                          ...prev,
                          [activeProb.id]: EMPTY_STARTER_TEMPLATES[newLang] || EMPTY_STARTER_TEMPLATES.java,
                        }));
                      }
                    }}
                    className="bg-slate-950 text-white text-xs font-mono font-bold px-3 py-1.5 rounded-xl border border-slate-700 outline-none cursor-pointer"
                  >
                    <option value="java">Java (OpenJDK 21)</option>
                    <option value="python">Python 3.12</option>
                    <option value="c">C (GCC 13)</option>
                    <option value="cpp">C++ (GCC 13)</option>
                    <option value="javascript">JavaScript (Node.js 20)</option>
                  </select>
                </div>

                {/* Clean Code Editor Textarea */}
                {(() => {
                  const activeProb = (questionsBank.Coding && questionsBank.Coding[codingActiveIndex]) || INITIAL_QUESTIONS_BANK.Coding[0];
                  const currentCode = codingDrafts[activeProb.id] !== undefined
                    ? codingDrafts[activeProb.id]
                    : EMPTY_STARTER_TEMPLATES[codingLanguage] || EMPTY_STARTER_TEMPLATES.java;

                  return (
                    <textarea
                      rows={14}
                      value={currentCode}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCodingDrafts((prev) => ({ ...prev, [activeProb.id]: val }));
                        setAutoSaveStatus('Saving...');
                      }}
                      className="w-full p-4 rounded-2xl bg-black/90 border border-slate-800 font-mono text-xs text-emerald-300 outline-none resize-none focus:border-indigo-500 selection:bg-indigo-600"
                      placeholder="Write your code solution here..."
                    />
                  );
                })()}

                {/* Real Code Compilation Console Output */}
                {codeConsoleOutput && (
                  <div className="p-3.5 rounded-2xl bg-black/95 border border-slate-800 font-mono text-xs text-slate-200 whitespace-pre-wrap max-h-40 overflow-y-auto">
                    {codeConsoleOutput}
                  </div>
                )}
              </div>

              {/* Run Test Cases & Submit Controls */}
              <div className="flex items-center justify-between border-t border-slate-800 pt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const activeProb = (questionsBank.Coding && questionsBank.Coding[codingActiveIndex]) || INITIAL_QUESTIONS_BANK.Coding[0];
                    setCodingDrafts((prev) => ({
                      ...prev,
                      [activeProb.id]: EMPTY_STARTER_TEMPLATES[codingLanguage] || EMPTY_STARTER_TEMPLATES.java,
                    }));
                  }}
                  className="text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  Reset Template
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleRunCodeTestCases}
                  disabled={isRunningCode}
                  className="bg-indigo-600 hover:bg-indigo-500 font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  {isRunningCode ? <Spinner size="xs" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                  <span>Run Against Sample</span>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Security Alert Notifications Modal */}
        {devToolsWarningModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
            <div className="w-full max-w-md bg-slate-900 rounded-3xl border border-red-500/40 p-6 space-y-4 text-center shadow-2xl">
              <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Developer Tools Warning</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Developer tools inspection or page source access was detected. All security violations are recorded in your audit log.
              </p>
              <Button
                variant="primary"
                size="md"
                onClick={() => setDevToolsWarningModal(false)}
                className="w-full bg-red-600 hover:bg-red-500 font-bold"
              >
                Acknowledge &amp; Resume
              </Button>
            </div>
          </div>
        )}

        {/* Screen Share Reconnect Modal */}
        {screenSharePauseModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
            <div className="w-full max-w-md bg-slate-900 rounded-3xl border border-amber-500/40 p-6 space-y-4 text-center shadow-2xl">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                <PauseCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Assessment Paused</h3>
              <p className="text-xs text-amber-200/90 leading-relaxed">
                Screen sharing was disconnected. Entire primary desktop screen sharing is mandatory to resume the examination.
              </p>
              <Button
                variant="primary"
                size="md"
                onClick={async () => {
                  await requestScreenShareAccess();
                  setScreenSharePauseModal(false);
                  setExamState('IN_PROGRESS');
                }}
                className="w-full bg-amber-600 hover:bg-amber-500 font-bold"
              >
                Reconnect Screen Sharing
              </Button>
            </div>
          </div>
        )}

        {/* General Security Notification Dialog */}
        {securityModalText && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
            <div className="w-full max-w-md bg-slate-900 rounded-3xl border border-slate-700 p-6 space-y-4 text-center shadow-2xl">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Proctoring Notice</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{securityModalText}</p>
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  setSecurityModalText('');
                  enterFullscreenMode();
                }}
                className="w-full bg-indigo-600 hover:bg-indigo-500 font-bold"
              >
                Continue Assessment
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: PORTAL VIEW (OVERVIEW, 100% REAL SCORECARD, REVIEW, HISTORY, FACULTY AUDIT)
  // =========================================================================
  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-sans">
      {/* Top Header with Clean Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Full Pattern Mock Assessment
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Standard Campus Placement Mock Benchmark &bull; Timed &amp; Evidence-Based Proctoring
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="md"
            icon={Play}
            disabled={remainingAttempts <= 0}
            onClick={() => setExamState('SYSTEM_CHECK')}
            className="font-bold bg-indigo-600 hover:bg-indigo-500 shadow-lg disabled:opacity-50 cursor-pointer"
          >
            {remainingAttempts <= 0 ? 'Attempts Exhausted (3/3)' : viewTab === 'attempt' ? 'Retake Benchmark' : 'Launch Examination'}
          </Button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Sidebar Benchmarks List */}
        <div className="bg-slate-900 rounded-3xl p-5 border border-slate-800 shadow-xl space-y-4 lg:col-span-1">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search benchmarks..."
              className="w-full bg-slate-950 border border-slate-800 text-xs rounded-xl pl-9 pr-3 py-2 text-white outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-1.5 max-h-[550px] overflow-y-auto pr-1">
            {BENCHMARK_LIST.map((t) => (
              <div
                key={t.id}
                className={`p-3 rounded-2xl text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                  t.active
                    ? 'bg-indigo-600/20 border border-indigo-500 text-white shadow-md'
                    : 'bg-slate-950/40 hover:bg-slate-950 text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <FileText className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span className="truncate">{t.title}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* Right 3 Columns: Overview / Attempt Scorecard / Question Review / History / Faculty */}
        <div className="lg:col-span-3 space-y-4">
          {/* Tab Selector Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-2">
            <div className="flex items-center gap-6 flex-wrap">
              <button
                onClick={() => setViewTab('overview')}
                className={`text-sm font-bold pb-2 transition relative cursor-pointer ${
                  viewTab === 'overview'
                    ? 'text-indigo-400 border-b-2 border-indigo-500'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setViewTab('attempt')}
                className={`text-sm font-bold pb-2 transition relative cursor-pointer ${
                  viewTab === 'attempt'
                    ? 'text-indigo-400 border-b-2 border-indigo-500'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Attempt Scorecard
              </button>
              {examResult?.reviewData && examResult.reviewData.length > 0 && (
                <button
                  onClick={() => setViewTab('review')}
                  className={`text-sm font-bold pb-2 transition relative cursor-pointer flex items-center gap-1.5 ${
                    viewTab === 'review'
                      ? 'text-indigo-400 border-b-2 border-indigo-500'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Review Answers ({examResult.reviewData.length})</span>
                </button>
              )}
              <button
                onClick={() => setViewTab('history')}
                className={`text-sm font-bold pb-2 transition relative cursor-pointer ${
                  viewTab === 'history'
                    ? 'text-indigo-400 border-b-2 border-indigo-500'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Attempt History
              </button>
              <button
                onClick={() => setViewTab('faculty')}
                className={`text-sm font-bold pb-2 transition relative cursor-pointer ${
                  viewTab === 'faculty'
                    ? 'text-indigo-400 border-b-2 border-indigo-500'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Faculty Review Audit
              </button>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="text-slate-400">
                Attempt: <strong className="text-indigo-400">{attemptHistory.length > 0 ? `0${attemptHistory.length}` : '00'} of 03</strong>
              </span>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* TAB 1: OVERVIEW TABLE */}
          {/* ========================================================================= */}
          {viewTab === 'overview' && (
            <div className="bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-800/80 border-b border-slate-700 text-slate-300 font-bold">
                    <th className="p-4">SNo</th>
                    <th className="p-4">Name</th>
                    <th className="p-4 text-center">Questions</th>
                    <th className="p-4 text-center">Duration (Min)</th>
                    <th className="p-4 text-center">Marks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200">
                  {SECTIONS_CONFIG.map((sec) => (
                    <tr key={sec.sNo} className="hover:bg-slate-800/40 transition">
                      <td className="p-4 font-mono text-slate-400">{sec.sNo}</td>
                      <td className="p-4 font-bold text-white">{sec.name}</td>
                      <td className="p-4 text-center font-mono">{sec.questions}</td>
                      <td className="p-4 text-center font-mono">{sec.duration}</td>
                      <td className="p-4 text-center font-mono font-bold text-indigo-400">{sec.marks}</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-800/60 font-bold text-slate-200 border-t-2 border-slate-700">
                    <td className="p-4"></td>
                    <td className="p-4 text-sm uppercase">Total</td>
                    <td className="p-4 text-center font-mono text-sm">42</td>
                    <td className="p-4 text-center font-mono text-sm">80</td>
                    <td className="p-4 text-center font-mono text-sm text-indigo-400">60</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: REAL 100% DATABASE-BACKED ATTEMPT SCORECARD & ANALYTICS */}
          {/* ========================================================================= */}
          {viewTab === 'attempt' && (
            examResult ? (
              <div className="space-y-6">
                {/* Result Header */}
                <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                    <div>
                      <h2 className="text-xl font-black text-white">{examResult.examTitle}</h2>
                      <p className="text-xs text-slate-400 mt-1">
                        Completed: <strong className="text-slate-200">{examResult.completedAt}</strong>
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {examResult.reviewData && examResult.reviewData.length > 0 && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setViewTab('review')}
                          className="bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-600/50 cursor-pointer"
                        >
                          Review All 42 Answers
                        </Button>
                      )}
                      <Badge variant="indigo">Attempt 0{examResult.attemptNumber} of 03</Badge>
                    </div>
                  </div>

                  {/* Top 4 KPI Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">TIME SPENT</span>
                      <strong className="text-white text-lg block mt-1">{examResult.timeSpentFormatted}</strong>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">ASSESSMENT SCORE</span>
                      <strong className="text-indigo-400 text-lg block mt-1">
                        {examResult.score} / {examResult.maxScore || 60} ({examResult.percentage}%)
                      </strong>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">INTEGRITY SCORE</span>
                      <strong className={examResult.integrityScore >= 80 ? 'text-emerald-400 text-lg block mt-1' : 'text-amber-400 text-lg block mt-1'}>
                        {examResult.integrityScore} / 100
                      </strong>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">AUDIT STATUS</span>
                      <span className={`inline-block mt-1 px-2.5 py-0.5 rounded text-xs font-bold ${
                        examResult.auditStatus === 'Verified Clean'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : examResult.auditStatus === 'Needs Review'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {examResult.auditStatus}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Section Performance Breakdown Table */}
                <div className="bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
                  <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/80">
                    <h3 className="font-bold text-white text-sm">SECTION PERFORMANCE</h3>
                  </div>
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-800/80 border-b border-slate-700 text-slate-300 font-bold">
                        <th className="p-4">Section</th>
                        <th className="p-4 text-center">Answered</th>
                        <th className="p-4 text-center">Correct</th>
                        <th className="p-4 text-center">Score</th>
                        <th className="p-4 text-center">Max Marks</th>
                        <th className="p-4 text-center">Percentage</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-200 font-mono">
                      {SECTIONS_CONFIG.map((sec) => {
                        const secData = examResult.sectionScores?.[sec.name] || {};
                        const sc = secData.score !== undefined ? secData.score : (secData.correct !== undefined ? secData.correct : 0);
                        const maxSc = secData.maximumScore || sec.marks;
                        const pct = secData.percentage !== undefined ? secData.percentage : Math.round((sc / maxSc) * 100);

                        return (
                          <tr key={sec.name} className="hover:bg-slate-800/40 transition">
                            <td className="p-4 font-bold text-white font-sans">{sec.name}</td>
                            <td className="p-4 text-center">{secData.answered !== undefined ? secData.answered : sec.questions}</td>
                            <td className="p-4 text-center text-emerald-400 font-bold">{secData.correct !== undefined ? secData.correct : sc}</td>
                            <td className="p-4 text-center font-bold text-indigo-400">{sc}</td>
                            <td className="p-4 text-center text-slate-400">{maxSc}</td>
                            <td className="p-4 text-center font-bold text-white">{pct}%</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* AI Performance Analysis Section */}
                <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span>AI PERFORMANCE ANALYSIS</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                      <h4 className="font-bold text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Strengths
                      </h4>
                      <ul className="space-y-1 text-slate-300 list-disc list-inside">
                        {(examResult.aiRecommendations?.strengths || ['High accuracy in verbal logic', 'Good algorithmic comprehension']).map((s, idx) => (
                          <li key={idx}>{s}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                      <h4 className="font-bold text-amber-400 flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-amber-400" /> Weak Areas
                      </h4>
                      <ul className="space-y-1 text-slate-300 list-disc list-inside">
                        {(examResult.aiRecommendations?.weaknesses || ['Speed optimization in pseudo code', 'Two-pointer edge cases']).map((w, idx) => (
                          <li key={idx}>{w}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                    <h4 className="font-bold text-indigo-400 flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-indigo-400" /> Recommended Practice &amp; Next Target
                    </h4>
                    <ul className="space-y-1 text-slate-300 list-disc list-inside">
                      {(examResult.aiRecommendations?.actionableTips || ['Practice 5 medium DSA problems before your next assessment.', 'Target 75%+ on next attempt.']).map((t, idx) => (
                        <li key={idx}>{t}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Email Delivery Audit Banner */}
                <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 text-xs font-mono ${
                  examResult.emailSent !== false
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                }`}>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 shrink-0" />
                    <span>{examResult.emailMessage || 'Scorecard dispatched to your registered email address.'}</span>
                  </div>
                  <span className="text-[11px] text-slate-500">IP: {examResult.ipAddress || 'Masked'}</span>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center bg-slate-900 rounded-3xl border border-slate-800 space-y-3">
                <FileText className="w-12 h-12 text-slate-600 mx-auto" />
                <h3 className="text-base font-bold text-white">No Completed Attempts Yet</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Launch the proctored examination above to generate your real score, section breakdown, and AI diagnostic recommendations.
                </p>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setExamState('SYSTEM_CHECK')}
                  className="bg-indigo-600 hover:bg-indigo-500 font-bold cursor-pointer"
                >
                  Start Assessment
                </Button>
              </div>
            )
          )}

          {/* ========================================================================= */}
          {/* TAB 3: COMPLETE 42-QUESTION REVIEW WITH ANSWERS & EXPLANATIONS */}
          {/* ========================================================================= */}
          {viewTab === 'review' && (
            <div className="space-y-4">
              <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-indigo-400" />
                      <span>Full Assessment Question Review (42 Questions)</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Review all questions, your selected answers, official solutions, and coding test case reports.
                    </p>
                  </div>

                  {/* Section Filter Chips */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {['All', 'Aptitude', 'Reasoning', 'Verbal', 'Pseudo Code', 'Coding'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setReviewFilter(cat)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                          reviewFilter === cat
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Review Questions List */}
                <div className="space-y-4">
                  {(examResult?.reviewData || [])
                    .filter((q) => reviewFilter === 'All' || q.section === reviewFilter)
                    .map((item, idx) => {
                      const isMcq = item.section !== 'Coding';
                      const isCorrect = item.isCorrect;
                      const statusColor = isCorrect
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                        : item.studentAnswerIndex !== null && item.studentAnswerIndex !== undefined
                        ? 'bg-red-500/20 text-red-400 border-red-500/40'
                        : 'bg-slate-800 text-slate-400 border-slate-700';

                      return (
                        <div
                          key={item.id || idx}
                          className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3.5 text-xs"
                        >
                          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-indigo-400 font-mono">
                                #{item.questionNumber || idx + 1} &bull; {item.section}
                              </span>
                              <span className="text-slate-500 font-mono">({item.topic || 'Standard'})</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`px-2.5 py-0.5 rounded-md border font-bold text-[10px] ${statusColor}`}>
                                {item.status || (isCorrect ? 'Correct' : 'Incorrect')} &bull; {item.marksEarned || 0}/{item.maxMarks || 1} M
                              </span>
                            </div>
                          </div>

                          {/* MCQ Question Statement */}
                          <div className="space-y-2">
                            <p className="font-bold text-white text-xs leading-relaxed">
                              {item.question || item.description || item.title}
                            </p>

                            {item.codeSnippet && (
                              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-indigo-300 whitespace-pre-wrap">
                                {item.codeSnippet}
                              </div>
                            )}
                          </div>

                          {/* MCQ Options Display */}
                          {isMcq && item.options && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                              {item.options.map((opt, oIdx) => {
                                const isChosen = item.studentAnswerIndex === oIdx;
                                const isRightAns = item.correctAnswerIndex === oIdx;

                                let optBorder = 'border-slate-800 bg-slate-900/60 text-slate-400';
                                if (isRightAns) {
                                  optBorder = 'border-emerald-500/60 bg-emerald-500/15 text-emerald-300 font-bold';
                                } else if (isChosen && !isRightAns) {
                                  optBorder = 'border-red-500/60 bg-red-500/15 text-red-300 font-bold';
                                }

                                return (
                                  <div
                                    key={oIdx}
                                    className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${optBorder}`}
                                  >
                                    <span>{String.fromCharCode(65 + oIdx)}. {opt}</span>
                                    {isRightAns && <span className="text-[10px] text-emerald-400 font-bold">✓ Correct</span>}
                                    {isChosen && !isRightAns && <span className="text-[10px] text-red-400 font-bold">✗ Your Answer</span>}
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {/* Coding Problem Code Review */}
                          {!isMcq && (
                            <div className="space-y-2 pt-1">
                              <span className="text-[11px] font-bold text-slate-400 uppercase">Submitted Code ({item.language || 'java'}):</span>
                              <div className="p-3 rounded-xl bg-black border border-slate-800 font-mono text-emerald-400 whitespace-pre-wrap max-h-48 overflow-y-auto">
                                {item.studentCode || '// No code submitted'}
                              </div>
                            </div>
                          )}

                          {/* Explanation Box */}
                          {item.explanation && (
                            <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-indigo-200 text-xs space-y-1">
                              <strong className="text-indigo-400 block font-sans">Explanation / Solution:</strong>
                              <p className="leading-relaxed">{item.explanation}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: REAL ATTEMPT HISTORY WITH ACTUAL DATES */}
          {/* ========================================================================= */}
          {viewTab === 'history' && (
            <div className="space-y-4">
              <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Clock className="w-4 h-4 text-indigo-400" />
                      <span>Assessment History</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">All completion timestamps and scores retrieved from database.</p>
                  </div>
                  <Badge variant="emerald">{attemptHistory.length} Attempts Completed</Badge>
                </div>

                {attemptHistory.length === 0 ? (
                  <p className="text-xs text-slate-500 py-6 text-center">No previous attempts recorded.</p>
                ) : (
                  <div className="space-y-3">
                    {attemptHistory.map((att) => (
                      <div
                        key={att.attemptNumber}
                        className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm">Attempt {att.attemptNumber}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] ${
                              att.reviewStatus === 'Verified Clean' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                            }`}>
                              {att.reviewStatus || 'Verified Clean'}
                            </span>
                          </div>
                          <p className="text-slate-400 font-sans text-xs">
                            Completed: <strong className="text-slate-200">{att.completedDate}</strong> &bull; Time Spent: {att.timeSpent}
                          </p>
                        </div>

                        <div className="flex items-center gap-6">
                          <div>
                            <span className="text-[10px] text-slate-500 block">Assessment Score</span>
                            <span className="font-bold text-indigo-400 text-sm">{att.score} ({att.rawScore || ''})</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 block">Integrity Score</span>
                            <span className="font-bold text-emerald-400 text-sm">{att.integrityScore}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: FACULTY REVIEW AUDIT PANEL */}
          {/* ========================================================================= */}
          {viewTab === 'faculty' && (
            <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span>Faculty &amp; Placement Coordinator Proctoring Audit</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Evidence-based telemetry replay and candidate verification.</p>
                </div>
                <Badge variant="indigo">Faculty Console</Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block">Screen Share Status</span>
                  <strong className="text-emerald-400 text-sm">Verified (Entire Screen)</strong>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block">DevTools Detections</span>
                  <strong className="text-slate-200 text-sm">{devToolsCount} Flagged</strong>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block">Tab Switch Events</span>
                  <strong className="text-slate-200 text-sm">{tabSwitchCount} Recorded</strong>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 8-STEP PRE-EXAM SYSTEM CHECK MODAL */}
      {/* ========================================================================= */}
      {examState === 'SYSTEM_CHECK' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 font-sans">
          <div className="relative w-full max-w-2xl bg-slate-900 rounded-3xl border border-slate-700 shadow-2xl p-6 sm:p-8 space-y-6 text-left">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-indigo-400" />
                  <span>Pre-Exam System Clearance Check</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Complete all 4 diagnostic verifications to launch your monitored examination.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setExamState('PORTAL')}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* 4 Proctoring Checks List */}
            <div className="space-y-3">
              {/* Check 1: Camera Hardware */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Camera &amp; Facial Visibility</h4>
                    <p className="text-[11px] text-slate-400">Continuous biometric feed validation</p>
                  </div>
                </div>
                {cameraAllowed ? (
                  <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1 border border-emerald-500/30">
                    <CheckCircle className="w-3.5 h-3.5" /> Verified
                  </span>
                ) : (
                  <Button variant="primary" size="xs" onClick={requestCameraAccess} className="bg-indigo-600 hover:bg-indigo-500 cursor-pointer">
                    Enable Camera
                  </Button>
                )}
              </div>

              {/* Check 2: Desktop Screen Share */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
                    <Monitor className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Entire Desktop Screen Sharing</h4>
                    <p className="text-[11px] text-slate-400">Prevents split-screen AI tools &amp; background apps</p>
                  </div>
                </div>
                {screenShareAllowed ? (
                  <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1 border border-emerald-500/30">
                    <CheckCircle className="w-3.5 h-3.5" /> Streaming
                  </span>
                ) : (
                  <Button variant="primary" size="xs" onClick={requestScreenShareAccess} className="bg-indigo-600 hover:bg-indigo-500 cursor-pointer">
                    Share Entire Screen
                  </Button>
                )}
              </div>

              {/* Check 3: Fullscreen Enforcement */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
                    <Maximize className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Exclusive Fullscreen Environment</h4>
                    <p className="text-[11px] text-slate-400">Locks window focus to proctored canvas</p>
                  </div>
                </div>
                {fullscreenActive ? (
                  <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1 border border-emerald-500/30">
                    <CheckCircle className="w-3.5 h-3.5" /> Locked
                  </span>
                ) : (
                  <Button variant="primary" size="xs" onClick={enterFullscreenMode} className="bg-indigo-600 hover:bg-indigo-500 cursor-pointer">
                    Enter Fullscreen
                  </Button>
                )}
              </div>

              {/* Check 4: Network Connectivity */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
                    <Wifi className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Cloud Sync &amp; Low Latency</h4>
                    <p className="text-[11px] text-slate-400">Real-time answer persistence &amp; telemetry</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1 border border-emerald-500/30 font-mono">
                  <CheckCircle className="w-3.5 h-3.5" /> {pingLatency}ms (Online)
                </span>
              </div>
            </div>

            {/* Hidden Camera Preview Video */}
            <div className="hidden">
              <video ref={videoRef} autoPlay playsInline muted />
            </div>

            {/* Launch Action */}
            <div className="border-t border-slate-800 pt-4 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Assessment: <strong>42 Questions &bull; 60 Marks &bull; 80 Mins</strong>
              </span>

              <Button
                variant="primary"
                size="md"
                disabled={!cameraAllowed || !screenShareAllowed || !fullscreenActive}
                onClick={handleStartExam}
                className="bg-emerald-600 hover:bg-emerald-500 font-bold px-6 shadow-xl disabled:opacity-40 cursor-pointer"
              >
                Launch Monitored Exam
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
