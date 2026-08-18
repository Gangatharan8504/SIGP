const Question = require("../models/Question");
const Assessment = require("../models/Assessment");

const seedBaselineAssessment = async () => {
  try {
    const existing = await Assessment.findOne({ isBaselineAssessment: true });
    if (existing) {
      return existing;
    }

    console.log("Creating 42-Question Mandatory Baseline Placement Assessment...");

    // 1. Aptitude Section (10 Questions)
    const aptitudeQuestionsData = [
      {
        title: "Train Speed & Relative Velocity",
        description: "A train running at the speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train in meters?",
        category: "Aptitude",
        difficulty: "Easy",
        marks: 10,
        options: [
          { text: "120 meters", isCorrect: false },
          { text: "150 meters", isCorrect: true },
          { text: "180 meters", isCorrect: false },
          { text: "324 meters", isCorrect: false },
        ],
        explanation: "Speed = 60 * (5/18) = 50/3 m/sec. Distance (Length) = Speed * Time = (50/3) * 9 = 150 meters.",
      },
      {
        title: "Work & Time Pipes Problem",
        description: "Pipe A can fill a tank in 5 hours, while Pipe B can fill it in 10 hours. Pipe C can empty it in 20 hours. If all three pipes are opened together, how long will it take to fill the tank?",
        category: "Aptitude",
        difficulty: "Medium",
        marks: 10,
        options: [
          { text: "4 hours", isCorrect: true },
          { text: "3.5 hours", isCorrect: false },
          { text: "6 hours", isCorrect: false },
          { text: "4.5 hours", isCorrect: false },
        ],
        explanation: "Net rate per hour = (1/5) + (1/10) - (1/20) = (4 + 2 - 1)/20 = 5/20 = 1/4. Total time = 4 hours.",
      },
      {
        title: "Profit, Loss & Discount Percentage",
        description: "A merchant marks his goods 20% above the cost price and allows a discount of 10% on the marked price. What is his net profit percentage?",
        category: "Aptitude",
        difficulty: "Easy",
        marks: 10,
        options: [
          { text: "8%", isCorrect: true },
          { text: "10%", isCorrect: false },
          { text: "12%", isCorrect: false },
          { text: "6%", isCorrect: false },
        ],
        explanation: "Let CP = 100. MP = 120. SP = 120 - 10% of 120 = 108. Net Profit = 8%.",
      },
      {
        title: "Probability of Marbles Draw",
        description: "A bag contains 6 black and 8 white balls. One ball is drawn at random. What is the probability that the ball drawn is white?",
        category: "Aptitude",
        difficulty: "Easy",
        marks: 10,
        options: [
          { text: "4/7", isCorrect: true },
          { text: "3/7", isCorrect: false },
          { text: "8/15", isCorrect: false },
          { text: "1/2", isCorrect: false },
        ],
        explanation: "Total balls = 14. White balls = 8. P(White) = 8/14 = 4/7.",
      },
      {
        title: "Simple vs Compound Interest Difference",
        description: "The difference between simple interest and compound interest on a sum for 2 years at 10% per annum is ₹65. What is the principal sum?",
        category: "Aptitude",
        difficulty: "Medium",
        marks: 10,
        options: [
          { text: "₹6,500", isCorrect: true },
          { text: "₹6,000", isCorrect: false },
          { text: "₹7,200", isCorrect: false },
          { text: "₹5,500", isCorrect: false },
        ],
        explanation: "Difference for 2 years = P * (R/100)² => 65 = P * (10/100)² => P = 65 * 100 = 6,500.",
      },
      {
        title: "Permutations of Committee Selection",
        description: "In how many ways can a group of 5 men and 2 women be chosen from a pool of 7 men and 4 women?",
        category: "Aptitude",
        difficulty: "Medium",
        marks: 10,
        options: [
          { text: "126", isCorrect: true },
          { text: "140", isCorrect: false },
          { text: "105", isCorrect: false },
          { text: "210", isCorrect: false },
        ],
        explanation: "Ways = 7C5 * 4C2 = 21 * 6 = 126 ways.",
      },
      {
        title: "Ratios & Mixtures Dilution",
        description: "A mixture contains milk and water in the ratio 5:1. On adding 5 liters of water, the ratio becomes 5:2. What is the quantity of milk in the original mixture?",
        category: "Aptitude",
        difficulty: "Easy",
        marks: 10,
        options: [
          { text: "25 liters", isCorrect: true },
          { text: "20 liters", isCorrect: false },
          { text: "30 liters", isCorrect: false },
          { text: "15 liters", isCorrect: false },
        ],
        explanation: "Let milk = 5x, water = x. 5x / (x + 5) = 5/2 => 10x = 5x + 25 => x = 5. Milk = 5x = 25 liters.",
      },
      {
        title: "Averages Weighted Calculation",
        description: "The average age of 24 students and their teacher is 15 years. If the teacher's age is excluded, the average reduces by 1 year. What is the teacher's age?",
        category: "Aptitude",
        difficulty: "Easy",
        marks: 10,
        options: [
          { text: "39 years", isCorrect: true },
          { text: "40 years", isCorrect: false },
          { text: "35 years", isCorrect: false },
          { text: "42 years", isCorrect: false },
        ],
        explanation: "Total sum = 25 * 15 = 375. Sum without teacher = 24 * 14 = 336. Teacher's age = 375 - 336 = 39.",
      },
      {
        title: "Geometric Progression nth Term",
        description: "Find the 7th term of the geometric series: 2, 6, 18, 54, ...",
        category: "Aptitude",
        difficulty: "Easy",
        marks: 10,
        options: [
          { text: "1458", isCorrect: true },
          { text: "486", isCorrect: false },
          { text: "1250", isCorrect: false },
          { text: "1620", isCorrect: false },
        ],
        explanation: "a = 2, r = 3. 7th term = a * r^(n-1) = 2 * 3^6 = 2 * 729 = 1458.",
      },
      {
        title: "Boats & Streams Upstream Velocity",
        description: "A boat can travel with a speed of 13 km/hr in still water. If the speed of the stream is 4 km/hr, find the time taken by the boat to go 68 km downstream.",
        category: "Aptitude",
        difficulty: "Easy",
        marks: 10,
        options: [
          { text: "4 hours", isCorrect: true },
          { text: "5 hours", isCorrect: false },
          { text: "3 hours", isCorrect: false },
          { text: "4.5 hours", isCorrect: false },
        ],
        explanation: "Downstream speed = 13 + 4 = 17 km/hr. Time = 68 / 17 = 4 hours.",
      },
    ];

    // 2. Reasoning Section (10 Questions)
    const reasoningQuestionsData = [
      {
        title: "Blood Relations Direct Lineage",
        description: "Pointing to a photograph of a boy, Suresh said, 'He is the son of the only son of my mother.' How is Suresh related to that boy?",
        category: "Reasoning",
        difficulty: "Easy",
        marks: 10,
        options: [
          { text: "Father", isCorrect: true },
          { text: "Uncle", isCorrect: false },
          { text: "Brother", isCorrect: false },
          { text: "Grandfather", isCorrect: false },
        ],
        explanation: "The only son of Suresh's mother is Suresh himself. So the boy is Suresh's son, making Suresh the Father.",
      },
      {
        title: "Syllogisms Valid Deductions",
        description: "Statements: All cars are cats. All cats are fans. Conclusions: I. All cars are fans. II. Some fans are cars.",
        category: "Reasoning",
        difficulty: "Medium",
        marks: 10,
        options: [
          { text: "Both I and II follow", isCorrect: true },
          { text: "Only conclusion I follows", isCorrect: false },
          { text: "Only conclusion II follows", isCorrect: false },
          { text: "Neither follows", isCorrect: false },
        ],
        explanation: "Cars ⊆ Cats ⊆ Fans. Hence All cars are fans, and by subalternation Some fans are cars.",
      },
      {
        title: "Direction Sense Spatial Vector",
        description: "A man walks 5 km toward South and then turns right. After walking 3 km he turns to the left and walks 5 km. Now in which direction is he from the starting place?",
        category: "Reasoning",
        difficulty: "Easy",
        marks: 10,
        options: [
          { text: "South-West", isCorrect: true },
          { text: "South", isCorrect: false },
          { text: "West", isCorrect: false },
          { text: "North-East", isCorrect: false },
        ],
        explanation: "Starting point (0,0) -> (0, -5) -> (-3, -5) -> (-3, -10). The position is in the South-West quadrant.",
      },
      {
        title: "Coding Decoding Pattern Shift",
        description: "In a certain code language, 'COMPUTER' is written as 'RFUVQNPC'. How will 'MEDICINE' be written in that code?",
        category: "Reasoning",
        difficulty: "Medium",
        marks: 10,
        options: [
          { text: "EOJDJEFM", isCorrect: true },
          { text: "EOJDEJFM", isCorrect: false },
          { text: "MFEJDJOE", isCorrect: false },
          { text: "EOJDJFEM", isCorrect: false },
        ],
        explanation: "Reverse order and +1 shift on internal letters.",
      },
      {
        title: "Circular Seating Arrangement",
        description: "A, B, C, D, E, and F are sitting around a circle facing the center. D is between F and B. A is second to the left of D and second to the right of E. Who is facing D?",
        category: "Reasoning",
        difficulty: "Medium",
        marks: 10,
        options: [
          { text: "E", isCorrect: true },
          { text: "A", isCorrect: false },
          { text: "C", isCorrect: false },
          { text: "B", isCorrect: false },
        ],
        explanation: "Arranging positions 1 to 6 gives E directly opposite (facing) D.",
      },
      {
        title: "Alphanumeric Series Progression",
        description: "Find the next term in the series: B2D, E4G, H8J, K16M, ?",
        category: "Reasoning",
        difficulty: "Easy",
        marks: 10,
        options: [
          { text: "N32P", isCorrect: true },
          { text: "N30P", isCorrect: false },
          { text: "M32O", isCorrect: false },
          { text: "O32Q", isCorrect: false },
        ],
        explanation: "First letter +3 (B, E, H, K, N). Numbers double (2, 4, 8, 16, 32). Last letter +3 (D, G, J, M, P). Result: N32P.",
      },
      {
        title: "Statement & Course of Action",
        description: "Statement: A large number of engineering graduates remain unplaced due to lack of practical coding proficiency. Course of Action: I. Curricula should mandate verified DSA and hands-on software development.",
        category: "Reasoning",
        difficulty: "Easy",
        marks: 10,
        options: [
          { text: "Only I is a logically sound course of action", isCorrect: true },
          { text: "Neither follows", isCorrect: false },
          { text: "Dismiss all assessments", isCorrect: false },
          { text: "Close all engineering colleges", isCorrect: false },
        ],
        explanation: "Aligning academic curricula to industry skills directly solves the root deficiency.",
      },
      {
        title: "Analogies Concept Pairing",
        description: "Ophthalmologist : Eye :: Neurologist : ?",
        category: "Reasoning",
        difficulty: "Easy",
        marks: 10,
        options: [
          { text: "Brain & Nervous System", isCorrect: true },
          { text: "Heart", isCorrect: false },
          { text: "Kidneys", isCorrect: false },
          { text: "Lungs", isCorrect: false },
        ],
        explanation: "An ophthalmologist specializes in eyes; a neurologist specializes in the brain and nervous system.",
      },
      {
        title: "Clocks Angle between Hands",
        description: "What is the angle between the hour hand and the minute hand of a clock at 3:40?",
        category: "Reasoning",
        difficulty: "Medium",
        marks: 10,
        options: [
          { text: "130°", isCorrect: true },
          { text: "120°", isCorrect: false },
          { text: "140°", isCorrect: false },
          { text: "125°", isCorrect: false },
        ],
        explanation: "Angle = |30 * H - (11/2) * M| = |30 * 3 - (11/2) * 40| = |90 - 220| = 130°.",
      },
      {
        title: "Venn Diagram Set Intersections",
        description: "Which diagram best represents the relationship between: Engineers, Software Developers, and Musicians?",
        category: "Reasoning",
        difficulty: "Easy",
        marks: 10,
        options: [
          { text: "All Software Developers are Engineers, and some of both can be Musicians (overlapping circles)", isCorrect: true },
          { text: "Three completely disjoint circles", isCorrect: false },
          { text: "Musicians contain all Engineers", isCorrect: false },
          { text: "Engineers are disjoint from Developers", isCorrect: false },
        ],
        explanation: "Software Developers are a subset of Engineers; individuals from both sets can have musical avocations.",
      },
    ];

    // 3. Verbal Ability Section (10 Questions)
    const verbalQuestionsData = [
      {
        title: "Sentence Correction & Subject-Verb Agreement",
        description: "Choose the correct sentence: 'Neither of the candidates (have/has) submitted the portfolio.'",
        category: "Verbal",
        difficulty: "Easy",
        marks: 10,
        options: [
          { text: "Neither of the candidates has submitted the portfolio.", isCorrect: true },
          { text: "Neither of the candidates have submitted the portfolio.", isCorrect: false },
          { text: "Neither of the candidates are submitting the portfolio.", isCorrect: false },
          { text: "Neither of candidate have submitted portfolio.", isCorrect: false },
        ],
        explanation: "'Neither' is a singular indefinite pronoun requiring the singular verb 'has'.",
      },
      {
        title: "Vocabulary Contextual Synonyms",
        description: "Choose the exact synonym for 'PRAGMATIC':",
        category: "Verbal",
        difficulty: "Easy",
        marks: 10,
        options: [
          { text: "Practical & realistic", isCorrect: true },
          { text: "Idealistic & theoretical", isCorrect: false },
          { text: "Arrogant & boastful", isCorrect: false },
          { text: "Hesitant & indecisive", isCorrect: false },
        ],
        explanation: "Pragmatic means dealing with things sensibly and realistically based on practical considerations.",
      },
      {
        title: "Idioms & Phrases Accurate Meaning",
        description: "What is the meaning of the idiom 'To hit the nail on the head'?",
        category: "Verbal",
        difficulty: "Easy",
        marks: 10,
        options: [
          { text: "To describe exactly what is causing a situation or state the precise truth", isCorrect: true },
          { text: "To cause unintended physical damage", isCorrect: false },
          { text: "To delay an important decision", isCorrect: false },
          { text: "To work vigorously on construction", isCorrect: false },
        ],
        explanation: "The idiom denotes finding the exact right answer or diagnosing the true issue.",
      },
      {
        title: "Antonym Identification",
        description: "Choose the word most opposite in meaning to 'METICULOUS':",
        category: "Verbal",
        difficulty: "Easy",
        marks: 10,
        options: [
          { text: "Careless & sloppy", isCorrect: true },
          { text: "Detailed & precise", isCorrect: false },
          { text: "Diligent", isCorrect: false },
          { text: "Perfectionist", isCorrect: false },
        ],
        explanation: "Meticulous means showing great attention to detail; careless is its direct antonym.",
      },
      {
        title: "Para Jumble Coherence",
        description: "Arrange into a logical paragraph: (P) He realized (Q) that practice (R) was the sole key (S) to placement mastery.",
        category: "Verbal",
        difficulty: "Easy",
        marks: 10,
        options: [
          { text: "P - Q - R - S", isCorrect: true },
          { text: "Q - P - S - R", isCorrect: false },
          { text: "S - R - Q - P", isCorrect: false },
          { text: "R - S - P - Q", isCorrect: false },
        ],
        explanation: "The sequential order P -> Q -> R -> S forms a grammatically sound sentence.",
      },
      {
        title: "Active to Passive Voice Transformation",
        description: "Transform: 'The engineering team architected a high-concurrency microservice.'",
        category: "Verbal",
        difficulty: "Easy",
        marks: 10,
        options: [
          { text: "A high-concurrency microservice was architected by the engineering team.", isCorrect: true },
          { text: "A high-concurrency microservice is being architected by the engineering team.", isCorrect: false },
          { text: "A high-concurrency microservice has been architected by the engineering team.", isCorrect: false },
          { text: "A high-concurrency microservice was being architected by team.", isCorrect: false },
        ],
        explanation: "Simple past active 'architected' transforms to 'was architected by'.",
      },
      {
        title: "Spotting Grammar Errors",
        description: "Identify the erroneous part: 'She had (A) / scarcely finished her code (B) / than the proctor called time (C).'",
        category: "Verbal",
        difficulty: "Medium",
        marks: 10,
        options: [
          { text: "Part C ('than' should be 'when')", isCorrect: true },
          { text: "Part A", isCorrect: false },
          { text: "Part B", isCorrect: false },
          { text: "No Error", isCorrect: false },
        ],
        explanation: "'Scarcely' is followed by 'when', not 'than' (which pairs with 'No sooner').",
      },
      {
        title: "Reading Comprehension Inferences",
        description: "Passage: 'Distributed systems prioritize eventual consistency over strict serializability when network partitions occur.' What does this imply under CAP theorem?",
        category: "Verbal",
        difficulty: "Medium",
        marks: 10,
        options: [
          { text: "The system chooses Availability and Partition Tolerance (AP) over immediate Consistency (CP)", isCorrect: true },
          { text: "The system guarantees CA under all network failures", isCorrect: false },
          { text: "Network partitions never occur in cloud clusters", isCorrect: false },
          { text: "Data is permanently lost during partitions", isCorrect: false },
        ],
        explanation: "According to Brewer's CAP theorem, choosing eventual consistency under network partitions exemplifies an AP trade-off.",
      },
      {
        title: "One Word Substitution",
        description: "A person who has comprehensive knowledge across multiple diverse subject areas:",
        category: "Verbal",
        difficulty: "Easy",
        marks: 10,
        options: [
          { text: "Polymath", isCorrect: true },
          { text: "Pedant", isCorrect: false },
          { text: "Novice", isCorrect: false },
          { text: "Misanthrope", isCorrect: false },
        ],
        explanation: "A polymath is a person of wide-ranging knowledge and learning.",
      },
      {
        title: "Direct to Indirect Speech",
        description: "Convert: The placement officer said, 'Be prepared for technical interviews tomorrow.'",
        category: "Verbal",
        difficulty: "Easy",
        marks: 10,
        options: [
          { text: "The placement officer advised us to be prepared for technical interviews the next day.", isCorrect: true },
          { text: "The placement officer said that be prepared for technical interviews tomorrow.", isCorrect: false },
          { text: "The placement officer asked if we prepared for interviews.", isCorrect: false },
          { text: "The placement officer ordered us to prepared tomorrow.", isCorrect: false },
        ],
        explanation: "Imperative statement changes to 'advised to be prepared' and 'tomorrow' changes to 'the next day'.",
      },
    ];

    // 4. Pseudo Code Section (10 Questions)
    const pseudoCodeQuestionsData = [
      {
        title: "Bitwise Shift Multiplication",
        description: `What is the output of the following pseudocode?
INTEGER a = 5, b = 2
a = a << b
PRINT a`,
        category: "Pseudo Code",
        difficulty: "Easy",
        marks: 10,
        options: [
          { text: "20", isCorrect: true },
          { text: "10", isCorrect: false },
          { text: "25", isCorrect: false },
          { text: "7", isCorrect: false },
        ],
        explanation: "Left shifting 5 by 2 bits corresponds to 5 * 2^2 = 5 * 4 = 20.",
      },
      {
        title: "Recursive Function Return Value",
        description: `What will fun(4) return?
FUNCTION fun(n)
  IF n <= 1 RETURN 1
  RETURN n + fun(n - 2)
END FUNCTION`,
        category: "Pseudo Code",
        difficulty: "Medium",
        marks: 10,
        options: [
          { text: "7", isCorrect: true },
          { text: "10", isCorrect: false },
          { text: "6", isCorrect: false },
          { text: "5", isCorrect: false },
        ],
        explanation: "fun(4) = 4 + fun(2). fun(2) = 2 + fun(0). fun(0) = 1. fun(2) = 2 + 1 = 3. fun(4) = 4 + 3 = 7.",
      },
      {
        title: "Nested Loops Iteration Count",
        description: `How many times is 'x = x + 1' executed?
INTEGER count = 0
FOR i = 1 TO 4
  FOR j = 1 TO i
    count = count + 1
  END FOR
END FOR`,
        category: "Pseudo Code",
        difficulty: "Easy",
        marks: 10,
        options: [
          { text: "10", isCorrect: true },
          { text: "16", isCorrect: false },
          { text: "8", isCorrect: false },
          { text: "12", isCorrect: false },
        ],
        explanation: "Sum of 1 + 2 + 3 + 4 = 10 times.",
      },
      {
        title: "Array Pointer Traversal",
        description: `INTEGER arr[] = {10, 20, 30, 40, 50}
INTEGER sum = 0
FOR i = 0 TO 4 STEP 2
  sum = sum + arr[i]
END FOR
PRINT sum`,
        category: "Pseudo Code",
        difficulty: "Easy",
        marks: 10,
        options: [
          { text: "90", isCorrect: true },
          { text: "150", isCorrect: false },
          { text: "60", isCorrect: false },
          { text: "100", isCorrect: false },
        ],
        explanation: "Iterates through indices 0, 2, 4: arr[0]=10 + arr[2]=30 + arr[4]=50 = 90.",
      },
      {
        title: "Modular Arithmetic Logic",
        description: `INTEGER x = 45, y = 7
x = x % y
x = x ^ 2
PRINT x`,
        category: "Pseudo Code",
        difficulty: "Easy",
        marks: 10,
        options: [
          { text: "9", isCorrect: true },
          { text: "6", isCorrect: false },
          { text: "3", isCorrect: false },
          { text: "1", isCorrect: false },
        ],
        explanation: "45 % 7 = 3. 3 ^ 2 (or 3 squared in math) = 9 (or in bitwise XOR 3 ^ 2 = 1, in power notation 9).",
      },
      {
        title: "String Character Swapping",
        description: `STRING s = "SGIP"
SWAP(s[0], s[3])
PRINT s`,
        category: "Pseudo Code",
        difficulty: "Easy",
        marks: 10,
        options: [
          { text: "PGIS", isCorrect: true },
          { text: "SGIP", isCorrect: false },
          { text: "PIGS", isCorrect: false },
          { text: "GIPS", isCorrect: false },
        ],
        explanation: "Swapping first char 'S' and fourth char 'P' turns 'SGIP' into 'PGIS'.",
      },
      {
        title: "Stack Push-Pop Sequence",
        description: `STACK st
st.PUSH(5)
st.PUSH(10)
st.PUSH(15)
st.POP()
st.PUSH(20)
PRINT st.PEEK()`,
        category: "Pseudo Code",
        difficulty: "Easy",
        marks: 10,
        options: [
          { text: "20", isCorrect: true },
          { text: "15", isCorrect: false },
          { text: "10", isCorrect: false },
          { text: "5", isCorrect: false },
        ],
        explanation: "Push 5, 10, 15 -> Pop 15 -> Push 20 -> Peek returns top element 20.",
      },
      {
        title: "Short-Circuit Logical Evaluation",
        description: `BOOLEAN a = FALSE, b = TRUE
IF (a AND (b = FALSE)) THEN
  PRINT "YES"
ELSE
  PRINT b
END IF`,
        category: "Pseudo Code",
        difficulty: "Medium",
        marks: 10,
        options: [
          { text: "TRUE", isCorrect: true },
          { text: "FALSE", isCorrect: false },
          { text: "YES", isCorrect: false },
          { text: "Error", isCorrect: false },
        ],
        explanation: "Due to short-circuiting in logical AND, because 'a' is FALSE, the second expression is never evaluated, preserving b = TRUE.",
      },
      {
        title: "Binary Search Middle Pointer Index",
        description: `INTEGER low = 0, high = 15
INTEGER mid = low + (high - low) / 2
PRINT mid`,
        category: "Pseudo Code",
        difficulty: "Easy",
        marks: 10,
        options: [
          { text: "7", isCorrect: true },
          { text: "8", isCorrect: false },
          { text: "15", isCorrect: false },
          { text: "0", isCorrect: false },
        ],
        explanation: "0 + (15 - 0) / 2 = 7.5 -> integer floor = 7.",
      },
      {
        title: "Time Complexity Asymptotics",
        description: `FOR i = 1 TO N STEP i = i * 2
  PRINT i
END FOR
What is the Big-O time complexity?`,
        category: "Pseudo Code",
        difficulty: "Easy",
        marks: 10,
        options: [
          { text: "O(log N)", isCorrect: true },
          { text: "O(N)", isCorrect: false },
          { text: "O(N²)", isCorrect: false },
          { text: "O(1)", isCorrect: false },
        ],
        explanation: "Multiplying loop index by 2 in each iteration yields logarithmic O(log N) iterations.",
      },
    ];

    // 5. Coding Section (2 Questions)
    const codingQuestionsData = [
      {
        title: "Two Sum Target Indices Finder",
        description: "Given an array of integers `nums` and an integer `target`, return the indices of the two numbers such that they add up to target in O(N) linear time.",
        category: "Coding",
        difficulty: "Medium",
        type: "coding",
        marks: 10,
        starterCode: {
          javascript: "function twoSum(nums, target) {\n  // Write your O(N) solution here\n}",
          python: "def twoSum(nums, target):\n    # Write your O(N) solution here\n    pass",
          cpp: "#include <vector>\nusing namespace std;\nvector<int> twoSum(vector<int>& nums, int target) {\n}",
          java: "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n    }\n}",
        },
        testCases: [
          { input: "[2, 7, 11, 15], 9", output: "[0, 1]", isHidden: false },
          { input: "[3, 2, 4], 6", output: "[1, 2]", isHidden: false },
          { input: "[3, 3], 6", output: "[0, 1]", isHidden: true },
        ],
        explanation: "Use a hash map to look up the complement in O(1) time.",
      },
      {
        title: "Longest Substring Without Repeating Characters",
        description: "Given a string `s`, find the length of the longest substring without duplicate characters using the sliding window technique.",
        category: "Coding",
        difficulty: "Medium",
        type: "coding",
        marks: 10,
        starterCode: {
          javascript: "function lengthOfLongestSubstring(s) {\n  // Write your sliding window solution here\n}",
          python: "def lengthOfLongestSubstring(s: str) -> int:\n    pass",
          cpp: "#include <string>\nusing namespace std;\nint lengthOfLongestSubstring(string s) {\n}",
          java: "class Solution {\n    public int lengthOfLongestSubstring(String s) {\n    }\n}",
        },
        testCases: [
          { input: '"abcabcbb"', output: "3", isHidden: false },
          { input: '"bbbbb"', output: "1", isHidden: false },
          { input: '"pwwkew"', output: "3", isHidden: true },
        ],
        explanation: "Maintain a sliding window with a character hash set.",
      },
    ];

    // Bulk create all questions
    const allQuestionsData = [
      ...aptitudeQuestionsData,
      ...reasoningQuestionsData,
      ...verbalQuestionsData,
      ...pseudoCodeQuestionsData,
      ...codingQuestionsData,
    ];

    const createdQuestions = await Question.insertMany(allQuestionsData);
    const questionIds = createdQuestions.map((q) => q._id);

    // Create the Master 42-Question Baseline Assessment
    const baselineDoc = await Assessment.create({
      title: "Mandatory 42-Question Baseline Placement Assessment",
      description: "Comprehensive 60-minute placement readiness benchmark across 5 core sections: Aptitude (10 Q), Reasoning (10 Q), Verbal (10 Q), Pseudo Code (10 Q), and Coding (2 Q).",
      category: "Baseline Benchmark",
      targetRole: "Software Engineer / Product Developer",
      skillTags: ["Aptitude", "Logical Reasoning", "Verbal Ability", "Data Structures & Algorithms", "Core CS"],
      difficulty: "Intermediate",
      isBaselineAssessment: true,
      durationMinutes: 60,
      totalMarks: 420,
      passingMarks: 250,
      maxAttempts: 3,
      isSecureExamMode: true,
      sectionTimings: [
        { sectionName: "Aptitude", durationMinutes: 10, questionCount: 10 },
        { sectionName: "Reasoning", durationMinutes: 10, questionCount: 10 },
        { sectionName: "Verbal", durationMinutes: 10, questionCount: 10 },
        { sectionName: "Pseudo Code", durationMinutes: 10, questionCount: 10 },
        { sectionName: "Coding", durationMinutes: 20, questionCount: 2 },
      ],
      questions: questionIds,
    });

    console.log(`42-Question Baseline Assessment seeded successfully with ID: ${baselineDoc._id}`);
    return baselineDoc;
  } catch (error) {
    console.error("Error seeding baseline assessment:", error);
  }
};

module.exports = { seedBaselineAssessment };
